import { useRef, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { type SharedData } from "@/types";

export default function CartDropdown() {
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

    const { cartCount = 0, cartItemsPreview = [] } = usePage<SharedData>().props as unknown as { cartCount: number, cartItemsPreview: { slug: string, image: string, name: string, price_formatted: string }[] };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* CART ICON */}
            <Link href="/cart" className="relative w-9 h-9 flex items-center justify-center rounded-md">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#16a34a"
                    className="size-5.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                    />
                </svg>
                {cartCount > 0 && (
                    <span
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white"
                    >
                        {cartCount}
                    </span>
                )}
            </Link>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute left-1/2 mt-3.5 w-[350px] -translate-x-1/2 bg-white dark:bg-[#1A1A19] border border-gray-200 dark:border-[#252523] rounded-sm shadow-xl z-50 overflow-hidden">

                    {/* HEADER */}
                    <div className="flex items-center justify-between h-12 px-4 border-b shadow-md">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            Keranjang
                        </h3>
                        <Link
                            href="/cart"
                            className="text-green-600 text-xs font-semibold hover:underline"
                        >
                            Lihat
                        </Link>
                    </div>

                    {cartItemsPreview.length === 0 ? (
                        /* EMPTY CART */
                        <div className="px-6 py-2 text-center">
                            <img
                                src="/images/nav/no-cart.webp"
                                alt="Keranjang kosong"
                                className="mx-auto w-36 mb-4"
                            />
                            <h4 className="font-bold text-gray-900 text-base mb-1">
                                Wah, keranjang belanjamu kosong
                            </h4>
                            <p className="text-gray-500 text-[13px] mb-4">
                                Yuk, isi dengan barang-barang impianmu!
                            </p>
                            <Link
                                href="/top-product"
                                className="inline-block border border-green-600 mb-5 text-green-600 font-semibold text-sm px-6 py-1 rounded-sm hover:bg-green-50 transition"
                            >
                                Mulai Belanja
                            </Link>
                        </div>
                    ) : (
                        /* CART WITH ITEMS */
                        <div className="max-h-[300px] overflow-y-auto">
                            {cartItemsPreview.map((item, index) => (
                                <Link key={index} href={`/product/${item.slug}`} className="flex items-center gap-3 px-4 py-3 border-b dark:border-[#252523] hover:bg-gray-50 dark:hover:bg-[#1A1A19]">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                    <div className="flex-1">
                                        <p className="text-sm line-clamp-2 leading-tight text-gray-800 dark:text-gray-200">{item.name}</p>
                                        <p className="text-xs font-semibold text-green-600 mt-1">{item.price_formatted}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
}
