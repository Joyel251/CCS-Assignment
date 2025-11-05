"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ComparisonChartProps {
  data: Array<{
    algorithm: string
    avgTime: number
    avgMemory: number
    opsPerSecond: number
  }>
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const chartData = data.map((algo) => ({
    algorithm: algo.algorithm,
    time: Number.parseFloat(algo.avgTime.toFixed(2)),
    memory: Number.parseFloat(algo.avgMemory.toFixed(2)),
    opsPerSecond: Number.parseFloat(String(algo.opsPerSecond)),
  }))

  const colors = ["#3b82f6", "#ef4444"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="time"
          name="Execution Time (ms)"
          stroke="var(--muted-foreground)"
          label={{ value: "Execution Time (ms)", position: "bottom", offset: 10 }}
        />
        <YAxis
          dataKey="memory"
          name="Memory (MB)"
          stroke="var(--muted-foreground)"
          label={{ value: "Memory (MB)", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          labelStyle={{ color: "var(--foreground)" }}
          cursor={{ strokeDasharray: "3 3" }}
        />
        <Legend />
        {chartData.map((_, index) => (
          <Scatter
            key={index}
            name={data[index].algorithm}
            data={[chartData[index]]}
            fill={colors[index % colors.length]}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  )
}
