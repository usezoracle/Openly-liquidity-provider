import { Bell, Settings, Moon, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">Arto+</div>
            </div>

            <Select defaultValue="bagus">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bagus">Bagus Fikri</SelectItem>
                <SelectItem value="other">Other User</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="shop">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop">Fikri Shop</SelectItem>
                <SelectItem value="store">Other Store</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search" className="pl-9" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Pro Mode</span>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Create
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-600">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
