import { AdminSidebar } from '@/components/admin-sidebar';
import { usePage, router } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { type PropsWithChildren, useEffect } from 'react';

interface FlashMessage {
    success?: string;
    error?: string;
}

let lastShownSuccess: string | null = null;
let lastShownError: string | null = null;

export default function AdminLayout({ children }: PropsWithChildren) {
    const { flash } = usePage<{ flash: FlashMessage }>().props;

    useEffect(() => {
        const unsubscribe = router.on('start', () => {
            lastShownSuccess = null;
            lastShownError = null;
        });

        if (flash.success && flash.success !== lastShownSuccess) {
            toast.success('Success', {
                description: flash.success,
            });
            lastShownSuccess = flash.success;
        }

        if (flash.error && flash.error !== lastShownError) {
            toast.error('Error', {
                description: flash.error,
            });
            lastShownError = flash.error;
        }

        return () => unsubscribe();
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

