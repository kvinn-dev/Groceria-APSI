<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.product'])
            ->latest();

        // For customers, only show their own orders
        if (Auth::check() && !Auth::user()->is_admin) {
            $query->where('user_id', Auth::id());
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'payment_status']),
            'statusOptions' => [
                'pending' => 'Menunggu',
                'processing' => 'Diproses',
                'shipped' => 'Dikirim',
                'delivered' => 'Selesai',
                'cancelled' => 'Dibatalkan',
            ],
            'paymentStatusOptions' => [
                'pending' => 'Menunggu',
                'paid' => 'Dibayar',
                'failed' => 'Gagal',
                'refunded' => 'Dikembalikan',
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('orders/Create', [
            'products' => Product::where('is_active', true)
                ->where('stock', '>', 0)
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'customer_city' => 'required|string|max:100',
            'customer_province' => 'required|string|max:100',
            'customer_postal_code' => 'required|string|max:10',
            'customer_country' => 'required|string|max:100',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $subtotal = 0;
                $itemsData = [];

                foreach ($validated['items'] as $item) {
                    // Lock product row to prevent race conditions during concurrent checkouts
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    // Check stock
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}");
                    }

                    $price = $product->discount_price ?? $product->price;
                    $itemSubtotal = $price * $item['quantity'];
                    $subtotal += $itemSubtotal;

                    $itemsData[] = [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_price' => $price,
                        'quantity' => $item['quantity'],
                        'subtotal' => $itemSubtotal,
                        'product_model' => $product, // temp reference to update stock
                    ];
                }

                // Calculate tax (11% PPN) and shipping
                $tax = $subtotal * 0.11;
                $shippingCost = 15000; // Flat rate for now
                $total = $subtotal + $tax + $shippingCost;

                $order = Order::create([
                    'user_id' => Auth::id(),
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'customer_address' => $validated['customer_address'],
                    'customer_city' => $validated['customer_city'],
                    'customer_province' => $validated['customer_province'],
                    'customer_postal_code' => $validated['customer_postal_code'],
                    'customer_country' => $validated['customer_country'],
                    'subtotal' => $subtotal,
                    'tax' => $tax,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'payment_method' => $validated['payment_method'],
                    'notes' => $validated['notes'] ?? null,
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                // Create order items and decrement stock
                foreach ($itemsData as $itemData) {
                    $productModel = $itemData['product_model'];
                    unset($itemData['product_model']);

                    $order->items()->create($itemData);

                    // Reduce stock in DB and memory
                    $productModel->decrement('stock', $itemData['quantity']);

                    // Increment flash sale sold count if active
                    $activeFlashSale = $productModel->active_flash_sale;
                    if ($activeFlashSale) {
                        $activeFlashSale->incrementSoldCount($itemData['quantity']);
                    }
                }

                // Clear items from cart
                if (Auth::check()) {
                    $productIds = collect($itemsData)->pluck('product_id')->toArray();
                    \App\Models\Cart::where('user_id', Auth::id())
                        ->whereIn('product_id', $productIds)
                        ->delete();
                }
            });

            return redirect()
                ->route('orders.index')
                ->with('success', 'Pesanan berhasil dibuat!');

        } catch (\Exception $e) {
            return back()->withErrors([
                'items' => $e->getMessage(),
            ])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        // Check authorization
        if (Auth::check() && !Auth::user()->is_admin && $order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['user', 'items.product', 'payment']);

        return Inertia::render('orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'required|in:pending,paid,failed,refunded',
            'shipping_tracking_number' => 'nullable|string|max:100',
            'shipping_carrier' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        // If order is cancelled, restore product stock
        if ($validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            foreach ($order->items as $item) {
                $product = $item->product;
                $product->increment('stock', $item->quantity);
            }
        }

        $order->update($validated);

        return back()->with('success', 'Pesanan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        // Only allow deletion of pending orders
        if ($order->status !== 'pending') {
            return redirect()
                ->route('orders.index')
                ->with('error', 'Hanya pesanan dengan status pending yang dapat dihapus!');
        }

        // Restore product stock
        foreach ($order->items as $item) {
            $product = $item->product;
            $product->increment('stock', $item->quantity);
        }

        $order->delete();

        return redirect()
            ->route('orders.index')
            ->with('success', 'Pesanan berhasil dihapus!');
    }

    /**
     * Customer checkout from cart
     */
    /**
     * Prepare items for checkout and save them to user session.
     */
    public function prepareCheckout(Request $request)
    {
        $request->validate([
            'cart_items' => 'nullable|array',
            'cart_items.*' => 'exists:carts,id',
            'product_id' => 'nullable|exists:products,id',
            'quantity' => 'nullable|integer|min:1',
        ]);

        $checkoutItems = [];

        if ($request->has('cart_items')) {
            $cartItems = \App\Models\Cart::with('product')
                ->where('user_id', Auth::id())
                ->whereIn('id', $request->cart_items)
                ->get();

            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                if ($product) {
                    $checkoutItems[] = [
                        'product_id' => $product->id,
                        'name' => $product->name,
                        'price' => (float) ($product->discount_price ?? $product->price),
                        'quantity' => (int) $cartItem->quantity,
                        'image' => $product->image_url,
                        'stock' => (int) $product->stock,
                    ];
                }
            }
        } elseif ($request->has('product_id')) {
            $product = Product::findOrFail($request->product_id);
            $checkoutItems[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => (float) ($product->discount_price ?? $product->price),
                'quantity' => (int) $request->input('quantity', 1),
                'image' => $product->image_url,
                'stock' => (int) $product->stock,
            ];
        }

        if (empty($checkoutItems)) {
            return redirect()->route('cart.index')->with('error', 'Silakan pilih produk terlebih dahulu.');
        }

        // Save to session
        session(['checkout_items' => $checkoutItems]);

        return redirect()->route('checkout.page');
    }

    /**
     * Display checkout form page.
     */
    public function checkoutPage()
    {
        $checkoutItems = session('checkout_items');

        if (empty($checkoutItems)) {
            return redirect()->route('cart.index')->with('error', 'Keranjang belanja Anda kosong.');
        }

        $subtotal = 0;
        foreach ($checkoutItems as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }

        $tax = $subtotal * 0.11;
        $shippingCost = 15000; // Flat rate shipping
        $total = $subtotal + $tax + $shippingCost;

        $user = Auth::user();

        return Inertia::render('Checkout', [
            'checkoutItems' => $checkoutItems,
            'summary' => [
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shippingCost' => $shippingCost,
                'total' => $total,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone ?? '',
                'address' => $user->address ?? '',
                'city' => $user->city ?? '',
                'province' => $user->province ?? '',
                'postal_code' => $user->postal_code ?? '',
            ]
        ]);
    }

    /**
     * Customer checkout from cart
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.name' => 'required|string|max:255',
            'shipping_address.email' => 'required|email',
            'shipping_address.phone' => 'required|string|max:20',
            'shipping_address.address' => 'required|string',
            'shipping_address.city' => 'required|string|max:100',
            'shipping_address.province' => 'required|string|max:100',
            'shipping_address.postal_code' => 'required|string|max:10',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        // Map cart items from frontend format to backend items structure
        $items = array_map(function ($item) {
            return [
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
            ];
        }, $validated['cart']);

        // Process order using the store method
        return $this->store(new Request([
            'customer_name' => $validated['shipping_address']['name'],
            'customer_email' => $validated['shipping_address']['email'],
            'customer_phone' => $validated['shipping_address']['phone'],
            'customer_address' => $validated['shipping_address']['address'],
            'customer_city' => $validated['shipping_address']['city'],
            'customer_province' => $validated['shipping_address']['province'],
            'customer_postal_code' => $validated['shipping_address']['postal_code'],
            'customer_country' => 'Indonesia',
            'payment_method' => $validated['payment_method'],
            'notes' => $validated['notes'] ?? null,
            'items' => $items,
        ]));
    }

    /**
     * Display a listing of orders for administration.
     */
    public function adminIndex(Request $request)
    {
        $query = Order::with(['user', 'items.product'])
            ->latest();

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'payment_status']),
            'statusOptions' => [
                'pending' => 'Menunggu Verifikasi',
                'processing' => 'Diproses',
                'shipped' => 'Dikirim',
                'delivered' => 'Selesai',
                'cancelled' => 'Dibatalkan',
            ],
            'paymentStatusOptions' => [
                'pending' => 'Menunggu Pembayaran',
                'paid' => 'Dibayar',
                'failed' => 'Gagal',
                'refunded' => 'Dikembalikan',
            ],
        ]);
    }
}