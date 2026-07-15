import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { CreditCard, Truck, Wallet, ShieldCheck, MapPin } from 'lucide-react';

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

interface CheckoutProps {
    checkoutItems: CheckoutItem[];
    summary: Summary;
    user: UserData;
}

export default function Checkout({ checkoutItems, summary, user }: CheckoutProps) {
    const { data, setData, post, processing, errors } = useForm({
        cart: checkoutItems.map((item) => ({
            id: item.product_id,
            quantity: item.quantity,
        })),
        shipping_address: {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            province: user.province || '',
            postal_code: user.postal_code || '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout/process');
    };

    return (
        <>
            <Head title="Checkout - Groceria" />
            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-gray-100">
                <NavMain />

                <main className="mx-auto max-w-6xl px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Selesaikan pembayaran untuk memproses pesanan Anda.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* LEFT COLUMN: Checkout Form */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Alamat Pengiriman */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-500">
                                    <MapPin className="h-5 w-5" />
                                    <h2 className="text-lg font-bold">Alamat Pengiriman</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="name">Nama Penerima</Label>
                                        <Input
                                            id="name"
                                            value={data.shipping_address.name}
                                            onChange={(e) => handleAddressChange('name', e.target.value)}
                                            required
                                            className="dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.name'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.name']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="phone">Nomor Telepon</Label>
                                        <Input
                                            id="phone"
                                            value={data.shipping_address.phone}
                                            onChange={(e) => handleAddressChange('phone', e.target.value)}
                                            required
                                            placeholder="Contoh: 08123456789"
                                            className="dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.phone'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.phone']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.shipping_address.email}
                                            onChange={(e) => handleAddressChange('email', e.target.value)}
                                            required
                                            className="dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.email'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.email']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <Label htmlFor="address">Alamat Lengkap</Label>
                                        <Textarea
                                            id="address"
                                            value={data.shipping_address.address}
                                            onChange={(e) => handleAddressChange('address', e.target.value)}
                                            required
                                            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                                            className="min-h-[80px] dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.address'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.address']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="city">Kota / Kabupaten</Label>
                                        <Input
                                            id="city"
                                            value={data.shipping_address.city}
                                            onChange={(e) => handleAddressChange('city', e.target.value)}
                                            required
                                            className="dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.city'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.city']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="province">Provinsi</Label>
                                        <Input
                                            id="province"
                                            value={data.shipping_address.province}
                                            onChange={(e) => handleAddressChange('province', e.target.value)}
                                            required
                                            className="dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.province'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.province']}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="postal_code">Kode Pos</Label>
                                        <Input
                                            id="postal_code"
                                            value={data.shipping_address.postal_code}
                                            onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                                            required
                                            className="dark:bg-[#252523] dark:border-[#3E3E3A]"
                                        />
                                        {errors['shipping_address.postal_code'] && (
                                            <p className="text-xs text-red-500">{errors['shipping_address.postal_code']}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Metode Pembayaran */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-4 flex items-center gap-2 text-green-600 dark:text-green-500">
                                    <CreditCard className="h-5 w-5" />
                                    <h2 className="text-lg font-bold">Metode Pembayaran</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Bank Transfer */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-[#252523] ${
                                            data.payment_method === 'bank_transfer'
                                                ? 'border-green-600 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20'
                                                : 'border-gray-200 dark:border-[#2A2A28]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="bank_transfer"
                                            checked={data.payment_method === 'bank_transfer'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">Transfer Bank</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Konfirmasi manual atau otomatis via Virtual Account.
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
                                            checked={data.payment_method === 'ewallet'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">E-Wallet</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Gunakan ShopeePay, GoPay, OVO, atau DANA.
                                            </p>
                                        </div>
                                    </label>

                                    {/* Credit Card */}
                                    <label
                                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-[#252523] ${
                                            data.payment_method === 'credit_card'
                                                ? 'border-green-600 bg-green-50/50 dark:border-green-500 dark:bg-green-950/20'
                                                : 'border-gray-200 dark:border-[#2A2A28]'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="credit_card"
                                            checked={data.payment_method === 'credit_card'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">Kartu Kredit / Debit</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Mendukung kartu berlogo Visa, Mastercard, atau JCB.
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
                                            checked={data.payment_method === 'cod'}
                                            onChange={(e) => setData('payment_method', e.target.value)}
                                            className="mt-1 accent-green-600"
                                        />
                                        <div>
                                            <p className="font-semibold">Bayar di Tempat (COD)</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Bayar tunai langsung saat kurir mengantar pesanan.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                                {errors.payment_method && (
                                    <p className="mt-2 text-xs text-red-500">{errors.payment_method}</p>
                                )}
                            </div>

                            {/* Catatan Tambahan */}
                            <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <div className="mb-2">
                                    <Label htmlFor="notes" className="text-sm font-semibold">Catatan untuk Penjual (Opsional)</Label>
                                </div>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Contoh: Tolong bungkus yang rapi ya, kirim sebelum jam 3 sore."
                                    className="min-h-[60px] dark:bg-[#252523] dark:border-[#3E3E3A]"
                                />
                                {errors.notes && (
                                    <p className="text-xs text-red-500">{errors.notes}</p>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-xl border bg-white p-6 shadow-sm dark:border-[#2A2A28] dark:bg-[#1A1A19]">
                                <h2 className="mb-4 text-lg font-bold border-b pb-3 dark:border-[#2A2A28]">Ringkasan Belanja</h2>

                                {/* Product List */}
                                <div className="mb-6 max-h-[220px] overflow-y-auto pr-1 space-y-4">
                                    {checkoutItems.map((item) => (
                                        <div key={item.product_id} className="flex gap-3 text-sm">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-14 w-14 rounded-lg object-cover border dark:border-[#3E3E3A]"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={item.name}>
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.quantity} x {formatCurrency(item.price)}
                                                </p>
                                            </div>
                                            <div className="font-semibold text-right">
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing details */}
                                <div className="space-y-3 text-sm border-t pt-4 dark:border-[#2A2A28]">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Total Harga ({checkoutItems.reduce((acc, i) => acc + i.quantity, 0)} Barang)</span>
                                        <span>{formatCurrency(summary.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Ongkos Kirim (Flat)</span>
                                        <span>{formatCurrency(summary.shippingCost)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Pajak (PPN 11%)</span>
                                        <span>{formatCurrency(summary.tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-extrabold border-t pt-3 dark:border-[#2A2A28] text-green-600 dark:text-green-500">
                                        <span>Total Belanja</span>
                                        <span>{formatCurrency(summary.total)}</span>
                                    </div>
                                </div>

                                {/* Safety Info */}
                                <div className="mt-6 flex items-start gap-2 rounded-lg bg-green-50/50 p-3 text-xs text-green-700 dark:bg-green-950/10 dark:text-green-400 border border-green-100 dark:border-green-950/20">
                                    <ShieldCheck className="h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
                                    <p>
                                        Transaksi Anda dilindungi. Pembayaran dijamin aman melalui enkripsi data sistem Groceria.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Memproses Pesanan...' : 'Buat Pesanan'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </main>

                <NavFooter />
            </div>
        </>
    );
}
