import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { type Brand, type Category, type PaginatedData, type Product } from '@/types';
import NavMain from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { DataTablePagination } from '@/components/data-table-pagination';
import { Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';

interface ProductsIndexProps {
    products: PaginatedData<Product & { category?: Category; brand?: Brand }>;
    categories: Category[];
    brands: Brand[];
    filters: {
        search?: string;
        category?: string;
        brand?: string;
        min_price?: string;
        max_price?: string;
    };
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

interface ProductCardProps {
    product: any;
    handleBuyNow: (id: number) => void;
}

function ProductCard({ product, handleBuyNow }: ProductCardProps) {
    const originalPrice = Number(product.price) || 0;
    const discountPriceRaw = product.discount_price !== null && product.discount_price !== undefined ? Number(product.discount_price) : null;
    const hasDiscount = discountPriceRaw !== null && !Number.isNaN(discountPriceRaw) && discountPriceRaw > 0 && discountPriceRaw < originalPrice;
    const discountPercent = hasDiscount ? Math.round(((originalPrice - discountPriceRaw) / originalPrice) * 100) : 0;
    const finalPrice = hasDiscount ? discountPriceRaw : originalPrice;

    const originalPriceFormatted = formatRupiah(originalPrice);
    const finalPriceFormatted = formatRupiah(finalPrice);
    const imageUrl = product.image_url || product.image || '/images/placeholder.png';
    const sold = product.sold ?? 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post('/cart/add', { product_id: product.id });
    };

    return (
        <Link
            href={`/product/${product.slug}`}
            className="relative rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm dark:border-[#252523] dark:bg-[#1A1A19]"
        >
            {hasDiscount && (
                <div className="absolute top-3 left-3 z-10">
                    <div className="discount-wrapper-fs">
                        <span className="discount-dark-fs"></span>
                        <span className="discount-light-fs">
                            -{discountPercent}%
                        </span>
                    </div>
                </div>
            )}

            <div className="relative h-44 w-full overflow-hidden rounded-t-xl bg-gray-100 dark:bg-[#252523]">
                <img
                    src={imageUrl}
                    alt={product.name ?? '-'}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder.png';
                    }}
                />
            </div>

            <div className="mb-3 px-2.5 py-2.5">
                <h3 className="mb-1.5 line-clamp-2 min-h-[40px] text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-green-600 transition-colors">
                    {product.name ?? '-'}
                </h3>

                <div className="mt-3 flex gap-2">
                    <div className="flex-1">
                        <div className="mb-1 flex flex-col gap-0.5">
                            {hasDiscount ? (
                                <div className="text-[12px] leading-tight text-gray-400 line-through">
                                    {originalPriceFormatted}
                                </div>
                            ) : (
                                <div className="invisible text-[12px] leading-tight">
                                    placeholder
                                </div>
                            )}

                            <div className="text-[18px] leading-tight font-semibold text-green-600">
                                {finalPriceFormatted}
                            </div>
                        </div>

                        <div>
                            <div className="mb-0.5 text-[11px] text-gray-500">
                                Terjual {sold} / {product.stock}
                            </div>

                            <div className="h-2 w-[100px] max-w-full rounded-full bg-gray-200">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                                    style={{
                                        width: product.stock
                                            ? `${Math.min((sold / product.stock) * 100, 100)}%`
                                            : '0%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex w-[80px] flex-col items-end justify-between">
                        <div className="flex gap-3 px-1 pt-1">
                            <button
                                type="button"
                                className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-green-600/50 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Favorit"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
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

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-green-600/50 transition hover:bg-gray-100 dark:hover:bg-gray-800"
                                title="Tambah ke Keranjang"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="#16a34a"
                                    className="size-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleBuyNow(product.id);
                            }}
                            disabled={product.stock <= 0}
                            className="w-full rounded-md bg-green-600 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"
                        >
                            BELI
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Index({ products, categories, brands, filters }: ProductsIndexProps) {
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedBrand, setSelectedBrand] = useState(filters.brand || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');

    const handleApplyFilters = () => {
        router.get(
            '/products',
            {
                search: filters.search || '',
                category: selectedCategory,
                brand: selectedBrand,
                min_price: minPrice,
                max_price: maxPrice,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleResetFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        setMinPrice('');
        setMaxPrice('');
        router.get(
            '/products',
            {
                search: filters.search || '',
            },
            {
                replace: true,
            }
        );
    };

    const handleBuyNow = (productId: number) => {
        router.post('/cart/add', { product_id: productId });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#151515] text-gray-900 dark:text-gray-100">
            <NavMain />
            
            <Head title="Jelajahi Produk - Groceria" />

            <div className="flex-1 container mx-auto max-w-6xl px-4 py-8">
                {/* Header Section */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Daftar Produk</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {filters.search ? (
                                <span>Menampilkan hasil untuk pencarian "<span className="font-semibold text-green-600">{filters.search}</span>"</span>
                            ) : (
                                "Temukan berbagai produk menarik dengan harga terbaik"
                            )}
                            {` (${(products as any).meta !== undefined ? (products as any).meta.total : ((products as any).total ?? 0)} produk ditemukan)`}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* FILTERS SIDEBAR */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1d] p-5 shadow-sm">
                            <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-gray-800">
                                <h2 className="flex items-center gap-2 font-semibold text-lg text-gray-800 dark:text-gray-100">
                                    <SlidersHorizontal className="h-4 w-4 text-green-600" /> Filter
                                </h2>
                                <button 
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition"
                                >
                                    <RotateCcw className="h-3 w-3" /> Reset
                                </button>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-3 mb-6">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori</label>
                                <select 
                                    value={selectedCategory} 
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full flex h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#252523] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.slug}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Brand Filter */}
                            <div className="space-y-3 mb-6">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Brand</label>
                                <select 
                                    value={selectedBrand} 
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                    className="w-full flex h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#252523] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600"
                                >
                                    <option value="">Semua Brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.slug}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range Filter */}
                            <div className="space-y-3 mb-6">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Rentang Harga (Rp)</label>
                                <div className="space-y-2">
                                    <input 
                                        type="number"
                                        placeholder="Harga Minimum"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full flex h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#252523] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Harga Maksimum"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full flex h-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#252523] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-600"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleApplyFilters}
                                className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 text-sm transition"
                            >
                                <Filter className="h-4 w-4" /> Terapkan Filter
                            </button>
                        </div>
                    </div>

                    {/* PRODUCTS GRID */}
                    <div className="lg:col-span-3">
                        {products.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e1e1d] p-16 text-center shadow-sm min-h-[400px]">
                                <RotateCcw className="h-10 w-10 text-gray-400 mb-4" />
                                <h3 className="font-semibold text-lg">Tidak ada produk ditemukan</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                                    Coba ubah kata kunci pencarian Anda atau atur ulang filter untuk menemukan produk yang diinginkan.
                                </p>
                                <button 
                                    onClick={handleResetFilters}
                                    className="mt-6 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 text-sm transition"
                                >
                                    Muat Ulang Semua Produk
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                                    {products.data.map((p) => (
                                        <ProductCard key={p.id} product={p} handleBuyNow={handleBuyNow} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <DataTablePagination data={products} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <NavFooter />
        </div>
    );
}
