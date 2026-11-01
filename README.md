# Groceria

Groceria adalah sistem informasi berbasis web yang dikembangkan untuk menyederhanakan dan mengoptimalkan operasional minimarket melalui platform digital yang terintegrasi. Aplikasi ini menyediakan fitur pengelolaan produk, inventaris, transaksi, serta berbagai aktivitas operasional lainnya untuk membantu meningkatkan efisiensi dan pengelolaan data.

Groceria dikembangkan sebagai proyek kelompok dalam mata kuliah Analisis dan Perancangan Sistem Informasi (APSI) di Universitas Esa Unggul dengan fokus menghadirkan solusi digital yang praktis dan mudah digunakan untuk pengelolaan minimarket.

---

## Panduan Penggunaan Aplikasi (Alur Pengguna / Customer)

### 1. Halaman Utama (Homepage) - Sebelum Login
Saat pertama kali membuka aplikasi, pengguna akan disambut dengan halaman beranda yang menampilkan *banner* promosi, daftar kategori, *flash sale*, dan daftar produk. Pada tahap ini, pengguna belum bisa melakukan *add to cart* atau *checkout* sebelum mereka melakukan login.
> **Gambar Homepage (Belum Login):**
> ![Homepage Guest](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g01.avif)

### 2. Registrasi Akun
Pengguna baru harus mendaftar melalui halaman **Register** dengan mengisi Nama, Email, dan Password untuk dapat mengakses fitur belanja secara penuh.
> **Gambar Halaman Register:**
> ![Register Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g02.avif)

### 3. Login ke Aplikasi
Pengguna yang sudah memiliki akun dapat masuk melalui halaman **Login**. Jika berhasil, pengguna akan diarahkan kembali ke halaman *homepage* dengan fitur yang sudah terbuka sepenuhnya (seperti tombol beli dan keranjang).
> **Gambar Halaman Login:**
> ![Login Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g03.avif)

### 4. Halaman Utama (Homepage) - Setelah Login
Setelah berhasil login, antarmuka *homepage* akan menyesuaikan. Tombol-tombol untuk berbelanja seperti fitur *Add to Cart* dan profil pengguna (Taylor Swift) akan muncul di *navbar*.
> **Gambar Homepage (Sudah Login):**
> ![Homepage User](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g04.avif)

### 5. Halaman Kategori
Pengguna dapat menelusuri produk berdasarkan kategori tertentu (misalnya: Sayuran, Buah-buahan, Daging, dll) melalui halaman ini.
> **Gambar Halaman Kategori:**
> ![Category Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g05.avif)

### 6. Halaman Flash Sale
Halaman khusus yang menampilkan produk-produk dengan diskon besar dan waktu terbatas. Terdapat *countdown timer* yang menunjukkan sisa waktu promo.
> **Gambar Halaman Flash Sale:**
> ![Flash Sale Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g06.avif)

### 7. Halaman Produk Terlaris
Menampilkan daftar produk yang paling banyak dibeli dan diminati oleh pelanggan.
> **Gambar Halaman Produk Terlaris:**
> ![Top Products Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g07.avif)

### 8. Halaman Daftar Produk
Halaman yang menampilkan seluruh katalog produk yang tersedia di Groceria, lengkap dengan fitur pencarian dan filter.
> **Gambar Halaman Daftar Produk:**
> ![All Products Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g08.avif)

### 9. Halaman Detail Produk
Saat pengguna mengklik salah satu produk, mereka akan diarahkan ke halaman ini. Berisi informasi lengkap seperti nama produk, harga, deskripsi, jumlah stok, dan tombol untuk menambahkannya ke keranjang.
> **Gambar Halaman Detail Produk:**
> ![Product Detail Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g09.avif)

### 10. Halaman Keranjang Belanja
Halaman ini berisi daftar produk yang sudah ditambahkan oleh pengguna. Pengguna dapat mengubah kuantitas (*qty*), menghapus produk, dan melihat ringkasan total belanja sebelum lanjut ke *checkout*.
> **Gambar Halaman Keranjang:**
> ![Cart Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g10.avif)

### 11. Halaman Checkout
Halaman untuk menyelesaikan transaksi. Pengguna dapat memilih alamat pengiriman, memilih metode pembayaran (Transfer, E-Wallet, COD, dll), dan melihat rincian akhir beserta pajak dan ongkos kirim.
> **Gambar Halaman Checkout:**
> ![Checkout Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g11.avif)

### 12. Halaman Daftar Transaksi
Setelah melakukan pemesanan, pengguna dapat melihat riwayat belanja mereka di halaman **Daftar Transaksi**. Terdapat status pesanan seperti "Menunggu", "Diproses", "Dikirim", atau "Selesai".
> **Gambar Halaman Daftar Transaksi:**
> ![Transaction List Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g12.avif)

### 13. Halaman Detail Pesanan
Halaman ini menampilkan rincian lengkap dari satu pesanan spesifik, termasuk *timeline* status pengiriman, alamat pengiriman, informasi pembayaran, dan daftar produk yang dibeli.
> **Gambar Halaman Detail Pesanan:**
> ![Order Detail Page](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g13.avif)

---

## Fitur Panel Admin

Admin bertugas mengelola seluruh operasional toko, mulai dari produk, pesanan, pengguna, hingga kampanye promosi.

### 1. Dashboard Admin
Halaman utama admin menampilkan ringkasan metrik penting seperti Total Pendapatan, Total Pesanan, Total Produk, dan Total Kategori. Terdapat juga grafik *Status Pesanan*, daftar *Produk Terlaris*, dan daftar *Pesanan Terbaru*.
> **Gambar Dashboard Admin:**
> ![Admin Dashboard](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g14.avif)

### 2. Manajemen Produk (Manage Products)
Admin dapat melihat seluruh daftar produk yang terdaftar. Di sini admin bisa menambahkan produk baru, mengedit informasi produk (harga, stok, kategori), atau menghapus produk.
> **Gambar Manage Products:**
> ![Admin Manage Products](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g15.avif)

### 3. Manajemen Kategori (Manage Categories)
Admin dapat mengelola daftar kategori produk, memastikan pengelompokan produk tetap rapi, serta menambah atau mengedit kategori.
> **Gambar Manage Categories:**
> ![Admin Manage Categories](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g16.avif)

### 4. Manajemen Pesanan (Manage Orders)
Halaman ini memungkinkan admin untuk memantau semua pesanan masuk dari pelanggan. Admin dapat memfilter pesanan berdasarkan status dan membuka detail pesanan untuk mengubah status pengiriman, memverifikasi pembayaran, atau menghapus pesanan.
> **Gambar Manage Orders (Daftar):**
> ![Admin Manage Orders List](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g17.avif)
> **Gambar Manage Orders (Detail & Edit):**
> ![Admin Manage Orders Detail](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g18.avif)

### 5. Manajemen Pengguna (Manage Users)
Admin dapat melihat seluruh daftar *customer* yang terdaftar. Melalui menu ini, admin dapat melihat detail profil pengguna, membatasi transaksi (blokir sementara), atau menonaktifkan akun pengguna.
> **Gambar Manage Users (Daftar):**
> ![Admin Manage Users List](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g19.avif)
> **Gambar Manage Users (Detail User):**
> ![Admin Manage Users Detail](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g20.avif)

### 6. Manajemen Flash Sale
Admin dapat mengatur kampanye *Flash Sale*. Pada halaman ini, admin dapat menambahkan produk ke dalam *Flash Sale*, mengatur besaran diskon, mengatur batas stok, serta menentukan periode aktif *Flash Sale* tersebut.
> **Gambar Manage Flash Sale:**
> ![Admin Manage Flash Sale](https://hdaphuncqwjfxysgmcew.supabase.co/storage/v1/object/public/images/g21.avif)

---


## Teknologi yang Digunakan

- **Framework Backend:** Laravel 12
- **Framework Frontend:** React 19
- **Language:** PHP, TypeScript
- **Frontend Integration:** Inertia.js
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, Radix UI
- **Database:** MySQL
- **Build Tool:** Vite
- **Package Manager:** Composer, NPM
- **Version Control:** Git, GitHub

## Struktur Project & Instalasi

Untuk informasi lebih lanjut mengenai cara mengunduh project, konfigurasi database, migrasi, dan cara menjalankannya di komputer lokal, silakan baca panduan lengkapnya di file:

**[INSTALLATION.md](INSTALLATION.md)**

---
*Copyright © 2026 Groceria. All rights reserved.*