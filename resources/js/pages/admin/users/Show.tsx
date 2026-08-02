import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type Address, type Order, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Calendar,
    ChevronRight,
    CreditCard,
    MapPin,
    Phone,
    ShieldAlert,
    ShoppingBag,
    UserCheck,
    User as UserIcon,
} from 'lucide-react';

interface UserShowProps {
    userDetail: User;
    orders: Order[];
    addresses: Address[];
    stats: {
        total_orders: number;
        total_spent: number;
    };
}

export default function Show({
    userDetail,
    orders = [],
    addresses = [],
    stats,
}: UserShowProps) {
    const handleStatusChange = (
        newStatus: 'active' | 'suspended' | 'restricted',
    ) => {
        router.patch(`/admin/users/${userDetail.id}/status`, {
            status: newStatus,
        });
    };

    const getStatusBadgeClass = (status?: string) => {
        switch (status) {
            case 'suspended':
                return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-200/50';
            case 'restricted':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200/50';
            default:
                return 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200/50';
        }
    };

    const getStatusLabel = (status?: string) => {
        switch (status) {
            case 'suspended':
                return 'Dinonaktifkan Sementara';
            case 'restricted':
                return 'Akses Dibatasi';
            default:
                return 'Akun Aktif';
        }
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formattedBirthDate = userDetail.birth_date
        ? new Date(userDetail.birth_date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '-';

    const formattedRegDate = new Date(userDetail.created_at).toLocaleDateString(
        'id-ID',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    );

    const getGenderLabel = (g?: string) => {
        if (!g) return '-';
        return g.toLowerCase() === 'l' ? 'Laki-laki' : 'Perempuan';
    };

    return (
        <AdminLayout>
            <Head title={`User Detail - ${userDetail.name}`} />

            <div className="flex items-center gap-4">
                <Link href="/admin/users">
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Detail User
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Lihat info lengkap profil customer dan riwayat order.
                    </p>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT COLUMN: PROFILE CARD & ACTIONS */}
                <div className="space-y-6 lg:col-span-1">
                    {/* User Profile Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                {userDetail.avatar ? (
                                    <img
                                        src={userDetail.avatar}
                                        alt={userDetail.name}
                                        className="h-24 w-24 rounded-full border-4 border-white object-cover shadow dark:border-gray-800"
                                    />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-700 dark:bg-green-950 dark:text-green-400">
                                        {userDetail.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}
                                <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                                    {userDetail.name}
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {userDetail.email}
                                </span>

                                <span
                                    className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(userDetail.status)}`}
                                >
                                    {getStatusLabel(userDetail.status)}
                                </span>
                            </div>

                            <div className="mt-6 space-y-3 border-t pt-4 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2.5">
                                    <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>{userDetail.phone || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <UserIcon className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>
                                        Gender:{' '}
                                        {getGenderLabel(
                                            userDetail.gender as string,
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>Lahir: {formattedBirthDate}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                                    <span>Register: {formattedRegDate}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Security / Status Action Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Tindakan Moderasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {userDetail.status !== 'active' && (
                                <Button
                                    onClick={() => handleStatusChange('active')}
                                    className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
                                >
                                    <UserCheck className="h-4 w-4" />
                                    Aktifkan Akun
                                </Button>
                            )}

                            {userDetail.status !== 'restricted' && (
                                <Button
                                    onClick={() =>
                                        handleStatusChange('restricted')
                                    }
                                    variant="outline"
                                    className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/20"
                                >
                                    <ShieldAlert className="h-4 w-4" />
                                    Batasi Transaksi
                                </Button>
                            )}

                            {userDetail.status !== 'suspended' && (
                                <Button
                                    onClick={() =>
                                        handleStatusChange('suspended')
                                    }
                                    variant="destructive"
                                    className="w-full gap-2"
                                >
                                    <Ban className="h-4 w-4" />
                                    Nonaktifkan Akun
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: STATS, ADDRESSES & ORDERS */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    Total Checkout
                                </CardTitle>
                                <ShoppingBag className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_orders} Kali
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">
                                    Total Belanja (Paid)
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-gray-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatRupiah(stats.total_spent)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Address List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <MapPin className="h-5 w-5 text-green-600" />
                                Daftar Alamat Pengiriman ({addresses.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {addresses.length === 0 ? (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    User belum menambahkan alamat.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            className={`relative rounded-lg border p-4 shadow-sm ${
                                                addr.is_default
                                                    ? 'border-green-500 bg-green-50/20 dark:bg-green-950/10'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    {addr.name}
                                                </h4>
                                                {addr.is_default && (
                                                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-800 dark:bg-green-950 dark:text-green-400">
                                                        Utama
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {addr.phone}
                                            </p>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                {addr.address}, {addr.city},{' '}
                                                {addr.province},{' '}
                                                {addr.postal_code}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">
                                Riwayat Pesanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {orders.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-500">
                                    Belum ada transaksi pembelian.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-6">
                                                Invoice
                                            </TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Payment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="pr-6 text-right">
                                                Detail
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => {
                                            const orderDate = new Date(
                                                order.created_at,
                                            ).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            });

                                            return (
                                                <TableRow
                                                    key={order.id}
                                                    className="dark:hover:bg-gray-75/50 hover:bg-gray-50/50"
                                                >
                                                    <TableCell className="pl-6 font-mono text-xs font-semibold text-gray-900 dark:text-white">
                                                        {order.order_number}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-gray-600 dark:text-gray-400">
                                                        {orderDate}
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                                                        {formatRupiah(
                                                            order.total,
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                order.payment_status ===
                                                                'paid'
                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400'
                                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
                                                            }`}
                                                        >
                                                            {order.payment_status ===
                                                            'paid'
                                                                ? 'Lunas'
                                                                : 'Belum Lunas'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-xs text-gray-600 uppercase dark:text-gray-400">
                                                            {order.status}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-6 text-right">
                                                        <Link
                                                            href={`/admin/orders?search=${order.order_number}`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                                            >
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
