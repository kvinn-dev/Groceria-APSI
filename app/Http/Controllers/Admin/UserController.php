<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::withCount('orders')
            ->where('id', '!=', auth()->id());

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return Inertia::render('admin/users/Index', [
            'users' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified user details.
     */
    public function show(User $user)
    {
        // Load addresses and orders with items
        $user->load(['addresses', 'orders' => function ($q) {
            $q->latest();
        }]);

        $totalOrders = $user->orders->count();
        $totalSpent = $user->orders->where('payment_status', 'paid')->sum('total');

        return Inertia::render('admin/users/Show', [
            'userDetail' => $user,
            'orders' => $user->orders,
            'addresses' => $user->addresses,
            'stats' => [
                'total_orders' => $totalOrders,
                'total_spent' => (float) $totalSpent,
            ]
        ]);
    }

    /**
     * Update the user's status.
     */
    public function updateStatus(Request $request, User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat mengubah status akun Anda sendiri.');
        }

        $validated = $request->validate([
            'status' => 'required|in:active,suspended,restricted',
        ]);

        $user->update(['status' => $validated['status']]);

        // Translate status for readability
        $statusLabels = [
            'active' => 'Aktif',
            'suspended' => 'Dinonaktifkan Sementara',
            'restricted' => 'Dibatasi',
        ];

        $label = $statusLabels[$validated['status']] ?? $validated['status'];

        return back()->with('success', "Status akun user berhasil diubah menjadi {$label}.");
    }
}
