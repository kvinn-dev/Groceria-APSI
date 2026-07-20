import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    DollarSign,
    Eye,
    FolderOpen,
    Package,
    Shield,
    ShoppingCart,
    TrendingUp,
} from 'lucide-react';

interface RecentOrder {
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    created_at: string;
}

interface TopProduct {
    product_id: number;
    product_name: string;
    total_sold: number;
    total_revenue: number;
}

interface DashboardProps {
    stats: {
        total_products: number;
        total_categories: number;
        total_orders: number;
        total_revenue: number;
        order_status_counts: {
            pending: number;
            processing: number;
            shipped: number;
            delivered: number;
            cancelled: number;
        };
        recent_orders: RecentOrder[];
        top_products: TopProduct[];
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // SVG Donut Chart Math & Data
    const segments = [
        {
            label: 'Menunggu Verifikasi',
            value: stats.order_status_counts.pending,
            color: '#f59e0b',
            bgClass: 'bg-amber-500',
        },
        {
            label: 'Diproses',
            value: stats.order_status_counts.processing,
            color: '#3b82f6',
            bgClass: 'bg-blue-500',
        },
        {
            label: 'Dikirim',
            value: stats.order_status_counts.shipped,
            color: '#6366f1',
            bgClass: 'bg-indigo-500',
        },
        {
            label: 'Selesai',
            value: stats.order_status_counts.delivered,
            color: '#10b981',
            bgClass: 'bg-emerald-500',
        },
        {
            label: 'Dibatalkan',
            value: stats.order_status_counts.cancelled,
            color: '#ef4444',
            bgClass: 'bg-rose-500',
        },
    ];

    const totalOrders = segments.reduce((sum, s) => sum + s.value, 0);

    let accumulatedPercent = 0;
    const segmentData = segments.map((s) => {
        const percent = totalOrders > 0 ? s.value / totalOrders : 0;
        const strokeDasharray = `${(percent * 314.16).toFixed(2)} 314.16`;
        const strokeDashoffset = `${(-(accumulatedPercent * 314.16)).toFixed(2)}`;
        accumulatedPercent += percent;
        return {
            ...s,
            percent,
            strokeDasharray,
            strokeDashoffset,
        };
    });

    const getStatusBadge = (status: RecentOrder['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-250 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/50';
            case 'processing':
                return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
            case 'shipped':
                return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50';
            case 'delivered':
                return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50';
            case 'cancelled':
                return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getStatusText = (status: RecentOrder['status']) => {
        const labels = {
            pending: 'Menunggu',
            processing: 'Diproses',
            shipped: 'Dikirim',
            delivered: 'Selesai',
            cancelled: 'Dibatalkan',
        };
        return labels[status];
    };

    const maxSold =
        stats.top_products.length > 0
            ? Math.max(...stats.top_products.map((p) => p.total_sold))
            : 1;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-8">
                {/* Welcome banner */}
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white shadow-md">
                    <div className="absolute -top-10 -right-10 text-emerald-800 opacity-20">
                        <Shield className="h-40 w-40" />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Selamat Datang di Admin Panel
                        </h1>
                        <p className="max-w-xl text-emerald-100">
                            Kelola produk, kategori, dan pesanan toko e-commerce
                            Anda dengan cepat dan mudah melalui panel ini.
                        </p>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Revenue Card */}
                    <Card className="transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#1A1A19]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Pendapatan
                            </CardTitle>
                            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                                {formatCurrency(stats.total_revenue)}
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                                Dari pesanan yang sudah dibayar
                            </p>
                        </CardContent>
                    </Card>

                    {/* Orders Card */}
                    <Card className="transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#1A1A19]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Pesanan
                            </CardTitle>
                            <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_orders}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Seluruh pesanan masuk
                            </p>
                        </CardContent>
                    </Card>

                    {/* Products Card */}
                    <Card className="transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#1A1A19]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Produk
                            </CardTitle>
                            <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <Package className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_products}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Produk terdaftar aktif
                            </p>
                        </CardContent>
                    </Card>

                    {/* Categories Card */}
                    <Card className="transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#1A1A19]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Kategori
                            </CardTitle>
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <FolderOpen className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_categories}
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Kategori pembagian produk
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts & Top Products row */}
                <div className="grid gap-6 md:grid-cols-12">
                    {/* Donut Chart Card */}
                    <Card className="md:col-span-5 dark:border-gray-800 dark:bg-[#1A1A19]">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Status Pesanan
                            </CardTitle>
                            <CardDescription>
                                Pembagian pesanan berdasarkan status saat ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center space-y-6">
                            <div className="relative h-44 w-44">
                                <svg
                                    className="h-full w-full"
                                    viewBox="0 0 160 160"
                                >
                                    {totalOrders === 0 ? (
                                        // Empty state circle
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="50"
                                            fill="transparent"
                                            stroke="#e5e7eb"
                                            strokeWidth="12"
                                            className="dark:stroke-gray-800"
                                        />
                                    ) : (
                                        segmentData.map((seg, idx) => (
                                            <circle
                                                key={idx}
                                                cx="80"
                                                cy="80"
                                                r="50"
                                                fill="transparent"
                                                stroke={seg.color}
                                                strokeWidth="12"
                                                strokeDasharray={
                                                    seg.strokeDasharray
                                                }
                                                strokeDashoffset={
                                                    seg.strokeDashoffset
                                                }
                                                transform="rotate(-90 80 80)"
                                                className="transition-all duration-300 hover:stroke-[14px]"
                                            />
                                        ))
                                    )}
                                    <text
                                        x="80"
                                        y="78"
                                        textAnchor="middle"
                                        className="fill-gray-900 text-2xl font-extrabold dark:fill-white"
                                    >
                                        {totalOrders}
                                    </text>
                                    <text
                                        x="80"
                                        y="96"
                                        textAnchor="middle"
                                        className="fill-gray-400 text-[10px] font-semibold tracking-wider uppercase dark:fill-gray-500"
                                    >
                                        Total Order
                                    </text>
                                </svg>
                            </div>

                            {/* Legend */}
                            <div className="w-full space-y-2.5 text-sm">
                                {segmentData.map((seg, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`h-3 w-3 rounded-full ${seg.bgClass}`}
                                            />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {seg.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 font-semibold">
                                            <span>{seg.value}</span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                {totalOrders > 0
                                                    ? `${((seg.value / totalOrders) * 100).toFixed(0)}%`
                                                    : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Selling Products Card */}
                    <Card className="md:col-span-7 dark:border-gray-800 dark:bg-[#1A1A19]">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">
                                Produk Terlaris
                            </CardTitle>
                            <CardDescription>
                                5 Produk dengan volume penjualan tertinggi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {stats.top_products.length === 0 ? (
                                <div className="flex h-48 flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                    <Package className="mb-2 h-10 w-10 opacity-30" />
                                    <span>
                                        Belum ada data penjualan produk.
                                    </span>
                                </div>
                            ) : (
                                stats.top_products.map((p, idx) => {
                                    const percent =
                                        (p.total_sold / maxSold) * 100;
                                    return (
                                        <div
                                            key={p.product_id}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex max-w-[70%] items-center gap-2.5">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs font-bold dark:bg-gray-800">
                                                        {idx + 1}
                                                    </span>
                                                    <span className="truncate font-semibold">
                                                        {p.product_name}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold">
                                                        {p.total_sold} terjual
                                                    </span>
                                                    <span className="block text-xs text-gray-400 dark:text-gray-500">
                                                        {formatCurrency(
                                                            p.total_revenue,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Progress Bar representation */}
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                                <div
                                                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                                                    style={{
                                                        width: `${percent}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders table card */}
                <Card className="dark:border-gray-800 dark:bg-[#1A1A19]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold">
                                Pesanan Terbaru
                            </CardTitle>
                            <CardDescription>
                                5 transaksi pesanan masuk terakhir.
                            </CardDescription>
                        </div>
                        <Link href="/admin/orders">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-green-600 hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-950/20"
                            >
                                Kelola Pesanan
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase dark:border-gray-800 dark:bg-transparent">
                                <tr>
                                    <th className="px-4 py-3 font-bold">
                                        No. Pesanan
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Pelanggan
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Total Belanja
                                    </th>
                                    <th className="px-4 py-3 font-bold">
                                        Status Pesanan
                                    </th>
                                    <th className="px-4 py-3 text-right font-bold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-800">
                                {stats.recent_orders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            Tidak ada pesanan terbaru.
                                        </td>
                                    </tr>
                                ) : (
                                    stats.recent_orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50/30 dark:hover:bg-gray-800/10"
                                        >
                                            <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900 dark:text-white">
                                                {order.order_number}
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {order.customer_name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-green-600 dark:text-green-500">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(order.status)}`}
                                                >
                                                    {getStatusText(
                                                        order.status,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href="/admin/orders">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/20"
                                                    >
                                                        <Eye className="mr-1.5 h-4 w-4" />
                                                        Kelola
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
