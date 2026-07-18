import { DataTablePagination } from '@/components/data-table-pagination';
import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import ProductCardItem from '@/components/product-card-item';
import { type Category, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Folder, FolderOpen } from 'lucide-react';

type Product = {
    id: number;
    slug: string;
    name: string;
    price: number | string;
    discount_price?: number | string | null;
    image: string | null;
    stock: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
    discount?: number;
    sold?: number;
};

interface ShowProps {
    category: Category;
    products: PaginatedData<Product>;
    categories: Category[];
}

function formatRupiah(amount: number | null | undefined) {
    if (!amount) return 'Rp0';
    const intAmount = Math.round(amount);
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    })
        .format(intAmount)
        .replace(/\u00A0/g, '');
}

export default function Show({ category, products, categories }: ShowProps) {
    const processedProducts = products.data.map((p) => {
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

        return {
            ...p,
            originalPrice,
            discountPrice: discountPriceRaw,
            hasDiscount,
            discountPercent,
            finalPrice,
            originalPriceFormatted: formatRupiah(originalPrice),
            finalPriceFormatted: formatRupiah(finalPrice),
            discount: p.discount ?? 0,
            sold: p.sold ?? 0,
        };
    });

    const handleBuyNow = (productId: number) => {
        router.post('/checkout', { product_id: productId, quantity: 1 });
    };

    return (
        <>
            <Head title={`${category.name} - Groceria`} />
            <div className="flex min-h-screen flex-col bg-[#FDFDFD] text-gray-900 dark:bg-[#121212] dark:text-gray-100">
                {/* Navigation Header */}
                <NavMain />

                {/* Main Content Area */}
                <main className="max-w-8xl container mx-auto flex-grow px-4 py-6">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Link
                            href="/"
                            className="transition-colors hover:text-green-600"
                        >
                            Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-gray-400">Kategori</span>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {category.name}
                        </span>
                    </nav>

                    {/* Category Banner Header */}
                    <div className="relative mb-8 overflow-hidden rounded-2xl border border-green-500/10 bg-gradient-to-r from-green-500/10 via-green-600/5 to-transparent p-6 md:p-8 dark:border-green-500/20 dark:from-green-950/20">
                        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                                    {category.name}
                                </h1>
                                {category.description ? (
                                    <p className="max-w-xl text-sm text-gray-600 dark:text-gray-400">
                                        {category.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Temukan produk terbaik pilihan kami di
                                        kategori {category.name}.
                                    </p>
                                )}
                            </div>
                            {category.image && (
                                <img
                                    src={
                                        category.image.startsWith('http')
                                            ? category.image
                                            : `/storage/${category.image}`
                                    }
                                    alt={category.name}
                                    className="h-20 w-20 rounded-full border border-green-500/20 bg-white object-cover p-1 shadow-md md:h-24 md:w-24"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row">
                        {/* Left Column: Category Navigation Sidebar */}
                        <aside className="w-full flex-shrink-0 lg:w-48">
                            <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-3 dark:border-[#252523] dark:bg-[#1A1A19]">
                                <h3 className="mb-3 text-[11px] font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                                    Daftar Kategori
                                </h3>
                                <nav className="max-h-[calc(100vh-200px)] space-y-0.5 overflow-y-auto">
                                    {categories.map((cat) => {
                                        const isActive =
                                            cat.slug === category.slug;
                                        return (
                                            <div
                                                key={cat.id}
                                                className="space-y-0.5"
                                            >
                                                <Link
                                                    href={`/categories/${cat.slug}`}
                                                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                                                        isActive
                                                            ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-[#252523] dark:hover:text-gray-200'
                                                    }`}
                                                >
                                                    {isActive ? (
                                                        <FolderOpen className="h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <Folder className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                                    )}
                                                    <span className="truncate">
                                                        {cat.name}
                                                    </span>
                                                </Link>

                                                {/* If category has subcategories and this is the active parent category or active child's parent */}
                                                {cat.children &&
                                                    cat.children.length > 0 &&
                                                    (isActive ||
                                                        cat.children.some(
                                                            (c) =>
                                                                c.slug ===
                                                                category.slug,
                                                        )) && (
                                                        <div className="mt-1 ml-4 space-y-1 border-l border-gray-100 pl-4 dark:border-[#252523]">
                                                            {cat.children.map(
                                                                (sub) => {
                                                                    const isSubActive =
                                                                        sub.slug ===
                                                                        category.slug;
                                                                    return (
                                                                        <Link
                                                                            key={
                                                                                sub.id
                                                                            }
                                                                            href={`/categories/${sub.slug}`}
                                                                            className={`block rounded-md px-2 py-1.5 text-xs font-medium transition-all ${
                                                                                isSubActive
                                                                                    ? 'font-bold text-green-600 dark:text-green-400'
                                                                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                sub.name
                                                                            }
                                                                        </Link>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </nav>
                            </div>
                        </aside>

                        {/* Right Column: Products Listing Grid */}
                        <section className="min-w-0 flex-1">
                            {processedProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-4 py-16 text-center dark:border-[#252523] dark:bg-[#1A1A19]">
                                    <span className="mb-4 text-5xl">🌾</span>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                        Tidak Ada Produk
                                    </h3>
                                    <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                                        Saat ini tidak ada produk yang tersedia
                                        di kategori{' '}
                                        <strong>{category.name}</strong>. Coba
                                        jelajahi kategori lainnya!
                                    </p>
                                    <Link href="/" className="mt-6">
                                        <button className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-green-700">
                                            Kembali ke Beranda
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Products Grid */}
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                                            {processedProducts.map((p) => (
                                                <ProductCardItem
                                                    key={p.id}
                                                    product={p}
                                                    handleBuyNow={handleBuyNow}
                                                />
                                            ))}
                                        </div>

                                        {/* Pagination Links */}
                                        <DataTablePagination data={products} />
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </main>

                {/* Footer Section */}
                <NavFooter />
            </div>
        </>
    );
}
