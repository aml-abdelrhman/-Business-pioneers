'use client'
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadCnPagination,
} from '@/components/ui/pagination'
import { usePagination } from '@/hooks/use-pagination'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  totalPages: number
  paginationItemsToDisplay?: number
  onChange?: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
  onChange,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  })

  const handlePageChange = (page: number) => {
    if (onChange && page !== currentPage) {
      onChange(page)
    }
  }

  if (Number(totalPages) === 1 || !totalPages) return null

  return (
    <ShadCnPagination dir="ltr">
      <PaginationContent>
        {/* Previous page button */}
        <PaginationItem>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={cn(
              'flex items-center gap-1 px-2.5 sm:pe-4 rounded-md',
              'aria-disabled:pointer-events-none aria-disabled:opacity-50',
              'hover:bg-accent hover:text-accent-foreground',
            )}
            disabled={currentPage === 1}
            aria-disabled={currentPage === 1}
          >
            <PaginationPrevious className="p-0" />
          </button>
        </PaginationItem>

        {/* Left ellipsis (...) */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page number buttons */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <button
              onClick={() => handlePageChange(page)}
              className={cn(
                'rounded-md border border-border text-accent-foreground h-9 w-9',
                'hover:bg-accent hover:text-accent-foreground',
                page === currentPage &&
                  'bg-primary border-0 hover:bg-main-700 text-white hover:text-white',
              )}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </PaginationItem>
        ))}

        {/* Right ellipsis (...) */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page button */}
        <PaginationItem>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={cn(
              'flex items-center gap-1 px-2.5 sm:ps-4 rounded-md',
              'aria-disabled:pointer-events-none aria-disabled:opacity-50',
              'hover:bg-accent hover:text-accent-foreground',
            )}
            disabled={currentPage === totalPages}
            aria-disabled={currentPage === totalPages}
          >
            <PaginationNext className="p-0" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </ShadCnPagination>
  )
}
