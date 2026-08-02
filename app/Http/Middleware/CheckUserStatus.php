<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->status === 'suspended') {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                if ($request->expectsJson() || $request->header('X-Inertia')) {
                    return response()->json([
                        'message' => 'Akun Anda dinonaktifkan sementara oleh admin.'
                    ], 403);
                }

                return redirect()->route('home')->with('error', 'Akun Anda dinonaktifkan sementara oleh admin.');
            }
        }

        return $next($request);
    }
}
