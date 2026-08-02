<?php

use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserAddressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ViewProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Web\CategoryController as WebCategoryController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FlashSaleController;
use App\Http\Controllers\TopProductController;


Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|confirmed|min:8',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    Auth::login($user);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user,
    ], 201);
});

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (Auth::attempt($request->only('email', 'password'))) {
        $user = Auth::user();
        
        if ($user->status === 'suspended') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return response()->json(['message' => 'Akun Anda dinonaktifkan sementara oleh admin.'], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil',
            'user' => $user,
        ]);
    }

    return response()->json(['message' => 'Email atau password salah'], 422);
});

Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    if ($request->expectsJson() && !$request->hasHeader('X-Inertia')) {
        return response()->json(['message' => 'Logged out']);
    }
    return redirect('/login');
})->name('logout');

// Ambil CSRF token untuk frontend
Route::get('/csrf-token', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});

Route::middleware(['user.only'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | PUBLIC ROUTES
    |--------------------------------------------------------------------------
    |*/

    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/product/{slug}', [ViewProductController::class, 'view'])
        ->name('product.view');

    /*
    |--------------------------------------------------------------------------
    | PRODUCT & CATEGORY (PUBLIC)
    |--------------------------------------------------------------------------
    |*/

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])
            ->name('products.index');

        Route::get('/{product:slug}', [ProductController::class, 'show'])
            ->name('products.show');
    });

    Route::prefix('categories')->group(function () {
        Route::get('/', [WebCategoryController::class, 'index'])
            ->name('categories.index');

        Route::get('/{category:slug}', [WebCategoryController::class, 'show'])
            ->name('categories.show');
    });

    /*
    |--------------------------------------------------------------------------
    | FLASH SALE & TOP PRODUCT (PUBLIC)
    |--------------------------------------------------------------------------
    |*/

    Route::get('/flash-sale', [FlashSaleController::class, 'index'])
        ->name('flash-sale');

    Route::get('/flash-sale/batch', [FlashSaleController::class, 'batch']);

    Route::get('/top-product', [TopProductController::class, 'index'])
        ->name('top-product');

    Route::get('/top-product/all', [TopProductController::class, 'all'])
        ->name('top-product.all');

    Route::middleware(['auth'])->group(function () {

        // Profile page
        Route::get('/user-profile', [UserProfileController::class, 'index'])
            ->name('user-profile');

        // Update basic info (name, avatar, dll)
        Route::post('/user-profile', [UserProfileController::class, 'update'])
            ->name('user-profile.update');

        // Update password
        Route::put('/user-profile/password', [UserProfileController::class, 'updatePassword'])
            ->name('user-profile.password');

        // Delete account
        Route::delete('/user-profile', [UserProfileController::class, 'destroy'])
            ->name('user-profile.destroy');

        // Address management
        Route::post('/user-addresses', [UserAddressController::class, 'store'])->name('user-addresses.store');
        Route::put('/user-addresses/{address}', [UserAddressController::class, 'update'])->name('user-addresses.update');
        Route::delete('/user-addresses/{address}', [UserAddressController::class, 'destroy'])->name('user-addresses.destroy');
        Route::patch('/user-addresses/{address}/set-default', [UserAddressController::class, 'setDefault'])->name('user-addresses.set-default');
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', function () {
            $totalProducts = \App\Models\Product::count();
            $totalCategories = \App\Models\Category::count();
            $totalOrders = \App\Models\Order::count();
            $totalRevenue = \App\Models\Order::where('payment_status', 'paid')->sum('total');

            // Order Status counts
            $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            $statusCountsRaw = \App\Models\Order::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray();
            
            $orderStatusCounts = [];
            foreach ($statuses as $status) {
                $orderStatusCounts[$status] = $statusCountsRaw[$status] ?? 0;
            }

            // Recent Orders
            $recentOrders = \App\Models\Order::latest()
                ->limit(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer_name' => $order->customer_name,
                        'total' => (float) $order->total,
                        'status' => $order->status,
                        'payment_status' => $order->payment_status,
                        'created_at' => $order->created_at->toIso8601String(),
                    ];
                });

            // Top Products
            $topProducts = \App\Models\OrderItem::selectRaw('product_id, product_name, sum(quantity) as total_sold, sum(subtotal) as total_revenue')
                ->groupBy('product_id', 'product_name')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'total_sold' => (int) $item->total_sold,
                        'total_revenue' => (float) $item->total_revenue,
                    ];
                });

            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'total_products' => $totalProducts,
                    'total_categories' => $totalCategories,
                    'total_orders' => $totalOrders,
                    'total_revenue' => (float) $totalRevenue,
                    'order_status_counts' => $orderStatusCounts,
                    'recent_orders' => $recentOrders,
                    'top_products' => $topProducts,
                ]
            ]);
        })->name('dashboard');

        // Flash Sale Management
        Route::prefix('flash-sale')->group(function () {
            Route::get('/', [FlashSaleController::class, 'manage'])->name('flash-sale');
            Route::post('/', [FlashSaleController::class, 'store'])->name('flash-sale.store');
            Route::put('/{id}', [FlashSaleController::class, 'update'])->name('flash-sale.update');
            Route::delete('/{id}', [FlashSaleController::class, 'destroy'])->name('flash-sale.destroy');
        });

        // Top Product Management
        Route::prefix('top-product')->group(function () {
            Route::get('/', [TopProductController::class, 'manage'])->name('top-product');
            Route::post('/', [TopProductController::class, 'store'])->name('top-product.store');
            Route::put('/{id}', [TopProductController::class, 'update'])->name('top-product.update');
            Route::delete('/{id}', [TopProductController::class, 'destroy'])->name('top-product.destroy');
        });

        // Product Management
        Route::prefix('products')->group(function () {
            Route::get('/', [ProductController::class, 'index'])->name('products.index');
            Route::get('/create', [ProductController::class, 'create'])->name('products.create');
            Route::post('/', [ProductController::class, 'store'])->name('products.store');
            Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
            Route::put('/{product}', [ProductController::class, 'update'])->name('products.update');
            Route::delete('/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        });

        // Category Management
        Route::prefix('categories')->group(function () {
            Route::get('/', [AdminCategoryController::class, 'index'])
                ->name('categories.index');

            Route::get('/create', [AdminCategoryController::class, 'create'])
                ->name('categories.create');

            Route::post('/', [AdminCategoryController::class, 'store'])
                ->name('categories.store');

            Route::get('/{category}/edit', [AdminCategoryController::class, 'edit'])
                ->name('categories.edit');

            Route::put('/{category}', [AdminCategoryController::class, 'update'])
                ->name('categories.update');

            Route::delete('/{category}', [AdminCategoryController::class, 'destroy'])
                ->name('categories.destroy');
        });

        // Order Management
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'adminIndex'])->name('orders.index');
            Route::put('/{order}', [OrderController::class, 'update'])->name('orders.update');
            Route::delete('/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
        });

        // User Management
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('users.index');
            Route::get('/{user}', [UserController::class, 'show'])->name('users.show');
            Route::patch('/{user}/status', [UserController::class, 'updateStatus'])->name('users.update-status');
        });
    });

/*
|--------------------------------------------------------------------------
| API-LIKE ROUTES (SEMENTARA DI WEB)
|--------------------------------------------------------------------------
*/

Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'apiIndex']);
    Route::get('/products/featured', [ProductController::class, 'featured']);
    Route::get('/categories', [WebCategoryController::class, 'apiIndex']);

    Route::get('/flash-sale/products', [FlashSaleController::class, 'getProducts']);
    Route::get('/top-product/products', [TopProductController::class, 'getProducts']);
});


    Route::middleware(['auth', 'verified', 'user.only'])->group(function () {
        Route::get('/cart', [App\Http\Controllers\CartController::class, 'index'])->name('cart.index');
        Route::delete('/cart/remove/{cart}', [App\Http\Controllers\CartController::class, 'remove'])->name('cart.remove');

        // Routes blocked if user account is restricted
        Route::middleware(['restricted.check'])->group(function () {
            Route::post('/cart/add', [App\Http\Controllers\CartController::class, 'add'])->name('cart.add');
            Route::patch('/cart/update/{cart}', [App\Http\Controllers\CartController::class, 'update'])->name('cart.update');

            // Checkout Routes
            Route::post('/checkout', [OrderController::class, 'prepareCheckout'])->name('checkout.prepare');
            Route::get('/checkout', [OrderController::class, 'checkoutPage'])->name('checkout.page');
            Route::post('/checkout/process', [OrderController::class, 'checkout'])->name('checkout.process');
        });

        // Customer Order Routes
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    });

require __DIR__.'/settings.php';
