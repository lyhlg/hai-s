import * as React from 'react'
import { cn } from '../utils/cn'
import { Label } from './label'

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  error?: string
  description?: string
  required?: boolean
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, label, error, description, required, children, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props}>
      {label && (
        <Label className={cn(error && 'text-error-500')}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      {error && (
        <p className="text-sm text-error-500">{error}</p>
      )}
    </div>
  )
)
Field.displayName = 'Field'

export { Field }
