import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import * as React from 'react'
import { cn } from '../foundations/cn'

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, indeterminate, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded border border-gray-300 bg-white',
        'focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600',
        'data-[state=indeterminate]:border-primary-600 data-[state=indeterminate]:bg-primary-600',
        'hover:border-gray-400 data-[state=checked]:hover:bg-primary-700 data-[state=checked]:hover:border-primary-700',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-white')}>
        {indeterminate ? <Minus className="h-3 w-3" /> : <Check className="h-3 w-3" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
