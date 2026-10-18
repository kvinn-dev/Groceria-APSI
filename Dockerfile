# ==========================================
# Stage 1: Build Frontend Assets & Vendor
# ==========================================
FROM php:8.4-cli-alpine AS builder

# Pasang dependency sistem dan Node.js untuk build frontend
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    unzip \
    curl

# Pasang Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Pasang ekstensi PHP yang diperlukan oleh Laravel & Wayfinder
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions bcmath mbstring pdo_mysql zip

WORKDIR /app

# 1. Install Composer dependencies (production only)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# 2. Install NPM dependencies
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

# 3. Copy source code aplikasi
COPY . .

# 4. Generate optimized autoload
RUN composer dump-autoload --optimize

# 5. Build frontend (Wayfinder + Vite)
# APP_KEY dummy untuk proses bootstrap Laravel saat generate route Wayfinder
ENV APP_KEY=base64:dGVzdGtleWZvcmJ1aWxkaW5nb25seW5vdGZvcnByb2Q=
ENV NODE_ENV=production
RUN npm run build

# ==========================================
# Stage 2: Production Runtime
# ==========================================
FROM php:8.4-fpm-alpine AS runner

# Pasang web server Nginx, process manager Supervisor, CA certificates, dan utility
RUN apk add --no-cache \
    nginx \
    supervisor \
    ca-certificates \
    curl \
    tzdata

# Pasang ekstensi PHP yang dibutuhkan untuk runtime Laravel & TiDB Cloud
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/
RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions \
    pdo_mysql \
    bcmath \
    mbstring \
    zip \
    opcache \
    gd \
    pcntl

# Konfigurasi PHP, Nginx, Supervisor, dan Entrypoint
COPY docker/php.ini $PHP_INI_DIR/conf.d/custom.ini
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

# Salin aplikasi dan vendor dari builder stage
COPY --from=builder /app /var/www/html

# Bersihkan artefak development yang tidak diperlukan di runtime production
RUN rm -rf /var/www/html/node_modules \
    /var/www/html/tests \
    /var/www/html/.phpunit.result.cache

# Siapkan direktori storage & bootstrap cache dan tetapkan kepemilikan ke www-data
RUN mkdir -p /var/www/html/storage/framework/cache/data \
             /var/www/html/storage/framework/sessions \
             /var/www/html/storage/framework/views \
             /var/www/html/storage/app/public \
             /var/www/html/storage/logs \
             /var/www/html/bootstrap/cache && \
    chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Port default (akan di-override oleh Render via PORT env)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
