import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { type PaginatedData } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface DataTablePaginationProps<T> {
    data: PaginatedData<T>;
}

export function DataTablePagination<T>({ data }: DataTablePaginationProps<T>) {
    const rawData = data as any;
    
    // Check if it's the nested API Resource structure or a flat Laravel Paginator
    const isNested = rawData.meta !== undefined && rawData.links !== undefined && rawData.meta.links !== undefined;

    const from = isNested ? rawData.meta.from : rawData.from;
    const to = isNested ? rawData.meta.to : rawData.to;
    const total = isNested ? rawData.meta.total : rawData.total;
    
    const prevUrl = isNested ? rawData.links.prev : rawData.prev_page_url;
    const nextUrl = isNested ? rawData.links.next : rawData.next_page_url;
    
    const paginationLinks = isNested ? rawData.meta.links : rawData.links;

    // Filter untuk menghilangkan link Previous & Next dari array
    const filteredLinks = Array.isArray(paginationLinks) 
        ? paginationLinks.filter((link: any) => {
            // Skip Previous & Next links karena sudah dirender terpisah
            if (link.label.includes('&laquo;') || link.label.includes('&raquo;')) {
                // Previous: &laquo; Previous
                // Next: Next &raquo;
                // Simple arrow: &laquo; atau &raquo;
                // Abaikan hanya yang murni Previous/Next (bukan number)
                return false;
            }
            return true;
        })
        : [];

    return (
        <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                Showing {from ?? 0} to {to ?? 0} of {total ?? 0} results.
            </div>

            <Pagination className="mx-0 w-auto">
                <PaginationContent>
                    <PaginationItem>
                        {prevUrl ? (
                            <PaginationPrevious asChild>
                                <Link href={prevUrl} preserveScroll>
                                    <ChevronLeftIcon />
                                    <span className="hidden sm:block">Previous</span>
                                </Link>
                            </PaginationPrevious>
                        ) : (
                            <PaginationPrevious className="pointer-events-none opacity-50" />
                        )}
                    </PaginationItem>

                    {filteredLinks.map((link: any, index: number) => (
                        <PaginationItem key={index}>
                            {link.label.includes('...') ? (
                                <PaginationEllipsis />
                            ) : link.url ? (
                                <PaginationLink isActive={link.active} asChild>
                                    <Link href={link.url} preserveScroll>
                                        {/* Bersihkan HTML entities dari label */}
                                        {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
                                    </Link>
                                </PaginationLink>
                            ) : (
                                <PaginationLink isActive={link.active}>
                                    {link.label.replace(/&laquo;|&raquo;/g, '').trim()}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        {nextUrl ? (
                            <PaginationNext asChild>
                                <Link href={nextUrl} preserveScroll>
                                    <span className="hidden sm:block">Next</span>
                                    <ChevronRightIcon />
                                </Link>
                            </PaginationNext>
                        ) : (
                            <PaginationNext className="pointer-events-none opacity-50" />
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}