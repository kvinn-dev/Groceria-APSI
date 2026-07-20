import CardProducts from '@/components/card_product';
import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const bannerData = [
    {
        id: 1,
        title: 'Promo Guncang 12.12',
        subtitle: 'HALEON',
        slug: 'banner-001',
        src: 'images/banner/001.webp',
        href: 'flash-sale',
    },
    {
        id: 2,
        title: 'Flash Sale Akhir Tahun',
        subtitle: 'SENSODYNE',
        slug: 'banner-002',
        src: 'images/banner/002.webp',
    },
    {
        id: 3,
        title: 'Paket Hemat Keluarga',
        subtitle: 'PARAMONT',
        slug: 'banner-003',
        src: 'images/banner/003.webp',
    },
    {
        id: 4,
        title: 'Paket Hemat Keluarga',
        subtitle: 'PARAMONT',
        slug: 'banner-004',
        src: 'images/banner/004.webp',
    },
];

interface FlashSaleProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    discount?: number;
    image: string | null;
    category: {
        name: string;
        slug: string;
    };
    stock?: number;
    sold?: number;
    progress?: number;
}

interface HomePageProps {
    featuredProducts: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        discount_price: number | null;
        image: string | null;
        category: { name: string; slug: string };
    }>;
    newProducts: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        discount_price: number | null;
        image: string | null;
        category: { name: string; slug: string };
    }>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
        products_count: number;
        image?: string | null;
    }>;
    topProducts: any[];
}

export default function Home({
    featuredProducts = [],
    newProducts = [],
    categories = [],
    topProducts = [],
}: HomePageProps) {
    /* ================= STATE ================= */
    const [flashSale, setFlashSale] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const total = bannerData.length;
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { auth } = usePage<SharedData>().props;

    // Banner navigation with transition lock
    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide((prev) => prev - 1);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlaying]);

    // Pause auto-play saat hover
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    /* ================= FETCH FLASH SALE ================= */
    useEffect(() => {
        let isMounted = true;

        const fetchFlashSale = async () => {
            try {
                const res = await fetch('/flash-sale/batch?page=1', {
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!res.ok) return;

                const data = await res.json();

                if (isMounted && Array.isArray(data?.products)) {
                    setFlashSale(data.products);
                }
            } catch (error) {
                console.error('Flash sale fetch failed:', error);
            }
        };

        fetchFlashSale();

        return () => {
            isMounted = false;
        };
    }, []);

    /* ================= DATA SOURCE ================= */
    const flashSaleData = flashSale;
    const ITEM_WIDTH = 170;
    const ITEM_GAP = 16;

    const useCategorySlider = (ITEM_WIDTH: number, GAP: number) => {
        const ref = useRef<HTMLDivElement>(null);
        const [canPrev, setCanPrev] = useState(false);
        const [canNext, setCanNext] = useState(false);

        const updateArrows = () => {
            const el = ref.current;
            if (!el) return;

            setCanPrev(el.scrollLeft > 0);
            setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        };

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            updateArrows();

            let ticking = false;

            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateArrows();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            el.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', updateArrows);

            return () => {
                el.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', updateArrows);
            };
        }, []);

        const scroll = (direction: 'left' | 'right') => {
            const el = ref.current;
            if (!el) return;

            const MOVE_COL = 5;
            const distance = MOVE_COL * (ITEM_WIDTH + GAP);

            el.scrollBy({
                left: direction === 'right' ? distance : -distance,
                behavior: 'smooth',
            });
        };

        return { ref, canPrev, canNext, scroll };
    };

    const categorySlider = useCategorySlider(ITEM_WIDTH, ITEM_GAP);

    const categoryItems = categories.map((cat, index) => {
        const icon = cat.image
            ? cat.image.startsWith('http')
                ? cat.image
                : `/storage/${cat.image}`
            : `images/category/000${String((index % 26) + 1).padStart(2, '0')}.webp`;
        return {
            id: cat.id,
            slug: cat.slug,
            label: cat.name,
            icon: icon,
            products_count: cat.products_count,
        };
    });

    const ITEMS_PER_PAGE = 20;
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE);

    const visibleItems = categoryItems.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE,
    );

    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    const useTopProductSlider = () => {
        const ref = useRef<HTMLDivElement>(null);
        const [canPrev, setCanPrev] = useState(false);
        const [canNext, setCanNext] = useState(true);

        const updateArrows = () => {
            const el = ref.current;
            if (!el) return;
            setCanPrev(el.scrollLeft > 0);
            setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        };

        useEffect(() => {
            updateArrows();
            const el = ref.current;
            if (!el) return;
            let ticking = false;

            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateArrows();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            el.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', updateArrows);
            return () => {
                el.removeEventListener('scroll', updateArrows);
                window.removeEventListener('resize', updateArrows);
            };
        }, []);

        const scroll = (direction: 'left' | 'right') => {
            const el = ref.current;
            if (!el) return;

            const ITEMS_PER_SCROLL = 3;

            const distance =
                (ITEM_WIDTH + ITEM_GAP) * Math.max(1, ITEMS_PER_SCROLL);

            el.scrollBy({
                left: direction === 'right' ? distance : -distance,
                behavior: 'smooth',
            });
        };

        return { ref, canPrev, canNext, scroll };
    };

    const topProductSlider = useTopProductSlider();

    const useChevronSlider = (deps: any[] = []) => {
        const ref = useRef<HTMLDivElement>(null);
        const [canPrev, setCanPrev] = useState(false);
        const [canNext, setCanNext] = useState(false);

        const updateArrows = () => {
            const el = ref.current;
            if (!el) return;

            const { scrollLeft, clientWidth, scrollWidth } = el;

            setCanPrev(scrollLeft > 0);
            setCanNext(scrollLeft + clientWidth < scrollWidth - 1);
        };

        /* 🔑 FIX UTAMA: update setelah data & DOM siap */
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            requestAnimationFrame(() => {
                updateArrows();
            });
        }, deps);

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            let ticking = false;

            const onScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateArrows();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            el.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', updateArrows);

            return () => {
                el.removeEventListener('scroll', onScroll);
                window.removeEventListener('resize', updateArrows);
            };
        }, []);

        const scroll = (direction: 'left' | 'right') => {
            const el = ref.current;
            if (!el) return;

            const ITEMS_PER_SCROLL = 3;
            const distance = (ITEM_WIDTH + ITEM_GAP) * ITEMS_PER_SCROLL;

            el.scrollBy({
                left: direction === 'right' ? distance : -distance,
                behavior: 'smooth',
            });
        };

        return { ref, canPrev, canNext, scroll };
    };

    const flashSlider = useChevronSlider([flashSale.length]);

    const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

    useEffect(() => {
        const countdownTarget = new Date();
        countdownTarget.setHours(24, 0, 0, 0); // Target: jam 00:00 nanti malam

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownTarget.getTime() - now;

            if (distance < 0) {
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

    return (
        <>
            <Head title="Belanja Online Murah & Aman">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white text-gray-900 dark:bg-[#1A1A19]">
                {/* Header Navigation */}
                <NavMain />

                {/* Hero Section */}
                <section
                    className="relative mt-15"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Banner */}
                    <div className="group relative mx-4 max-w-6xl overflow-hidden rounded-xl shadow-lg md:mx-auto">
                        <div className="relative h-64 w-full overflow-hidden md:h-72">
                            <div
                                className="flex h-full"
                                style={{
                                    willChange: 'transform',
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                    transition: isTransitioning
                                        ? 'transform 1300ms cubic-bezier(0.22,1,0.36,1)'
                                        : 'none',
                                }}
                                onTransitionEnd={() => {
                                    // Reset otomatis saat reach clone
                                    if (currentSlide > total) {
                                        setIsTransitioning(false);
                                        setCurrentSlide(1);
                                    } else if (currentSlide === 0) {
                                        setIsTransitioning(false);
                                        setCurrentSlide(total);
                                    } else {
                                        setIsTransitioning(false); // transisi selesai
                                    }
                                }}
                            >
                                {/* Clone last */}
                                <Link
                                    href={`/products/${bannerData[total - 1].slug}`}
                                    className="h-full w-full flex-shrink-0"
                                >
                                    <img
                                        src={bannerData[total - 1].src}
                                        className="h-full w-full object-cover"
                                        alt=""
                                    />
                                </Link>

                                {/* Real slides */}
                                {bannerData.map((banner, index) => (
                                    <Link
                                        key={index}
                                        href={`${banner.href}`}
                                        className="h-full w-full flex-shrink-0"
                                    >
                                        <img
                                            src={banner.src}
                                            alt={`Banner ${index + 1}`}
                                            className="h-full w-full object-cover"
                                            loading={
                                                index === 0 ? 'eager' : 'lazy'
                                            }
                                        />
                                    </Link>
                                ))}

                                {/* Clone first */}
                                <Link
                                    href={`/products/${bannerData[0].slug}`}
                                    className="h-full w-full flex-shrink-0"
                                >
                                    <img
                                        src={bannerData[0].src}
                                        className="h-full w-full object-cover"
                                        alt=""
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* CHEVRONS */}
                        <div className="group pointer-events-none absolute inset-0">
                            <button
                                onClick={() => {
                                    if (isTransitioning) return;
                                    setIsTransitioning(true);
                                    setCurrentSlide((prev) => prev - 1);
                                }}
                                className="pointer-events-auto absolute top-1/2 left-2 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>

                            <button
                                onClick={() => {
                                    if (isTransitioning) return;
                                    setIsTransitioning(true);
                                    setCurrentSlide((prev) => prev + 1);
                                }}
                                className="pointer-events-auto absolute top-1/2 right-2 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-4 z-20 flex gap-1">
                            {bannerData.map((_, index) => {
                                const activeIndex =
                                    (currentSlide - 1 + total) % total;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (isTransitioning) return;
                                            setIsTransitioning(true);
                                            setCurrentSlide(index + 1);
                                        }}
                                        className={`h-1.5 w-1.5 rounded-full transition-all ${index === activeIndex ? 'w-0 bg-white' : 'bg-white/70'}`}
                                    />
                                );
                            })}
                        </div>

                        {/* Button promo kecil kanan bawah */}
                        <Link
                            href="/promotions"
                            className="font-regular absolute right-4 bottom-4 z-20 rounded-sm bg-black px-2 py-1 text-xs text-white"
                        >
                            Lihat promo lainnya
                        </Link>

                        {/* Progress bar (hidden) */}
                        <div className="absolute bottom-0 left-0 hidden h-1 w-full bg-white/20">
                            <div
                                className="h-full bg-green-600 transition-all duration-5000"
                                style={{
                                    width: isAutoPlaying ? '100%' : '0%',
                                    transitionDuration: isAutoPlaying
                                        ? '5s'
                                        : '0s',
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-10">
                    <div className="container mx-auto max-w-6xl px-18">
                        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5 lg:grid-cols-8">
                            {/* Item 1 */}
                            <Link
                                href="/lokal"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_local.png"
                                        alt="Groceria Pilih Lokal"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Groceria Pilih Lokal
                                </p>
                            </Link>

                            {/* Item 2 */}
                            <Link
                                href="/mall"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_bag.png"
                                        alt="Groceria Mall"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Groceria Mall
                                </p>
                            </Link>

                            {/* Item 3 */}
                            {/* <Link
                                href="/pulsa"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_pulsa.png"
                                        alt="Pulsa Tagihan Tiket"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Pulsa, Tagihan, dan Tiket
                                </p>
                            </Link> */}

                            {/* Item 4 */}
                            <Link
                                href="/flash-sale"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_flashsale.png"
                                        alt="Flash Sale"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Flash Sale
                                </p>
                            </Link>

                            {/* Item 5 */}
                            <Link
                                href="/supermarket"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_supermarket.png"
                                        alt="Supermarket"
                                        className="h-8 w-10"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Groceria Supermarket
                                </p>
                            </Link>

                            {/* Item 6 */}
                            <Link
                                href="/kelola"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_kelola.png"
                                        alt="Dikelola Groceria"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Dikelola Groceria
                                </p>
                            </Link>

                            {/* Item 7 */}
                            {/* <Link
                                href="/diskon"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_fitcheck.png"
                                        alt="FitCheck Diskon"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    FitCheck Diskon 35%
                                </p>
                            </Link> */}

                            {/* Item 8 */}
                            <Link
                                href="/gratis-ongkir"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_voucher.png"
                                        alt="Gratis Ongkir"
                                        className="h-8 w-8.5"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Gratis Ongkir & Voucher
                                </p>
                            </Link>

                            {/* Item 9 */}
                            <Link
                                href="/berkah"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_berkah.png"
                                        alt="Groceria Berkah"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Groceria Berkah
                                </p>
                            </Link>

                            {/* Item 10 */}
                            <Link
                                href="/semua"
                                className="flex flex-col items-center"
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-200/15 dark:bg-[#1A1A19]">
                                    <img
                                        src="images/icon/icon_promo.png"
                                        alt="Semua Promo"
                                        className="h-8 w-8"
                                    />
                                </div>
                                <p className="font-regular mt-2 text-[13px] text-gray-900 dark:text-gray-300">
                                    Semua Promo
                                </p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Category Section */}
                <section className="relative py-0">
                    <div className="group relative mx-auto max-w-6xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-200/15 dark:bg-[#1A1A19]">
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-200/15">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Kategori
                            </h2>
                        </div>

                        {/* Chevron Left */}
                        {categorySlider.canPrev && (
                            <button
                                onClick={() => categorySlider.scroll('left')}
                                className="pointer-events-auto absolute top-1/2 left-0 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>
                        )}

                        {categorySlider.canNext && (
                            <button
                                onClick={() => categorySlider.scroll('right')}
                                className="pointer-events-auto absolute top-1/2 right-0 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>
                        )}

                        {/* Scroll Wrapper */}
                        <div
                            ref={categorySlider.ref}
                            className="overflow-x-hidden"
                        >
                            {/* GRID */}
                            <div
                                className="inline-grid auto-cols-[17.05%] grid-rows-2 divide-x divide-y divide-gray-300 dark:divide-[#252523]"
                                style={{ gridAutoFlow: 'column' }}
                            >
                                {categoryItems.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={`/categories/${item.slug}`}
                                        className="flex flex-col items-center bg-white transition-colors hover:bg-gray-50/50 dark:bg-[#1A1A19] dark:hover:bg-[#252523]/50"
                                    >
                                        {/* ICON AREA (FIX HEIGHT) */}
                                        <div className="flex h-[104px] items-center justify-center">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1A1A19]">
                                                <img
                                                    src={item.icon}
                                                    alt={item.label}
                                                    className="max-h-full max-w-full object-contain"
                                                    onError={(e) => {
                                                        // Fallback in case icon is missing
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            `images/category/000${String((index % 26) + 1).padStart(2, '0')}.webp`;
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* TEXT AREA (FIX HEIGHT) */}
                                        <div className="mb-1.5 flex h-[40px] items-start justify-center px-2 text-center">
                                            <p className="line-clamp-2 text-sm leading-tight font-medium text-gray-800 dark:text-gray-200">
                                                {item.label}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Flash Sale Section */}
                <section className="bg-white py-10 dark:bg-[#1A1A19]">
                    <div className="container mx-auto max-w-6xl rounded-xl">
                        {/* WRAPPER FLASH SALE */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-200/15 dark:bg-[#1A1A19]">
                            {/* Header Flash Sale */}
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src="images/icon/flashsale.png"
                                        alt="Flash Sale"
                                        className="h-8 w-auto object-contain"
                                    />

                                    {/* Countdown */}
                                    <div className="-mt-1 flex space-x-1 px-0.5 py-2 font-medium text-white">
                                        {[
                                            timeLeft.h,
                                            timeLeft.m,
                                            timeLeft.s,
                                        ].map((t, i) => (
                                            <span
                                                key={i}
                                                className="flex h-5 w-6 items-center justify-center rounded bg-[#191919] text-xs dark:bg-[#000]"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Lihat Semua */}
                                <Link
                                    href="/flash-sale"
                                    className="flex items-center gap-1 text-sm font-bold text-green-600"
                                >
                                    <span>Lihat Semua</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </Link>
                            </div>

                            <div className="group pointer-events-none relative">
                                {/* Scroll Slider */}
                                <div
                                    ref={flashSlider.ref}
                                    className="scrollbar-hide pointer-events-auto flex translate-z-0 gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-2 pb-4 will-change-transform"
                                >
                                    {flashSale.length > 0 &&
                                        flashSale.map((prod) => {
                                            const stock = Number(
                                                prod.stock ?? 0,
                                            );
                                            const maxStock = Number(
                                                prod.max_stock ?? 100,
                                            );

                                            const stockPercent =
                                                maxStock > 0
                                                    ? Math.max(
                                                          0,
                                                          Math.min(
                                                              100,
                                                              Math.round(
                                                                  (stock /
                                                                      maxStock) *
                                                                      100,
                                                              ),
                                                          ),
                                                      )
                                                    : 0;

                                            const finalPrice =
                                                typeof prod.discount_price ===
                                                'number'
                                                    ? prod.discount_price
                                                    : prod.price;

                                            const discount =
                                                typeof prod.discount_price ===
                                                    'number' && prod.price > 0
                                                    ? Math.round(
                                                          ((prod.price -
                                                              prod.discount_price) /
                                                              prod.price) *
                                                              100,
                                                      )
                                                    : null;

                                            return (
                                                <Link
                                                    href={`/product/${prod.slug}`}
                                                    key={prod.id}
                                                    className="flex max-w-[170px] min-w-[170px] snap-start flex-col rounded-lg border border-gray-300 bg-white dark:border-gray-200/15 dark:bg-[#1A1A19]"
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                prod.image || ''
                                                            }
                                                            alt={prod.name}
                                                            className="h-[150px] w-full rounded-t-lg object-cover object-center"
                                                        />

                                                        {discount !== null &&
                                                            discount > 0 && (
                                                                <div className="discount-wrapper">
                                                                    <span className="discount-dark"></span>
                                                                    <span className="discount-light">
                                                                        -
                                                                        {
                                                                            discount
                                                                        }
                                                                        %
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </div>

                                                    <div className="mt-2.5 mb-[-15px] flex min-h-[85px] flex-col items-center px-3 text-center">
                                                        <p className="text-[19px] leading-tight font-medium text-green-600">
                                                            Rp
                                                            {finalPrice.toLocaleString(
                                                                'id-ID',
                                                            )}
                                                        </p>

                                                        <div className="mt-2 w-full">
                                                            <div className="relative h-3.5 w-full overflow-hidden rounded-sm bg-green-200 dark:bg-green-600">
                                                                <div
                                                                    className="h-full bg-green-600 transition-all duration-700"
                                                                    style={{
                                                                        width: `${stockPercent}%`,
                                                                    }}
                                                                />
                                                                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
                                                                    STOK
                                                                    TERBATAS
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                </div>

                                {/* CHEVRONS */}
                                {flashSlider.canPrev && (
                                    <button
                                        onClick={() =>
                                            flashSlider.scroll('left')
                                        }
                                        className="pointer-events-auto absolute top-1/2 left-0 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}

                                {flashSlider.canNext && (
                                    <button
                                        onClick={() =>
                                            flashSlider.scroll('right')
                                        }
                                        className="pointer-events-auto absolute top-1/2 right-0 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Product Section */}
                <section className="mb-10 bg-white py-0 dark:bg-[#1A1A19]">
                    <div className="container mx-auto max-w-6xl rounded-xl">
                        <div className="rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm dark:border-gray-200/15 dark:bg-[#1A1A19]">
                            {/* HEADER */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Produk Terlaris
                                </h2>

                                <Link
                                    href="/top-product"
                                    className="flex items-center gap-1 text-sm font-bold text-green-600"
                                >
                                    Lihat Semua
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </Link>
                            </div>

                            {/* WRAPPER */}
                            <div className="group relative">
                                {/* SCROLL VIEW */}
                                <div
                                    ref={topProductSlider.ref}
                                    id="top-products-scroll"
                                    className="scrollbar-hide flex translate-z-0 gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 will-change-transform"
                                >
                                    {topProducts.map((prod) => (
                                        <Link
                                            key={prod.id}
                                            href={`/product/${prod.slug}`}
                                            className="w-[calc((100%-5*1.5rem)/6)] flex-shrink-0"
                                        >
                                            {/* IMAGE */}
                                            <div className="relative h-[160px] w-full overflow-hidden rounded-t-xl">
                                                {/* BADGE TOP */}
                                                <div className="pointer-events-none absolute top-0 left-0 z-20 h-[44px] w-[35px]">
                                                    <svg
                                                        className="absolute inset-0"
                                                        viewBox="0 0 60 60"
                                                    >
                                                        <defs>
                                                            <linearGradient
                                                                id="topGradient"
                                                                x1="0"
                                                                y1="0"
                                                                x2="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="0%"
                                                                    stopColor="#22c55e"
                                                                />
                                                                <stop
                                                                    offset="100%"
                                                                    stopColor="#16a34a"
                                                                />
                                                            </linearGradient>
                                                        </defs>
                                                        <path
                                                            d="M0 0 H60 V38 C60 41 57 43 54 45 L32 58 C31 58.5 29 58.5 28 58 L6 45 C3 43 0 41 0 38 Z"
                                                            fill="url(#topGradient)"
                                                        />
                                                    </svg>
                                                    <span className="absolute top-[8px] left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-wider text-white">
                                                        TOP
                                                    </span>
                                                </div>

                                                <img
                                                    src={prod.image}
                                                    className="h-full w-full object-cover"
                                                    alt={prod.name}
                                                />

                                                <div className="absolute bottom-0 left-0 w-full bg-black/60 px-2 py-1 text-[12px] text-white">
                                                    Penjualan / Bulan{' '}
                                                    {prod.sold}
                                                </div>
                                            </div>

                                            {/* CONTENT */}
                                            <div className="rounded-b-xl bg-white px-1 pt-4 dark:bg-[#1A1A19]">
                                                <p
                                                    className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-white"
                                                    title={prod.name}
                                                >
                                                    {prod.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* CHEVRONS */}
                                {topProductSlider.canPrev && (
                                    <button
                                        onClick={() =>
                                            topProductSlider.scroll('left')
                                        }
                                        className="pointer-events-auto absolute top-1/2 left-0 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}

                                {topProductSlider.canNext && (
                                    <button
                                        onClick={() =>
                                            topProductSlider.scroll('right')
                                        }
                                        className="pointer-events-auto absolute top-1/2 right-0 -translate-y-1/2 scale-75 rounded-full bg-white/90 p-3 opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 hover:scale-110 dark:bg-[#1A1A19]/90"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <CardProducts />
                </section>

                {/* FOOTER */}
                <NavFooter />
            </div>
        </>
    );
}

// Product Card Component
// function ProductCard({
//     product,
// }: {
//     product: HomePageProps['featuredProducts'][0];
// }) {
//     const finalPrice = product.discount_price || product.price;
//     const hasDiscount =
//         product.discount_price && product.discount_price < product.price;

//     return (
//         <Link href={`/products/${product.slug}`} className="group">
//             <div className="overflow-hidden rounded-lg border border-[#19140035] bg-white transition-all hover:shadow-lg dark:border-gray-200/15 dark:bg-[#1A1A19]">
//                 <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-[#1A1A19]">
//                     <img
//                         src={product.image || '/images/placeholder.jpg'}
//                         alt={product.name}
//                         className="h-full w-full object-cover transition-transform group-hover:scale-105"
//                     />
//                     {hasDiscount && (
//                         <span className="absolute top-2 left-2 rounded bg-[#F53003] px-2 py-1 text-xs font-medium text-white">
//                             Sale
//                         </span>
//                     )}
//                 </div>
//                 <div className="p-4">
//                     <span className="mb-1 block text-xs text-[#706f6c] dark:text-[#A1A09A]">
//                         {product.category.name}
//                     </span>
//                     <h3 className="mb-2 line-clamp-1 font-medium group-hover:text-[#F53003] dark:text-white dark:group-hover:text-[#FF4433]">
//                         {product.name}
//                     </h3>
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <span className="text-lg font-bold text-[#1b1b18] dark:text-white">
//                                 Rp {finalPrice.toLocaleString('id-ID')}
//                             </span>
//                             {hasDiscount && (
//                                 <span className="text-sm text-[#706f6c] line-through dark:text-[#A1A09A]">
//                                     Rp {product.price.toLocaleString('id-ID')}
//                                 </span>
//                             )}
//                         </div>
//                         <button className="rounded-full bg-[#1b1b18] p-2 text-white hover:bg-black dark:bg-[#EDEDEC] dark:text-[#1C1C1A] dark:hover:bg-white">
//                             <ShoppingCart className="h-4 w-4" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// }

// Category Card Component
// function CategoryCard({
//     category,
// }: {
//     category: HomePageProps['categories'][0];
// }) {
//     return (
//         <Link href={`/categories/${category.slug}`} className="group">
//             <div className="rounded-lg border border-[#19140035] bg-white p-6 text-center transition-all hover:border-[#F53003] hover:shadow-md dark:border-gray-200/15 dark:bg-[#252523] dark:hover:border-[#FF4433]">
//                 <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F53003]/10 dark:bg-[#FF4433]/10">
//                     <span className="text-xl">🛍️</span>
//                 </div>
//                 <h3 className="font-semibold group-hover:text-[#F53003] dark:text-white dark:group-hover:text-[#FF4433]">
//                     {category.name}
//                 </h3>
//                 <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
//                     {category.products_count} produk
//                 </p>
//             </div>
//         </Link>
//     );
// }
