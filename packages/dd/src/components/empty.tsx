import * as React from 'react'
import { cn } from '../utils/cn'
import { Inbox } from 'lucide-react'

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title?: string
  description?: string
}

const Empty = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, icon, title = '데이터가 없습니다', description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
      {...props}
    >
      <div className="text-gray-300 mb-4">
        {icon || <Inbox className="h-12 w-12" />}
      </div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
)
Empty.displayName = 'Empty'

export { Empty }
