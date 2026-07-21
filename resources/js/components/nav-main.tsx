import CartDropdown from '@/components/cart-dropdown';
import NotificationDropdown from '@/components/notification-dropdown';
import { UserInfo } from '@/components/user-info';
import { type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NavMain() {
    const page = usePage<SharedData>();
    const auth = page.props.auth ?? { user: null };

    // State untuk Search Query
    const [searchQuery, setSearchQuery] = useState(
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search).get('search') || ''
            : '',
    );

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        router.get('/products', { search: searchQuery });
    };

    // State untuk CSRF token
    const [csrfToken, setCsrfToken] = useState<string>('');

    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const res = await fetch('/csrf-token', {
                    credentials: 'include',
                });
                const data = await res.json();
                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.error('Gagal ambil CSRF token', err);
            }
        };
        fetchCsrf();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
            });

            if (res.ok) {
                window.location.reload();
            } else {
                console.error('Logout gagal');
            }
        } catch (err) {
            console.error('Logout error', err);
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
            {/* TOP PROMO BAR */}
            <div className="border-b border-gray-200 bg-gray-100 px-4 text-[13px] dark:border-[#3E3E3A] dark:bg-[#252523]">
                <div className="mx-auto flex max-w-7xl items-center justify-between text-gray-600 dark:text-gray-300">
                    <div className="group relative inline-block">
                        {/* TEXT / TRIGGER */}
                        <Link
                            href="/promo-aplikasi"
                            className="flex items-center gap-1 py-1 text-gray-900 dark:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5A2.25 2.25 0 0 0 8.25 22.5h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5H13.5m-3 0V3h3V1.5"
                                />
                            </svg>

                            <span className="font-bold">
                                Gratis Ongkir + Banyak Promo
                            </span>
                            <span className="text-gray-900 group-hover:font-bold dark:text-gray-300">
                                belanja di aplikasi
                            </span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </Link>

                        {/* POPUP */}
                        <div className="invisible absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-sm border bg-white p-4 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-[#3E3E3A] dark:bg-[#252523]">
                            <p className="mb-1 text-center text-xs text-gray-900 dark:text-white">
                                Scan QR ini untuk download aplikasi dan dapatkan
                                promonya!
                            </p>

                            <div className="mb-1 flex justify-center">
                                <img
                                    src="/images/nav/qr-apk.webp"
                                    alt="QR Download App"
                                    className="h-36 w-36"
                                />
                            </div>

                            <p className="mb-2 text-center text-xs text-gray-500">
                                atau klik tombol di bawah:
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                {/* BARIS ATAS */}
                                <img
                                    src="/images/nav/google-play.svg"
                                    className="h-10 justify-self-center object-contain"
                                    alt="Google Play"
                                />
                                <img
                                    src="/images/nav/app-store.svg"
                                    className="h-10 justify-self-center object-contain"
                                    alt="App Store"
                                />

                                {/* BARIS BAWAH - TENGAH */}
                                <img
                                    src="/images/nav/app-gallery.svg"
                                    className="col-span-2 h-8 justify-self-center object-contain"
                                    alt="App Gallery"
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-6">
                        {["Tentang Groceria", "Mulai Berjualan", "Promo", "Groceria Care"].map((item) => (
                            <Link
                                key={item}
                                href="/"
                                className="hover:text-green-600 dark:hover:text-green-400 dark:text-gray-300"
                            >
                                {item}
                            </Link>
                        ))}
                    </div> */}
                </div>
            </div>

            <div className="container mx-auto bg-white px-4 py-2 dark:bg-[#1A1A19]">
                <div className="flex items-center justify-between gap-6">
                    {/* LOGO */}
                    <Link href="/" className="flex items-center">
                        <img
                            src="/logo-groceria-text.svg"
                            alt="Groceria"
                            className="h-5.5 w-auto"
                        />
                    </Link>

                    {/* SEARCH BAR */}
                    <form
                        onSubmit={handleSearchSubmit}
                        className="hidden flex-1 md:flex"
                    >
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari di Groceria"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pr-4 pl-10 text-sm shadow-xs outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 dark:border-[#3E3E3A] dark:bg-[#252523] dark:text-gray-200 focus:dark:border-green-600 focus:dark:ring-green-600"
                            />

                            <button
                                type="submit"
                                className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition hover:text-green-600 dark:text-gray-500"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeWidth="2"
                                        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center">
                        {/* ICON GROUP */}
                        <div className="flex items-center gap-1">
                            {/* CART */}
                            <CartDropdown />

                            {auth.user && (
                                <>
                                    {/* NOTIF */}
                                    <NotificationDropdown />

                                    {/* INBOX */}
                                    <Link
                                        href="/user-profile"
                                        data={{
                                            section: 'inbox',
                                            tab: 'Chat',
                                        }}
                                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md hover:bg-gray-100/70 dark:hover:bg-[#252523]"
                                    >
                                        <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* AUTH AREA */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    {/* DIVIDER */}
                                    <div className="mx-4 mr-4 h-6 w-px bg-gray-300 dark:bg-[#3E3E3A]" />

                                    {/* USER PROFILE */}
                                    <UserInfo
                                        user={auth.user}
                                        onLogout={handleLogout}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* DIVIDER */}
                                    <div className="mx-4 h-6 w-px bg-gray-300 dark:bg-[#3E3E3A]" />

                                    {/* MASUK */}
                                    <Link
                                        href="/login"
                                        className="rounded-md border border-green-600 px-3 py-1 text-sm font-semibold text-green-600 hover:bg-green-100"
                                    >
                                        Masuk
                                    </Link>

                                    {/* DAFTAR */}
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
