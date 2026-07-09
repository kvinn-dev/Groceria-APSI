import { AdminSidebar } from '@/components/admin-sidebar';
import { usePage } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { type PropsWithChildren, useEffect } from 'react';

interface FlashMessage {
    success?: string;
    error?: string;
}

export default function AdminLayout({ children }: PropsWithChildren) {
    const { flash } = usePage<{ flash: FlashMessage }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success('Success', {
                description: flash.success,
            });
        }
        if (flash.error) {
            toast.error('Error', {
                description: flash.error,
            });
        }
    }, [flash]);

    return (
        <>
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
                <AdminSidebar />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
            <Toaster richColors position="top-right" />
        </>
    );
}
