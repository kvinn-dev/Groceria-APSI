import { Link } from '@inertiajs/react';
import {
    Bell,
    Clock,
    MapPin,
    Megaphone,
    RefreshCw,
    Settings,
    Truck,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function NotificationDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimer.current = window.setTimeout(() => {
            setOpen(false);
        }, 30);
    };

    const TABS = ['Transaksi', 'Update'] as const;

    type TabKey = (typeof TABS)[number];

    const [activeTab, setActiveTab] = useState<TabKey>('Transaksi');

    /* TAB UNDERLINE LOGIC */
    const containerRef = useRef<HTMLDivElement | null>(null);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [indicator, setIndicator] = useState({
        left: 0,
        width: 0,
    });

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
    }, [activeTab]);

    const TabTransaksi = () => (
        <div className="relative flex max-h-[360px] flex-col">
            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
                {/* PEMBELIAN */}
                <div className="px-4 py-3">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-[14.5px] font-semibold text-gray-900 dark:text-white">
                            Pembelian
                        </span>
                        <Link
                            href="/orders"
                            className="text-[12px] text-green-600"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center text-[11px] text-gray-700 dark:text-gray-300">
                        <StatusItem
                            icon={<Clock size={16} />}
                            label="Menunggu Konfirmasi"
                            href="/orders?status=pending"
                        />
                        <StatusItem
                            icon={<RefreshCw size={16} />}
                            label="Pesanan Diproses"
                            href="/orders?status=processing"
                        />
                        <StatusItem
                            icon={<Truck size={16} />}
                            label="Sedang Dikirim"
                            href="/orders?status=shipped"
                        />
                        <StatusItem
                            icon={<MapPin size={16} />}
                            label="Sampai Tujuan"
                            href="/orders?status=delivered"
                        />
                    </div>
                </div>

                {/* EMPTY STATE */}
                <div className="border-t px-6 py-4 text-center dark:border-[#3E3E3A]">
                    <img
                        src="/images/nav/no-notif.webp"
                        alt="Belum ada notifikasi"
                        className="mx-auto mb-2 w-20"
                    />

                    <h4 className="mb-1 text-[14.5px] font-semibold text-gray-900 dark:text-white">
                        Belum ada notifikasi
                    </h4>

                    <p className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">
                        Notifikasi terkait transaksi kamu bakal muncul di sini
                    </p>

                    <Link
                        href="/products"
                        className="inline-block rounded-sm bg-green-600 px-4 py-1 text-[13px] font-semibold text-white transition hover:bg-green-700"
                    >
                        Mulai Belanja
                    </Link>
                </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-4 py-2 text-[11px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:border-[#3E3E3A] dark:bg-[#252523]">
                <Link
                    href="#"
                    className="font-medium text-green-600 hover:text-green-700"
                >
                    Tandai Semua Dibaca
                </Link>
                <Link
                    href="#"
                    className="font-medium text-green-600 hover:text-green-700"
                >
                    Lihat selengkapnya
                </Link>
            </div>
        </div>
    );

    const TabUpdate = () => (
        <div className="relative flex h-[360px] flex-col">
            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
                {/* NOTIFICATION ITEM */}
                <div className="border-b bg-green-50 px-4 py-3 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                    <div className="mb-1 flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1 font-semibold text-green-600">
                            <Megaphone size={12} />
                            Promo
                        </span>
                        <span>•</span>
                        <span>24 Des</span>
                    </div>

                    <h4 className="mb-1 text-[13px] leading-snug font-semibold text-gray-900 dark:text-white">
                        Cashback 80% untuk pengguna baru
                    </h4>

                    <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">
                        Tokopedia sudah berhasil mengirimkan produk kejutan
                        pembeli di Indonesia. Sekarang waktunya kamu cobain
                        nyamannya belanja apapun di Tokopedia pakai c...
                    </p>

                    <Link
                        href="/promo/cashback-80"
                        className="mt-1 inline-block text-[11px] font-semibold text-green-600 hover:underline"
                    >
                        Selengkapnya
                    </Link>
                </div>

                {/* contoh item lain (kalau banyak, otomatis scroll) */}
            </div>

            {/* STICKY FOOTER */}
            <div className="sticky bottom-0 flex items-center justify-between border-t bg-white px-4 py-2 text-[11px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:border-[#3E3E3A] dark:bg-[#252523]">
                <Link
                    href="#"
                    className="font-medium text-green-600 hover:text-green-700"
                >
                    Tandai Semua Dibaca
                </Link>
                <Link
                    href="/notifikasi"
                    className="font-medium text-green-600 hover:text-green-700"
                >
                    Lihat Selengkapnya
                </Link>
            </div>
        </div>
    );

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ICON */}
            <button className="relative rounded-md p-2 hover:bg-gray-100/70 dark:hover:bg-[#252523]">
                <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute left-1/2 z-50 mt-3.5 w-[280px] -translate-x-1/2 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-xl dark:border-[#3E3E3A] dark:bg-[#252523]">
                    {/* HEADER */}
                    <div className="flex h-12 items-center justify-between border-b px-4 shadow-md dark:border-[#3E3E3A]">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Notifikasi
                        </h3>
                        <Settings className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                    </div>

                    {/* TABS */}
                    <div className="relative shrink-0">
                        {/* GARIS ABU */}
                        <div className="absolute right-0 bottom-0 left-0 h-px bg-gray-200 dark:bg-[#3E3E3A]" />

                        {/* TABS */}
                        <div className="relative grid grid-cols-2 text-sm font-semibold">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-2 text-center transition-colors ${
                                        activeTab === tab
                                            ? 'text-green-600'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    } `}
                                >
                                    {tab}
                                </button>
                            ))}

                            {/* UNDERLINE */}
                            <span
                                className="pointer-events-none absolute bottom-0 h-0.5 bg-green-600 transition-transform duration-300 ease-out"
                                style={{
                                    width: `${100 / TABS.length}%`,
                                    transform: `translateX(${TABS.indexOf(activeTab) * 100}%)`,
                                }}
                            />
                        </div>
                    </div>

                    {/* CONTENT (NO PADDING DI SINI) */}
                    {activeTab === 'Transaksi' && <TabTransaksi />}
                    {activeTab === 'Update' && <TabUpdate />}
                </div>
            )}
        </div>
    );
}

function StatusItem({
    icon,
    label,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex cursor-pointer flex-col items-center gap-1 hover:text-green-600 dark:hover:text-green-400"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-[#1A1A19] dark:text-green-400">
                {icon}
            </div>
            <span className="text-center leading-tight dark:text-gray-300">
                {label}
            </span>
        </Link>
    );
}
