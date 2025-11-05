"use client"

export function generateTextReport(data: any): string {
  const lines = [
    "=".repeat(80),
    "CRYPTOGRAPHIC BENCHMARK REPORT",
    "=".repeat(80),
    "",
    `Generated: ${new Date(data.timestamp).toLocaleString()}`,
    "",
    "--- CONFIGURATION ---",
    `Algorithms: ${data.algorithms.join(", ")}`,
    `Iterations: ${data.iterations}`,
    `Data Size: ${data.dataSize} bytes`,
    `Number of Runs: ${data.runs}`,
    data.testInput ? `Test Input Length: ${data.testInput.length} characters` : "Test Input: Random Data",
    "",
    "--- STATISTICS ---",
    "",
  ]

  data.stats.forEach((stat: any) => {
    lines.push(`Algorithm: ${stat.algorithm}`)
    lines.push(`  Min Time:      ${stat.minTime.toFixed(2)} ms`)
    lines.push(`  Avg Time:      ${stat.avgTime.toFixed(2)} ms`)
    lines.push(`  Max Time:      ${stat.maxTime.toFixed(2)} ms`)
    lines.push(`  Std Dev:       ${stat.stdDevTime.toFixed(2)} ms`)
    lines.push(`  P50 (Median):  ${stat.p50Time.toFixed(2)} ms`)
    lines.push(`  P95:           ${stat.p95Time.toFixed(2)} ms`)
    lines.push(`  P99:           ${stat.p99Time.toFixed(2)} ms`)
    lines.push(`  Avg Memory:    ${stat.avgMemory.toFixed(4)} MB`)
    lines.push(`  Ops/Second:    ${stat.opsPerSecond}`)
    lines.push("")
  })

  lines.push("=".repeat(80))
  lines.push("END OF REPORT")
  lines.push("=".repeat(80))

  return lines.join("\n")
}

export function generateCSVReport(data: any): string {
  const headers = [
    "Algorithm",
    "Min Time (ms)",
    "Avg Time (ms)",
    "Max Time (ms)",
    "Std Dev (ms)",
    "P50 (ms)",
    "P95 (ms)",
    "P99 (ms)",
    "Avg Memory (MB)",
    "Ops/Second",
  ]

  const rows = data.stats.map((stat: any) => [
    stat.algorithm,
    stat.minTime.toFixed(2),
    stat.avgTime.toFixed(2),
    stat.maxTime.toFixed(2),
    stat.stdDevTime.toFixed(2),
    stat.p50Time.toFixed(2),
    stat.p95Time.toFixed(2),
    stat.p99Time.toFixed(2),
    stat.avgMemory.toFixed(4),
    stat.opsPerSecond,
  ])

  const csv = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  return csv
}

export function generateJSONReport(data: any): string {
  const report = {
    timestamp: data.timestamp,
    configuration: {
      algorithms: data.algorithms,
      iterations: data.iterations,
      dataSize: data.dataSize,
      runs: data.runs,
      testInputLength: data.testInput?.length || 0,
    },
    statistics: data.stats,
  }

  return JSON.stringify(report, null, 2)
}

export async function generatePDFReport(data: any): Promise<void> {
  // Dynamically import html2pdf only on the client side
  const html2pdf = (await import("html2pdf.js")).default

  // Capture charts as images
  const captureChartImage = (chartId: string): string => {
    const chartElement = document.querySelector(`[data-chart-id="${chartId}"]`)
    if (chartElement) {
      const canvas = chartElement.querySelector('canvas')
      if (canvas) {
        return canvas.toDataURL('image/png')
      }
    }
    return ''
  }

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333;">
      <h1 style="text-align: center; color: #1a1a1a; margin-bottom: 10px; font-size: 28px;">
        Cryptographic Performance Benchmark Report
      </h1>
      <p style="text-align: center; color: #666; margin-bottom: 40px; font-size: 14px;">
        Generated on ${new Date(data.timestamp).toLocaleString()}
      </p>

      <div style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Benchmark Configuration
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">Algorithms Tested</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.algorithms.join(", ")}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">Iterations per Run</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.iterations}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">Data Size</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.dataSize} bytes</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">Number of Runs</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${data.runs}</td>
          </tr>
          <tr style="background-color: #f3f4f6;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: 600;">Test Input</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">
              ${data.testInput ? `Custom input (${data.testInput.length} characters)` : "Random data generation"}
            </td>
          </tr>
        </table>
      </div>

      <div style="page-break-inside: avoid;">
        <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Performance Statistics
        </h2>
        ${data.stats
          .map(
            (stat: any) => `
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 10px;">${stat.algorithm}</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; width: 50%; font-weight: 600;">Metric</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; width: 50%; font-weight: 600;">Value</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Minimum Time</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.minTime.toFixed(2)} ms</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Average Time</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace; font-weight: 600;">${stat.avgTime.toFixed(2)} ms</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Maximum Time</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.maxTime.toFixed(2)} ms</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Standard Deviation</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.stdDevTime.toFixed(2)} ms</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">P50 (Median)</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.p50Time.toFixed(2)} ms</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">P95</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.p95Time.toFixed(2)} ms</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">P99</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.p99Time.toFixed(2)} ms</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Average Memory</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.avgMemory.toFixed(4)} MB</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">Operations/Second</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-family: monospace;">${stat.opsPerSecond}</td>
              </tr>
            </table>
          </div>
        `,
          )
          .join("")}
      </div>

      <div style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="color: #2563eb; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Performance Comparison Charts
        </h2>
        
        <!-- Average Time Comparison -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Average Execution Time</h3>
          ${data.stats
            .map((stat: any) => {
              const maxTime = Math.max(...data.stats.map((s: any) => s.avgTime))
              const width = (stat.avgTime / maxTime) * 100
              const color = stat.algorithm === "ED25519" ? "#3b82f6" : "#10b981"
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600; font-size: 14px;">${stat.algorithm}</span>
                    <span style="font-family: monospace; font-size: 14px;">${stat.avgTime.toFixed(2)} ms</span>
                  </div>
                  <div style="width: 100%; height: 30px; background-color: #f3f4f6; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${width}%; height: 100%; background-color: ${color}; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: white; font-size: 12px; font-weight: 600;">
                      ${width.toFixed(1)}%
                    </div>
                  </div>
                </div>
              `
            })
            .join("")}
        </div>

        <!-- Operations Per Second Comparison -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Operations Per Second</h3>
          ${data.stats
            .map((stat: any) => {
              const maxOps = Math.max(...data.stats.map((s: any) => parseFloat(s.opsPerSecond)))
              const width = (parseFloat(stat.opsPerSecond) / maxOps) * 100
              const color = stat.algorithm === "ED25519" ? "#8b5cf6" : "#f59e0b"
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600; font-size: 14px;">${stat.algorithm}</span>
                    <span style="font-family: monospace; font-size: 14px;">${stat.opsPerSecond} ops/s</span>
                  </div>
                  <div style="width: 100%; height: 30px; background-color: #f3f4f6; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${width}%; height: 100%; background-color: ${color}; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: white; font-size: 12px; font-weight: 600;">
                      ${width.toFixed(1)}%
                    </div>
                  </div>
                </div>
              `
            })
            .join("")}
        </div>

        <!-- Memory Usage Comparison -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Average Memory Usage</h3>
          ${data.stats
            .map((stat: any) => {
              const maxMem = Math.max(...data.stats.map((s: any) => s.avgMemory))
              const width = (stat.avgMemory / maxMem) * 100
              const color = stat.algorithm === "ED25519" ? "#ec4899" : "#06b6d4"
              return `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight: 600; font-size: 14px;">${stat.algorithm}</span>
                    <span style="font-family: monospace; font-size: 14px;">${stat.avgMemory.toFixed(4)} MB</span>
                  </div>
                  <div style="width: 100%; height: 30px; background-color: #f3f4f6; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${width}%; height: 100%; background-color: ${color}; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; color: white; font-size: 12px; font-weight: 600;">
                      ${width.toFixed(1)}%
                    </div>
                  </div>
                </div>
              `
            })
            .join("")}
        </div>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #666;">
        <p style="margin: 0;">This report was automatically generated by the Crypto Benchmark Tool.</p>
        <p style="margin: 5px 0 0 0;">Performance benchmarks for ED25519 and ECDSA cryptographic algorithms.</p>
      </div>
    </div>
  `

  const element = document.createElement("div")
  element.innerHTML = html

  const opt = {
    margin: 10,
    filename: `benchmark-report-${new Date().toISOString().split("T")[0]}.pdf`,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: "portrait" as const, unit: "mm" as const, format: "a4" as const },
  }

  html2pdf().set(opt).from(element).save()
}

export function downloadFile(content: string, filename: string, mimeType = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
