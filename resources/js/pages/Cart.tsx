import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Button } from '@/components/ui/button'; // Asumsi Anda punya komponen Button dari shadcn/ui
import { Checkbox } from '@/components/ui/checkbox'; // Asumsi Anda punya komponen Checkbox dari shadcn/ui
import { Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type CartItemType = {
    id: number;
    quantity: number;
    product_id: number;
    name: string;
    slug: string;
    image: string;
    price: number;
    price_formatted: string;
    stock: number;
    store_name: string;
};

export default function Cart({
    cartItems = [],
}: {
    cartItems: CartItemType[];
}) {
    const [selectedItems, setSelectedItems] = useState<number[]>(
        cartItems.map((item) => item.id), // Default pilih semua
    );

    const handleSelectItem = (itemId: number, checked: boolean) => {
        setSelectedItems((prev) =>
            checked ? [...prev, itemId] : prev.filter((id) => id !== itemId),
        );
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? cartItems.map((item) => item.id) : []);
    };

    const isAllSelected =
        cartItems.length > 0 && selectedItems.length === cartItems.length;

    const summary = useMemo(() => {
        const itemsToSummarize = cartItems.filter((item) =>
            selectedItems.includes(item.id),
        );

        const totalItems = itemsToSummarize.reduce(
            (sum, item) => sum + item.quantity,
            0,
        );
        const totalPrice = itemsToSummarize.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );

        return {
            totalItems,
            totalPrice,
            totalPriceFormatted: new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
            }).format(totalPrice),
        };
    }, [selectedItems, cartItems]);

    const handleQuantityChange = (cartId: number, newQuantity: number) => {
        router.patch(
            `/cart/update/${cartId}`,
            { quantity: newQuantity },
            { preserveScroll: true },
        );
    };

    const handleRemoveItem = (cartId: number) => {
        router.delete(`/cart/remove/${cartId}`, {
            preserveScroll: true,
        });
    };

    const handleCheckout = () => {
        router.post('/checkout', {
            cart_items: selectedItems,
        });
    };

    return (
        <>
            <Head title="Keranjang Belanja" />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
                <NavMain />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    <h1 className="mb-6 text-2xl font-bold">Keranjang</h1>

                    {cartItems.length === 0 ? (
                        <div className="rounded-lg border bg-white p-12 text-center dark:bg-[#1A1A19]">
                            <h2 className="text-xl font-semibold">
                                Keranjangmu kosong
                            </h2>
                            <p className="mt-2 text-gray-500">
                                Yuk, isi dengan barang-barang impianmu!
                            </p>
                            <Link href="/products">
                                <Button className="mt-6 bg-green-600 hover:bg-green-700">
                                    Mulai Belanja
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* DAFTAR ITEM */}
                            <div className="lg:col-span-2">
                                <div className="rounded-lg border bg-white p-4 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                    <div className="flex items-center border-b pb-3 dark:border-[#3E3E3A]">
                                        <Checkbox
                                            id="select-all"
                                            checked={isAllSelected}
                                            onCheckedChange={handleSelectAll}
                                            className="mr-4"
                                        />
                                        <label
                                            htmlFor="select-all"
                                            className="text-sm font-medium"
                                        >
                                            Pilih semua
                                        </label>
                                    </div>

                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 border-b py-4 dark:border-[#3E3E3A]"
                                        >
                                            <Checkbox
                                                checked={selectedItems.includes(
                                                    item.id,
                                                )}
                                                onCheckedChange={(checked) =>
                                                    handleSelectItem(
                                                        item.id,
                                                        !!checked,
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-20 w-20 rounded-md object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500">
                                                    {item.store_name}
                                                </p>
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="font-semibold hover:text-green-600"
                                                >
                                                    {item.name}
                                                </Link>
                                                <p className="mt-1 font-bold text-green-600">
                                                    {item.price_formatted}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() =>
                                                        handleRemoveItem(
                                                            item.id,
                                                        )
                                                    }
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                                                </button>
                                                <div className="flex items-center rounded-md border">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                item.quantity -
                                                                    1,
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity <= 1
                                                        }
                                                        className="px-2 py-1 disabled:cursor-not-allowed disabled:text-gray-300"
                                                    >
                                                        -
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={item.quantity}
                                                        readOnly
                                                        className="w-10 border-none bg-transparent text-center outline-none"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.id,
                                                                item.quantity +
                                                                    1,
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity >=
                                                            item.stock
                                                        }
                                                        className="px-2 py-1 disabled:cursor-not-allowed disabled:text-gray-300"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RINGKASAN BELANJA */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 rounded-lg border bg-white p-6 shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                    <h2 className="mb-4 text-lg font-semibold">
                                        Ringkasan Belanja
                                    </h2>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Total Harga ({summary.totalItems}{' '}
                                            barang)
                                        </span>
                                        <span>
                                            {summary.totalPriceFormatted}
                                        </span>
                                    </div>

                                    <div className="my-4 border-t dark:border-[#3E3E3A]" />

                                    <div className="flex justify-between font-bold">
                                        <span>Total Harga</span>
                                        <span className="text-green-600">
                                            {summary.totalPriceFormatted}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={selectedItems.length === 0}
                                        className="mt-6 w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
                                    >
                                        Beli ({selectedItems.length})
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <NavFooter />
            </div>
        </>
    );
}

// Anda mungkin perlu membuat komponen UI ini jika belum ada
// Contoh sederhana jika Anda tidak menggunakan library seperti shadcn/ui

/*
const Checkbox = ({ id, checked, onCheckedChange, className }) => (
    <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className={`h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 ${className}`}
    />
);

const Button = ({ children, onClick, disabled, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
        {children}
    </button>
);
*/
