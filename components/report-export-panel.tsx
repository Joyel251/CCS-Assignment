"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, FileText, FileJson, FilePen as FilePdf, ExternalLink } from "lucide-react"
import {
  generateTextReport,
  generateCSVReport,
  generateJSONReport,
  generatePDFReport,
  downloadFile,
} from "@/lib/report-generator"

interface ReportExportPanelProps {
  results: any
  stats: Array<{
    algorithm: string
    avgTime: number
    minTime: number
    maxTime: number
    stdDevTime: number
    p50Time: number
    p95Time: number
    p99Time: number
    avgMemory: number
    opsPerSecond: number
  }>
}

export function ReportExportPanel({ results, stats }: ReportExportPanelProps) {
  const handleExportTXT = () => {
    const report = generateTextReport({
      algorithms: results.algorithms,
      iterations: results.iterations,
      dataSize: results.dataSize,
      runs: results.runs,
      timestamp: results.timestamp,
      testInput: results.testInput,
      stats,
      benchmarkData: results.benchmarkData,
    })
    downloadFile(report, `benchmark-report-${new Date().toISOString().split("T")[0]}.txt`)
  }

  const handleExportCSV = () => {
    const report = generateCSVReport({
      algorithms: results.algorithms,
      iterations: results.iterations,
      dataSize: results.dataSize,
      runs: results.runs,
      timestamp: results.timestamp,
      testInput: results.testInput,
      stats,
      benchmarkData: results.benchmarkData,
    })
    downloadFile(report, `benchmark-report-${new Date().toISOString().split("T")[0]}.csv`, "text/csv")
  }

  const handleExportJSON = () => {
    const report = generateJSONReport({
      algorithms: results.algorithms,
      iterations: results.iterations,
      dataSize: results.dataSize,
      runs: results.runs,
      timestamp: results.timestamp,
      testInput: results.testInput,
      stats,
      benchmarkData: results.benchmarkData,
    })
    downloadFile(report, `benchmark-report-${new Date().toISOString().split("T")[0]}.json`, "application/json")
  }

  const handleExportPDF = () => {
    generatePDFReport({
      algorithms: results.algorithms,
      iterations: results.iterations,
      dataSize: results.dataSize,
      runs: results.runs,
      timestamp: results.timestamp,
      testInput: results.testInput,
      stats,
      benchmarkData: results.benchmarkData,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={handleExportTXT}
            variant="outline"
            className="flex items-center gap-2 justify-center h-auto flex-col py-4 bg-transparent hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">Text</span>
          </Button>

          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2 justify-center h-auto flex-col py-4 bg-transparent hover:bg-muted/50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">CSV</span>
          </Button>

          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="flex items-center gap-2 justify-center h-auto flex-col py-4 bg-transparent hover:bg-muted/50 transition-colors"
          >
            <FileJson className="w-5 h-5" />
            <span className="text-xs font-medium">JSON</span>
          </Button>

          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="flex items-center gap-2 justify-center h-auto flex-col py-4 bg-transparent hover:bg-muted/50 transition-colors"
          >
            <FilePdf className="w-5 h-5" />
            <span className="text-xs font-medium">PDF</span>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
          Download your benchmark results with detailed statistics (avg, stddev, percentiles) in multiple formats for
          sharing and documentation.
        </p>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Reference Documentation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://ed25519.cr.yp.to/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all flex items-start gap-2 group"
          >
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm">ED25519 Specs</p>
              <p className="text-xs text-muted-foreground">Official EdDSA documentation</p>
            </div>
          </a>

          <a
            href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all flex items-start gap-2 group"
          >
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm">ECDSA Overview</p>
              <p className="text-xs text-muted-foreground">Elliptic Curve Digital Signature</p>
            </div>
          </a>

          <a
            href="https://tools.ietf.org/html/rfc8032"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all flex items-start gap-2 group"
          >
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm">RFC 8032</p>
              <p className="text-xs text-muted-foreground">EdDSA Standard Specification</p>
            </div>
          </a>

          <a
            href="https://csrc.nist.gov/publications/detail/fips/186-4/final"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all flex items-start gap-2 group"
          >
            <ExternalLink className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm">NIST FIPS 186-4</p>
              <p className="text-xs text-muted-foreground">Digital Signature Standard</p>
            </div>
          </a>
        </div>
      </Card>
    </div>
  )
}
