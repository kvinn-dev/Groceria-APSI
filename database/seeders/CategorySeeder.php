<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Array contoh nama kategori
        $categories = [
            'Sayuran',
            'Buah-buahan',
            'Daging',
            'Ikan',
            'Frozen Food',
            'Snack',
            'Minuman',
            'Perlengkapan Mandi',
            'Pembersih',
            'Siap Saji',
            'Makanan Ringan',
            'Bumbu & Saus',
            'Perawatan Diri',
            'Kesehatan',
            'Susu & Olahan',
            'Perlengkapan Bayi',
            'Sembako',
            'Popok & Tisu',
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'slug' => strtolower(str_replace(' ', '-', $name)),
                'is_active' => true,
            ]);
        }
    }
}
