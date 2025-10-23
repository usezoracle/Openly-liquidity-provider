import { Card } from "@/components/ui/card"

export function SpendingChart() {
  const data = [
    { date: "14 Jul", income: 42, outcome: 28 },
    { date: "21 Jul", income: 38, outcome: 32 },
    { date: "28 Jul", income: 45, outcome: 30 },
    { date: "4 Aug", income: 40, outcome: 35 },
    { date: "11 Aug", income: 48, outcome: 28 },
    { date: "18 Aug", income: 52, outcome: 30 },
    { date: "25 Aug", income: 55, outcome: 32 },
    { date: "1 Sep", income: 50, outcome: 35 },
    { date: "8 Sep", income: 58, outcome: 30 },
    { date: "15 Sep", income: 48, outcome: 33 },
    { date: "22 Sep", income: 52, outcome: 28 },
    { date: "28 Sep", income: 60, outcome: 30 },
  ]

  const maxValue = 60

  return (
    <Card className="p-6 h-fit sticky top-6">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-4">
          Looks like you are spending more than 25K USD on last 3 weeks.
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Income</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">35.898</div>
              <div className="text-xs text-muted-foreground">USD</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted" />
              <span className="text-xs text-muted-foreground">Outcome</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">25.093</div>
              <div className="text-xs text-muted-foreground">USD</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <div className="absolute right-0 top-0 text-xs text-muted-foreground">4K USD</div>
        <div className="absolute right-0 bottom-0 text-xs text-muted-foreground">0 USD</div>
        <div className="absolute right-0 bottom-[-20px] text-xs text-muted-foreground">3K USD</div>

        <div className="flex h-full items-end justify-between gap-1 pt-4">
          {data.map((item, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1">
              <div className="relative w-full flex flex-col gap-0.5">
                <div
                  className="w-full rounded-t bg-success"
                  style={{ height: `${(item.income / maxValue) * 200}px` }}
                />
                <div className="w-full rounded-b bg-muted" style={{ height: `${(item.outcome / maxValue) * 200}px` }} />
              </div>
              {index % 3 === 0 && (
                <span className="mt-2 text-[10px] text-muted-foreground whitespace-nowrap">{item.date}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
