import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GoalsSection() {
  const progress = (3908 / 5000) * 100

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Goals</h3>
        <Button variant="ghost" size="sm" className="text-blue-600">
          <Pencil className="mr-2 h-3 w-3" />
          Edit
        </Button>
      </div>

      <div className="mb-2 text-sm text-muted-foreground">
        1092 USD remaining to achieve your goals <span className="font-semibold text-foreground">3,908/5,000 USD</span>
      </div>

      <Progress value={progress} className="h-2" />
    </Card>
  )
}
