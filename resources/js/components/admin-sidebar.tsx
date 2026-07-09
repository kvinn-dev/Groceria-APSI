import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';

const navLinks = [
    {
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        label: 'Dashboard',
        routeName: 'admin.dashboard',
    },
    {
        href: '/admin/products',
        icon: Package,
        label: 'Products',
        routeName: 'admin.products.index',
    },
];

export function AdminSidebar() {
    const { component } = usePage();

    return (
        <aside className="flex w-64 flex-col border-r bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-8 flex items-center gap-2">
                <img src="/logo-ditoekoe.svg" alt="Logo" className="h-8 w-auto" />
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            component.startsWith(`Admin/${link.label}`)
                                ? 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white'
                                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                    >
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                    </Link>
                ))}
            </nav>
            <div className="mt-auto border-t pt-4 dark:border-gray-700">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
