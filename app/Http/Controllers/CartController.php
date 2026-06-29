<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Menampilkan halaman keranjang belanja.
     */
    public function index()
    {
        $user = Auth::user();
        $cartItems = Cart::with('product.store')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($cartItem) {
                $product = $cartItem->product;
                $price = $product->discount_price ?? $product->price;

                return [
                    'id' => $cartItem->id,
                    'quantity' => $cartItem->quantity,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image' => $product->image_url, // Asumsi ada accessor image_url di model Product
                    'price' => $price,
                    'price_formatted' => 'Rp' . number_format($price, 0, ',', '.'),
                    'stock' => $product->stock,
                    'store_name' => $product->store->name ?? 'Official Store',
                ];
            });

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
        ]);
    }

    /**
     * Menambahkan produk ke keranjang.
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $user = Auth::user();
        $productId = $request->product_id;
        $quantity = $request->quantity ?? 1;

        // Cek apakah produk sudah ada di keranjang
        $cartItem = Cart::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            // Jika sudah ada, update quantity
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            // Jika belum ada, buat item baru
            Cart::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return Redirect::back()->with('success', 'Produk ditambahkan ke keranjang.');
    }

    /**
     * Update kuantitas item di keranjang.
     */
    public function update(Request $request, Cart $cart)
    {
        // Pastikan user yang login adalah pemilik item keranjang
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart->update(['quantity' => $request->quantity]);

        return Redirect::route('cart.index');
    }

    /**
     * Menghapus item dari keranjang.
     */
    public function remove(Cart $cart)
    {
        // Pastikan user yang login adalah pemilik item keranjang
        if ($cart->user_id !== Auth::id()) {
            abort(403);
        }

        $cart->delete();

        return Redirect::route('cart.index');
    }
}
