import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Head, Link, router } from '@inertiajs/react';
import { Search, ShoppingBag, Eye, Calendar, DollarSign, Clock } from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
    product?: {
        image_url: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    created_at: string;
    items: OrderItem[];
}

interface PaginatedData<T> {
    data: T[];
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    current_page: number;
    last_page: number;
    total: number;
}

interface OrdersIndexProps {
    orders: PaginatedData<Order>;
    filters: {
        search?: string;
        status?: string;
        payment_status?: string;
    };
    statusOptions: Record<string, string>;
    paymentStatusOptions: Record<string, string>;
}

export default function Index({ orders, filters, statusOptions, paymentStatusOptions }: OrdersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [activeStatus, setActiveStatus] = useState(filters.status || 'all');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/orders', {
            search,
            status: activeStatus !== 'all' ? activeStatus : undefined,
        }, {
            preserveState: true,
        });
    };

    const handleStatusFilter = (status: string) => {
        setActiveStatus(status);
        router.get('/orders', {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
        }, {
            preserveState: true,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/50';
            case 'processing':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
            case 'shipped':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50';
            case 'delivered':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-[#1A1A19] dark:text-gray-400';
        }
    };

    const getPaymentStatusBadge = (status: Order['payment_status']) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'paid':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'failed':
                return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
            case 'refunded':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <>
            <Head title="Daftar Transaksi Saya - Groceria" />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
                <NavMain />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Daftar Transaksi</h1>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Pantau status pemesanan dan riwayat belanja Anda di Groceria.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <div className="relative w-64">
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nomor pesanan..."
                                    className="pl-9 dark:bg-[#1A1A19] dark:border-[#3E3E3A]"
                                />
                                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
                            </div>
                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                                Cari
                            </Button>
                        </form>
                    </div>

                    {/* Status Tabs */}
                    <div className="mb-6 overflow-x-auto border-b pb-1 scrollbar-none dark:border-[#2A2A28]">
                        <div className="flex gap-2 min-w-max">
                            <button
                                onClick={() => handleStatusFilter('all')}
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    activeStatus === 'all'
                                        ? 'bg-green-600 text-white'
                                        : 'hover:bg-gray-100 dark:hover:bg-[#1A1A19]'
                                }`}
                            >
                                Semua Pesanan
                            </button>
                            {Object.entries(statusOptions).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => handleStatusFilter(key)}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                        activeStatus === key
                                            ? 'bg-green-600 text-white'
                                            : 'hover:bg-gray-100 dark:hover:bg-[#1A1A19]'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border bg-white p-12 text-center shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h2 className="text-xl font-bold">Belum Ada Transaksi</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Anda belum memiliki transaksi dengan status yang dipilih.
                            </p>
                            <Link href="/products" className="mt-6">
                                <Button className="bg-green-600 hover:bg-green-700 text-white">Mulai Belanja</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-[#2A2A28] dark:bg-[#1A1A19] flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
                                >
                                    {/* Order Meta */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                                                {order.order_number}
                                            </span>
                                            <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${getStatusBadge(order.status)}`}>
                                                {statusOptions[order.status]}
                                            </span>
                                            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${getPaymentStatusBadge(order.payment_status)}`}>
                                                Pembayaran: {paymentStatusOptions[order.payment_status]}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                <span>{formatDate(order.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Metode: {order.payment_method.toUpperCase()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-4 w-4" />
                                                <span>{order.items.reduce((acc, i) => acc + i.quantity, 0)} Barang</span>
                                            </div>
                                        </div>

                                        {/* Product Preview Snippet */}
                                        <div className="flex gap-2 items-center overflow-x-auto py-1">
                                            {order.items.slice(0, 3).map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2 dark:border-[#2A2A28] dark:bg-[#252523]"
                                                >
                                                    <img
                                                        src={item.product?.image_url || '/images/placeholder.png'}
                                                        alt={item.product_name}
                                                        className="h-8 w-8 rounded object-cover"
                                                    />
                                                    <div className="max-w-[120px] text-xs">
                                                        <p className="font-semibold truncate">{item.product_name}</p>
                                                        <p className="text-gray-400 text-[10px]">{item.quantity}x</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <span className="text-xs text-gray-400 pl-2">
                                                    +{order.items.length - 3} lainnya
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action & Total Price */}
                                    <div className="flex md:flex-col items-end gap-3 justify-between w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 dark:border-[#2A2A28]">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Total Belanja</p>
                                            <p className="text-lg font-black text-green-600 dark:text-green-500">
                                                {formatCurrency(order.total)}
                                            </p>
                                        </div>

                                        <Link href={`/orders/${order.id}`}>
                                            <Button variant="outline" className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/20">
                                                <Eye className="h-4 w-4" />
                                                <span>Detail</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Links */}
                    {orders.links && orders.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-2">
                            {orders.links.map((link, idx) => (
                                <button
                                    key={idx}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold border transition-all ${
                                        link.active
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-white hover:bg-gray-50 dark:bg-[#1A1A19] dark:border-[#2A2A28] dark:hover:bg-[#252523] disabled:opacity-40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </main>

                <NavFooter />
            </div>
        </>
    );
}
