"use client"

import { useState } from "react"
import ConfigPanel from "@/components/config-panel"
import BenchmarkDashboard from "@/components/benchmark-dashboard"
import { CryptoVisualization } from "@/components/crypto-visualization"
import { runBenchmark } from "@/lib/benchmark-engine"
import { RotateCcw, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [benchmarkStarted, setBenchmarkStarted] = useState(false)
  const [benchmarkResults, setBenchmarkResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ algo: "", current: 0, total: 0 })
  const [activeView, setActiveView] = useState("learn")

  const handleRunBenchmark = async (config: any) => {
    setLoading(true)
    setBenchmarkStarted(true)
    setActiveView("benchmark")

    try {
      const results = await runBenchmark(
        config.algorithms,
        config.iterations,
        config.dataSize,
        config.runs,
        config.testInput || "",
        (algo: string, current: number, total: number) => {
          setProgress({ algo, current, total })
        },
      )
      setBenchmarkResults({
        ...config,
        benchmarkData: results,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Benchmark error:", error)
    } finally {
      setLoading(false)
      setProgress({ algo: "", current: 0, total: 0 })
    }
  }

  const handleReset = () => {
    setBenchmarkStarted(false)
    setBenchmarkResults(null)
    setLoading(false)
    setProgress({ algo: "", current: 0, total: 0 })
    setActiveView("learn")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 border-r border-border/50 bg-card/60 backdrop-blur-sm p-6 overflow-y-auto shadow-lg">
          <div className="mb-8">
            <div className="inline-block mb-4 px-3 py-1 rounded-lg bg-primary/10 border border-primary/30">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Cryptography</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-1">
              Crypto Benchmark
            </h1>
            <p className="text-sm text-muted-foreground">Performance analysis tool</p>
          </div>

          <ConfigPanel onRunBenchmark={handleRunBenchmark} loading={loading} />

          {benchmarkStarted && (
            <Button
              onClick={handleReset}
              variant="outline"
              className="w-full mt-6 gap-2 bg-transparent"
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4" />
              Run New Benchmark
            </Button>
          )}

          {loading && progress.total > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-foreground">{progress.algo}</p>
                <p className="text-xs text-muted-foreground">
                  {progress.current} / {progress.total}
                </p>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-chart-1 h-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-background">
          {benchmarkStarted ? (
            <Tabs value={activeView} onValueChange={setActiveView} className="w-full h-full flex flex-col">
              <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="px-8 pt-6">
                  <TabsList className="grid w-fit grid-cols-2 bg-muted/50 p-1">
                    <TabsTrigger value="benchmark" className="flex items-center gap-2">
                      Benchmark Results
                    </TabsTrigger>
                    <TabsTrigger value="learn" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Learn
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <TabsContent value="benchmark" className="m-0 p-0">
                  <BenchmarkDashboard results={benchmarkResults} loading={loading} progress={progress} />
                </TabsContent>

                <TabsContent value="learn" className="m-0 p-0">
                  <div className="p-8">
                    <CryptoVisualization />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full px-8">
              <div className="text-center max-w-2xl">
                <div className="mb-6 inline-block p-4 rounded-full bg-primary/10 border border-primary/20">
                  <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">Ready to benchmark</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Configure your benchmark parameters on the left and click{" "}
                  <span className="font-semibold text-foreground">"Run Benchmark"</span> to test the performance of
                  ED25519 and ECDSA cryptographic algorithms with your custom test input.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl mb-2">�</div>
                    <p className="font-semibold text-foreground mb-1 text-sm">Your Test Data</p>
                    <p className="text-xs text-muted-foreground">Provide custom input or use random generation</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl mb-2">⚙️</div>
                    <p className="font-semibold text-foreground mb-1 text-sm">Real Algorithms</p>
                    <p className="text-xs text-muted-foreground">ED25519 and ECDSA with Web Crypto API</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border">
                    <div className="text-2xl mb-2">�</div>
                    <p className="font-semibold text-foreground mb-1 text-sm">Detailed Results</p>
                    <p className="text-xs text-muted-foreground">Charts, statistics, and PDF export</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
