<?php

namespace App\Http\Middleware;
 
use App\Models\Cart;
use Illuminate\Foundation\Inspiring;
use Tighten\Ziggy\Ziggy;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'cartCount' => fn () => $request->user()
                ? Cart::where('user_id', $request->user()->id)->count()
                : 0,
            'cartItemsPreview' => fn () => $request->user()
                ? Cart::with('product')
                    ->where('user_id', $request->user()->id)
                    ->latest() // Mengambil item terbaru
                    ->limit(15) // Batasi 15 item untuk pratinjau
                    ->get()
                    ->map(function ($cartItem) {
                        if (!$cartItem->product) return null;
                        $product = $cartItem->product;
                        $price = $product->discount_price ?? $product->price;
                        return [
                            'name' => $product->name,
                            'slug' => $product->slug,
                            'image' => $product->image_url, // Pastikan accessor ini ada di model Product
                            'price_formatted' => 'Rp' . number_format($price, 0, ',', '.'),
                        ];
                    })->filter() // Menghapus item null jika produk tidak ditemukan
                : [],
        ]);
    }
}
