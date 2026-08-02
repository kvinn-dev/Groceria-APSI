<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- SEO & Open Graph --}}
    <meta name="description"
        content="Groceria adalah platform e-commerce minimarket untuk memudahkan pengguna berbelanja kebutuhan sehari-hari.">

    <meta property="og:type" content="website">
    <meta property="og:title" content="Groceria - E-Commerce Minimarket">
    <meta property="og:description"
        content="Platform e-commerce minimarket Groceria untuk memudahkan pengguna berbelanja kebutuhan sehari-hari.">
    <meta property="og:image"
        content="https://groceria-apsi.up.railway.app/images/groceria-preview.jpg">
    <meta property="og:url"
        content="https://groceria-apsi.up.railway.app/">
    <meta property="og:site_name" content="Groceria">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Groceria - E-Commerce Minimarket">
    <meta name="twitter:description"
        content="Platform e-commerce minimarket Groceria untuk memudahkan pengguna berbelanja kebutuhan sehari-hari.">
    <meta name="twitter:image"
        content="https://groceria-apsi.up.railway.app/images/groceria-preview.jpg">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    {{-- Favicon --}}
    <link rel="icon" href="/logo-groceria.svg" sizes="any">
    <link rel="icon" href="/logo-groceria.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>