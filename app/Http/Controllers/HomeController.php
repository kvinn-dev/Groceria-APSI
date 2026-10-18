<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display home page
     */
    public function index()
    {
        // Data untuk homepage diambil dari model Product & Category
        $featuredProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->limit(8)
            ->get();

        $newProducts = Product::with(['category', 'brand'])
            ->where('is_active', true)
            ->latest()
            ->limit(8)
            ->get();

        $categories = Category::withCount('products')
            ->whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->withCount('products');
            }])
            ->get()
            ->map(fn($cat) => [
                'id'             => $cat->id,
                'name'           => $cat->name,
                'slug'           => $cat->slug,
                'description'    => $cat->description,
                'image'          => $cat->image_url, // accessor: uploaded image → default static → generic icon
                'products_count' => $cat->products_count,
                'children'       => $cat->children->map(fn($child) => [
                    'id'             => $child->id,
                    'name'           => $child->name,
                    'slug'           => $child->slug,
                    'products_count' => $child->products_count,
                    'image'          => $child->image_url,
                ]),
            ]);

        $topProducts = Product::with('category')
            ->where('is_active', true)
            ->latest()
            ->limit(12)
            ->get()
            ->map(fn($product) => [
                'id'       => $product->id,
                'name'     => $product->name,
                'slug'     => $product->slug,
                'price'    => $product->discount_price ?? $product->price,
                'image'    => $product->image_url,
                'category' => $product->category,
                'sold'     => (int) $product->sold,
            ]);

        $search = request('search');
        $productsQuery = Product::where('is_active', true);

        if ($search) {
            $productsQuery->where('name', 'like', "%{$search}%")
                ->orderByRaw("CASE 
                    WHEN name = ? THEN 1 
                    WHEN name LIKE ? THEN 2 
                    WHEN name LIKE ? THEN 3 
                    ELSE 4 
                END ASC", [
                    $search,
                    $search . '%',
                    '%' . $search . '%'
                ]);
        }

        $products = $productsQuery->latest()
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'slug' => $p->slug,
                'name' => $p->name,
                'price' => (int) $p->price,
                'discount_price' => $p->discount_price !== null
                    ? (int) $p->discount_price
                    : null,
                'discount' => (int) ($p->discount ?? 0),
                'stock' => (int) ($p->stock ?? 0),
                'image' => $p->image_url,
                'sold' => (int) ($p->sold ?? 0),
            ]);


        // Render halaman React 'Home' dengan data
        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'newProducts' => $newProducts,
            'categories' => $categories,
            'topProducts'      => $topProducts,
            'products' => $products,
        ]);
    }
}
