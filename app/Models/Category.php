<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id',
    ];

    /**
     * Pemetaan slug kategori ke gambar statis di public/images/category/.
     * Digunakan sebagai fallback ketika gambar yang di-upload admin tidak tersedia
     * (misalnya setelah container di-restart dan storage ephemeral hilang).
     */
    protected static array $defaultImages = [
        'sayuran'           => '/images/category/carousel-sayuran_18062025075356.png',
        'buah-buahan'       => '/images/category/carousel-buah_18112025083456.png',
        'buah'              => '/images/category/carousel-buah_18112025083456.png',
        'daging'            => '/images/category/carousel-daging_10112023060536.png',
        'ikan'              => '/images/category/carousel-seafood_10112023060709.png',
        'seafood'           => '/images/category/carousel-seafood_10112023060709.png',
        'frozen-food'       => '/images/category/carousel-produk_beku_10112023060820.png',
        'produk-beku'       => '/images/category/carousel-produk_beku_10112023060820.png',
        'snack'             => '/images/category/carousel-makanan_ringan_10112023023122.png',
        'makanan-ringan'    => '/images/category/carousel-makanan_ringan_10112023023122.png',
        'minuman'           => '/images/category/carousel-minuman_07122023034203.png',
        'perlengkapan-mandi'=> '/images/category/carousel-perawatan_diri_04122023025211.png',
        'perawatan-diri'    => '/images/category/carousel-perawatan_diri_04122023025211.png',
        'pembersih'         => '/images/category/carousel-kebersihan_rumah_04122023025235.png',
        'kebersihan-rumah'  => '/images/category/carousel-kebersihan_rumah_04122023025235.png',
        'siap-saji'         => "/images/category/carousel-segari's_kitchen_03022025024415.png",
        'bumbu-saus'        => '/images/category/carousel-bumbu_&_saus_10112023023032.png',
        'bumbu'             => '/images/category/carousel-bumbu_&_saus_10112023023032.png',
        'kesehatan'         => '/images/category/carousel-kesehatan_10112023062037.png',
        'susu-olahan'       => '/images/category/carousel-susu_&_dairy_12032024040721.png',
        'susu'              => '/images/category/carousel-susu_&_dairy_12032024040721.png',
        'perlengkapan-bayi' => '/images/category/carousel-ibu,_bayi,_&_anak_19022026093637.png',
        'ibu-bayi-anak'     => '/images/category/carousel-ibu,_bayi,_&_anak_19022026093637.png',
        'popok-tisu'        => '/images/category/carousel-mpasi_03032026115330.png',
        'mpasi'             => '/images/category/carousel-mpasi_03032026115330.png',
        'sembako'           => '/images/category/carousel-sembako_24072025101106.png',
        'elektronik'        => '/images/category/carousel-elektronik_07122023034334.png',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Accessor: selalu kembalikan URL gambar yang dapat digunakan.
     *
     * Prioritas:
     * 1. Gambar yang di-upload admin (dari storage).
     * 2. Gambar statis dari public/images/category/ berdasarkan slug.
     * 3. Icon supermarket generik sebagai last resort.
     */
    public function getImageUrlAttribute(): string
    {
        // Prioritas 1: gambar upload admin masih ada
        if ($this->image) {
            if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
                return $this->image;
            }
            return asset('storage/' . $this->image);
        }

        // Prioritas 2: cari padanan slug di peta default
        $slug = $this->slug ?? '';
        if (isset(static::$defaultImages[$slug])) {
            return static::$defaultImages[$slug];
        }

        // Coba padanan parsial (misal slug "bumbu-&-saus" → key "bumbu-saus")
        $normalized = preg_replace('/[^a-z0-9]+/', '-', strtolower($slug));
        $normalized = trim($normalized, '-');
        if (isset(static::$defaultImages[$normalized])) {
            return static::$defaultImages[$normalized];
        }

        // Prioritas 3: icon generik yang pasti ada
        return '/images/icon/icon_supermarket.png';
    }

    /**
     * Relationships
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }
}