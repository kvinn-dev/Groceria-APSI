import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
interface UserInfoProps {
    user: User;
    onLogout: () => void;
}

export function UserInfo({ user, onLogout }: UserInfoProps) {
    const getInitials = useInitials();

    return (
        <div className="group relative">
            {/* CLICK → PROFILE */}
            <Link
                href="/user-profile"
                className="flex items-center gap-2.5 py-2" // Tambah py-2 untuk memperluas hover area
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={user.avatar ?? '/images/login-illus.png'}
                        alt={user.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                <span className="max-w-[120px] truncate text-sm font-medium dark:text-white">
                    {user.name}
                </span>
            </Link>

            {/* DROPDOWN (HOVER) - FIXED */}
            <div className="invisible absolute top-full right-0 z-50 pt-2 opacity-0 transition-[opacity,visibility] delay-100 duration-200 group-hover:visible group-hover:opacity-100">
                {/* Bridge element - menghubungkan trigger dan dropdown tanpa celah */}
                <div className="absolute top-0 right-0 left-0 h-2 -translate-y-full" />

                <div className="w-44 rounded-md border bg-white shadow-md dark:border-[#3E3E3A] dark:bg-[#252523]">
                    {/* HANYA UNTUK ADMIN */}
                    {user.is_admin && (
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 rounded-t-sm px-4 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-[#1A1A19]"
                        >
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            <span>Admin Panel</span>
                        </Link>
                    )}

                    {/* Sesuai route */}
                    <Link
                        href="/user-profile"
                        className={`block px-4 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-[#1A1A19] ${user.is_admin ? '' : 'rounded-t-sm'}`}
                    >
                        Profil Saya
                    </Link>

                    {/* Sesuai route dengan section parameter */}
                    <Link
                        href="/user-profile"
                        data={{ section: 'pembelian' }}
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-[#1A1A19]"
                    >
                        Pesanan Saya
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={onLogout}
                        className="w-full rounded-b-sm px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100/30 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
