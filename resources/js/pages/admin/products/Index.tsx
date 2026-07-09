import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Head, Link, router } from '@inertiajs/react';
import { type Brand, type Category, type PaginatedData, type Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Edit, PlusCircle, Trash2, Search, X } from 'lucide-react';
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
import { DataTablePagination } from '@/components/data-table-pagination';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface ProductIndexProps {
    products: PaginatedData<Product & { category: Category; brand: Brand }>;
    filters: {
        search?: string;
    };
}

export default function Index({ products, filters }: ProductIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleDelete = (id: number) => {
        router.delete(`/admin/products/${id}`);
    };

    const handleSearch = (value: string) => {
        router.get(
            '/admin/products',
            { search: value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                handleSearch(search);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleClear = () => {
        setSearch('');
        handleSearch('');
    };

    return (
        <AdminLayout>
            <Head title="Manage Products" />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/admin/products/create">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <div className="mt-6 flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products by name, SKU, category..."
                        className="pl-9 pr-8 bg-white dark:bg-gray-800"
                    />
                    {search && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img src={product.image ?? '/images/placeholder.png'} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>
                                    <Badge variant={product.is_active ? 'default' : 'destructive'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>Rp{Number(product.price).toLocaleString('id-ID')}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.category?.name}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="outline" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the product.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination data={products} />
        </AdminLayout>
    );
}
