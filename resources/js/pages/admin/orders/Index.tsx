import { DataTablePagination } from '@/components/data-table-pagination';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import {
    Eye,
    FileText,
    MapPin,
    Search,
    ShoppingBag,
    Trash2,
    User as UserIcon,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { type Order, type PaginatedData } from '@/types';

interface OrderIndexProps {
    orders: PaginatedData<Order>;
    filters: {
        search?: string;
        status?: string;
        payment_status?: string;
    };
    statusOptions: Record<string, string>;
    paymentStatusOptions: Record<string, string>;
}

export default function Index({
    orders,
    filters,
    statusOptions,
    paymentStatusOptions,
}: OrderIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [paymentFilter, setPaymentFilter] = useState(
        filters.payment_status || 'all',
    );
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // States for editing order in modal
    const [editStatus, setEditStatus] = useState<Order['status']>('pending');
    const [editPaymentStatus, setEditPaymentStatus] =
        useState<Order['payment_status']>('pending');
    const [editCarrier, setEditCarrier] = useState('');
    const [editTrackingNumber, setEditTrackingNumber] = useState('');
    const [editNotes, setEditNotes] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({
            search,
            status: statusFilter,
            payment_status: paymentFilter,
        });
    };

    const applyFilters = (newFilters: {
        search?: string;
        status?: string;
        payment_status?: string;
    }) => {
        router.get(
            '/admin/orders',
            {
                search: newFilters.search || undefined,
                status:
                    newFilters.status !== 'all' ? newFilters.status : undefined,
                payment_status:
                    newFilters.payment_status !== 'all'
                        ? newFilters.payment_status
                        : undefined,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatusFilter('all');
        setPaymentFilter('all');
        router.get('/admin/orders', {}, { replace: true });
    };

    const handleOpenDetail = (order: Order) => {
        setSelectedOrder(order);
        setEditStatus(order.status);
        setEditPaymentStatus(order.payment_status);
        setEditCarrier(order.shipping_carrier || '');
        setEditTrackingNumber(order.shipping_tracking_number || '');
        setEditNotes(order.notes || '');
        setIsDetailOpen(true);
    };

    const handleUpdateOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        router.put(
            `/admin/orders/${selectedOrder.id}`,
            {
                status: editStatus,
                payment_status: editPaymentStatus,
                shipping_carrier: editCarrier || null,
                shipping_tracking_number: editTrackingNumber || null,
                notes: editNotes || null,
            },
            {
                onSuccess: () => {
                    setIsDetailOpen(false);
                    setSelectedOrder(null);
                },
            },
        );
    };

    const handleDeleteOrder = (id: number) => {
        router.delete(`/admin/orders/${id}`, {
            onSuccess: () => {
                setIsDetailOpen(false);
                setSelectedOrder(null);
            },
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
                return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-[#1A1A19] dark:text-gray-400';
        }
    };

    const getPaymentStatusBadge = (status: Order['payment_status']) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-250 dark:bg-amber-900/30 dark:text-amber-400';
            case 'paid':
                return 'bg-emerald-100 text-emerald-800 border-emerald-250 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'failed':
                return 'bg-rose-100 text-rose-800 border-rose-250 dark:bg-rose-900/30 dark:text-rose-400';
            case 'refunded':
                return 'bg-purple-100 text-purple-800 border-purple-250 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    return (
        <AdminLayout>
            <Head title="Pengelolaan Pesanan - Admin Panel" />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Pengelolaan Pesanan
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pantau status, pembayaran, dan informasi pengiriman
                        pesanan pembeli.
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <Card className="mt-6 border-gray-200 bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                <CardContent className="pt-6">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="grid gap-4 md:grid-cols-4"
                    >
                        {/* Search Input */}
                        <div className="relative col-span-2">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari No. Pesanan, Nama, atau Email..."
                                className="bg-white pr-8 pl-9 dark:border-[#3E3E3A] dark:bg-[#252523]"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        applyFilters({
                                            search: '',
                                            status: statusFilter,
                                            payment_status: paymentFilter,
                                        });
                                    }}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Order Status Select */}
                        <Select
                            value={statusFilter}
                            onValueChange={(val) => {
                                setStatusFilter(val);
                                applyFilters({
                                    search,
                                    status: val,
                                    payment_status: paymentFilter,
                                });
                            }}
                        >
                            <SelectTrigger className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]">
                                <SelectValue placeholder="Status Pesanan" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                <SelectItem value="all">
                                    Semua Status Pesanan
                                </SelectItem>
                                {Object.entries(statusOptions).map(
                                    ([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        {/* Payment Status Select */}
                        <Select
                            value={paymentFilter}
                            onValueChange={(val) => {
                                setPaymentFilter(val);
                                applyFilters({
                                    search,
                                    status: statusFilter,
                                    payment_status: val,
                                });
                            }}
                        >
                            <SelectTrigger className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]">
                                <SelectValue placeholder="Status Pembayaran" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                <SelectItem value="all">
                                    Semua Status Pembayaran
                                </SelectItem>
                                {Object.entries(paymentStatusOptions).map(
                                    ([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </form>

                    {(search ||
                        statusFilter !== 'all' ||
                        paymentFilter !== 'all') && (
                        <div className="mt-4 flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                Bersihkan Filter
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Table Section */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-[#252523]">
                        <TableRow className="border-gray-200 dark:border-[#3E3E3A]">
                            <TableHead className="w-[150px] font-bold">
                                No. Pesanan
                            </TableHead>
                            <TableHead className="font-bold">
                                Pelanggan
                            </TableHead>
                            <TableHead className="font-bold">Tanggal</TableHead>
                            <TableHead className="font-bold">Total</TableHead>
                            <TableHead className="font-bold">Metode</TableHead>
                            <TableHead className="font-bold">
                                Pembayaran
                            </TableHead>
                            <TableHead className="font-bold">
                                Status Pesanan
                            </TableHead>
                            <TableHead className="w-[100px] text-right font-bold">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-32 text-center text-gray-500 dark:text-gray-400"
                                >
                                    <ShoppingBag className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                    Tidak ada data pesanan yang ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.data.map((order) => (
                                <TableRow
                                    key={order.id}
                                    className="border-gray-200 hover:bg-gray-50/50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]/50"
                                >
                                    <TableCell
                                        className="text-xs font-bold"
                                        title={order.order_number}
                                    >
                                        {order.order_number.length > 14
                                            ? `${order.order_number.slice(0, 14)}...`
                                            : order.order_number}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-semibold">
                                            {order.customer_name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {order.customer_email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {formatDate(order.created_at)}
                                    </TableCell>
                                    <TableCell className="font-bold text-green-600 dark:text-green-500">
                                        {formatCurrency(order.total)}
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold">
                                        {(
                                            order.payment_method || ''
                                        ).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-block rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getPaymentStatusBadge(order.payment_status)}`}
                                        >
                                            {
                                                paymentStatusOptions[
                                                    order.payment_status
                                                ]
                                            }
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${getStatusBadge(order.status)}`}
                                        >
                                            {statusOptions[order.status]}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleOpenDetail(order)
                                            }
                                            className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/20"
                                        >
                                            <Eye className="mr-1.5 h-4 w-4" />
                                            Kelola
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination data={orders} />

            {/* ORDER DETAIL & UPDATE MODAL */}
            {isDetailOpen && selectedOrder && (
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto border-gray-200 bg-white p-6 sm:max-w-5xl md:p-8 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between text-xl font-bold">
                                <span>
                                    Detail Pesanan {selectedOrder.order_number}
                                </span>
                                <span
                                    className={`mr-6 rounded-full border px-3 py-0.5 text-xs font-semibold ${getStatusBadge(selectedOrder.status)}`}
                                >
                                    {statusOptions[selectedOrder.status]}
                                </span>
                            </DialogTitle>
                            <DialogDescription>
                                Dibuat pada{' '}
                                {formatDate(selectedOrder.created_at)}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-8 py-6 md:grid-cols-2">
                            {/* Column Left: Customer & Delivery Info */}
                            <div className="space-y-6">
                                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-[#3E3E3A] dark:bg-[#252523]/50">
                                    <h3 className="mb-3 flex items-center gap-1.5 border-b pb-2 text-sm font-bold text-gray-900 dark:border-[#3E3E3A] dark:text-white">
                                        <UserIcon className="h-4 w-4 text-green-600" />
                                        Informasi Pelanggan
                                    </h3>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Nama:
                                            </span>
                                            <span className="font-semibold">
                                                {selectedOrder.customer_name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                Email:
                                            </span>
                                            <span>
                                                {selectedOrder.customer_email}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">
                                                No. HP:
                                            </span>
                                            <span>
                                                {selectedOrder.customer_phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-[#3E3E3A] dark:bg-[#252523]/50">
                                    <h3 className="mb-3 flex items-center gap-1.5 border-b pb-2 text-sm font-bold text-gray-900 dark:border-[#3E3E3A] dark:text-white">
                                        <MapPin className="h-4 w-4 text-green-600" />
                                        Alamat Pengiriman
                                    </h3>
                                    <div className="space-y-1.5 text-sm">
                                        <p className="font-medium">
                                            {selectedOrder.customer_address}
                                        </p>
                                        <p className="text-gray-500">
                                            {selectedOrder.customer_city},{' '}
                                            {selectedOrder.customer_province},{' '}
                                            {selectedOrder.customer_postal_code}
                                        </p>
                                    </div>
                                </div>

                                {selectedOrder.notes && (
                                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-[#3E3E3A] dark:bg-[#252523]/50">
                                        <h3 className="mb-3 flex items-center gap-1.5 border-b pb-2 text-sm font-bold text-gray-900 dark:border-[#3E3E3A] dark:text-white">
                                            <FileText className="h-4 w-4 text-green-600" />
                                            Catatan Pembeli
                                        </h3>
                                        <p className="text-sm text-gray-600 italic dark:text-gray-400">
                                            "{selectedOrder.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Column Right: Items & Totals */}
                            <div className="space-y-6">
                                <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 dark:border-[#3E3E3A] dark:bg-[#252523]/50">
                                    <h3 className="mb-3 border-b pb-2 text-sm font-bold dark:border-[#3E3E3A]">
                                        Daftar Belanja (
                                        {(selectedOrder.items || []).reduce(
                                            (acc, i) => acc + i.quantity,
                                            0,
                                        )}{' '}
                                        Item)
                                    </h3>
                                    <div className="max-h-[250px] space-y-3 overflow-y-auto pr-1">
                                        {(selectedOrder.items || []).map(
                                            (item) => (
                                                <div
                                                    key={item.id}
                                                    className="border-gray-150 flex items-center justify-between gap-3 border-b pb-2 text-sm last:border-0 last:pb-0 dark:border-[#3E3E3A]"
                                                >
                                                    <div className="flex max-w-[70%] items-center gap-2">
                                                        <img
                                                            src={
                                                                item.product
                                                                    ?.image_url ||
                                                                '/images/placeholder.png'
                                                            }
                                                            alt={
                                                                item.product_name
                                                            }
                                                            className="h-8 w-8 rounded object-cover"
                                                        />
                                                        <div className="truncate">
                                                            <p className="truncate font-semibold">
                                                                {
                                                                    item.product_name
                                                                }
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatCurrency(
                                                                    Number(
                                                                        item.product_price,
                                                                    ),
                                                                )}{' '}
                                                                x{' '}
                                                                {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="font-bold">
                                                        {formatCurrency(
                                                            Number(
                                                                item.subtotal,
                                                            ),
                                                        )}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    {/* Total Bill Details */}
                                    <div className="mt-4 space-y-1.5 border-t pt-3 text-sm dark:border-[#3E3E3A]">
                                        <div className="flex justify-between text-gray-500">
                                            <span>Subtotal:</span>
                                            <span>
                                                {formatCurrency(
                                                    Number(
                                                        selectedOrder.subtotal,
                                                    ),
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-500">
                                            <span>Ongkos Kirim:</span>
                                            <span>
                                                {formatCurrency(
                                                    Number(
                                                        selectedOrder.shipping_cost,
                                                    ),
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2 text-lg font-bold text-green-600 dark:border-[#3E3E3A] dark:text-green-500">
                                            <span>Total Pembayaran:</span>
                                            <span>
                                                {formatCurrency(
                                                    Number(selectedOrder.total),
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Management Form (Update Status) */}
                        <form
                            onSubmit={handleUpdateOrder}
                            className="space-y-4 border-t pt-4 dark:border-[#3E3E3A]"
                        >
                            <h3 className="text-sm font-bold">
                                Pengelolaan Status & Pengiriman
                            </h3>

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Order Status Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500">
                                        Status Pesanan
                                    </label>
                                    <Select
                                        value={editStatus}
                                        onValueChange={(val: Order['status']) =>
                                            setEditStatus(val)
                                        }
                                    >
                                        <SelectTrigger className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                            {Object.entries(statusOptions).map(
                                                ([key, value]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Payment Status Selector */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500">
                                        Status Pembayaran
                                    </label>
                                    <Select
                                        value={editPaymentStatus}
                                        onValueChange={(
                                            val: Order['payment_status'],
                                        ) => setEditPaymentStatus(val)}
                                    >
                                        <SelectTrigger className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]">
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                            {Object.entries(
                                                paymentStatusOptions,
                                            ).map(([key, value]) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Shipping info (Kurir / Resi) - only shown when status is shipped or delivered */}
                            {(editStatus === 'shipped' ||
                                editStatus === 'delivered') && (
                                <div className="grid gap-4 rounded-lg border border-dashed border-green-500 bg-green-50/20 p-3 md:grid-cols-2 dark:bg-green-950/10">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            Kurir Pengiriman
                                        </label>
                                        <Input
                                            value={editCarrier}
                                            onChange={(e) =>
                                                setEditCarrier(e.target.value)
                                            }
                                            placeholder="Contoh: JNE, J&T, SiCepat"
                                            className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                            Nomor Resi (Tracking Number)
                                        </label>
                                        <Input
                                            value={editTrackingNumber}
                                            onChange={(e) =>
                                                setEditTrackingNumber(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan No. Resi pengiriman"
                                            className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500">
                                    Catatan Admin / Catatan Tambahan
                                </label>
                                <Textarea
                                    value={editNotes}
                                    onChange={(e) =>
                                        setEditNotes(e.target.value)
                                    }
                                    placeholder="Tambahkan catatan untuk pesanan ini..."
                                    className="bg-white dark:border-[#3E3E3A] dark:bg-[#252523]"
                                    rows={2}
                                />
                            </div>

                            {/* Dialog Footer Actions */}
                            <DialogFooter className="flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row dark:border-[#3E3E3A]">
                                {/* Left Side: Delete/Cancel Order (Only for pending orders) */}
                                <div className="flex-1 text-left">
                                    {selectedOrder.status === 'pending' && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                >
                                                    <Trash2 className="mr-1.5 h-4 w-4" />
                                                    Hapus Pesanan
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="border-gray-200 bg-white dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Hapus Pesanan ini?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Tindakan ini tidak dapat
                                                        dibatalkan. Stok produk
                                                        akan dikembalikan jika
                                                        Anda menghapus pesanan
                                                        pending ini.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-700">
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteOrder(
                                                                selectedOrder.id,
                                                            )
                                                        }
                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                    >
                                                        Hapus
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDetailOpen(false)}
                                        className="border-gray-300 bg-transparent dark:border-gray-700"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-green-600 font-semibold text-white hover:bg-green-700"
                                    >
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </AdminLayout>
    );
}
