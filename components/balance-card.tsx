import { ArrowUp, ArrowDown, RefreshCw, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function BalanceCard() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
            <Image src="/us-flag.jpg" alt="US Flag" width={32} height={32} className="object-cover" />
          </div>
          <span className="text-sm text-muted-foreground">Total balances</span>
        </div>
        <div className="mb-2 text-4xl font-bold">3,908 USD</div>
        <div className="text-sm text-muted-foreground">
          1 USD = 15,326.35 IDR <span className="text-xs">As of today</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
          <ArrowUp className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
          <ArrowDown className="mr-2 h-4 w-4" />
          Request
        </Button>
        <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">
          <RefreshCw className="mr-2 h-4 w-4" />
          Convert
        </Button>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
