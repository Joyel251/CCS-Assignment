"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface ConfigPanelProps {
  onRunBenchmark: (config: any) => void
  loading: boolean
}

export default function ConfigPanel({ onRunBenchmark, loading }: ConfigPanelProps) {
  const [config, setConfig] = useState({
    algorithms: ["ED25519", "ECDSA"],
    iterations: 1000,
    dataSize: 256,
    runs: 5,
    testInput: "",
  })

  const [algorithmSelection, setAlgorithmSelection] = useState({
    ed25519: true,
    ecdsa: true,
  })

  const handleAlgorithmToggle = (algo: string) => {
    setAlgorithmSelection((prev) => ({
      ...prev,
      [algo]: !prev[algo as keyof typeof prev],
    }))
  }

  const handleInputChange = (field: string, value: string | number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: typeof value === "string" && field !== "testInput" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleRun = () => {
    const algorithms = Object.keys(algorithmSelection)
      .filter((key) => algorithmSelection[key as keyof typeof algorithmSelection])
      .map((key) => key.toUpperCase())

    onRunBenchmark({
      ...config,
      algorithms,
    })
  }

  const allAlgorithmsSelected = Object.values(algorithmSelection).every((v) => v)
  const noAlgorithmsSelected = !Object.values(algorithmSelection).some((v) => v)

  return (
    <div className="space-y-6">
      {/* Algorithms Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Algorithms</h3>
        <div className="space-y-3">
          {[
            { id: "ed25519", label: "ED25519", description: "EdDSA signature scheme" },
            { id: "ecdsa", label: "ECDSA", description: "Elliptic Curve DSA" },
          ].map((algo) => (
            <button
              key={algo.id}
              onClick={() => handleAlgorithmToggle(algo.id)}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                algorithmSelection[algo.id as keyof typeof algorithmSelection]
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-muted/30 hover:border-muted-foreground hover:bg-muted/50"
              }`}
            >
              <div className="font-medium text-sm text-foreground">{algo.label}</div>
              <div className="text-xs text-muted-foreground">{algo.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Test Input Section - Added user test input textarea */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Test Input</h3>
        <Label className="text-xs text-muted-foreground mb-2 block">Enter custom data to sign (optional)</Label>
        <Textarea
          value={config.testInput}
          onChange={(e) => handleInputChange("testInput", e.target.value)}
          placeholder="Leave empty for random data generation"
          className="bg-background border-border/50 focus:border-primary min-h-24 resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {config.testInput.length > 0 ? `${config.testInput.length} characters` : "Using random data"}
        </p>
      </div>

      {/* Parameters Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Parameters</h3>
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Iterations per run</Label>
            <Input
              type="number"
              value={config.iterations}
              onChange={(e) => handleInputChange("iterations", e.target.value)}
              min="100"
              max="10000"
              step="100"
              className="bg-background border-border/50 focus:border-primary"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Data size (bytes)</Label>
            <Input
              type="number"
              value={config.dataSize}
              onChange={(e) => handleInputChange("dataSize", e.target.value)}
              min="32"
              max="1024"
              step="32"
              className="bg-background border-border/50 focus:border-primary"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Number of runs</Label>
            <Input
              type="number"
              value={config.runs}
              onChange={(e) => handleInputChange("runs", e.target.value)}
              min="1"
              max="20"
              step="1"
              className="bg-background border-border/50 focus:border-primary"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleRun}
        disabled={noAlgorithmsSelected || loading}
        className="w-full bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-primary-foreground font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Running Benchmark...
          </div>
        ) : (
          "Run Benchmark"
        )}
      </Button>

      {/* Info Section */}
      <Card className="p-4 bg-muted/30 border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Tip:</span> Real cryptographic operations using Web Crypto
          API. Results vary based on hardware.
        </p>
      </Card>
    </div>
  )
}
