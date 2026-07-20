import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const [csrfToken, setCsrfToken] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    // Ambil CSRF token dari backend
    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const res = await fetch('/csrf-token', {
                    credentials: 'include',
                });
                const data = await res.json();
                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.error('Failed to fetch CSRF token', err);
            }
        };
        fetchCsrf();
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors([]);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        if (!name) {
            setErrors(['Nama harus diisi']);
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setErrors(['Password dan konfirmasi password tidak sama']);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            if (res.ok) {
                alert('Akun berhasil dibuat! Silakan login.');
                window.location.href = '/login';
            } else {
                const data = await res.json();
                if (data.errors) {
                    const errorMessages = Object.values(
                        data.errors,
                    ).flat() as string[];
                    setErrors(errorMessages);
                } else {
                    setErrors([
                        data.message || 'Terjadi kesalahan saat membuat akun',
                    ]);
                }
            }
        } catch (err) {
            console.error(err);
            setErrors(['Terjadi kesalahan saat membuat akun']);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleSignup}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold text-green-600">
                                    Create your account
                                </h1>
                                <p className="text-sm text-balance text-gray-900 dark:text-muted-foreground">
                                    Enter your details below to create your
                                    account
                                </p>
                            </div>

                            {errors.length > 0 && (
                                <div className="mb-4 space-y-1 text-sm text-red-600">
                                    {errors.map((err, i) => (
                                        <p key={i}>{err}</p>
                                    ))}
                                </div>
                            )}

                            {/* Field Nama */}
                            <Field className="!text-gray-500 placeholder:!text-gray-500 dark:!text-muted-foreground">
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                />
                            </Field>

                            <Field className="!text-gray-500 placeholder:!text-gray-500 dark:!text-muted-foreground">
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                />
                            </Field>

                            <Field className="grid grid-cols-2 gap-4">
                                <Field className="!text-gray-500 placeholder:!text-gray-500 dark:!text-muted-foreground">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </Field>
                                <Field className="!text-gray-500 placeholder:!text-gray-500 dark:!text-muted-foreground">
                                    <FieldLabel htmlFor="confirm-password">
                                        Confirm Password
                                    </FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                    />
                                </Field>
                            </Field>

                            <Field>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-green-600 text-white hover:bg-green-700"
                                >
                                    {loading ? '. . .' : 'Create Account'}
                                </Button>
                            </Field>

                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>

                            <FieldDescription className="text-center">
                                Already have an account?{' '}
                                <a
                                    href="/login"
                                    className="font-medium text-green-600 hover:font-semibold hover:!text-green-600"
                                >
                                    Sign in
                                </a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>

                    <div className="relative hidden bg-muted md:block">
                        <img
                            src="images/login-ill.webp"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    </div>
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{' '}
                <a
                    href="#"
                    className="font-medium text-green-600 underline-offset-2 transition-colors hover:!font-semibold hover:!text-green-600 hover:underline"
                >
                    Terms of Service
                </a>{' '}
                and{' '}
                <a
                    href="#"
                    className="font-medium text-green-600 underline-offset-2 transition-colors hover:!font-semibold hover:!text-green-600 hover:underline"
                >
                    Privacy Policy
                </a>
                .
            </FieldDescription>
        </div>
    );
}
