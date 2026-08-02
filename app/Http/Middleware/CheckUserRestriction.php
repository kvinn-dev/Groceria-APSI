<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRestriction
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->status === 'restricted') {
            if ($request->expectsJson() && !$request->header('X-Inertia')) {
                return response()->json([
                    'message' => 'Aktivitas akun Anda dibatasi oleh admin. Anda tidak dapat melakukan transaksi.'
                ], 403);
            }

            return redirect()->back()->with('error', 'Aktivitas akun Anda dibatasi oleh admin. Anda tidak dapat melakukan transaksi.');
        }

        return $next($request);
    }
}
