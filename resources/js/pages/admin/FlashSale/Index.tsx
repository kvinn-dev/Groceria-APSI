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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { type Category, type Product } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertCircle, Calendar, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface FlashSale {
    id: number;
    product_id: number;
    original_price: number;
    discounted_price: number;
    discount_percentage: number;
    stock_limit: number;
    sold_count: number;
    start_time: string;
    end_time: string;
    is_active: number | boolean;
    product?: Product & { category?: Category };
}

interface FlashSaleIndexProps {
    flashSales: FlashSale[];
    products: Product[];
}

export default function Index({
    flashSales = [],
    products = [],
}: FlashSaleIndexProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentFs, setCurrentFs] = useState<FlashSale | null>(null);

    // Form hooks from Inertia
    const addForm = useForm({
        product_id: '',
        discount_percentage: 10,
        start_time: '',
        end_time: '',
        stock_limit: 10,
        is_active: true,
    });

    const editForm = useForm({
        discount_percentage: 10,
        start_time: '',
        end_time: '',
        stock_limit: 10,
        is_active: true,
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/admin/flash-sale', {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentFs) return;
        editForm.put(`/admin/flash-sale/${currentFs.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                setCurrentFs(null);
                editForm.reset();
            },
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/flash-sale/${id}`);
    };

    const openEdit = (fs: FlashSale) => {
        setCurrentFs(fs);
        // Format ISO datetime local format: YYYY-MM-DDTHH:MM
        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            const pad = (num: number) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        editForm.setData({
            discount_percentage: fs.discount_percentage,
            start_time: formatDate(fs.start_time),
            end_time: formatDate(fs.end_time),
            stock_limit: fs.stock_limit,
            is_active: Boolean(fs.is_active),
        });
        setIsEditOpen(true);
    };

    // Helper to format currency
    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate discounted price dynamically
    const selectedProductToAdd = products.find(
        (p) => p.id === Number(addForm.data.product_id),
    );
    const calculatedAddPrice = selectedProductToAdd
        ? Number(selectedProductToAdd.price) *
          (1 - addForm.data.discount_percentage / 100)
        : 0;

    const calculatedEditPrice = currentFs
        ? Number(currentFs.product?.price ?? currentFs.original_price) *
          (1 - editForm.data.discount_percentage / 100)
        : 0;

    return (
        <AdminLayout>
            <Head title="Manage Flash Sales" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-bold">
                        Flash Sales
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage limited time flash sales discount campaigns.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-green-600 text-white hover:bg-green-700"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Flash Sale
                </Button>
            </div>

            {/* List Table */}
            <div className="mt-6 rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50 dark:bg-gray-900/50">
                            <TableHead className="w-[100px]">
                                Product Image
                            </TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Discount Info</TableHead>
                            <TableHead>Stock (Sold / Limit)</TableHead>
                            <TableHead>Active Period</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {flashSales.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="py-10 text-center text-gray-500"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <AlertCircle className="h-8 w-8 text-gray-400" />
                                        <span>
                                            No flash sales scheduled. Click "Add
                                            Flash Sale" to start.
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            flashSales.map((fs) => {
                                const now = new Date();
                                const start = new Date(fs.start_time);
                                const end = new Date(fs.end_time);

                                let timeStatus = 'Upcoming';
                                let statusVariant:
                                    | 'default'
                                    | 'destructive'
                                    | 'secondary'
                                    | 'outline' = 'secondary';

                                if (now >= start && now <= end) {
                                    timeStatus = 'Ongoing';
                                    statusVariant = 'default'; // Green / Active
                                } else if (now > end) {
                                    timeStatus = 'Ended';
                                    statusVariant = 'destructive';
                                }

                                const productPrice = Number(
                                    fs.product?.price ?? fs.original_price,
                                );
                                const discountPrice = Number(
                                    fs.discounted_price,
                                );

                                return (
                                    <TableRow
                                        key={fs.id}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                                    >
                                        <TableCell>
                                            <img
                                                src={
                                                    fs.product?.image_url ||
                                                    '/images/placeholder.png'
                                                }
                                                alt={
                                                    fs.product?.name ||
                                                    'Product'
                                                }
                                                className="h-12 w-12 rounded-md border object-cover dark:border-gray-700"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {fs.product?.name ||
                                                    'Deleted Product'}
                                            </div>
                                            <div className="mt-0.5 text-xs text-gray-500">
                                                {fs.product?.category?.name ||
                                                    'No Category'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-amber-500 font-bold text-white">
                                                    -{fs.discount_percentage}%
                                                </Badge>
                                                <div>
                                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {formatRupiah(
                                                            discountPrice,
                                                        )}
                                                    </span>
                                                    <span className="block text-xs text-gray-400 line-through">
                                                        {formatRupiah(
                                                            productPrice,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">
                                                {fs.sold_count} /{' '}
                                                {fs.stock_limit}
                                            </div>
                                            <div className="mt-1 h-1.5 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
                                                <div
                                                    className="h-1.5 rounded-full bg-amber-500"
                                                    style={{
                                                        width: `${Math.min(100, (fs.sold_count / fs.stock_limit) * 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                <span>
                                                    Start:{' '}
                                                    {start.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    End:{' '}
                                                    {end.toLocaleString(
                                                        'id-ID',
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-start gap-1">
                                                <Badge
                                                    variant={
                                                        fs.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                    className={
                                                        fs.is_active
                                                            ? 'bg-emerald-500 text-white'
                                                            : ''
                                                    }
                                                >
                                                    {fs.is_active
                                                        ? 'Active'
                                                        : 'Disabled'}
                                                </Badge>
                                                <Badge variant={statusVariant}>
                                                    {timeStatus}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    onClick={() => openEdit(fs)}
                                                    variant="outline"
                                                    size="icon"
                                                    className="hover:border-amber-500 hover:text-amber-500"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="hover:bg-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="dark:border-gray-700 dark:bg-gray-800">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="dark:text-white">
                                                                Remove Flash
                                                                Sale?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription className="dark:text-gray-400">
                                                                This action will
                                                                permanently
                                                                delete the flash
                                                                sale campaign
                                                                for this
                                                                product. Product
                                                                pricing will
                                                                return to
                                                                normal.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="dark:bg-gray-700 dark:text-white">
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        fs.id,
                                                                    )
                                                                }
                                                                className="bg-red-600 text-white hover:bg-red-700"
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

            {/* ADD FLASH SALE MODAL */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 duration-200 fade-in">
                    <div className="relative w-full max-w-lg animate-in rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-200 zoom-in-95 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 flex items-center gap-2 border-b pb-2 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                            <PlusCircle className="h-5 w-5 text-green-500" />
                            Create Flash Sale
                        </h2>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select Product
                                </label>
                                <select
                                    value={addForm.data.product_id}
                                    onChange={(e) =>
                                        addForm.setData(
                                            'product_id',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    required
                                >
                                    <option value="">
                                        -- Choose Product --
                                    </option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} (
                                            {formatRupiah(Number(p.price))})
                                        </option>
                                    ))}
                                </select>
                                {addForm.errors.product_id && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {addForm.errors.product_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={addForm.data.discount_percentage}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'discount_percentage',
                                                Math.max(
                                                    1,
                                                    Math.min(
                                                        99,
                                                        Number(e.target.value),
                                                    ),
                                                ),
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {addForm.errors.discount_percentage && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {addForm.errors.discount_percentage}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Stock Limit
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={addForm.data.stock_limit}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'stock_limit',
                                                Math.max(
                                                    1,
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {addForm.errors.stock_limit && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {addForm.errors.stock_limit}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {selectedProductToAdd && (
                                <div className="space-y-1.5 rounded-lg border bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Original Price:
                                        </span>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                                            {formatRupiah(
                                                Number(
                                                    selectedProductToAdd.price,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Discounted Price:
                                        </span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            {formatRupiah(calculatedAddPrice)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={addForm.data.start_time}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {addForm.errors.start_time && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {addForm.errors.start_time}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        End Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={addForm.data.end_time}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'end_time',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {addForm.errors.end_time && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {addForm.errors.end_time}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="add_is_active"
                                    checked={addForm.data.is_active}
                                    onChange={(e) =>
                                        addForm.setData(
                                            'is_active',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <label
                                    htmlFor="add_is_active"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Set Active Immediately
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t pt-4 dark:border-gray-700">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddOpen(false)}
                                    disabled={addForm.processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    disabled={addForm.processing}
                                >
                                    {addForm.processing
                                        ? 'Creating...'
                                        : 'Create Campaign'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT FLASH SALE MODAL */}
            {isEditOpen && currentFs && (
                <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/50 p-4 duration-200 fade-in">
                    <div className="relative w-full max-w-lg animate-in rounded-xl border border-gray-200 bg-white p-6 shadow-lg duration-200 zoom-in-95 dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 flex items-center gap-2 border-b pb-2 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                            <Edit className="h-5 w-5 text-amber-500" />
                            Edit Flash Sale: {currentFs.product?.name}
                        </h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={
                                            editForm.data.discount_percentage
                                        }
                                        onChange={(e) =>
                                            editForm.setData(
                                                'discount_percentage',
                                                Math.max(
                                                    1,
                                                    Math.min(
                                                        99,
                                                        Number(e.target.value),
                                                    ),
                                                ),
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {editForm.errors.discount_percentage && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {
                                                editForm.errors
                                                    .discount_percentage
                                            }
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Stock Limit
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.data.stock_limit}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'stock_limit',
                                                Math.max(
                                                    1,
                                                    Number(e.target.value),
                                                ),
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {editForm.errors.stock_limit && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {editForm.errors.stock_limit}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5 rounded-lg border bg-gray-50 p-3 text-xs dark:border-gray-700 dark:bg-gray-900">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Original Price:
                                    </span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {formatRupiah(
                                            Number(
                                                currentFs.product?.price ??
                                                    currentFs.original_price,
                                            ),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        New Discounted Price:
                                    </span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        {formatRupiah(calculatedEditPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Start Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.data.start_time}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'start_time',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {editForm.errors.start_time && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {editForm.errors.start_time}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        End Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editForm.data.end_time}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'end_time',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        required
                                    />
                                    {editForm.errors.end_time && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {editForm.errors.end_time}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="edit_is_active"
                                    checked={editForm.data.is_active}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'is_active',
                                            e.target.checked,
                                        )
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <label
                                    htmlFor="edit_is_active"
                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Set Active
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t pt-4 dark:border-gray-700">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setCurrentFs(null);
                                    }}
                                    disabled={editForm.processing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    disabled={editForm.processing}
                                >
                                    {editForm.processing
                                        ? 'Saving...'
                                        : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
