import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
    Calendar,
    Clock,
    CreditCard,
    DollarSign,
    Edit,
    Eye,
    MapPin,
    Plus,
    ShoppingBag,
    Trash2,
    Wallet,
    Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    birth_date?: string;
    gender?: string;
};

interface OrderItem {
    id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
    product?: {
        image_url: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    payment_method: string;
    created_at: string;
    items: OrderItem[];
}

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
        className={`h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const BioRow = ({
    label,
    value,
    action,
    badge,
    onClick,
}: {
    label: string;
    value: string;
    action?: string;
    badge?: string;
    onClick?: () => void;
}) => (
    <div className="mb-3 flex items-center justify-between">
        <span className="w-40 text-gray-700 dark:text-gray-300">{label}</span>

        <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">{value}</span>

            {badge && (
                <span className="rounded bg-green-100 px-1 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {badge}
                </span>
            )}

            {action && (
                <button
                    onClick={onClick}
                    className="font-semibold text-green-600 hover:underline"
                >
                    {action}
                </button>
            )}
        </div>
    </div>
);

type SectionKey = 'profil' | 'inbox' | 'pembelian';

const SECTION_TABS = {
    profil: [
        'Biodata Diri',
        'Daftar Alamat',
        'Pembayaran',
        'Rekening Bank',
        'Mode Tampilan',
        'Keamanan',
    ],
    inbox: ['Notifikasi', 'Chat'],
    pembelian: ['Menunggu Pembayaran', 'Daftar Transaksi'],
} as const;

const TabBiodata = ({
    user,
    onOpenEditModal,
    onUploadAvatar,
    avatarError,
}: {
    user: User;
    onOpenEditModal: () => void;
    onUploadAvatar: (file: File) => void;
    avatarError?: string;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUploadAvatar(file);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
            {/* LEFT */}
            <div>
                {/* PHOTO CARD */}
                <div className="mb-6 space-y-2 rounded-sm border bg-white p-3 shadow-sm dark:border-[#3E3E3A] dark:bg-[#252523]">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#1A1A19]">
                        <Avatar className="h-full w-full">
                            <AvatarImage
                                src={user.avatar || undefined}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                            <AvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-3xl font-bold text-gray-500 dark:bg-[#1A1A19] dark:text-white">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="block w-full cursor-pointer rounded-sm border py-1.5 text-center text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#1A1A19]"
                    >
                        Pilih Foto
                    </button>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                        Besar file maksimum 10 MB
                        <br />
                        JPG, JPEG, PNG
                    </p>

                    {avatarError && (
                        <p className="mt-1 text-center text-xs font-semibold text-red-500">
                            {avatarError}
                        </p>
                    )}
                </div>

                {/* BUTTON GROUP */}
                <div className="space-y-1">
                    <button className="w-full rounded-sm border py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]">
                        Buat Kata Sandi
                    </button>

                    <button className="w-full rounded-sm border py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]">
                        PIN Groceria
                    </button>

                    <button className="w-full rounded-sm border py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]">
                        Verifikasi Instan
                    </button>
                </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-6 py-2 text-sm">
                <div>
                    <h3 className="mb-4 border-b pb-2 text-lg font-bold dark:border-[#3E3E3A]">
                        Ubah Biodata Diri
                    </h3>

                    <BioRow
                        label="Nama"
                        value={user.name}
                        action="Ubah"
                        onClick={onOpenEditModal}
                    />
                    <BioRow
                        label="Tanggal Lahir"
                        value={user.birth_date || 'Tambah Tanggal Lahir'}
                        action={user.birth_date ? 'Ubah' : 'Tambah'}
                        onClick={onOpenEditModal}
                    />
                    <BioRow
                        label="Jenis Kelamin"
                        value={user.gender || 'Tambah Jenis Kelamin'}
                        action={user.gender ? 'Ubah' : 'Tambah'}
                        onClick={onOpenEditModal}
                    />
                </div>

                <div>
                    <h3 className="mb-4 border-b pb-2 text-lg font-bold dark:border-[#3E3E3A]">
                        Ubah Kontak
                    </h3>

                    <BioRow
                        label="Email"
                        value={user.email}
                        badge="Terverifikasi"
                    />
                    <BioRow
                        label="Nomor HP"
                        value={user.phone || 'Tambah Nomor HP'}
                        action={user.phone ? 'Ubah' : 'Tambah'}
                        onClick={onOpenEditModal}
                    />
                </div>
            </div>
        </div>
    );
};

const TabPembayaran = () => {
    const [activeMethod, setActiveMethod] = useState<
        | 'GoPay'
        | 'DANA'
        | 'Kartu Kredit / Debit'
        | 'Kredivo Express'
        | 'Debit Instan'
    >('GoPay');

    const renderRightContent = () => {
        switch (activeMethod) {
            case 'GoPay':
                return (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                            <Wallet className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            Yuk, Aktifkan GoPay!
                        </h2>
                        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Hubungkan akun GoPay kamu untuk pembayaran lebih
                            cepat, aman, dan nikmati berbagai promo cashback
                            menarik.
                        </p>
                        <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                            Aktifkan GoPay
                        </button>
                    </div>
                );
            case 'DANA':
                return (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950/20 dark:text-sky-400">
                            <Wallet className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            Hubungkan Akun DANA
                        </h2>
                        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Bayar belanjaan online kamu dengan mudah menggunakan
                            DANA. Cukup hubungkan akun kamu sekali saja.
                        </p>
                        <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                            Hubungkan DANA
                        </button>
                    </div>
                );
            case 'Kartu Kredit / Debit':
                return (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            Tambah Kartu Kredit / Debit
                        </h2>
                        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Simpan kartu Visa, Mastercard, JCB, atau Amex kamu
                            secara aman untuk kemudahan checkout instan
                            berikutnya.
                        </p>
                        <div className="mb-6 flex gap-2">
                            <span className="rounded border px-2.5 py-1 text-xs font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                Visa
                            </span>
                            <span className="rounded border px-2.5 py-1 text-xs font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                Mastercard
                            </span>
                            <span className="rounded border px-2.5 py-1 text-xs font-semibold text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                JCB
                            </span>
                        </div>
                        <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                            Tambah Kartu Baru
                        </button>
                    </div>
                );
            case 'Kredivo Express':
                return (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400">
                            <Zap className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            Hubungkan Kredivo Express
                        </h2>
                        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Beli sekarang, bayar nanti dengan Kredivo Express.
                            Nikmati tenor pembayaran hingga 12 bulan.
                        </p>
                        <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                            Hubungkan Kredivo
                        </button>
                    </div>
                );
            case 'Debit Instan':
                return (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                            <CreditCard className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                            Daftarkan Debit Instan
                        </h2>
                        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Hubungkan kartu debit bank favoritmu (BCA, Mandiri,
                            BNI, BRI) untuk pembayaran langsung tanpa transfer
                            manual.
                        </p>
                        <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                            Daftar Debit Instan
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
            {/* LEFT MENU */}
            <div className="h-fit overflow-hidden rounded-xl border bg-white text-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                {(
                    [
                        'GoPay',
                        'DANA',
                        'Kartu Kredit / Debit',
                        'Kredivo Express',
                        'Debit Instan',
                    ] as const
                ).map((item) => {
                    const isActive = activeMethod === item;
                    return (
                        <div
                            key={item}
                            onClick={() => setActiveMethod(item)}
                            className={`cursor-pointer border-b px-4 py-3 font-semibold transition-all last:border-b-0 dark:border-[#3E3E3A] ${
                                isActive
                                    ? 'border-l-4 border-l-green-600 bg-green-50/30 pl-3 text-green-600 dark:border-l-green-500 dark:bg-green-950/10 dark:text-green-400'
                                    : 'border-l-4 border-l-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-[#252523]'
                            }`}
                        >
                            {item}
                        </div>
                    );
                })}
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white p-8 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                {renderRightContent()}
            </div>
        </div>
    );
};

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

const TabAlamat = ({ addresses = [] }: { addresses: Address[] }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const form = useForm({
        name: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        is_default: false,
    });

    const formErrors = form.errors as Record<string, string>;

    const openAddModal = () => {
        form.reset();
        form.setData({
            name: '',
            phone: '',
            address: '',
            city: '',
            province: '',
            postal_code: '',
            is_default: addresses.length === 0,
        });
        setEditingAddress(null);
        setShowModal(true);
    };

    const openEditModal = (addr: Address) => {
        setEditingAddress(addr);
        form.setData({
            name: addr.name,
            phone: addr.phone,
            address: addr.address,
            city: addr.city,
            province: addr.province,
            postal_code: addr.postal_code,
            is_default: addr.is_default,
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Must have at least one default address
        if (!form.data.is_default) {
            const hasOtherDefault = addresses.some(
                (addr) =>
                    addr.is_default &&
                    (!editingAddress || addr.id !== editingAddress.id),
            );
            if (!hasOtherDefault) {
                form.setError(
                    'is_default',
                    'Harus ada minimal satu alamat utama. Silakan tandai alamat ini sebagai alamat utama.',
                );
                return;
            }
        }

        if (editingAddress) {
            form.put(`/user-addresses/${editingAddress.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                },
            });
        } else {
            form.post('/user-addresses', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
            router.delete(`/user-addresses/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSetDefault = (id: number) => {
        router.patch(
            `/user-addresses/${id}/set-default`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 dark:border-[#3E3E3A]">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Daftar Alamat
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Kelola alamat pengiriman Anda (maksimal 3 alamat)
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    disabled={addresses.length >= 3}
                    className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Alamat
                </button>
            </div>

            {/* Error address limit */}
            {formErrors.address_limit && (
                <div className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                    {formErrors.address_limit}
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MapPin className="mb-4 h-16 w-16 text-gray-300 dark:text-gray-700" />
                    <p className="font-medium text-gray-500 dark:text-gray-400">
                        Belum ada alamat tersimpan
                    </p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        Tambahkan alamat pengiriman untuk mempermudah checkout
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`rounded-xl border p-5 transition-all ${
                                addr.is_default
                                    ? 'border-green-600 bg-green-50/10 dark:border-green-500 dark:bg-green-950/5'
                                    : 'border-gray-200 bg-white hover:border-gray-300 dark:border-[#3E3E3A] dark:bg-[#1A1A19] dark:hover:border-gray-700'
                            }`}
                        >
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {addr.name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            ({addr.phone})
                                        </span>
                                        {addr.is_default && (
                                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                Utama
                                            </span>
                                        )}
                                    </div>
                                    <p className="max-w-2xl text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {addr.address}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {addr.city}, {addr.province},{' '}
                                        {addr.postal_code}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-start">
                                    {!addr.is_default && (
                                        <button
                                            onClick={() =>
                                                handleSetDefault(addr.id)
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-[#3E3E3A] dark:text-gray-300 dark:hover:bg-[#252523]"
                                        >
                                            Jadikan Utama
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openEditModal(addr)}
                                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-[#3E3E3A] dark:text-gray-400 dark:hover:bg-[#252523] dark:hover:text-gray-200"
                                        title="Ubah Alamat"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50 dark:border-red-950/30 dark:text-red-400 dark:hover:bg-red-950/20"
                                        title="Hapus Alamat"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL TAMBAH/UBAH ALAMAT */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:border dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4 dark:border-[#3E3E3A]">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editingAddress
                                    ? 'Ubah Alamat Pengiriman'
                                    : 'Tambah Alamat Baru'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#252523] dark:hover:text-gray-200"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-6 py-5">
                            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                                {/* Nama Penerima */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Nama Penerima
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        placeholder="Contoh: Budi Santoso"
                                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                        required
                                    />
                                    {form.errors.name && (
                                        <p className="text-xs text-red-500">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Nomor HP */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Nomor Telepon / HP Penerima
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.phone}
                                        onChange={(e) =>
                                            form.setData(
                                                'phone',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 08123456789"
                                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                        required
                                    />
                                    {form.errors.phone && (
                                        <p className="text-xs text-red-500">
                                            {form.errors.phone}
                                        </p>
                                    )}
                                </div>

                                {/* Alamat Lengkap */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        value={form.data.address}
                                        onChange={(e) =>
                                            form.setData(
                                                'address',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                                        rows={3}
                                        className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                        required
                                    />
                                    {form.errors.address && (
                                        <p className="text-xs text-red-500">
                                            {form.errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Kota */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Kota / Kabupaten
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.city}
                                            onChange={(e) =>
                                                form.setData(
                                                    'city',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: Jakarta Selatan"
                                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                            required
                                        />
                                        {form.errors.city && (
                                            <p className="text-xs text-red-500">
                                                {form.errors.city}
                                            </p>
                                        )}
                                    </div>

                                    {/* Provinsi */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Provinsi
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.province}
                                            onChange={(e) =>
                                                form.setData(
                                                    'province',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: DKI Jakarta"
                                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                            required
                                        />
                                        {form.errors.province && (
                                            <p className="text-xs text-red-500">
                                                {form.errors.province}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Kode Pos */}
                                <div className="space-y-1.5">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Kode Pos
                                    </label>
                                    <input
                                        type="text"
                                        value={form.data.postal_code}
                                        onChange={(e) =>
                                            form.setData(
                                                'postal_code',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Contoh: 12345"
                                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                        required
                                    />
                                    {form.errors.postal_code && (
                                        <p className="text-xs text-red-500">
                                            {form.errors.postal_code}
                                        </p>
                                    )}
                                </div>

                                {/* Checkbox Utama */}
                                <div className="mt-2 space-y-1">
                                    <label className="inline-flex cursor-pointer items-center gap-2.5">
                                        <input
                                            type="checkbox"
                                            checked={form.data.is_default}
                                            onChange={(e) => {
                                                const checked =
                                                    e.target.checked;
                                                form.setData(
                                                    'is_default',
                                                    checked,
                                                );
                                                if (checked) {
                                                    form.clearErrors(
                                                        'is_default',
                                                    );
                                                } else {
                                                    const hasOtherDefault =
                                                        addresses.some(
                                                            (addr) =>
                                                                addr.is_default &&
                                                                (!editingAddress ||
                                                                    addr.id !==
                                                                        editingAddress.id),
                                                        );
                                                    if (!hasOtherDefault) {
                                                        form.setError(
                                                            'is_default',
                                                            'Harus ada minimal satu alamat utama. Silakan tandai alamat ini sebagai alamat utama.',
                                                        );
                                                    }
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-600 dark:bg-[#252523]"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Jadikan Alamat Utama
                                        </span>
                                    </label>
                                    {form.errors.is_default && (
                                        <p className="mt-1 text-xs font-semibold text-red-500">
                                            {form.errors.is_default}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="mt-6 flex justify-end gap-3 border-t pt-5 dark:border-[#3E3E3A]">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#252523]"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const TabRekening = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Rekening Bank
    </div>
);

const TabMode = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Mode Tampilan
    </div>
);

const TabKeamanan = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Keamanan
    </div>
);

const TabNotifikasi = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Notifikasi
    </div>
);

const TabChat = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Chat
    </div>
);

const OrderList = ({ orders }: { orders: Order[] }) => {
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
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/50';
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
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
            case 'paid':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'failed':
                return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
            case 'refunded':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const statusLabels: Record<string, string> = {
        pending: 'Menunggu',
        processing: 'Diproses',
        shipped: 'Dikirim',
        delivered: 'Selesai',
        cancelled: 'Dibatalkan',
    };

    const paymentStatusLabels: Record<string, string> = {
        pending: 'Menunggu',
        paid: 'Dibayar',
        failed: 'Gagal',
        refunded: 'Dikembalikan',
    };

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-white p-12 text-center shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h2 className="text-xl font-bold">Belum Ada Transaksi</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Anda belum memiliki transaksi pada kategori ini.
                </p>
                <Link href="/products" className="mt-6">
                    <button className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                        Mulai Belanja
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="flex flex-col items-start justify-between gap-6 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md md:flex-row md:items-center dark:border-[#3E3E3A] dark:bg-[#1A1A19]"
                >
                    {/* Order Meta */}
                    <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                                {order.order_number}
                            </span>
                            <span
                                className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${getStatusBadge(order.status)}`}
                            >
                                {statusLabels[order.status]}
                            </span>
                            <span
                                className={`rounded-md px-2 py-0.5 text-xs font-medium ${getPaymentStatusBadge(order.payment_status)}`}
                            >
                                Pembayaran:{' '}
                                {paymentStatusLabels[order.payment_status]}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(order.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <DollarSign className="h-4 w-4" />
                                <span>
                                    {order.payment_method.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {order.items.reduce(
                                        (acc, i) => acc + i.quantity,
                                        0,
                                    )}{' '}
                                    Barang
                                </span>
                            </div>
                        </div>

                        {/* Product Preview Snippet */}
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                            {order.items.slice(0, 3).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-2 rounded-lg border bg-gray-50 p-2 dark:border-[#3E3E3A] dark:bg-[#252523]"
                                >
                                    <img
                                        src={
                                            item.product?.image_url ||
                                            '/images/placeholder.png'
                                        }
                                        alt={item.product_name}
                                        className="h-8 w-8 rounded object-cover"
                                    />
                                    <div className="max-w-[120px] text-xs">
                                        <p className="truncate font-semibold">
                                            {item.product_name}
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            {item.quantity}x
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <span className="pl-2 text-xs text-gray-400">
                                    +{order.items.length - 3} lainnya
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action & Total Price */}
                    <div className="flex w-full items-end justify-between gap-3 border-t pt-4 md:w-auto md:flex-col md:border-t-0 md:pt-0 dark:border-[#3E3E3A]">
                        <div className="text-right">
                            <p className="text-xs text-gray-400">
                                Total Belanja
                            </p>
                            <p className="text-lg font-black text-green-600 dark:text-green-500">
                                {formatCurrency(order.total)}
                            </p>
                        </div>

                        <Link href={`/orders/${order.id}`}>
                            <button className="flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/20">
                                <Eye className="h-4 w-4" />
                                <span>Detail</span>
                            </button>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TabMenungguPembayaran = ({ orders = [] }: { orders: Order[] }) => {
    const pendingOrders = orders.filter(
        (order) =>
            order.payment_status === 'pending' && order.status !== 'cancelled',
    );
    return <OrderList orders={pendingOrders} />;
};

const TabDaftarTransaksi = ({ orders = [] }: { orders: Order[] }) => {
    return <OrderList orders={orders} />;
};

export default function UserProfile() {
    const { props, url } = usePage<any>();
    const { user, errors, orders = [], addresses = [] } = props;

    const profileForm = useForm({
        name: user.name || '',
        avatar: null as File | null,
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        gender: user.gender || '',
    });

    const [showEditModal, setShowEditModal] = useState(false);

    const handleUploadAvatar = (file: File) => {
        router.post(
            '/user-profile',
            {
                name: user.name,
                phone: user.phone || '',
                birth_date: user.birth_date || '',
                gender: user.gender || '',
                avatar: file,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const handleSubmitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/user-profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
            },
        });
    };

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({
        'Kotak Masuk': true,
        Pembelian: true,
        'Profil Saya': true,
    });

    const toggleMenu = (menu: string) => {
        setOpenMenu((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    type TabKey = (typeof SECTION_TABS)[keyof typeof SECTION_TABS][number];

    const [activeSection, setActiveSection] = useState<SectionKey>('profil');
    const [activeTab, setActiveTab] = useState<TabKey>(SECTION_TABS.profil[0]);

    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [indicator, setIndicator] = useState({
        left: 0,
        width: 0,
    });

    const isValidTab = (section: SectionKey, tab: string): tab is TabKey => {
        return (SECTION_TABS[section] as readonly string[]).includes(tab);
    };

    useEffect(() => {
        const params = new URLSearchParams(url?.split('?')[1] || '');
        const section = params.get('section') as SectionKey | null;
        const tab = params.get('tab');

        if (section && SECTION_TABS[section]) {
            setActiveSection(section);
            if (tab && isValidTab(section, tab)) {
                setActiveTab(tab);
            } else {
                setActiveTab(SECTION_TABS[section][0]);
            }
        }
    }, [url]);

    useEffect(() => {
        const activeEl = tabRefs.current[activeTab];
        const containerEl = containerRef.current;

        if (!activeEl || !containerEl) return;

        const activeRect = activeEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();

        setIndicator({
            left: activeRect.left - containerRect.left,
            width: activeRect.width,
        });
    }, [activeTab, activeSection]);

    return (
        <>
            <Head title="Profil" />

            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white">
                {/* NAV */}
                <NavMain />

                {/* CONTENT */}
                <section className="py-8">
                    <div className="mx-auto max-w-6xl px-4 lg:px-0">
                        <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                            {/* Left Sidebar */}
                            <div className="h-full lg:col-span-3">
                                <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white text-sm shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                    {/* USER CARD */}
                                    <div className="p-4">
                                        <div className="mb-4 flex items-center gap-2.5">
                                            <Link
                                                href="/user-profile"
                                                className="flex min-w-0 items-center gap-2.5"
                                            >
                                                <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                                    <AvatarImage
                                                        src={
                                                            user.avatar ||
                                                            undefined
                                                        }
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <AvatarFallback className="flex items-center justify-center rounded-full bg-neutral-200 font-bold text-black dark:bg-neutral-700 dark:text-white">
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span className="max-w-[140px] min-w-0 truncate text-lg leading-tight font-bold">
                                                    {user.name}
                                                </span>
                                            </Link>
                                        </div>

                                        {/* DIVIDER */}
                                        <div className="-mx-4 border-t border-gray-300 dark:border-[#3E3E3A]" />

                                        {/* PROMO */}
                                        <div className="mt-5 rounded-lg border bg-white p-3 text-sm dark:border-[#3E3E3A] dark:bg-[#252523]">
                                            <span className="mb-2 inline-block rounded bg-linear-to-r from-green-500 to-green-600 px-1.5 text-xs font-semibold text-white italic">
                                                PLUS{' '}
                                                <span className="text-sm font-black">
                                                    +
                                                </span>
                                            </span>
                                            <p className="leading-snug font-bold">
                                                Nikmatin Gratis Ongkir tanpa
                                                batas!
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Min. belanja Rp0, bebas biaya
                                                aplikasi
                                            </p>
                                        </div>

                                        {/* WALLET */}
                                        <div className="mt-4 mb-1 space-y-3 px-2.5 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span>GoPay</span>

                                                <a
                                                    href="https://gopay.co.id/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Aktifkan
                                                </a>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Groceria Card</span>
                                                <a
                                                    href="#"
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Daftar
                                                </a>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Saldo</span>
                                                <span>Rp0</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="border-t border-gray-300 dark:border-[#3E3E3A]" />

                                    {/* MENU */}
                                    <div className="flex flex-1 flex-col p-2">
                                        {/* Profil Saya */}
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu('Profil Saya')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-[#252523]"
                                            >
                                                Profil Saya
                                                <ChevronIcon
                                                    open={
                                                        openMenu['Profil Saya']
                                                    }
                                                />
                                            </button>

                                            {openMenu['Profil Saya'] && (
                                                <div className="space-y-2 px-6 pb-3">
                                                    {SECTION_TABS.profil.map(
                                                        (tab) => (
                                                            <div
                                                                key={tab}
                                                                onClick={() => {
                                                                    setActiveSection(
                                                                        'profil',
                                                                    );
                                                                    setActiveTab(
                                                                        tab,
                                                                    );
                                                                }}
                                                                className={`cursor-pointer transition ${
                                                                    activeSection ===
                                                                        'profil' &&
                                                                    activeTab ===
                                                                        tab
                                                                        ? 'font-black text-green-600'
                                                                        : 'text-gray-600 hover:text-green-500 dark:text-gray-400'
                                                                }`}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Kotak Masuk */}
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu('Kotak Masuk')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-[#252523]"
                                            >
                                                Kotak Masuk
                                                <ChevronIcon
                                                    open={
                                                        openMenu['Kotak Masuk']
                                                    }
                                                />
                                            </button>

                                            {openMenu['Kotak Masuk'] && (
                                                <div className="space-y-2 px-6 pb-2.5 text-gray-600 dark:text-gray-400">
                                                    {SECTION_TABS.inbox.map(
                                                        (tab) => (
                                                            <div
                                                                key={tab}
                                                                onClick={() => {
                                                                    setActiveSection(
                                                                        'inbox',
                                                                    );
                                                                    setActiveTab(
                                                                        tab,
                                                                    );
                                                                }}
                                                                className={`cursor-pointer transition ${
                                                                    activeSection ===
                                                                        'inbox' &&
                                                                    activeTab ===
                                                                        tab
                                                                        ? 'font-black text-green-600'
                                                                        : 'hover:text-green-500'
                                                                }`}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Pembelian */}
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu('Pembelian')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-[#252523]"
                                            >
                                                Pembelian
                                                <ChevronIcon
                                                    open={openMenu['Pembelian']}
                                                />
                                            </button>

                                            {openMenu['Pembelian'] && (
                                                <div className="space-y-2 px-6 pb-2.5 text-gray-600 dark:text-gray-400">
                                                    {SECTION_TABS.pembelian.map(
                                                        (tab) => (
                                                            <div
                                                                key={tab}
                                                                onClick={() => {
                                                                    setActiveSection(
                                                                        'pembelian',
                                                                    );
                                                                    setActiveTab(
                                                                        tab,
                                                                    );
                                                                }}
                                                                className={`cursor-pointer transition ${
                                                                    activeSection ===
                                                                        'pembelian' &&
                                                                    activeTab ===
                                                                        tab
                                                                        ? 'font-black text-green-600'
                                                                        : 'hover:text-green-500'
                                                                }`}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* SPACER */}
                                        <div className="flex-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="lg:col-span-9">
                                <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                    {/* TABS */}
                                    <div className="relative shrink-0 pt-3">
                                        {/* GARIS ABU-ABU */}
                                        <div className="absolute right-0 bottom-0 left-0 h-px bg-gray-300 dark:bg-[#3E3E3A]" />

                                        {/* WRAPPER */}
                                        <div className="relative">
                                            {/* SCROLLABLE TABS */}
                                            <div
                                                ref={containerRef}
                                                className="scrollbar-hide flex gap-5 overflow-x-auto text-sm font-semibold"
                                            >
                                                {SECTION_TABS[
                                                    activeSection
                                                ].map((tab) => (
                                                    <button
                                                        key={tab}
                                                        ref={(el) => {
                                                            tabRefs.current[
                                                                tab
                                                            ] = el;
                                                        }}
                                                        onClick={() =>
                                                            setActiveTab(tab)
                                                        }
                                                        className={`shrink-0 px-5 pb-3 whitespace-nowrap transition-colors ${
                                                            activeTab === tab
                                                                ? 'text-green-600'
                                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                                        }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* SLIDING UNDERLINE */}
                                            <span
                                                className="pointer-events-none absolute bottom-0 h-0.5 bg-green-600 transition-[left,width] duration-300 ease-out"
                                                style={{
                                                    left: indicator.left,
                                                    width: indicator.width,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="mt-5 flex-1 px-5 pb-5">
                                        {/* PROFIL */}
                                        {activeSection === 'profil' && (
                                            <>
                                                {activeTab ===
                                                    'Biodata Diri' && (
                                                    <TabBiodata
                                                        user={user}
                                                        onOpenEditModal={() =>
                                                            setShowEditModal(
                                                                true,
                                                            )
                                                        }
                                                        onUploadAvatar={
                                                            handleUploadAvatar
                                                        }
                                                        avatarError={
                                                            errors?.avatar
                                                        }
                                                    />
                                                )}
                                                {activeTab ===
                                                    'Daftar Alamat' && (
                                                    <TabAlamat
                                                        addresses={addresses}
                                                    />
                                                )}
                                                {activeTab === 'Pembayaran' && (
                                                    <TabPembayaran />
                                                )}
                                                {activeTab ===
                                                    'Rekening Bank' && (
                                                    <TabRekening />
                                                )}
                                                {activeTab ===
                                                    'Mode Tampilan' && (
                                                    <TabMode />
                                                )}
                                                {activeTab === 'Keamanan' && (
                                                    <TabKeamanan />
                                                )}
                                            </>
                                        )}

                                        {/* INBOX */}
                                        {activeSection === 'inbox' && (
                                            <>
                                                {activeTab === 'Notifikasi' && (
                                                    <TabNotifikasi />
                                                )}
                                                {activeTab === 'Chat' && (
                                                    <TabChat />
                                                )}
                                            </>
                                        )}

                                        {/* PEMBELIAN */}
                                        {activeSection === 'pembelian' && (
                                            <>
                                                {activeTab ===
                                                    'Menunggu Pembayaran' && (
                                                    <TabMenungguPembayaran
                                                        orders={orders}
                                                    />
                                                )}
                                                {activeTab ===
                                                    'Daftar Transaksi' && (
                                                    <TabDaftarTransaksi
                                                        orders={orders}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <NavFooter />

                {/* EDIT BIODATA MODAL */}
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="w-full max-w-md rounded-xl bg-white shadow-xl dark:border dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b px-6 py-4 dark:border-[#3E3E3A]">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Ubah Biodata Diri
                                </h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-[#252523] dark:hover:text-gray-200"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmitProfile}
                                className="px-6 py-5"
                            >
                                <div className="space-y-5">
                                    {/* Nama Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.name}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan nama lengkap"
                                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                            required
                                        />
                                        {profileForm.errors.name && (
                                            <p className="text-xs text-red-500">
                                                {profileForm.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tanggal Lahir Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Tanggal Lahir
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={
                                                    profileForm.data
                                                        .birth_date || ''
                                                }
                                                onChange={(e) =>
                                                    profileForm.setData(
                                                        'birth_date',
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                                            />
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <svg
                                                    className="h-4 w-4 text-gray-400 dark:text-gray-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        {profileForm.errors.birth_date && (
                                            <p className="text-xs text-red-500">
                                                {profileForm.errors.birth_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Jenis Kelamin Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Jenis Kelamin
                                        </label>
                                        <div className="flex gap-6">
                                            <label className="inline-flex cursor-pointer items-center gap-2.5">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="Laki-laki"
                                                    checked={
                                                        profileForm.data
                                                            .gender ===
                                                        'Laki-laki'
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'gender',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-600 dark:bg-[#252523]"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Laki-laki
                                                </span>
                                            </label>
                                            <label className="inline-flex cursor-pointer items-center gap-2.5">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="Perempuan"
                                                    checked={
                                                        profileForm.data
                                                            .gender ===
                                                        'Perempuan'
                                                    }
                                                    onChange={(e) =>
                                                        profileForm.setData(
                                                            'gender',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-600 dark:bg-[#252523]"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                                    Perempuan
                                                </span>
                                            </label>
                                        </div>
                                        {profileForm.errors.gender && (
                                            <p className="text-xs text-red-500">
                                                {profileForm.errors.gender}
                                            </p>
                                        )}
                                    </div>

                                    {/* Nomor HP Input */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Nomor HP
                                        </label>
                                        <input
                                            type="text"
                                            value={profileForm.data.phone || ''}
                                            onChange={(e) =>
                                                profileForm.setData(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Contoh: 08123456789"
                                            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-600/20 focus:outline-none dark:border-gray-700 dark:bg-[#252523] dark:text-white dark:placeholder:text-gray-500"
                                        />
                                        {profileForm.errors.phone && (
                                            <p className="text-xs text-red-500">
                                                {profileForm.errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Buttons */}
                                <div className="mt-6 flex justify-end gap-3 border-t pt-5 dark:border-[#3E3E3A]">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-[#252523]"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={profileForm.processing}
                                        className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {profileForm.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
