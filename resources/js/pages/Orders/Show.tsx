import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    CreditCard,
    Package,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Info,
} from 'lucide-react';

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
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_province: string;
    customer_postal_code: string;
    customer_country: string;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    notes?: string;
    shipping_tracking_number?: string;
    shipping_carrier?: string;
    created_at: string;
    items: OrderItem[];
}

interface OrdersShowProps {
    order: Order;
}

export default function Show({ order }: OrdersShowProps) {
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

    const getTimelineStep = () => {
        const statuses = ['pending', 'processing', 'shipped', 'delivered'];
        if (order.status === 'cancelled') return -1;
        return statuses.indexOf(order.status);
    };

    const currentStep = getTimelineStep();

    const getStatusText = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'Menunggu Konfirmasi';
            case 'processing': return 'Sedang Diproses';
            case 'shipped': return 'Dalam Pengiriman';
            case 'delivered': return 'Selesai / Diterima';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    const getPaymentStatusText = (status: Order['payment_status']) => {
        switch (status) {
            case 'pending': return 'Menunggu Pembayaran';
            case 'paid': return 'Lunas';
            case 'failed': return 'Gagal';
            case 'refunded': return 'Dikembalikan';
            default: return status;
        }
    };

    return (
        <>
            <Head title={`Detail Pesanan ${order.order_number} - Groceria`} />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
                <NavMain />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/orders">
                                <button className="rounded-lg border bg-white p-2 hover:bg-gray-50 dark:border-[#2A2A28] dark:bg-[#1A1A19] dark:hover:bg-[#252523]" title="Kembali ke Daftar Transaksi">
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight">Detail Pesanan</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No. Pesanan: <span className="font-semibold text-gray-800 dark:text-gray-200">{order.order_number}</span>
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            <span>Dibuat pada {formatDate(order.created_at)}</span>
                        </div>
                    </div>

                    {/* Visual Order Timeline */}
                    <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                        <h2 className="mb-6 text-base font-bold">Status Pengiriman</h2>
                        
                        {order.status === 'cancelled' ? (
                            <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50">
                                <XCircle className="h-5 w-5 shrink-0" />
                                <div>
                                    <p className="font-bold">Pesanan Dibatalkan</p>
                                    <p className="text-xs text-red-600/80 dark:text-red-400/80">
                                        Pemesanan dibatalkan oleh pembeli atau sistem. Jika dana Anda sudah terpotong, silakan hubungi tim CS kami.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute top-5 left-6 right-6 hidden md:block border-t-2 border-gray-200 dark:border-[#2A2A28] z-0">
                                    <div
                                        className="border-t-2 border-green-600 dark:border-green-500 transition-all duration-500"
                                        style={{ width: `${(currentStep / 3) * 100}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                                    {/* Step 1: Pending */}
                                    <div className="flex md:flex-col items-center gap-4 text-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                            currentStep >= 0
                                                ? 'bg-green-600 border-green-600 text-white dark:bg-green-500 dark:border-green-500'
                                                : 'bg-white border-gray-300 dark:bg-[#1A1A19] dark:border-[#2A2A28]'
                                        }`}>
                                            <Clock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${currentStep >= 0 ? 'text-green-600 dark:text-green-500' : 'text-gray-400'}`}>Menunggu</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Menunggu verifikasi penjual</p>
                                        </div>
                                    </div>

                                    {/* Step 2: Processing */}
                                    <div className="flex md:flex-col items-center gap-4 text-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                            currentStep >= 1
                                                ? 'bg-green-600 border-green-600 text-white dark:bg-green-500 dark:border-green-500'
                                                : 'bg-white border-gray-300 dark:bg-[#1A1A19] dark:border-[#2A2A28]'
                                        }`}>
                                            <Package className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${currentStep >= 1 ? 'text-green-600 dark:text-green-500' : 'text-gray-400'}`}>Diproses</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Barang disiapkan & dikemas</p>
                                        </div>
                                    </div>

                                    {/* Step 3: Shipped */}
                                    <div className="flex md:flex-col items-center gap-4 text-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                            currentStep >= 2
                                                ? 'bg-green-600 border-green-600 text-white dark:bg-green-500 dark:border-green-500'
                                                : 'bg-white border-gray-300 dark:bg-[#1A1A19] dark:border-[#2A2A28]'
                                        }`}>
                                            <Truck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${currentStep >= 2 ? 'text-green-600 dark:text-green-500' : 'text-gray-400'}`}>Dikirim</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Kurir sedang mengirim paket</p>
                                        </div>
                                    </div>

                                    {/* Step 4: Delivered */}
                                    <div className="flex md:flex-col items-center gap-4 text-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                                            currentStep >= 3
                                                ? 'bg-green-600 border-green-600 text-white dark:bg-green-500 dark:border-green-500'
                                                : 'bg-white border-gray-300 dark:bg-[#1A1A19] dark:border-[#2A2A28]'
                                        }`}>
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${currentStep >= 3 ? 'text-green-600 dark:text-green-500' : 'text-gray-400'}`}>Selesai</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Pesanan diterima dengan baik</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* LEFT COLUMN: Order Details & Products */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Alamat Pengiriman & Kurir */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19] grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="mb-3 flex items-center gap-2 text-green-600 dark:text-green-500">
                                        <MapPin className="h-4.5 w-4.5" />
                                        <h3 className="font-bold">Alamat Pengiriman</h3>
                                    </div>
                                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                                        <p className="font-bold text-gray-800 dark:text-gray-200">{order.customer_name}</p>
                                        <p>{order.customer_phone}</p>
                                        <p>{order.customer_address}</p>
                                        <p>{order.customer_city}, {order.customer_province}, {order.customer_postal_code}</p>
                                        <p className="text-xs text-gray-400">{order.customer_country}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-3 flex items-center gap-2 text-green-600 dark:text-green-500">
                                        <Truck className="h-4.5 w-4.5" />
                                        <h3 className="font-bold">Informasi Pengiriman</h3>
                                    </div>
                                    <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                                        <div>
                                            <p className="text-xs text-gray-400">Kurir Pengiriman</p>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">
                                                {order.shipping_carrier || 'JNE Express (Reguler)'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Nomor Resi</p>
                                            <p className="font-mono text-gray-800 dark:text-gray-200">
                                                {order.shipping_tracking_number || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daftar Produk */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-500">
                                    <Package className="h-5 w-5" />
                                    <h3 className="font-bold">Produk Yang Dibeli</h3>
                                </div>

                                <div className="divide-y dark:divide-[#2A2A28]">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                            <img
                                                src={item.product?.image_url || '/images/placeholder.png'}
                                                alt={item.product_name}
                                                className="h-16 w-16 rounded-lg object-cover border dark:border-[#3E3E3A]"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate">{item.product_name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.quantity} Barang x {formatCurrency(item.product_price)}
                                                </p>
                                            </div>
                                            <div className="font-bold text-right text-sm">
                                                {formatCurrency(item.subtotal)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Summary & Payment */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Informasi Pembayaran */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-500">
                                    <CreditCard className="h-5 w-5" />
                                    <h3 className="font-bold">Info Pembayaran</h3>
                                </div>

                                <div className="text-sm space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Metode</span>
                                        <span className="font-semibold">{order.payment_method.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Status Bayar</span>
                                        <span className={`font-semibold ${
                                            order.payment_status === 'paid' ? 'text-green-600 dark:text-green-500' : 'text-yellow-600 dark:text-yellow-500'
                                        }`}>
                                            {getPaymentStatusText(order.payment_status)}
                                        </span>
                                    </div>
                                    {order.notes && (
                                        <div className="border-t pt-3 mt-3 dark:border-[#2A2A28]">
                                            <p className="text-xs text-gray-400 mb-1">Catatan Pesanan:</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                                "{order.notes}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Total Summary */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <h3 className="font-bold border-b pb-3 mb-3 dark:border-[#2A2A28]">Rincian Pembayaran</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Ongkos Kirim</span>
                                        <span>{formatCurrency(order.shipping_cost)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Pajak (PPN 11%)</span>
                                        <span>{formatCurrency(order.tax)}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3 dark:border-[#2A2A28] font-extrabold text-green-600 dark:text-green-500 text-lg">
                                        <span>Total Bayar</span>
                                        <span>{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <NavFooter />
            </div>
        </>
    );
}
