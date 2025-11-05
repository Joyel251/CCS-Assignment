"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TimeChartProps {
  data: Array<{
    algorithm: string
    times: number[]
  }>
}

export function TimeChart({ data }: TimeChartProps) {
  const chartData = data.flatMap((algo) =>
    algo.times.map((time, index) => ({
      iteration: index + 1,
      [algo.algorithm]: Number.parseFloat(time.toFixed(2)),
    })),
  )

  // Merge data by iteration
  const mergedData: any[] = []
  chartData.forEach((item) => {
    const existing = mergedData.find((d) => d.iteration === item.iteration)
    if (existing) {
      Object.assign(existing, item)
    } else {
      mergedData.push(item)
    }
  })

  const colors = ["#3b82f6", "#ef4444"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={mergedData.slice(0, 50)} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="iteration" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Legend />
        {data.map((algo, index) => (
          <Line
            key={algo.algorithm}
            type="monotone"
            dataKey={algo.algorithm}
            stroke={colors[index % colors.length]}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
