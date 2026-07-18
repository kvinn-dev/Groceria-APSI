import { usePage, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

type FlashMessage = {
    success?: string;
    error?: string;
};

let lastShownSuccess: string | null = null;
let lastShownError: string | null = null;

export function ToasterProvider() {
    const { flash } = usePage().props as unknown as { flash: FlashMessage };

    useEffect(() => {
        const unsubscribe = router.on('start', () => {
            lastShownSuccess = null;
            lastShownError = null;
        });

        if (flash?.success && flash.success !== lastShownSuccess) {
            toast.success(flash.success);
            lastShownSuccess = flash.success;
        }
        if (flash?.error && flash.error !== lastShownError) {
            toast.error(flash.error);
            lastShownError = flash.error;
        }

        return () => unsubscribe();
    }, [flash]);

    return (
        <Toaster
            position="top-center"
            richColors
        />
    )}
