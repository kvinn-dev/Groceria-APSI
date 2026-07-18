import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/admin-layout';
import { type Category } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Image as ImageIcon, Save, Upload } from 'lucide-react';
import { useState } from 'react';

interface CreateProps {
    parentCategories: Category[];
}

export default function Create({ parentCategories }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        parent_id: '',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Category" />
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/categories">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Add Category</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Create a new product category.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Details</CardTitle>
                            <CardDescription>
                                Configure name, parent, description, and image.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g. Vegetables, Fresh Fruits"
                                    className={
                                        errors.name
                                            ? 'border-red-500 focus-visible:ring-red-500'
                                            : ''
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parent_id">
                                    Parent Category
                                </Label>
                                <select
                                    id="parent_id"
                                    value={data.parent_id}
                                    onChange={(e) =>
                                        setData('parent_id', e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">
                                        None (Make root category)
                                    </option>
                                    {parentCategories.map((parent) => (
                                        <option
                                            key={parent.id}
                                            value={parent.id}
                                        >
                                            {parent.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.parent_id && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.parent_id}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Write a brief description about this category..."
                                    className={
                                        errors.description
                                            ? 'border-red-500 focus-visible:ring-red-500'
                                            : ''
                                    }
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-xs font-medium text-red-500">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Category Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md border border-dashed bg-gray-50 text-gray-400 dark:bg-gray-900">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="h-8 w-8" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="image"
                                                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Choose Image
                                            </Label>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG or WEBP. Max 2MB.
                                        </p>
                                        {errors.image && (
                                            <p className="text-xs font-medium text-red-500">
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Link href="/admin/categories">
                            <Button
                                variant="outline"
                                type="button"
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Save Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
