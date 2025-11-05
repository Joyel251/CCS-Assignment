"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MemoryChartProps {
  data: Array<{
    algorithm: string
    avgMemory: number
    maxMemory?: number
  }>
}

export function MemoryChart({ data }: MemoryChartProps) {
  const chartData = data.map((algo) => ({
    algorithm: algo.algorithm,
    "Average Memory": Number.parseFloat(algo.avgMemory.toFixed(2)),
    "Max Memory": Number.parseFloat((algo.maxMemory || algo.avgMemory * 1.2).toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="algorithm" stroke="var(--muted-foreground)" />
        <YAxis stroke="var(--muted-foreground)" label={{ value: "Memory (MB)", angle: -90, position: "insideLeft" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Legend />
        <Bar dataKey="Average Memory" fill="var(--chart-1)" />
        <Bar dataKey="Max Memory" fill="var(--chart-2)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
