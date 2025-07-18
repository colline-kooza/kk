import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ComponentProps, ElementType } from "react"
import { cn } from "@/lib/utils"

interface QuickAccessButtonProps extends Omit<ComponentProps<typeof Button>, "icon"> {
  icon: ElementType
  label: string
  showPlus?: boolean
}

export function QuickAccessButton({
  icon: Icon,
  label,
  showPlus = false,
  className,
  ...props
}: QuickAccessButtonProps) {
  return (
    <Button variant="outline" className={cn("flex items-center gap-2 bg-transparent hover:text-black", className)} {...props}>
      <Icon className="h-4 w-4" />
      {label}
      {showPlus && <Plus className="h-3 w-3 ml-1" />}
    </Button>
  )
}
