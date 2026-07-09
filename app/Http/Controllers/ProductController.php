<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource for admin.
     */
    public function index(Request $request)
    {
        // Cek apakah request datang dari route admin
        if ($request->route()->named('admin.*')) {
            $query = Product::with('category', 'brand');

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });

                // Urutkan berdasarkan tingkat relevansi kecocokan teks
                $query->orderByRaw("CASE 
                    WHEN name = ? THEN 1 
                    WHEN name LIKE ? THEN 2 
                    WHEN name LIKE ? THEN 3 
                    ELSE 4 
                END ASC", [
                    $search,
                    $search . '%',
                    '%' . $search . '%'
                ])->latest();
            } else {
                $query->latest();
            }

            return Inertia::render('Admin/Products/Index', [
                'products' => $query->paginate(10)->withQueryString(),
                'filters' => $request->only(['search']),
            ]);
        }

        // Logika untuk halaman publik
        $query = Product::with(['category', 'brand'])->where('is_active', true);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });

            // Urutkan berdasarkan relevansi
            $query->orderByRaw("CASE 
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

        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        if ($request->filled('brand')) {
            $brandSlug = $request->input('brand');
            $query->whereHas('brand', function($q) use ($brandSlug) {
                $q->where('slug', $brandSlug);
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        $query->latest();

        return Inertia::render('products/Index', [
            'products' => $query->paginate(12)->withQueryString(),
            'categories' => Category::whereNull('parent_id')->with('children')->get(),
            'brands' => Brand::where('is_active', true)->get(),
            'filters' => $request->only(['search', 'category', 'brand', 'min_price', 'max_price']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(),
            'brands' => Brand::where('is_active', true)->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateProduct($request);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        } elseif ($request->filled('image_url')) {
            $validated['image'] = $request->input('image_url');
        }

        unset($validated['image_url']);
        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        // Redirect ke halaman view publik
        return redirect()->route('product.view', $product->slug);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
            'brands' => Brand::where('is_active', true)->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $this->validateProduct($request, $product->id);

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image && !str_starts_with($product->image, 'http://') && !str_starts_with($product->image, 'https://')) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        } elseif ($request->filled('image_url')) {
            // Hapus gambar lama jika ada
            if ($product->image && !str_starts_with($product->image, 'http://') && !str_starts_with($product->image, 'https://')) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->input('image_url');
        }

        unset($validated['image_url']);

        // Update slug jika nama produk berubah
        if ($product->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product->image && !str_starts_with($product->image, 'http://') && !str_starts_with($product->image, 'https://')) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Produk berhasil dihapus.');
    }

    private function validateProduct(Request $request, $productId = null)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image_url' => 'nullable|url',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];

        // Saat update, pastikan 'image' tidak wajib
        if ($request->isMethod('patch') || $request->isMethod('put')) {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048';
        }

        return $request->validate($rules);
    }
}
