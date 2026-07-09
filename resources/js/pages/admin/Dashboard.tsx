import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import { Package, FolderOpen, ShoppingCart, PlusCircle, ArrowRight, Shield } from 'lucide-react';

interface DashboardProps {
    stats: {
        total_products: number;
        total_categories: number;
        total_orders: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-8">
                {/* Welcome banner */}
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white shadow-md">
                    <div className="absolute -right-10 -top-10 text-emerald-800 opacity-20">
                        <Shield className="h-40 w-40" />
                    </div>
                    <div className="relative z-10 space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang di Admin Panel</h1>
                        <p className="text-emerald-100 max-w-xl">
                            Kelola produk, kategori, dan pesanan toko e-commerce Anda dengan cepat dan mudah melalui panel ini.
                        </p>
                    </div>
                </div>

                {/* Stats cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Produk</CardTitle>
                            <div className="rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                <Package className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_products}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Produk terdaftar di toko</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Kategori</CardTitle>
                            <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                <FolderOpen className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_categories}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Kategori pembagian produk</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pesanan</CardTitle>
                            <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pesanan masuk dari pelanggan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Shortcuts & Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Aksi Cepat Produk</CardTitle>
                            <CardDescription>Tambah produk baru atau kelola daftar produk yang ada.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Link href="/admin/products/create">
                                <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Tambah Produk Baru
                                </Button>
                            </Link>
                            <Link href="/admin/products">
                                <Button variant="outline" className="w-full justify-between">
                                    <span>Lihat Semua Produk</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Keamanan & Batasan Akses</CardTitle>
                            <CardDescription>Status hak akses dan pembagian peran akun admin.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300">
                                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                                    <Shield className="h-4 w-4 text-green-600" />
                                    Akses Administrator Aktif
                                </div>
                                Akun Anda terverifikasi sebagai administrator. Anda hanya diizinkan untuk mengakses dashboard admin, produk, kategori, dan pesanan, serta tidak diperkenankan mengakses halaman toko konsumen.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
