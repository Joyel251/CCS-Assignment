"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeChart } from "./time-chart"
import { MemoryChart } from "./memory-chart"
import { ComparisonChart } from "./comparison-chart"
import { PerformanceMetrics } from "./performance-metrics"
import { ReportExportPanel } from "./report-export-panel"

interface BenchmarkDashboardProps {
  results: any
  loading: boolean
  progress?: { algo: string; current: number; total: number }
}

export default function BenchmarkDashboard({ results, loading, progress }: BenchmarkDashboardProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-2">Running benchmark...</p>
          {progress && progress.total > 0 && (
            <div className="text-sm text-muted-foreground">
              {progress.algo}: {progress.current} / {progress.total}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!results?.benchmarkData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No results yet</p>
        </div>
      </div>
    )
  }

  const benchmarkData = results.benchmarkData
  const algorithmStats: { [key: string]: any } = {}

  benchmarkData.forEach((metric: any) => {
    if (!algorithmStats[metric.algorithm]) {
      algorithmStats[metric.algorithm] = {
        times: [],
        memories: [],
        metrics: [],
      }
    }
    algorithmStats[metric.algorithm].times.push(...metric.times)
    algorithmStats[metric.algorithm].memories.push(...metric.memorySnapshots)
    algorithmStats[metric.algorithm].metrics.push(metric)
  })

  const stats = Object.entries(algorithmStats).map(([algo, data]: [string, any]) => {
    const times = data.times
    const sorted = [...times].sort((a, b) => a - b)
    const avg = times.reduce((a: number, b: number) => a + b) / times.length
    const variance = times.reduce((sq: number, n: number) => sq + Math.pow(n - avg, 2), 0) / times.length
    const stdDev = Math.sqrt(variance)

    return {
      algorithm: algo,
      avgTime: avg,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
      stdDevTime: stdDev,
      p50Time: sorted[Math.floor(sorted.length * 0.5)],
      p95Time: sorted[Math.floor(sorted.length * 0.95)],
      p99Time: sorted[Math.floor(sorted.length * 0.99)],
      avgMemory: data.memories.reduce((a: number, b: number) => a + b) / data.memories.length,
      opsPerSecond: (1000 / avg).toFixed(2),
      rawMetrics: data.metrics,
    }
  })

  const winner = stats.reduce((prev, current) => (prev.avgTime > current.avgTime ? current : prev))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
          Benchmark Results
        </h2>
        <p className="text-muted-foreground">
          Performance analysis for{" "}
          <span className="font-semibold text-foreground">{results?.algorithms?.join(" vs ")}</span>
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.algorithm}
                className={`p-6 border-2 transition-all duration-200 ${
                  stat.algorithm === winner.algorithm
                    ? "border-chart-1 bg-gradient-to-br from-card to-chart-1/5 shadow-lg"
                    : "border-border bg-card hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">{stat.algorithm}</h3>
                  {stat.algorithm === winner.algorithm && (
                    <span className="text-xs bg-chart-1/20 text-chart-1 px-2 py-1 rounded-full font-semibold">
                      Faster
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Average Time</span>
                    <span className="font-mono text-foreground font-semibold">{stat.avgTime.toFixed(2)} ms</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Std Dev</span>
                    <span className="font-mono text-foreground font-semibold">{stat.stdDevTime.toFixed(2)} ms</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Operations/sec</span>
                    <span className="font-mono text-foreground font-semibold">{stat.opsPerSecond}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Avg Memory</span>
                    <span className="font-mono text-foreground font-semibold">{stat.avgMemory.toFixed(4)} MB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">Time Range</span>
                    <span className="font-mono text-foreground text-sm">
                      {stat.minTime.toFixed(2)} - {stat.maxTime.toFixed(2)} ms
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="charts" className="mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
              <PerformanceMetrics stats={stats} />
            </div>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Execution Time Over Iterations</h3>
              <TimeChart
                data={benchmarkData.map((metric: any) => ({
                  algorithm: metric.algorithm,
                  times: metric.times,
                }))}
              />
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Memory Usage</h3>
              <MemoryChart
                data={stats.map((stat: any) => ({
                  algorithm: stat.algorithm,
                  avgMemory: stat.avgMemory,
                }))}
              />
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Time vs Memory Comparison</h3>
              <ComparisonChart data={stats} />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Detailed Statistics</h3>
            <div className="space-y-6">
              {stats.map((stat) => (
                <div key={stat.algorithm} className="border-b border-border pb-6 last:border-b-0">
                  <h4 className="font-semibold text-foreground mb-4">{stat.algorithm}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Min Time</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.minTime.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Avg Time</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.avgTime.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Max Time</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.maxTime.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.stdDevTime.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">P50</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.p50Time.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">P95</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.p95Time.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">P99</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.p99Time.toFixed(2)} ms</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Ops/Sec</p>
                      <p className="font-mono font-semibold text-foreground text-sm">{stat.opsPerSecond}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6">Input Processing Details</h3>
              {benchmarkData[0]?.inputDetails && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Input Type</span>
                    <span className="font-mono text-foreground">
                      {benchmarkData[0].inputDetails.isCustomInput ? "Custom User Input" : "Random Generated Data"}
                    </span>
                  </div>
                  {benchmarkData[0].inputDetails.isCustomInput && (
                    <>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Original Input</span>
                        <span className="font-mono text-foreground text-sm max-w-md truncate">
                          "{benchmarkData[0].inputDetails.originalInput}"
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Input Length (characters)</span>
                        <span className="font-mono text-foreground">{benchmarkData[0].inputDetails.inputLength}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-muted-foreground">Encoded Length (bytes)</span>
                        <span className="font-mono text-foreground">{benchmarkData[0].inputDetails.encodedLength}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Final Data Size (bytes)</span>
                    <span className="font-mono text-foreground">{benchmarkData[0].inputDetails.dataSize}</span>
                  </div>
                  {benchmarkData[0].inputDetails.isCustomInput && 
                   benchmarkData[0].inputDetails.encodedLength < benchmarkData[0].inputDetails.dataSize && (
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Note: Your input was repeated {Math.ceil(benchmarkData[0].inputDetails.dataSize / benchmarkData[0].inputDetails.encodedLength)} times 
                        to reach the target data size of {benchmarkData[0].inputDetails.dataSize} bytes.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6">Benchmark Configuration</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Algorithms Tested</span>
                  <span className="font-mono text-foreground">{results?.algorithms?.join(", ")}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Iterations per Run</span>
                  <span className="font-mono text-foreground">{results?.iterations}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Data Size</span>
                  <span className="font-mono text-foreground">{results?.dataSize} bytes</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Number of Runs</span>
                  <span className="font-mono text-foreground">{results?.runs}</span>
                </div>
                {results?.testInput && (
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Test Input Length</span>
                    <span className="font-mono text-foreground">{results.testInput.length} characters</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-mono text-foreground text-sm">
                    {new Date(results?.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <ReportExportPanel results={results} stats={stats} />
          
          {/* Detailed Cryptographic Process Breakdown */}
          <div className="mt-6 space-y-6">
            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">How Your Input is Processed</h3>
              
              {benchmarkData[0]?.inputDetails && (
                <div className="space-y-6">
                  {/* Step 1: Input Reception */}
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Step 1: Input Reception</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Your Input:</span> "
                        {benchmarkData[0].inputDetails.isCustomInput 
                          ? benchmarkData[0].inputDetails.originalInput 
                          : "Random bytes generated"}
                        "
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Type:</span> {
                          benchmarkData[0].inputDetails.isCustomInput 
                            ? "UTF-8 Text String" 
                            : "Cryptographically secure random data"
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Character Count:</span> {benchmarkData[0].inputDetails.inputLength}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Text Encoding */}
                  {benchmarkData[0].inputDetails.isCustomInput && (
                    <div className="border-l-4 border-chart-1 pl-4">
                      <h4 className="font-semibold text-foreground mb-2">Step 2: UTF-8 Encoding</h4>
                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Your text is converted to bytes using UTF-8 encoding. Each character becomes one or more bytes.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">Encoded Size:</span> {benchmarkData[0].inputDetails.encodedLength} bytes
                        </p>
                        <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                          TextEncoder.encode("{benchmarkData[0].inputDetails.originalInput.substring(0, 30)}...")
                          → Uint8Array({benchmarkData[0].inputDetails.encodedLength})
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Data Padding */}
                  <div className="border-l-4 border-chart-2 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Step 3: Data Padding/Normalization</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">
                        The data is {benchmarkData[0].inputDetails.isCustomInput && benchmarkData[0].inputDetails.encodedLength < benchmarkData[0].inputDetails.dataSize ? "padded" : "sized"} to exactly {benchmarkData[0].inputDetails.dataSize} bytes by repeating the pattern.
                      </p>
                      {benchmarkData[0].inputDetails.isCustomInput && benchmarkData[0].inputDetails.encodedLength < benchmarkData[0].inputDetails.dataSize && (
                        <>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">Repetitions:</span> {Math.ceil(benchmarkData[0].inputDetails.dataSize / benchmarkData[0].inputDetails.encodedLength)}x
                          </p>
                          <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                            for (i = 0; i &lt; {benchmarkData[0].inputDetails.dataSize}; i++) {"{"}<br/>
                            &nbsp;&nbsp;data[i] = encoded[i % {benchmarkData[0].inputDetails.encodedLength}]<br/>
                            {"}"}
                          </div>
                        </>
                      )}
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Final Size:</span> {benchmarkData[0].inputDetails.dataSize} bytes
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Key Generation */}
                  <div className="border-l-4 border-chart-3 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Step 4: Cryptographic Key Generation</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      {results?.algorithms?.map((algo: string) => (
                        <div key={algo} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                          <p className="font-semibold text-foreground text-sm mb-2">{algo} Algorithm:</p>
                          {algo === "ED25519" ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                • Generates a key pair using Curve25519 elliptic curve
                              </p>
                              <p className="text-sm text-muted-foreground">
                                • Private Key: 32 bytes (256 bits)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                • Public Key: 32 bytes (256 bits)
                              </p>
                              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                                crypto.subtle.generateKey("Ed25519", false, ["sign", "verify"])
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                • Generates a key pair using P-256 (secp256r1) elliptic curve
                              </p>
                              <p className="text-sm text-muted-foreground">
                                • Private Key: 32 bytes (256 bits)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                • Public Key: 65 bytes (uncompressed point)
                              </p>
                              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                                crypto.subtle.generateKey({"{"}name: "ECDSA", namedCurve: "P-256"{"}"}, false, ["sign", "verify"])
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 5: Signing Process */}
                  <div className="border-l-4 border-chart-4 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Step 5: Digital Signature Generation</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      {results?.algorithms?.map((algo: string) => (
                        <div key={algo} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                          <p className="font-semibold text-foreground text-sm mb-2">{algo} Signing:</p>
                          {algo === "ED25519" ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                1. Hash the {benchmarkData[0].inputDetails.dataSize}-byte data with SHA-512
                              </p>
                              <p className="text-sm text-muted-foreground">
                                2. Use private key to generate deterministic signature
                              </p>
                              <p className="text-sm text-muted-foreground">
                                3. Signature size: 64 bytes (512 bits)
                              </p>
                              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                                signature = crypto.subtle.sign("Ed25519", privateKey, data)<br/>
                                // Returns 64-byte signature
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                1. Hash the {benchmarkData[0].inputDetails.dataSize}-byte data with SHA-256
                              </p>
                              <p className="text-sm text-muted-foreground">
                                2. Generate random nonce (k) for this signature
                              </p>
                              <p className="text-sm text-muted-foreground">
                                3. Compute signature (r, s) using private key and nonce
                              </p>
                              <p className="text-sm text-muted-foreground">
                                4. Signature size: ~64-72 bytes (DER encoded)
                              </p>
                              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                                signature = crypto.subtle.sign(<br/>
                                &nbsp;&nbsp;{"{"}name: "ECDSA", hash: "SHA-256"{"}"}, <br/>
                                &nbsp;&nbsp;privateKey, data<br/>
                                )
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 6: Verification Process */}
                  <div className="border-l-4 border-chart-5 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Step 6: Signature Verification</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                      {results?.algorithms?.map((algo: string) => (
                        <div key={algo} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                          <p className="font-semibold text-foreground text-sm mb-2">{algo} Verification:</p>
                          {algo === "ED25519" ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                1. Hash the original {benchmarkData[0].inputDetails.dataSize}-byte data with SHA-512
                              </p>
                              <p className="text-sm text-muted-foreground">
                                2. Use public key to verify the 64-byte signature
                              </p>
                              <p className="text-sm text-muted-foreground">
                                3. Returns: true (valid) or false (invalid)
                              </p>
                              <p className="text-sm text-muted-foreground">
                                4. This proves the data wasn't tampered with and was signed by the private key holder
                              </p>
                              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                                isValid = crypto.subtle.verify(<br/>
                                &nbsp;&nbsp;"Ed25519", publicKey, signature, data<br/>
                                )<br/>
                                // Returns boolean
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-muted-foreground">
                                1. Hash the original {benchmarkData[0].inputDetails.dataSize}-byte data with SHA-256
                              </p>
                              <p className="text-sm text-muted-foreground">
                                2. Extract (r, s) values from signature
                              </p>
                              <p className="text-sm text-muted-foreground">
                                3. Use public key to verify the signature mathematically
                              </p>
                              <p className="text-sm text-muted-foreground">
                                4. Returns: true (valid) or false (invalid)
                              </p>
                              <div className="mt-2 font-mono text-xs bg-background p-2 rounded">
                                isValid = crypto.subtle.verify(<br/>
                                &nbsp;&nbsp;{"{"}name: "ECDSA", hash: "SHA-256"{"}"}, <br/>
                                &nbsp;&nbsp;publicKey, signature, data<br/>
                                )
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 7: Performance Measurement */}
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold text-foreground mb-2">Step 7: Performance Measurement</h4>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">
                        This entire process (steps 4-6) is repeated <span className="font-semibold text-foreground">{results?.iterations}</span> times
                        across <span className="font-semibold text-foreground">{results?.runs}</span> runs.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For each iteration, we measure:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Key generation time (milliseconds)</li>
                        <li>• Signing time (milliseconds)</li>
                        <li>• Verification time (milliseconds)</li>
                        <li>• Memory used (megabytes)</li>
                      </ul>
                      <p className="text-sm text-muted-foreground mt-2">
                        Total operations performed: <span className="font-semibold text-foreground">{results?.iterations * results?.runs}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
