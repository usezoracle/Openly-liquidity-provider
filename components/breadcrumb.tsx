import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
      <span className="hover:text-foreground cursor-pointer">Overview</span>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">Balance Details</span>
    </div>
  )
}
