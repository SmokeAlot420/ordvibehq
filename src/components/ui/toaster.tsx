import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isSuccess = !props.variant || props.variant === "default"
        const isError = props.variant === "destructive"
        
        return (
          <Toast 
            key={id} 
            {...props}
            className={`
              relative overflow-hidden
              ${isSuccess ? 'alkanes-toast-success' : ''}
              ${isError ? 'alkanes-toast-error' : ''}
            `}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 opacity-20">
              <div className={`
                absolute inset-0 
                ${isSuccess ? 'bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30' : ''}
                ${isError ? 'bg-gradient-to-r from-red-500/30 via-orange-500/30 to-red-500/30' : ''}
                animate-pulse
              `} />
            </div>
            
            {/* Content */}
            <div className="relative z-10 grid gap-1">
              {title && (
                <ToastTitle className={`
                  font-mono text-sm
                  ${isSuccess ? 'text-emerald-400' : ''}
                  ${isError ? 'text-red-400' : ''}
                `}>
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className={`
                  font-mono text-xs opacity-80
                  ${isSuccess ? 'text-cyan-300' : ''}
                  ${isError ? 'text-orange-300' : ''}
                `}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className={`
              ${isSuccess ? 'text-emerald-400 hover:text-emerald-300' : ''}
              ${isError ? 'text-red-400 hover:text-red-300' : ''}
            `} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
