import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleAlert, CircleCheck, CircleX, Info, Loader2, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../foundations/cn'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col-reverse items-center gap-2 p-4 pointer-events-none',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-fit max-w-[460px] items-center gap-3 overflow-hidden rounded-[10px] px-3 py-3 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-toast-slide-in data-[state=closed]:animate-toast-slide-out',
  {
    variants: {
      variant: {
        default: 'bg-gray-900 text-white',
        success: 'bg-gray-900 text-white',
        error: 'bg-gray-900 text-white',
        warning: 'bg-gray-900 text-white',
        info: 'bg-gray-900 text-white',
        loading: 'bg-gray-900 text-white',
        destructive: 'bg-error-500 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading' | 'destructive'

const ToastIcon = ({ variant }: { variant?: ToastVariant }) => {
  switch (variant) {
    case 'success':
      return <CircleCheck className="h-5 w-5 text-success-500 shrink-0 fill-success-500 stroke-gray-900" />
    case 'error':
    case 'destructive':
      return <CircleX className="h-5 w-5 text-error-500 shrink-0 fill-error-500 stroke-gray-900" />
    case 'warning':
      return <CircleAlert className="h-5 w-5 text-warning-500 shrink-0 fill-warning-500 stroke-gray-900" />
    case 'info':
      return <Info className="h-5 w-5 text-info-500 shrink-0 fill-info-500 stroke-gray-900" />
    case 'loading':
      return <Loader2 className="h-5 w-5 text-primary-500 shrink-0 animate-spin" />
    default:
      return null
  }
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
))
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-medium text-white',
      'transition-colors hover:bg-white/20 focus:outline-none disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn('rounded-md p-1 text-white/60 transition-colors hover:text-white focus:outline-none', className)}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('text-sm font-medium', className)} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('text-sm text-white/70', className)} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
  type ToastVariant,
}
