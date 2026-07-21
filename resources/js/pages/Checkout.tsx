import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Check,
    CreditCard,
    ExternalLink,
    MapPin,
    Plus,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface CheckoutItem {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    stock: number;
}

interface Summary {
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
}

interface UserData {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
}

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
}

interface CheckoutProps {
    checkoutItems: CheckoutItem[];
    summary: Summary;
    user: UserData;
    addresses?: Address[];
}

export default function Checkout({
    checkoutItems,
    summary,
    user,
    addresses = [],
}: CheckoutProps) {
    const savedAddresses = addresses || [];
    const defaultAddress =
        savedAddresses.find((a) => a.is_default) || savedAddresses[0];

    const [selectedAddressId, setSelectedAddressId] = useState<number>(
        defaultAddress ? defaultAddress.id : 0,
    );
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        cart: checkoutItems.map((item) => ({
            id: item.product_id,
            quantity: item.quantity,
        })),
        shipping_address: {
            name: defaultAddress ? defaultAddress.name : user.name || '',
            email: user.email || '',
            phone: defaultAddress ? defaultAddress.phone : user.phone || '',
            address: defaultAddress ? defaultAddress.address : '',
            city: defaultAddress ? defaultAddress.city : '',
            province: defaultAddress ? defaultAddress.province : '',
            postal_code: defaultAddress ? defaultAddress.postal_code : '',
        },
        payment_method: 'bank_transfer',
        notes: '',
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleAddressChange = (key: keyof UserData, value: string) => {
        setData('shipping_address', {
            ...data.shipping_address,
            [key]: value,
        });
    };

    const handleSelectAddress = (id: number) => {
        setSelectedAddressId(id);
        const addr = savedAddresses.find((a) => a.id === id);
        if (addr) {
            setData('shipping_address', {
                ...data.shipping_address,
                name: addr.name,
                phone: addr.phone,
                address: addr.address,
                city: addr.city,
                province: addr.province,
                postal_code: addr.postal_code,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasAddresses = savedAddresses.length > 0;
        const hasPhone =
            data.shipping_address.phone &&
            data.shipping_address.phone.trim() !== '';
        const hasAddressText =
            data.shipping_address.address &&
            data.shipping_address.address.trim() !== '';

        if (!hasAddresses || !hasPhone || !hasAddressText) {
            setShowWarningModal(true);
            return;
        }

        post('/checkout/process');
    };

    return (
        <>
            <Head title="Checkout - Groceria" />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
                <NavMain />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            Checkout
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Selesaikan pembayaran untuk memproses pesanan Anda.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                    >
                        {/* LEFT COLUMN: Checkout Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Alamat Pengiriman */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-500">
                                    <MapPin className="h-5 w-5" />
                                    <h2 className="text-lg font-bold">
                                        Alamat Pengiriman
                                    </h2>
                                </div>

                                {savedAddresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* Selected Address Card with Change Option */}
                                        {(() => {
                                            const selectedAddr =
                                                savedAddresses.find(
                                                    (a) =>
                                                        a.id ===
                                                        selectedAddressId,
                                                ) || defaultAddress;
                                            if (!selectedAddr) return null;
                                            return (
                                                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="space-y-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="font-bold text-gray-900 dark:text-white">
                                                                    {
                                                                        selectedAddr.name
                                                                    }
                                                                </span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    (
                                                                    {
                                                                        selectedAddr.phone
                                                                    }
                                                                    )
                                                                </span>
                                                                {selectedAddr.is_default && (
                                                                    <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                        Utama
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowAddressModal(
                                                                    true,
                                                                )
                                                            }
                                                            className="rounded-lg border border-green-600 px-3 py-1.5 text-xs font-semibold text-green-600 transition hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/20"
                                                        >
                                                            Pilih Alamat Lain
                                                        </button>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                                        {selectedAddr.address}
                                                    </p>
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {selectedAddr.city},{' '}
                                                        {selectedAddr.province},{' '}
                                                        {
                                                            selectedAddr.postal_code
                                                        }
                                                    </p>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400">
                                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
                                            <div>
                                                <p className="font-bold">
                                                    Alamat & Nomor HP Belum
                                                    Lengkap
                                                </p>
                                                <p className="mt-1">
                                                    Anda belum mengisi nomor HP
                                                    atau alamat pengiriman.
                                                    Untuk dapat berbelanja, Anda
                                                    wajib melengkapinya terlebih
                                                    dahulu.
                                                </p>
                                                <Link
                                                    href="/user-profile?section=profil&tab=Daftar+Alamat"
                                                    className="mt-2 inline-flex items-center gap-1 font-bold text-green-600 hover:underline"
                                                >
                                                    Lengkapi Sekarang{' '}
                                                    <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Metode Pembayaran */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-500">
                                    <CreditCard className="h-5 w-5" />
                                    <h2 className="text-lg font-bold">
                                        Metode Pembayaran
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Bank Transfer */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-[#252523] ${
                                            data.payment_method ===
                                            'bank_transfer'
                                                ? 'border-green-600 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20'
                                                : 'border-gray-200 dark:border-[#2A2A28]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="bank_transfer"
                                            checked={
                                                data.payment_method ===
                                                'bank_transfer'
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'payment_method',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                Transfer Bank
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Konfirmasi manual atau otomatis
                                                via Virtual Account.
                                            </p>
                                        </div>
                                    </label>

                                    {/* E-wallet */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-[#252523] ${
                                            data.payment_method === 'ewallet'
                                                ? 'border-green-600 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20'
                                                : 'border-gray-200 dark:border-[#2A2A28]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="ewallet"
                                            checked={
                                                data.payment_method ===
                                                'ewallet'
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'payment_method',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                E-Wallet
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Gunakan ShopeePay, GoPay, OVO,
                                                atau DANA.
                                            </p>
                                        </div>
                                    </label>

                                    {/* Credit Card */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-[#252523] ${
                                            data.payment_method ===
                                            'credit_card'
                                                ? 'border-green-600 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20'
                                                : 'border-gray-200 dark:border-[#2A2A28]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="credit_card"
                                            checked={
                                                data.payment_method ===
                                                'credit_card'
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'payment_method',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                Kartu Kredit / Debit
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Mendukung kartu berlogo Visa,
                                                Mastercard, atau JCB.
                                            </p>
                                        </div>
                                    </label>

                                    {/* COD */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-[#252523] ${
                                            data.payment_method === 'cod'
                                                ? 'border-green-600 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20'
                                                : 'border-gray-200 dark:border-[#2A2A28]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={
                                                data.payment_method === 'cod'
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'payment_method',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">
                                                Bayar di Tempat (COD)
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Bayar tunai langsung saat kurir
                                                mengantar pesanan.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {errors.payment_method && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.payment_method}
                                    </p>
                                )}
                            </div>

                            {/* Catatan Tambahan */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-2">
                                    <Label
                                        htmlFor="notes"
                                        className="text-sm font-semibold"
                                    >
                                        Catatan untuk Penjual (Opsional)
                                    </Label>
                                </div>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Contoh: Tolong bungkus yang rapi ya, kirim sebelum jam 3 sore."
                                    className="min-h-[60px] dark:border-[#3E3E3A] dark:bg-[#252523]"
                                />
                                {errors.notes && (
                                    <p className="text-xs text-red-500">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <h2 className="mb-4 border-b pb-3 text-lg font-bold dark:border-[#2A2A28]">
                                    Ringkasan Belanja
                                </h2>

                                {/* Product List */}
                                <div className="mb-6 max-h-[220px] space-y-4 overflow-y-auto pr-1">
                                    {checkoutItems.map((item) => (
                                        <div
                                            key={item.product_id}
                                            className="flex gap-3 text-sm"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-14 w-14 rounded-lg border object-cover dark:border-[#3E3E3A]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className="truncate font-semibold text-gray-800 dark:text-gray-200"
                                                    title={item.name}
                                                >
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.quantity} x{' '}
                                                    {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <div className="text-right font-semibold">
                                                {formatCurrency(
                                                    item.price * item.quantity,
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing details */}
                                <div className="space-y-3 border-t pt-4 text-sm dark:border-[#2A2A28]">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>
                                            Total Harga (
                                            {checkoutItems.reduce(
                                                (acc, i) => acc + i.quantity,
                                                0,
                                            )}{' '}
                                            Barang)
                                        </span>
                                        <span>
                                            {formatCurrency(summary.subtotal)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Ongkos Kirim (Flat)</span>
                                        <span>
                                            {formatCurrency(
                                                summary.shippingCost,
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Pajak (PPN 11%)</span>
                                        <span>
                                            {formatCurrency(summary.tax)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-3 text-lg font-extrabold text-green-600 dark:border-[#2A2A28] dark:text-green-500">
                                        <span>Total Belanja</span>
                                        <span>
                                            {formatCurrency(summary.total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Safety Info */}
                                <div className="mt-6 flex items-start gap-2 rounded-lg border border-green-100 bg-green-50/50 p-3 text-xs text-green-700 dark:border-green-950/20 dark:bg-green-950/10 dark:text-green-400">
                                    <ShieldCheck className="h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
                                    <p>
                                        Transaksi Anda dilindungi. Pembayaran
                                        dijamin aman melalui enkripsi data
                                        sistem Groceria.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 w-full rounded-lg bg-green-600 py-3 font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Memproses Pesanan...'
                                        : 'Buat Pesanan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </main>

                {/* WARNING MODAL DATA BELUM LENGKAP */}
                {showWarningModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:border dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                            {/* Warning Icon & Body */}
                            <div className="space-y-4 p-6 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-500">
                                    <AlertCircle className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Data Alamat & No. HP Belum Lengkap!
                                </h3>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                    Untuk dapat melakukan checkout, Anda wajib
                                    melengkapi alamat pengiriman dan nomor HP
                                    terlebih dahulu di halaman profil Anda.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col justify-end gap-3 border-t bg-gray-50 px-6 py-4 sm:flex-row dark:border-[#3E3E3A] dark:bg-[#252523]">
                                <button
                                    type="button"
                                    onClick={() => setShowWarningModal(false)}
                                    className="w-full rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#1A1A19]"
                                >
                                    Batal
                                </button>
                                <Link
                                    href="/user-profile?section=profil&tab=Daftar+Alamat"
                                    className="block w-full rounded-lg bg-green-600 px-6 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
                                >
                                    Lengkapi Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL PILIH ALAMAT LAIN */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:border dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b px-6 py-4 dark:border-[#3E3E3A]">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Pilih Alamat Pengiriman
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#252523] dark:hover:text-gray-200"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Body: List of saved addresses */}
                            <div className="max-h-[50vh] space-y-3 overflow-y-auto p-6">
                                {savedAddresses.map((addr) => {
                                    const isSelected =
                                        addr.id === selectedAddressId;
                                    return (
                                        <div
                                            key={addr.id}
                                            onClick={() => {
                                                handleSelectAddress(addr.id);
                                                setShowAddressModal(false);
                                            }}
                                            className={`group relative cursor-pointer rounded-xl border p-4 transition-all hover:border-green-500 hover:bg-green-50/5 ${
                                                isSelected
                                                    ? 'border-green-600 bg-green-50/10 dark:border-green-500 dark:bg-green-950/5'
                                                    : 'border-gray-200 bg-white dark:border-[#3E3E3A] dark:bg-[#252523]'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-bold text-gray-900 transition-colors group-hover:text-green-600 dark:text-white dark:group-hover:text-green-400">
                                                            {addr.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            ({addr.phone})
                                                        </span>
                                                        {addr.is_default && (
                                                            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                Utama
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                                                        {addr.address}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                                        {addr.city},{' '}
                                                        {addr.province},{' '}
                                                        {addr.postal_code}
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white dark:bg-green-500">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4 dark:border-[#3E3E3A] dark:bg-[#252523]">
                                <Link
                                    href="/user-profile?section=profil&tab=Daftar+Alamat"
                                    className="flex items-center gap-1 text-xs font-semibold text-green-600 hover:underline dark:text-green-400"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Kelola / Tambah Alamat Baru
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressModal(false)}
                                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-[#1A1A19] dark:text-gray-300 dark:hover:bg-[#252523]"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <NavFooter />
            </div>
        </>
    );
}
