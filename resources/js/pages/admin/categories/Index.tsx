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
import { type Category, type PaginatedData } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Edit,
    Folder,
    FolderTree,
    PlusCircle,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface CategoryIndexProps {
    categories: PaginatedData<Category>;
    filters?: {
        search?: string;
    };
}

export default function Index({
    categories,
    filters = {},
}: CategoryIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleDelete = (id: number) => {
        router.delete(`/admin/categories/${id}`);
    };

    const handleSearch = (value: string) => {
        router.get(
            '/admin/categories',
            { search: value },
            {
                preserveState: true,
                replace: true,
            },
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
            <Head title="Manage Categories" />
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link href="/admin/categories/create">
                    <Button className="bg-green-600 text-white hover:bg-green-700">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            <div className="mt-6 flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search categories..."
                        className="bg-white pr-8 pl-9 dark:bg-gray-800"
                    />
                    {search && (
                        <button
                            onClick={handleClear}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
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
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Parent Category</TableHead>
                            <TableHead>Products</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-8 text-center text-gray-500"
                                >
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.data.map((category) => {
                                const imageUrl = category.image
                                    ? category.image.startsWith('http')
                                        ? category.image
                                        : `/storage/${category.image}`
                                    : null;

                                return (
                                    <TableRow key={category.id}>
                                        <TableCell>
                                            {imageUrl ? (
                                                <img
                                                    src={imageUrl}
                                                    alt={category.name}
                                                    className="h-10 w-10 rounded-md border object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400 dark:bg-gray-700">
                                                    <Folder className="h-5 w-5" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {category.parent_id && (
                                                    <FolderTree className="h-4 w-4 text-gray-400" />
                                                )}
                                                <span>{category.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-500">
                                            {category.slug}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-gray-500">
                                            {category.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {category.parent ? (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                                    {category.parent.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                {category.products_count ?? 0}{' '}
                                                products
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/categories/${category.id}/edit`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Are you sure?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This action
                                                                cannot be
                                                                undone. This
                                                                will permanently
                                                                delete the
                                                                category.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        category.id,
                                                                    )
                                                                }
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination data={categories} />
        </AdminLayout>
    );
}
