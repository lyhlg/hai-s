import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '../foundations/cn'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipVariants = cva(
  'relative z-50 whitespace-pre-line flex justify-center items-center w-fit h-fit shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        black: 'text-white bg-gray-900',
        white: 'text-gray-700 bg-white border border-gray-200',
        primary: 'text-primary-600 bg-primary-50 border border-primary-200',
      },
      size: {
        lg: 'px-3 py-2.5 min-h-9 text-sm rounded-lg',
        md: 'px-2 py-1.5 min-h-7 text-xs rounded-md',
        sm: 'px-1.5 py-1 min-h-6 text-xs rounded',
      },
    },
    defaultVariants: {
      variant: 'black',
      size: 'md',
    },
  }
)

type TooltipVariant = 'black' | 'white' | 'primary'
type TooltipSize = 'sm' | 'md' | 'lg'

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, variant = 'black', size, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant, size }), className)}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipVariants,
  type TooltipSize,
  type TooltipVariant,
}
