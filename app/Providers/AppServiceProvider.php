<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') !== 'local') {
            URL::forceScheme('https');
        }

        // Auto-create storage symbolic link if it doesn't exist (useful for Docker/Railway deployments)
        if (!file_exists(public_path('storage'))) {
            try {
                app('files')->link(storage_path('app/public'), public_path('storage'));
            } catch (\Exception $e) {
                // Fail silently if symlink creation is blocked by permissions
            }
        }
    }
}
