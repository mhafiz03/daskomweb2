<?php

namespace App\Providers;

use ImageKit\ImageKit;
use App\Adapter\ImageKitAdapter;
use League\Flysystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use Illuminate\Filesystem\FilesystemAdapter;

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
        Storage::extend('imagekit', function ($app, $config) {
            $adapter = new ImageKitAdapter(
                new ImageKit(
                    env('IMAGEKIT_PUBLIC_KEY'),
                    env('IMAGEKIT_PRIVATE_KEY'),
                    env('IMAGEKIT_ENDPOINT_URL')
                ),
            );

            return new FilesystemAdapter(
                new Filesystem($adapter, $config),
                $adapter,
                $config
            );
        });
    }
}
