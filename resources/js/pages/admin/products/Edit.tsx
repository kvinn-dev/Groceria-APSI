import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Head, Link, useForm } from '@inertiajs/react';
import { type Brand, type Category, type Product } from '@/types';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface EditProps {
    product: Product;
    categories: Category[];
    brands: Brand[];
}

export default function Edit({ product, categories, brands }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discount_price: product.discount_price || '',
        stock: product.stock || '',
        sku: product.sku || '',
        weight: product.weight || '',
        dimensions: product.dimensions || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        image: null as File | null,
        image_url: product.image && (product.image.startsWith('http://') || product.image.startsWith('https://')) ? product.image : '',
        is_featured: !!product.is_featured,
        is_active: !!product.is_active,
    });

    const [imageType, setImageType] = useState<'upload' | 'url'>(
        product.image && (product.image.startsWith('http://') || product.image.startsWith('https://')) ? 'url' : 'upload'
    );

    const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData({
                ...data,
                image: file,
                image_url: '',
            });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUrlChange = (url: string) => {
        setData({
            ...data,
            image: null,
            image_url: url,
        });
        setImagePreview(url || null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/products/${product.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Edit Product" />
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/products">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Edit Product</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update details for "{product.name}".</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Left column: main info */}
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Information</CardTitle>
                                    <CardDescription>Enter basic details about your product.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter product name"
                                            className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.name && <p className="text-xs font-medium text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the product..."
                                            rows={6}
                                            className={errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.description && <p className="text-xs font-medium text-red-500">{errors.description}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Pricing & Inventory</CardTitle>
                                    <CardDescription>Define product price, discounts, stock, and SKU.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (Rp) *</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            placeholder="0"
                                            className={errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.price && <p className="text-xs font-medium text-red-500">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="discount_price">Discount Price (Rp)</Label>
                                        <Input
                                            id="discount_price"
                                            type="number"
                                            value={data.discount_price}
                                            onChange={(e) => setData('discount_price', e.target.value)}
                                            placeholder="Leave empty if no discount"
                                            className={errors.discount_price ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.discount_price && <p className="text-xs font-medium text-red-500">{errors.discount_price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock / Quantity *</Label>
                                        <Input
                                            id="stock"
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            placeholder="0"
                                            className={errors.stock ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.stock && <p className="text-xs font-medium text-red-500">{errors.stock}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData('sku', e.target.value)}
                                            placeholder="Product stock keeping unit code"
                                            className={errors.sku ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.sku && <p className="text-xs font-medium text-red-500">{errors.sku}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Dimensions</CardTitle>
                                    <CardDescription>Optional weight and size for shipping calculation.</CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            step="0.01"
                                            value={data.weight}
                                            onChange={(e) => setData('weight', e.target.value)}
                                            placeholder="0.00"
                                            className={errors.weight ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.weight && <p className="text-xs font-medium text-red-500">{errors.weight}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dimensions">Dimensions (LxWxH in cm)</Label>
                                        <Input
                                            id="dimensions"
                                            value={data.dimensions}
                                            onChange={(e) => setData('dimensions', e.target.value)}
                                            placeholder="e.g. 10x15x5"
                                            className={errors.dimensions ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                        />
                                        {errors.dimensions && <p className="text-xs font-medium text-red-500">{errors.dimensions}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column: image, categories, flags */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Image</CardTitle>
                                    <CardDescription>Upload or use external link for product image.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Tab/Toggle Buttons */}
                                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg text-sm">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageType('upload');
                                                setImagePreview(data.image ? URL.createObjectURL(data.image) : (product.image && !product.image.startsWith('http') ? (product.image_url || null) : null));
                                            }}
                                            className={`py-1.5 rounded-md font-medium transition-all ${imageType === 'upload' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                        >
                                            Upload File
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageType('url');
                                                setImagePreview(data.image_url || null);
                                            }}
                                            className={`py-1.5 rounded-md font-medium transition-all ${imageType === 'url' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                        >
                                            External URL
                                        </button>
                                    </div>

                                    {imageType === 'upload' ? (
                                        <>
                                            {imagePreview ? (
                                                <div className="relative group overflow-hidden rounded-md border aspect-square">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Label htmlFor="image" className="cursor-pointer bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors">
                                                            Change Image
                                                        </Label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md aspect-square bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 p-4 text-center">
                                                    <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                                                    <p className="text-xs text-gray-500 mb-2">No image uploaded</p>
                                                    <Label htmlFor="image" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1">
                                                        <Upload className="h-3 w-3" /> Upload
                                                    </Label>
                                                </div>
                                            )}
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            {errors.image && <p className="text-xs font-medium text-red-500">{errors.image}</p>}
                                        </>
                                    ) : (
                                        <div className="space-y-4">
                                            {imagePreview && (
                                                <div className="relative overflow-hidden rounded-md border aspect-square">
                                                    <img
                                                        src={imagePreview}
                                                        alt="URL Preview"
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/images/placeholder.png';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label htmlFor="image_url">Image URL</Label>
                                                <Input
                                                    id="image_url"
                                                    type="url"
                                                    value={data.image_url}
                                                    onChange={(e) => handleUrlChange(e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                    className={errors.image_url ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                                />
                                                {errors.image_url && <p className="text-xs font-medium text-red-500">{errors.image_url}</p>}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Organization</CardTitle>
                                    <CardDescription>Assign categories and brands.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">Category *</Label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="text-xs font-medium text-red-500">{errors.category_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand_id">Brand</Label>
                                        <select
                                            id="brand_id"
                                            value={data.brand_id}
                                            onChange={(e) => setData('brand_id', e.target.value)}
                                            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring- ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select a brand</option>
                                            {brands.map((b) => (
                                                <option key={b.id} value={b.id}>
                                                    {b.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.brand_id && <p className="text-xs font-medium text-red-500">{errors.brand_id}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Visibility & Status</CardTitle>
                                    <CardDescription>Determine if product is live or featured.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_active">Active Status</Label>
                                            <p className="text-xs text-gray-500">Show/hide in the storefront</p>
                                        </div>
                                        <Switch
                                            id="is_active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="is_featured">Featured</Label>
                                            <p className="text-xs text-gray-500">Highlight on homepage</p>
                                        </div>
                                        <Switch
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onCheckedChange={(checked) => setData('is_featured', checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-4 border-t pt-6">
                        <Link href="/admin/products">
                            <Button variant="outline" type="button" disabled={processing}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-green-600 hover:bg-green-700 text-white">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Saving...' : 'Update Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
