import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { type SharedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Product = {
    slug: string;
    discount_price: any;
    price: number;
    price_formatted: any;
    discount_price_formatted: any;
    id: number;
    name: string;
    discount: number;
    originalPrice: number;
    discountPrice: number;
    sold: number;
    stock: number;
    image: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

const upcomingSessions = [
    { time: '18:00', label: 'Sedang Berjalan', status: 'active' },
    { time: '00:00', label: 'Tomorrow', status: 'upcoming' },
    { time: '12:00', label: 'Tomorrow', status: 'upcoming' },
];

export default function FlashSale({
    auth,
    flashSaleProducts = [],
    categories = [],
}: {
    auth: SharedData['auth'];
    flashSaleProducts: Product[];
    categories?: Category[];
}) {
    const ITEMS_PER_LOAD = 30;

    const [activeCategory, setActiveCategory] = useState<'all' | string>('all');
    const [products, setProducts] = useState<Product[]>(flashSaleProducts);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(
        flashSaleProducts.length >= ITEMS_PER_LOAD,
    );

    const [activeSession, setActiveSession] = useState(
        upcomingSessions[0].time,
    );
    const moreBtnRef = useRef<HTMLButtonElement>(null);
    const [openMore, setOpenMore] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

    const formatRupiah = (value: number) =>
        `Rp ${value.toLocaleString('id-ID')}`;

    // Countdown timer
    useEffect(() => {
        const countdownTarget = new Date();
        countdownTarget.setHours(24, 0, 0, 0);

        const timer = setInterval(() => {
            const now = Date.now();
            const distance = countdownTarget.getTime() - now;

            if (distance <= 0) {
                clearInterval(timer);
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor(
                (distance % (1000 * 60 * 60)) / (1000 * 60),
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                h: String(hours).padStart(2, '0'),
                m: String(minutes).padStart(2, '0'),
                s: String(seconds).padStart(2, '0'),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Lazy load next batch
    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const res = await fetch(
                `/flash-sale/batch?page=${nextPage}&category=${activeCategory}`,
            );
            const data = await res.json();

            setProducts((prev) => [...prev, ...data.products]);
            setPage(nextPage);
            setHasMore(data.hasMore);
        } catch (err) {
            console.error('Gagal load batch flash sale', err);
        }
    };

    // Filter products berdasarkan kategori
    const filteredProducts =
        activeCategory === 'all'
            ? products
            : products.filter((p) => p.category?.slug === activeCategory);

    // Proses produk untuk menghitung harga & diskon
    const processedProducts = filteredProducts.map((p) => {
        const originalPrice = Number(p.price) || 0;
        const discountPriceRaw =
            p.discount_price !== null && p.discount_price !== undefined
                ? Number(p.discount_price)
                : null;

        const hasDiscount =
            discountPriceRaw !== null &&
            !Number.isNaN(discountPriceRaw) &&
            discountPriceRaw > 0 &&
            discountPriceRaw < originalPrice;

        const discountPercent = hasDiscount
            ? Math.round(
                  ((originalPrice - discountPriceRaw) / originalPrice) * 100,
              )
            : 0;

        const finalPrice = hasDiscount ? discountPriceRaw : originalPrice;

        function formatRupiah(amount: number | null | undefined) {
            if (!amount) return 'Rp0';
            // pastikan angka utuh
            const intAmount = Math.round(amount);
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            })
                .format(intAmount)
                .replace(/\u00A0/g, ''); // hapus spasi
        }

        return {
            ...p,
            originalPrice,
            discountPrice: discountPriceRaw,
            hasDiscount,
            discountPercent,
            finalPrice,
            originalPriceFormatted: formatRupiah(originalPrice),
            finalPriceFormatted: formatRupiah(finalPrice),
        };
    });

    // Pisahkan kategori utama dan "Lainnya"
    const MAIN_LIMIT = 8;
    const mainCategories = categories.slice(0, MAIN_LIMIT - 1);
    const moreCategories = categories.slice(MAIN_LIMIT - 1);

    return (
        <>
            <Head title="Flash Sale - Groceria" />
            <div className="min-h-screen text-gray-900">
                <NavMain />

                {/* Countdown Banner */}
                <div className="flex w-full items-center justify-center gap-4 pt-5 pb-5 dark:bg-[#1A1A19]">
                    <div className="h-[1px] max-w-[50px] flex-1 bg-gray-400" />
                    <div className="flex items-center gap-1">
                        <img
                            src="images/icon/flashsale.png"
                            alt="Flash Sale"
                            className="h-8 w-auto object-contain"
                        />
                        <div className="text-md flex items-center gap-1 text-gray-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                                <path strokeWidth="2" d="M12 7v5l3 3" />
                            </svg>
                            <span>BERAKHIR DALAM</span>
                        </div>
                        <div className="-mt-1 flex space-x-1 px-0.5 py-2 font-medium text-white">
                            {[timeLeft.h, timeLeft.m, timeLeft.s].map(
                                (t, i) => (
                                    <span
                                        key={i}
                                        className="flex h-6 w-8 items-center justify-center rounded bg-[#191919] text-sm"
                                    >
                                        {t}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                    <div className="h-[1px] max-w-[50px] flex-1 bg-gray-400" />
                </div>

                <section className="bg-white dark:bg-[#1A1A19]">
                    <div className="container mx-auto max-w-6xl">
                        {/* Banner */}
                        <div className="my-0">
                            <img
                                src="images/banner/flash-sale-banner.webp"
                                alt="Flash Sale Banner"
                                className="h-auto w-full rounded-t-lg object-cover"
                            />
                        </div>

                        {/* SESSION TABS */}
                        <div className="mb-6 flex flex-col items-start gap-4 lg:flex-row lg:items-center">
                            <div className="flex w-full gap-0 overflow-hidden">
                                {upcomingSessions.map((s, i) => {
                                    const isFirst = i === 0;
                                    const isLast =
                                        i === upcomingSessions.length - 1;
                                    const isActive = activeSession === s.time;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                setActiveSession(s.time)
                                            }
                                            className={`flex flex-1 flex-col items-center justify-center px-4 py-1.5 transition-all duration-300 ${isFirst ? 'rounded-bl-xl' : ''} ${isLast ? 'rounded-br-xl' : ''} ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-[#252523] dark:text-gray-100'
                                            }`}
                                        >
                                            <div className="mb-[-5px] text-[23px] font-semibold">
                                                {s.time}
                                            </div>
                                            <div className="text-[14.5px]">
                                                {s.label}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* CATEGORY FILTER */}
                        <div className="relative mb-7 pt-2">
                            <div className="relative ml-1.5 flex flex-wrap items-center gap-7.5">
                                <button
                                    onClick={() => setActiveCategory('all')}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                                        activeCategory === 'all'
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#252523] dark:text-gray-100'
                                    }`}
                                >
                                    All
                                </button>

                                {mainCategories.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            setActiveCategory(c.slug);
                                            setOpenMore(false);
                                        }}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                                            activeCategory === c.slug
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#252523] dark:text-gray-100'
                                        }`}
                                    >
                                        {c.name}
                                    </button>
                                ))}

                                {moreCategories.length > 0 && (
                                    <button
                                        ref={moreBtnRef}
                                        onClick={() =>
                                            setOpenMore((prev) => !prev)
                                        }
                                        className="flex items-center gap-1.5 rounded-full bg-gray-100 px-5 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-[#252523] dark:text-gray-100"
                                    >
                                        Lainnya
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            className={`h-4 w-4 transition-transform duration-200 ${openMore ? 'rotate-180' : ''}`}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m6 9 6 6 6-6"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Dropdown */}
                            {openMore && moreBtnRef.current && (
                                <div
                                    className="absolute z-[9999] mt-2 min-w-[200px] rounded-md border border-gray-200 bg-white shadow-xl"
                                    style={{
                                        top:
                                            moreBtnRef.current.offsetTop +
                                            moreBtnRef.current.offsetHeight +
                                            4,
                                        left: moreBtnRef.current.offsetLeft,
                                    }}
                                >
                                    {moreCategories.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveCategory(item.slug);
                                                setOpenMore(false);
                                            }}
                                            className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PRODUCTS GRID */}
                        <div className="mb-10">
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                                {processedProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/product/${p.slug}`}
                                        className="relative rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm dark:border-[#252523] dark:bg-[#1A1A19]"
                                    >
                                        {/* Badge Diskon */}
                                        {p.hasDiscount && (
                                            <div className="discount-wrapper">
                                                <span className="discount-dark"></span>
                                                <span className="discount-light">
                                                    -{p.discount}%
                                                </span>
                                            </div>
                                        )}

                                        {/* Gambar */}
                                        <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                                            <img
                                                src={
                                                    p.image ??
                                                    '/images/placeholder.png'
                                                }
                                                alt={p.name ?? '-'}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Info Produk */}
                                        <div className="mb-3 px-2.5 py-2.5">
                                            <h3 className="mb-1.5 line-clamp-2 min-h-[40px] text-sm font-medium text-gray-800 dark:text-gray-100">
                                                {p.name ?? '-'}
                                            </h3>

                                            <div className="mt-3 flex gap-2">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex flex-col gap-0.5">
                                                        {p.hasDiscount ? (
                                                            <div className="text-[12px] leading-tight text-gray-400 line-through">
                                                                {
                                                                    p.originalPriceFormatted
                                                                }
                                                            </div>
                                                        ) : (
                                                            <div className="invisible text-[12px] leading-tight">
                                                                placeholder
                                                            </div>
                                                        )}
                                                        <div className="text-[18px] leading-tight font-semibold text-green-600">
                                                            {
                                                                p.finalPriceFormatted
                                                            }
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="mb-0.5 text-[11px] text-gray-500">
                                                            Terjual{' '}
                                                            {p.sold ?? 0} /{' '}
                                                            {p.stock ?? 0}
                                                        </div>
                                                        <div className="h-2 w-[100px] max-w-full rounded-full bg-gray-200">
                                                            <div
                                                                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                                                                style={{
                                                                    width: `${
                                                                        p.stock &&
                                                                        p.sold
                                                                            ? Math.min(
                                                                                  (p.sold /
                                                                                      p.stock) *
                                                                                      100,
                                                                                  100,
                                                                              )
                                                                            : 0
                                                                    }%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tombol aksi */}
                                                <div className="flex w-[80px] flex-col items-end justify-between">
                                                    <div className="flex gap-3 px-1 pt-1">
                                                        {/* Favorit */}
                                                        <button
                                                            className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-green-600/50 transition hover:bg-gray-100"
                                                            title="Favorit"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="#16a34a"
                                                                className="size-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                                />
                                                            </svg>
                                                        </button>

                                                        {/* Tambah ke keranjang */}
                                                        <button
                                                            className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-green-600/50 transition hover:bg-gray-100"
                                                            title="Tambah ke Keranjang"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="#16a34a"
                                                                className="size-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Tombol beli */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.post(
                                                                '/checkout',
                                                                {
                                                                    product_id:
                                                                        p.id,
                                                                    quantity: 1,
                                                                },
                                                            );
                                                        }}
                                                        className="w-full rounded-md bg-green-600 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                                                    >
                                                        BELI
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Tombol Muat Lebih Banyak */}
                            {hasMore && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={loadMore}
                                        className="rounded-lg border border-green-600 px-16 py-2.5 font-semibold text-green-700 transition-colors duration-300 hover:bg-green-100/50 hover:text-green-600"
                                    >
                                        Muat Lebih Banyak
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <NavFooter />
            </div>
        </>
    );
}
