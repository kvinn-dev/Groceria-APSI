#!/bin/sh
set -e

echo "=== Groceria Production Entrypoint ==="

# 1. Validasi APP_KEY
if [ -z "$APP_KEY" ]; then
    echo "CRITICAL ERROR: APP_KEY environment variable is not set!" >&2
    echo "Please set APP_KEY in your Render Web Service Environment Variables." >&2
    echo "You can generate one using: php artisan key:generate --show" >&2
    exit 1
fi

# 2. Tangani port dinamis Render
RENDER_PORT="${PORT:-8080}"
echo "Configuring Nginx to listen on port ${RENDER_PORT}..."
sed -i "s/__PORT__/${RENDER_PORT}/g" /etc/nginx/http.d/default.conf

# 3. Pastikan direktori writable tersedia
echo "Ensuring required directories exist..."
mkdir -p /var/www/html/storage/framework/cache/data \
         /var/www/html/storage/framework/sessions \
         /var/www/html/storage/framework/views \
         /var/www/html/storage/app/public \
         /var/www/html/storage/logs \
         /var/www/html/bootstrap/cache

# Atur kepemilikan dan hak akses
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 4. Pastikan storage symlink terhubung
if [ ! -L /var/www/html/public/storage ]; then
    echo "Creating public storage symlink..."
    php artisan storage:link || true
fi

# 5. Optimasi Laravel production (jika APP_ENV=production)
if [ "${APP_ENV:-production}" = "production" ]; then
    echo "Running Laravel production caching..."
    php artisan config:cache || echo "Warning: config:cache returned an error, proceeding with runtime config."
    php artisan route:cache || echo "Warning: route:cache returned an error, proceeding with dynamic routes."
    php artisan view:cache || echo "Warning: view:cache returned an error."
fi

echo "Startup preparation completed. Starting services..."

# 6. Teruskan eksekusi ke supervisor atau CMD
exec "$@"
