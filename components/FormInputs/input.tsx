import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react'
import { cn } from "@/lib/utils"
import { forwardRef, useState } from "react"

interface InputFieldProps {
  label: string
  required?: boolean
  description?: string
  error?: string
  type?: "text" | "email" | "tel" | "url" | "number" | "password" | "textarea"
  placeholder?: string
  className?: string
  rows?: number
  showPasswordToggle?: boolean
  [key: string]: any
}

const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ 
    label, 
    required = false, 
    description, 
    error, 
    type = "text", 
    placeholder, 
    className,
    rows = 3,
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"
    const isTextarea = type === "textarea"
    const inputClassName = cn(
  "h-10 border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-purple-500",
  error && "border-red-300 focus:border-red-500 focus:ring-red-500",
  className
)

const textareaClassName = cn(
  "resize-none border border-gray-200 rounded-sm px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500",
  error && "border-red-300 focus:border-red-500 focus:ring-red-500",
  className
)

    return (
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-900">
          {label} :
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {isTextarea ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            placeholder={placeholder}
            rows={rows}
            className={textareaClassName}
            {...props}
          />
        ) : isPassword && showPasswordToggle ? (
          <div className="relative">
            <Input
              ref={ref as React.Ref<HTMLInputElement>}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              className={cn(inputClassName, "pr-12 ")}
              {...props}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            placeholder={placeholder}
            className={inputClassName}
            {...props}
          />
        )}
        
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1">{error}</p>}
      </div>
    )
  }
)

InputField.displayName = "InputField"

export default InputField
