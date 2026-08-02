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
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type User, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Eye,
    Search,
    ShieldAlert,
    ShieldCheck,
    Ban,
    UserCheck,
    X,
    Calendar,
    ShoppingCart
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserIndexProps {
    users: PaginatedData<User & { orders_count?: number }>;
    filters?: {
        search?: string;
        status?: string;
    };
}

export default function Index({ users, filters = {} }: UserIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleStatusChange = (userId: number, newStatus: 'active' | 'suspended' | 'restricted') => {
        router.patch(`/admin/users/${userId}/status`, {
            status: newStatus
        }, {
            preserveScroll: true
        });
    };

    const handleSearch = (searchValue: string, statusValue: string) => {
        router.get(
            '/admin/users',
            { search: searchValue, status: statusValue },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '') || statusFilter !== (filters.status || '')) {
                handleSearch(search, statusFilter);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter]);

    const handleClear = () => {
        setSearch('');
        setStatusFilter('');
        handleSearch('', '');
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
                return 'Dinonaktifkan';
            case 'restricted':
                return 'Dibatasi';
            default:
                return 'Aktif';
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Users" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Kelola data customer, lihat biodata, dan atur batasan akses akun.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama, email, telepon..."
                            className="bg-white pr-8 pl-9 dark:bg-gray-800"
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); handleSearch('', statusFilter); }}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="w-full sm:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                handleSearch(search, e.target.value);
                            }}
                            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-gray-800 dark:border-gray-700"
                        >
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="restricted">Dibatasi</option>
                            <option value="suspended">Dinonaktifkan</option>
                        </select>
                    </div>

                    {(search || statusFilter) && (
                        <Button
                            variant="ghost"
                            onClick={handleClear}
                            className="h-9 px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        >
                            Reset Filter
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">User</TableHead>
                            <TableHead>No. Telepon</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead className="text-center">Checkouts</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-gray-500"
                                >
                                    Tidak ada user ditemukan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.data.map((user) => {
                                const formattedDate = new Date(user.created_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });

                                return (
                                    <TableRow key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-75/50">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="h-10 w-10 rounded-full border object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700 dark:bg-green-950 dark:text-green-400">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-300">
                                            {user.phone || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(user.status)}`}>
                                                {getStatusLabel(user.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span>{formattedDate}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-medium">
                                            <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                <ShoppingCart className="h-3 w-3 text-gray-500" />
                                                {user.orders_count ?? 0}x
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3">
                                                        <Eye className="h-4 w-4" />
                                                        Detail
                                                    </Button>
                                                </Link>

                                                {/* QUICK STATUS ACTIONS */}
                                                {user.status !== 'active' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                                                        title="Aktifkan Kembali"
                                                        onClick={() => handleStatusChange(user.id, 'active')}
                                                    >
                                                        <UserCheck className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {user.status !== 'restricted' && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                                                                title="Batasi Akun"
                                                            >
                                                                <ShieldAlert className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Batasi Akun User?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    User <strong>{user.name}</strong> masih bisa login, namun tidak dapat menambahkan produk ke keranjang belanja atau memproses checkout.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleStatusChange(user.id, 'restricted')}
                                                                    className="bg-amber-600 hover:bg-amber-700"
                                                                >
                                                                    Batasi Akses
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}

                                                {user.status !== 'suspended' && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                                title="Nonaktifkan Sementara"
                                                            >
                                                                <Ban className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Nonaktifkan Sementara User?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    User <strong>{user.name}</strong> akan langsung dikeluarkan dari sesi aktif dan TIDAK bisa login kembali ke sistem sampai diaktifkan lagi.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleStatusChange(user.id, 'suspended')}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Nonaktifkan
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination data={users} />
        </AdminLayout>
    );
}
