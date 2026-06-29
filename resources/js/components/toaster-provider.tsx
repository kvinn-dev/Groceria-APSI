import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

type FlashMessage = {
    success?: string;
    error?: string;
};

export function ToasterProvider() {
    const { flash } = usePage().props as unknown as { flash: FlashMessage };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <Toaster
            position="top-center"
            richColors
        />
)}
