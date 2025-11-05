"use client"

import { Card } from "@/components/ui/card"

interface PerformanceMetricsProps {
  stats: Array<{
    algorithm: string
    avgTime: number
    minTime: number
    maxTime: number
    avgMemory: number
    opsPerSecond: number
  }>
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.algorithm} className="p-4 bg-muted/50 border-border">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-semibold text-foreground">{stat.algorithm}</h4>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Active</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Time:</span>
              <span className="font-mono font-semibold">{stat.avgTime.toFixed(2)} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Range:</span>
              <span className="font-mono font-semibold">
                {stat.minTime.toFixed(2)} - {stat.maxTime.toFixed(2)} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memory:</span>
              <span className="font-mono font-semibold">{stat.avgMemory.toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Throughput:</span>
              <span className="font-mono font-semibold">{stat.opsPerSecond} ops/sec</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground mb-2">Performance Index</div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-chart-1 to-chart-2"
                style={{ width: `${Math.min(100, (1000 / stat.avgTime) * 10)}%` }}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
