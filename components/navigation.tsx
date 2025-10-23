import { LayoutDashboard, Zap, Activity, Package, CreditCard, Users, FileText } from "lucide-react"

export function Navigation() {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: Zap, label: "Arto+", active: false },
    { icon: Activity, label: "Activities", active: false },
    { icon: Package, label: "Products", active: false },
    { icon: CreditCard, label: "Billing", active: false },
    { icon: Users, label: "People", active: false },
    { icon: FileText, label: "Report", active: false },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                item.active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
