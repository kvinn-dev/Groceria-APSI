import { useEffect, useRef, useState } from 'react';

/* =========================
   TABS & TYPES
========================= */
const TABS = [
    'Promo',
    'Produk Pilihan',
    'Kebutuhan Rumah',
    'Produk Digital',
    'Layanan',
    'Groceria Sehat',
] as const;

type TabKey = (typeof TABS)[number];

/* =========================
   TAB DATA
========================= */
const TAB_DATA: Record<TabKey, string[][]> = {
    Promo: [
        [
            'Bebas Ongkir',
            'Flash Sale',
            'Belanja Hemat',
            'Promo Mingguan',
            'Official Store',
            'Katalog Produk',
        ],
        [
            'Diskon Member',
            'Promo Pengguna Baru',
            'Belanja Sehat',
            'Produk Lokal',
            'Promo Keluarga',
        ],
        [
            'Festival Belanja',
            'Promo Ramadan',
            'Belanja Bulanan',
            'Groceria Business',
            'Festival Snack',
        ],
        [
            'Kejar Diskon',
            'Belanja Lokal',
            'Super Weekend Sale',
            'Mitra Groceria',
            'Voucher Belanja',
        ],
    ],

    'Produk Pilihan': [
        [
            'Produk Terlaris',
            'Produk Baru',
            'Favorit Pelanggan',
            'Produk Pilihan',
        ],
        ['Diskon Terbaik', 'Harga Spesial', 'Paket Hemat', 'Best Seller'],
        ['Produk Premium', 'Produk Lokal', 'Produk Organik', 'Produk Impor'],
        ['Flash Sale', 'Voucher', 'Cashback', 'Promo Member'],
    ],

    'Kebutuhan Rumah': [
        [
            'Deterjen',
            'Pembersih Lantai',
            'Sabun Cuci Piring',
            'Pewangi Pakaian',
            'Tisu',
        ],
        [
            'Pembersih Kaca',
            'Pembersih Toilet',
            'Kantong Sampah',
            'Pengharum Ruangan',
            'Lap Microfiber',
        ],
        ['Spons Cuci', 'Sapu', 'Pel', 'Disinfektan', 'Sarung Tangan'],
        [
            'Alat Kebersihan',
            'Peralatan Dapur',
            'Tempat Sampah',
            'Rak Penyimpanan',
            'Plastik Wrap',
        ],
    ],

    'Produk Digital': [
        [
            'Pulsa',
            'Paket Data',
            'Token Listrik',
            'Bayar Listrik',
            'BPJS',
            'PDAM',
            'Internet',
            'TV Kabel',
        ],
        [
            'Voucher Game',
            'Google Play',
            'Apple Gift Card',
            'Steam Wallet',
            'Netflix',
            'Spotify',
            'Disney+',
            'YouTube Premium',
        ],
        [
            'Voucher Belanja',
            'Voucher Groceria',
            'Voucher Makanan',
            'Top Up E-Wallet',
            'GoPay',
            'OVO',
            'DANA',
            'ShopeePay',
        ],
        [
            'Top Up Game',
            'Mobile Legends',
            'Free Fire',
            'PUBG',
            'Valorant',
            'Honor of Kings',
            'Point Blank',
            'League of Legends',
        ],
    ],

    Layanan: [
        [
            'Belanja Grosir',
            'Mitra Groceria',
            'Groceria Business',
            'Pesanan Terjadwal',
            'Langganan Bulanan',
        ],
        [
            'Belanja untuk UMKM',
            'Belanja Kantor',
            'Gift Card',
            'Pesanan Hadiah',
            'Paket Hemat',
        ],
        [
            'Promo Member',
            'Poin Reward',
            'Kupon Diskon',
            'Cashback',
            'Referensi Teman',
        ],
        [
            'Pusat Bantuan',
            'FAQ',
            'Hubungi Kami',
            'Lacak Pesanan',
            'Kebijakan Retur',
        ],
    ],

    'Groceria Sehat': [
        [
            'Produk Organik',
            'Vitamin',
            'Suplemen',
            'Makanan Sehat',
            'Minuman Sehat',
        ],
        ['Susu Rendah Lemak', 'Oatmeal', 'Granola', 'Protein', 'Buah Organik'],
        ['Sayur Organik', 'Madu', 'Herbal', 'Teh Herbal', 'Healthy Snack'],
        [
            'Diet Sehat',
            'Gaya Hidup Sehat',
            'Produk Vegan',
            'Gluten Free',
            'Sugar Free',
        ],
    ],
};

export function NavFooter() {
    const [activeTab, setActiveTab] = useState<TabKey>('Promo');
    const [lang, setLang] = useState<'ID' | 'EN'>('ID'); // Bahasa default Indonesia

    // Tabs indicator
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

    useEffect(() => {
        const activeIndex = TABS.indexOf(activeTab);
        const activeTabEl = tabRefs.current[activeIndex];
        if (activeTabEl) {
            setIndicatorStyle({
                width: activeTabEl.offsetWidth,
                left: activeTabEl.offsetLeft,
            });
        }
    }, [activeTab]);

    return (
        <footer className="bg-white py-10 dark:bg-[#1A1A19]">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white dark:bg-[#1A1A19]">
                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="mb-6 text-xl font-extrabold text-gray-900 dark:text-white">
                            Cari Semua di Groceria!
                        </h2>

                        {/* TABS */}
                        <div className="relative border-b border-gray-200 dark:border-[#252523]">
                            {/* TAB BUTTONS */}
                            <div className="relative flex flex-wrap gap-4">
                                {TABS.map((tab, index) => (
                                    <button
                                        key={tab}
                                        ref={(el: HTMLButtonElement | null) => {
                                            tabRefs.current[index] = el;
                                        }}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-11.5 pb-3 text-sm font-semibold transition-colors duration-200 ${
                                            activeTab === tab
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* SLIDING UNDERLINE */}
                            <span
                                className="absolute bottom-0 h-[3px] rounded-t-full bg-green-600 transition-all duration-300 ease-out dark:bg-green-400"
                                style={{
                                    width: indicatorStyle.width,
                                    transform: `translateX(${indicatorStyle.left}px)`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div
                            className="grid gap-4 px-4"
                            style={{
                                gridTemplateColumns: `repeat(${TAB_DATA[activeTab].length}, minmax(0, 1fr))`,
                            }}
                        >
                            {TAB_DATA[activeTab].map((column, colIndex) => (
                                <div key={colIndex} className="space-y-2">
                                    {column.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="w-full border-b border-gray-100 py-1.5 text-[12.5px] text-gray-600 transition-colors hover:text-green-600 dark:border-[#252523] dark:text-gray-400 dark:hover:text-green-400"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-md">
                            <h3 className="mb-3 text-lg font-black text-green-600">
                                Punya Toko Online? Buka cabangnya di Groceria
                            </h3>

                            <p className="mb-5 text-[13px] text-gray-600 dark:text-gray-300">
                                <span className="font-medium">
                                    Mudah, nyaman dan bebas Biaya Layanan
                                    Transaksi.
                                </span>{' '}
                                <span className="font-black">GRATIS!</span>
                            </p>

                            <div className="flex items-center gap-4">
                                <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700">
                                    Buka Toko GRATIS
                                </button>

                                <button className="flex items-center gap-0.5 text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200">
                                    Pelajari lebih lanjut
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* RIGHT - IMAGE */}
                        <div className="mx-[-40px] flex justify-center md:flex-1 md:justify-end">
                            <div className="w-[360px] md:w-[420px] lg:w-[480px]">
                                <img
                                    src="/images/nav/foot-01.webp"
                                    alt="Buka Toko di Groceria"
                                    className="h-auto w-full object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    {/* DASHED SEPARATOR */}
                    <div className="mt-5 mb-3">
                        <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600"></div>
                    </div>

                    {/* KEAMANAN Groceria - ELEMEN BARU */}
                    <div className="mt-0 pt-6 dark:border-[#252523]">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {/* TRANSPARAN */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex flex-shrink-0 items-center justify-center">
                                    <div className="flex aspect-square h-full items-center justify-center">
                                        <img
                                            src="/images/nav/transparan.jfif"
                                            alt="Transparan"
                                            className="h-[120px] object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="mb-1 text-[18px] font-black text-green-600 dark:text-white">
                                        Transparan
                                    </h4>
                                    <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
                                        Pembayaran Anda baru diteruskan ke
                                        penjual setelah barang Anda terima
                                    </p>
                                </div>
                            </div>

                            {/* AMAN */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex flex-shrink-0 items-center justify-center">
                                    <div className="flex aspect-square h-full items-center justify-center">
                                        <img
                                            src="/images/nav/aman.jfif"
                                            alt="Aman"
                                            className="h-[120px] object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="mb-1 text-[18px] font-black text-green-600 dark:text-white">
                                        Aman
                                    </h4>
                                    <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
                                        Bandingkan review untuk berbagai online
                                        shop terpercaya se-Indonesia
                                    </p>
                                </div>
                            </div>

                            {/* FASILITAS ESCROW GRATIS */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex flex-shrink-0 items-center justify-center">
                                    <div className="flex aspect-square h-full items-center justify-center">
                                        <img
                                            src="/images/nav/escrow.jfif"
                                            alt="Fasilitas Escrow"
                                            className="h-[120px] object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="mb-1 text-[18px] font-black text-green-600 dark:text-white">
                                        Fasilitas Escrow Gratis
                                    </h4>
                                    <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
                                        Fasilitas Escrow (rekening Bersama)
                                        Groceria tidak dikenakan biaya tambahan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DASHED SEPARATOR */}
                        <div className="mt-10">
                            <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600"></div>
                        </div>

                        {/* FOOTER BARU */}
                        <div className="mt-4 pt-8 dark:border-[#3E3E3A]">
                            <div className="grid grid-cols-1 gap-0.5 md:grid-cols-4">
                                {/* Groceria */}
                                <div className="pr-16">
                                    <div className="flex h-full flex-col space-y-6 border-r border-gray-200/50 dark:border-gray-700">
                                        <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                                            Groceria
                                        </h4>
                                        <ul className="space-y-2">
                                            {[
                                                'Tentang Groceria',
                                                'Karier',
                                                'Blog',
                                                'Program Affiliate',
                                                'Groceria Business',
                                                'Official Store',
                                                'Pusat Bantuan',
                                                'Lacak Pesanan',
                                                'Metode Pembayaran',
                                                'Kebijakan Pengembalian',
                                                'Promo Hari Ini',
                                                'Flash Sale',
                                            ].map((item) => (
                                                <li key={item}>
                                                    <a
                                                        href="#"
                                                        className="text-[13.5px] text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                    >
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Beli, Jual, Bantuan & Panduan */}
                                <div className="pr-16">
                                    <div className="flex h-full flex-col space-y-6 border-r border-gray-200/50 dark:border-gray-700">
                                        {/* Beli */}
                                        <div>
                                            <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                                                Beli
                                            </h4>
                                            <ul className="space-y-2">
                                                {[
                                                    'Tagihan & Top Up',
                                                    'Groceria COD',
                                                    'Bebas Ongkir',
                                                ].map((item) => (
                                                    <li key={item}>
                                                        <a
                                                            href="#"
                                                            className="text-[13.5px] text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                        >
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Jual */}
                                        <div>
                                            <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                                                Jual
                                            </h4>
                                            <ul className="space-y-2">
                                                {[
                                                    'Pusat Edukasi Seller',
                                                    'Daftar Mall',
                                                ].map((item) => (
                                                    <li key={item}>
                                                        <a
                                                            href="#"
                                                            className="text-[13.5px] text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                        >
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Bantuan & Panduan */}
                                        <div>
                                            <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                                                Bantuan & Panduan
                                            </h4>
                                            <ul className="space-y-2">
                                                {[
                                                    'Groceria Care',
                                                    'Syarat dan Ketentuan',
                                                    'Kebijakan Privasi',
                                                ].map((item) => (
                                                    <li key={item}>
                                                        <a
                                                            href="#"
                                                            className="text-[13.5px] text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                        >
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="pr-16">
                                    <div className="flex h-full flex-col space-y-6 border-r border-gray-200/50 dark:border-gray-700">
                                        {/* Keamanan & Privasi + Ikuti Kami */}
                                        <div className="space-y-6">
                                            {/* Keamanan & Privasi */}
                                            <div>
                                                <h4 className="mb-2 font-bold text-gray-900 dark:text-white">
                                                    Keamanan & Privasi
                                                </h4>
                                                <ul className="space-y-2">
                                                    {[
                                                        'Produk Segar Setiap Hari',
                                                        'Pembayaran Aman',
                                                        'Pengiriman Cepat',
                                                    ].map((item) => (
                                                        <li key={item}>
                                                            <a
                                                                href="#"
                                                                className="text-[13.5px] text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                            >
                                                                {item}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Ikuti Kami */}
                                            <div>
                                                <h4 className="mb-4 font-bold text-gray-900 dark:text-white">
                                                    Ikuti Kami
                                                </h4>
                                                <div className="flex space-x-2">
                                                    {[
                                                        {
                                                            name: 'Facebook',
                                                            src: '/images/icon/fb.svg',
                                                        },
                                                        {
                                                            name: 'Twitter',
                                                            src: '/images/icon/tw.svg',
                                                        },
                                                        {
                                                            name: 'Pinterest',
                                                            src: '/images/icon/pin.svg',
                                                        },
                                                        {
                                                            name: 'Instagram',
                                                            src: '/images/icon/ig.svg',
                                                        },
                                                    ].map((item) => (
                                                        <a
                                                            key={item.name}
                                                            href="#"
                                                            className="text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                                                        >
                                                            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                                                <img
                                                                    src={
                                                                        item.src
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="w-full object-contain"
                                                                />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Aplikasi Mobile */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="space-y-6">
                                            <h5 className="mb-3 font-bold text-gray-900 dark:text-white">
                                                Nikmati keuntungan spesial di
                                                aplikasi:
                                            </h5>
                                            <ul className="mb-4 space-y-2">
                                                {[
                                                    {
                                                        text: 'Diskon 70% hanya di aplikasi',
                                                        icon: (
                                                            <svg
                                                                className="nest-icon"
                                                                width="24"
                                                                height="24"
                                                                fill="rgb(var(--GN500,0,158,66))"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="M2.5 12c0-5.24 4.26-9.5 9.5-9.5s9.5 4.26 9.5 9.5-4.26 9.5-9.5 9.5-9.5-4.26-9.5-9.5ZM4 12c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8-8 3.59-8 8Zm8.68-2.49v1.81c1.82.49 2.6 1.23 2.6 2.58s-1.03 2.21-2.54 2.38v.64c0 .34-.28.62-.62.62-.34 0-.62-.27-.62-.62v-.65c-.85-.11-1.65-.41-2.36-.84-.25-.16-.41-.4-.41-.72 0-.47.36-.82.83-.82.16 0 .33.06.47.16.51.32.99.55 1.54.67v-1.91c-1.73-.46-2.58-1.12-2.58-2.55 0-1.32 1.01-2.2 2.52-2.36v-.14c0-.34.28-.62.62-.62.34 0 .62.27.62.62v.17c.65.1 1.22.29 1.74.58a.8.8 0 0 1 .43.72.8.8 0 0 1-.82.8c-.14 0-.29-.04-.42-.11-.34-.18-.68-.33-1-.41Zm-1.96.65c0 .37.17.62.83.86V9.4c-.58.09-.83.39-.83.76Zm1.96 2.96v1.67c.56-.08.85-.35.85-.78 0-.4-.2-.66-.85-.89Z"
                                                                ></path>
                                                            </svg>
                                                        ),
                                                    },
                                                    {
                                                        text: 'Promo Khusus aplikasi',
                                                        icon: (
                                                            <svg
                                                                className="nest-icon"
                                                                width="24"
                                                                height="24"
                                                                fill="rgb(var(--GN500,0,158,66))"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="m21.09 10.05-.92-.91a1.31 1.31 0 0 1-.37-.9V7a2.701 2.701 0 0 0-.8-2 2.62 2.62 0 0 0-1.95-.81h-1.29a1.29 1.29 0 0 1-.9-.37L14 2.91a2.81 2.81 0 0 0-3.9 0l-.91.92a1.3 1.3 0 0 1-.89.37H7A2.66 2.66 0 0 0 5 5a2.7 2.7 0 0 0-.81 2v1.24a1.31 1.31 0 0 1-.37.9l-.92.91a2.73 2.73 0 0 0 0 3.9l.92.91c.234.241.367.564.37.9v1.29A2.7 2.7 0 0 0 5 19a2.73 2.73 0 0 0 1.94.81h1.31a1.3 1.3 0 0 1 .89.37l.91.92a2.73 2.73 0 0 0 3.9 0l.91-.92a1.2 1.2 0 0 1 .9-.37h1.29A2.89 2.89 0 0 0 19 19a2.7 2.7 0 0 0 .81-1.95v-1.29a1.31 1.31 0 0 1 .37-.9l.92-.91a2.73 2.73 0 0 0 0-3.9h-.01ZM20 12.89l-.92.91a2.77 2.77 0 0 0-.82 2v1.29a1.22 1.22 0 0 1-.37.89 1.19 1.19 0 0 1-.89.37h-1.3a2.75 2.75 0 0 0-1.95.82l-.91.92a1.3 1.3 0 0 1-1.78 0l-.91-.92a2.75 2.75 0 0 0-1.95-.82H7a1.27 1.27 0 0 1-1.167-.777 1.22 1.22 0 0 1-.093-.483v-1.33a2.77 2.77 0 0 0-.82-2L4 12.89a1.26 1.26 0 0 1 0-1.78l.92-.91a2.77 2.77 0 0 0 .82-2V7a1.22 1.22 0 0 1 .37-.89A1.42 1.42 0 0 1 7 5.69h1.3a2.75 2.75 0 0 0 1.95-.82l.86-.87a1.28 1.28 0 0 1 1.78 0l.91.91a2.75 2.75 0 0 0 1.95.82h1.3c.333.006.651.138.89.37a1.221 1.221 0 0 1 .37.89v1.25a2.77 2.77 0 0 0 .82 2l.92.91a1.26 1.26 0 0 1 0 1.78l-.05-.04Zm-9.882-2.126A1.4 1.4 0 0 1 9.34 11a1.36 1.36 0 0 1-1.4-1.4 1.4 1.4 0 1 1 2.178 1.164Zm3.524 2.712a1.4 1.4 0 0 1 .778-.236 1.31 1.31 0 0 1 1.4 1.4 1.4 1.4 0 1 1-2.178-1.164ZM15 8.25a.75.75 0 0 1 .53 1.279l-6 6a.75.75 0 0 1-1.06-1.06l6-6a.75.75 0 0 1 .53-.22Z"
                                                                ></path>
                                                            </svg>
                                                        ),
                                                    },
                                                    {
                                                        text: 'Gratis Ongkir tiap hari',
                                                        icon: (
                                                            <svg
                                                                className="nest-icon"
                                                                width="24"
                                                                height="24"
                                                                fill="rgb(var(--GN500,0,158,66))"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    clipRule="evenodd"
                                                                    d="m18.66 8.19 2.41 2.75a2.75 2.75 0 0 1 .68 1.81V17A1.76 1.76 0 0 1 20 18.75h-1.41c.006.083.006.167 0 .25a2 2 0 0 1-4 0 1.896 1.896 0 0 1 0-.25H9.53a1.9 1.9 0 0 1 0 .25 2 2 0 0 1-4 0 1.9 1.9 0 0 1 0-.25H5A2.75 2.75 0 0 1 2.25 16v-4.25H2a.75.75 0 1 1 0-1.5h4a.75.75 0 1 1 0 1.5H3.75V16A1.25 1.25 0 0 0 5 17.25h7.25V7A1.25 1.25 0 0 0 11 5.75H5a.75.75 0 0 1 0-1.5h6A2.75 2.75 0 0 1 13.75 7v.25h2.84a2.73 2.73 0 0 1 2.07.94Zm1.517 8.987A.25.25 0 0 0 20.25 17v-4.25H17a.76.76 0 0 1-.75-.75v-1a.76.76 0 0 1 .75-.75h1.47l-.94-1.07a1.24 1.24 0 0 0-.94-.43h-2.84v8.5H20a.25.25 0 0 0 .177-.073ZM8.15 8.79h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 1 1 0 1.5Z"
                                                                ></path>
                                                            </svg>
                                                        ),
                                                    },
                                                ].map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {item.icon}
                                                        <span className="text-[13.5px] text-gray-900 dark:text-gray-400">
                                                            {item.text}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* QR + Download Buttons */}
                                    <div className="flex flex-col space-y-2">
                                        <p className="mb-2 text-[13.5px] text-gray-600 dark:text-gray-400">
                                            Buka aplikasi dengan scan QR atau
                                            klik tombol:
                                        </p>

                                        <div className="flex items-start gap-2">
                                            <div className="mx-[-10px] h-28 w-30 flex-shrink-0">
                                                <img
                                                    src="/images/nav/qr-apk.webp"
                                                    alt="QR Code Groceria"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="mx-3.5 flex flex-col space-y-2 pt-1">
                                                <a href="#" className="block">
                                                    <div className="flex h-7 w-30 items-center justify-center rounded-sm border border-gray-200 bg-white px-4 shadow-sm dark:bg-white">
                                                        <img
                                                            src="/images/nav/appstore.png"
                                                            alt="Get it on Google Play"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                </a>
                                                <a href="#" className="block">
                                                    <div className="flex h-7 w-30 items-center justify-center rounded-sm border border-gray-200 bg-white px-4 shadow-sm dark:bg-white">
                                                        <img
                                                            src="/images/nav/gp.png"
                                                            alt="Download on the App Store"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                </a>
                                                <a href="#" className="block">
                                                    <div className="flex h-7 w-30 items-center justify-center rounded-sm border border-gray-200 bg-white px-4 shadow-sm dark:bg-white">
                                                        <img
                                                            src="/images/nav/appgallery.png"
                                                            alt="Explore it on AppGallery"
                                                            className="h-6 object-contain"
                                                        />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>

                                        {/* Link Pelajari Selengkapnya */}
                                        <div>
                                            <a
                                                href="#"
                                                className="inline-flex items-center text-[13.5px] font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                            >
                                                Pelajari Selengkapnya
                                                <svg
                                                    className="nest-icon"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    style={{
                                                        marginLeft: '3px',
                                                    }}
                                                >
                                                    <path d="M3.57 13.18h15.22l-5.73 5.72c-.14.14-.22.34-.22.54a.75.75 0 0 0 1.28.53l7.1-7.1c.14-.14.22-.34.22-.53s-.08-.39-.22-.53l-7.1-7.1a.75.75 0 1 0-1.06 1.06l5.92 5.91H3.57a.75.75 0 0 0 0 1.5Z"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Copyright & Toggle */}
                            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-[#3E3E3A]">
                                <p className="text-[13.5px] text-gray-600 dark:text-gray-400">
                                    © Groceria 2026. All Rights Reserved.
                                </p>

                                {/* Toggle Switch Bahasa */}
                                <div className="relative inline-flex h-8.5 w-40 rounded-md bg-gray-200/70 p-1 dark:bg-[#252523]">
                                    {/* Slider */}
                                    <div
                                        className="absolute top-1 left-1 h-6.5 w-1/2 max-w-19 rounded-md bg-green-600 transition-all duration-300"
                                        style={{
                                            transform:
                                                lang === 'EN'
                                                    ? 'translateX(100%)'
                                                    : 'translateX(0%)',
                                        }}
                                    ></div>

                                    {/* Tombol Indonesia */}
                                    <button
                                        onClick={() => setLang('ID')}
                                        className={`relative z-10 flex-1 text-[13.5px] font-medium transition-colors duration-300 ${
                                            lang === 'ID'
                                                ? 'text-white'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        <span>Indonesia</span>
                                    </button>

                                    {/* Tombol English */}
                                    <button
                                        onClick={() => setLang('EN')}
                                        className={`relative z-10 flex-1 text-[13.5px] font-medium transition-colors duration-300 ${
                                            lang === 'EN'
                                                ? 'text-white'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        <span>English</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
