import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import * as React from 'react'
import { cn } from '../foundations/cn'
import { type ButtonProps } from './button'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'button'>

const PaginationLink = ({ className, isActive, ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors',
      'hover:bg-gray-100 focus-visible:outline-none',
      isActive && 'bg-primary-100 text-primary-700 hover:bg-primary-200',
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationFirst = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="첫 페이지로 이동" className={cn('gap-1', className)} {...props}>
    <ChevronsLeft className="h-4 w-4" />
  </PaginationLink>
)
PaginationFirst.displayName = 'PaginationFirst'

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="이전 페이지로 이동" className={cn('gap-1', className)} {...props}>
    <ChevronLeft className="h-4 w-4" />
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="다음 페이지로 이동" className={cn('gap-1', className)} {...props}>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationLast = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="마지막 페이지로 이동" className={cn('gap-1', className)} {...props}>
    <ChevronsRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationLast.displayName = 'PaginationLast'

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => (
  <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <MoreHorizontal className="h-4 w-4 text-gray-500" />
    <span className="sr-only">더 많은 페이지</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
