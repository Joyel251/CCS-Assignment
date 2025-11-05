export interface BenchmarkResult {
  algorithm: string
  executionTime: number
  memoryUsed: number
  operationsPerSecond: number
}

export interface BenchmarkMetrics {
  algorithm: string
  times: number[]
  memorySnapshots: number[]
  avgTime: number
  minTime: number
  maxTime: number
  stdDevTime: number
  p50Time: number
  p95Time: number
  p99Time: number
  avgMemory: number
  inputDetails?: {
    originalInput: string
    inputLength: number
    encodedLength: number
    dataSize: number
    isCustomInput: boolean
  }
}

async function generateDataFromInput(input: string, size: number): Promise<Uint8Array> {
  // Use user input if provided, otherwise generate random data
  if (input && input.length > 0) {
    const encoder = new TextEncoder()
    const encoded = encoder.encode(input)
    const data = new Uint8Array(size)

    // Repeat input to fill the requested size
    for (let i = 0; i < size; i++) {
      data[i] = encoded[i % encoded.length]
    }
    return data
  }
  return crypto.getRandomValues(new Uint8Array(size))
}

function calculateStatistics(times: number[]) {
  const sorted = [...times].sort((a, b) => a - b)
  const avg = times.reduce((a, b) => a + b) / times.length
  const variance = times.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / times.length
  const stdDev = Math.sqrt(variance)

  return {
    avg,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stdDev,
    p50: sorted[Math.floor(sorted.length * 0.5)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  }
}

async function runED25519Benchmark(
  iterations: number,
  dataSize: number,
  userInput: string,
  onProgress?: (current: number, total: number) => void,
): Promise<BenchmarkMetrics> {
  const times: number[] = []
  const memorySnapshots: number[] = []

  // Calculate input details
  const encoder = new TextEncoder()
  const encoded = userInput ? encoder.encode(userInput) : null
  const inputDetails = {
    originalInput: userInput || "Random data",
    inputLength: userInput.length,
    encodedLength: encoded ? encoded.length : 0,
    dataSize: dataSize,
    isCustomInput: userInput.length > 0,
  }

  for (let i = 0; i < iterations; i++) {
    const dataTemp = await generateDataFromInput(userInput, dataSize)
    const data = new Uint8Array(dataTemp)

    // Generate keypair
    const startKey = performance.now()
    const keyPair = await crypto.subtle.generateKey("Ed25519", false, ["sign", "verify"])
    const keyTime = performance.now() - startKey

    // Sign operation
    const startSign = performance.now()
    const signature = await crypto.subtle.sign("Ed25519", keyPair.privateKey, data)
    const signTime = performance.now() - startSign

    // Verify operation
    const startVerify = performance.now()
    await crypto.subtle.verify("Ed25519", keyPair.publicKey, signature, data)
    const verifyTime = performance.now() - startVerify

    times.push(keyTime + signTime + verifyTime)

    // Estimate memory usage
    const memEstimate = (data.byteLength + signature.byteLength) / (1024 * 1024)
    memorySnapshots.push(memEstimate)

    if (onProgress) {
      onProgress(i + 1, iterations)
    }
  }

  const stats = calculateStatistics(times)
  const avgMemory = memorySnapshots.reduce((a, b) => a + b) / memorySnapshots.length

  return {
    algorithm: "ED25519",
    times,
    memorySnapshots,
    avgTime: stats.avg,
    minTime: stats.min,
    maxTime: stats.max,
    stdDevTime: stats.stdDev,
    p50Time: stats.p50,
    p95Time: stats.p95,
    p99Time: stats.p99,
    avgMemory,
    inputDetails,
  }
}

async function runECDSABenchmark(
  iterations: number,
  dataSize: number,
  userInput: string,
  onProgress?: (current: number, total: number) => void,
): Promise<BenchmarkMetrics> {
  const times: number[] = []
  const memorySnapshots: number[] = []

  // Calculate input details
  const encoder = new TextEncoder()
  const encoded = userInput ? encoder.encode(userInput) : null
  const inputDetails = {
    originalInput: userInput || "Random data",
    inputLength: userInput.length,
    encodedLength: encoded ? encoded.length : 0,
    dataSize: dataSize,
    isCustomInput: userInput.length > 0,
  }

  for (let i = 0; i < iterations; i++) {
    const dataTemp = await generateDataFromInput(userInput, dataSize)
    const data = new Uint8Array(dataTemp)

    // Generate keypair
    const startKey = performance.now()
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "ECDSA",
        namedCurve: "P-256",
      },
      false,
      ["sign", "verify"],
    )
    const keyTime = performance.now() - startKey

    // Sign operation
    const startSign = performance.now()
    const signature = await crypto.subtle.sign(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.privateKey,
      data,
    )
    const signTime = performance.now() - startSign

    // Verify operation
    const startVerify = performance.now()
    await crypto.subtle.verify(
      {
        name: "ECDSA",
        hash: "SHA-256",
      },
      keyPair.publicKey,
      signature,
      data,
    )
    const verifyTime = performance.now() - startVerify

    times.push(keyTime + signTime + verifyTime)

    // Estimate memory usage
    const memEstimate = (data.byteLength + signature.byteLength) / (1024 * 1024)
    memorySnapshots.push(memEstimate)

    if (onProgress) {
      onProgress(i + 1, iterations)
    }
  }

  const stats = calculateStatistics(times)
  const avgMemory = memorySnapshots.reduce((a, b) => a + b) / memorySnapshots.length

  return {
    algorithm: "ECDSA",
    times,
    memorySnapshots,
    avgTime: stats.avg,
    minTime: stats.min,
    maxTime: stats.max,
    stdDevTime: stats.stdDev,
    p50Time: stats.p50,
    p95Time: stats.p95,
    p99Time: stats.p99,
    avgMemory,
    inputDetails,
  }
}

export async function runBenchmark(
  algorithms: string[],
  iterations: number,
  dataSize: number,
  runs: number,
  userInput = "",
  onProgress?: (algo: string, current: number, total: number) => void,
): Promise<BenchmarkMetrics[]> {
  const results: BenchmarkMetrics[] = []

  for (const algo of algorithms) {
    for (let run = 0; run < runs; run++) {
      let metrics: BenchmarkMetrics

      const progressCallback = (current: number, total: number) => {
        if (onProgress) {
          onProgress(algo, current, total)
        }
      }

      if (algo === "ED25519") {
        metrics = await runED25519Benchmark(Math.ceil(iterations / runs), dataSize, userInput, progressCallback)
      } else if (algo === "ECDSA") {
        metrics = await runECDSABenchmark(Math.ceil(iterations / runs), dataSize, userInput, progressCallback)
      } else {
        continue
      }

      results.push(metrics)
    }
  }

  return results
}
