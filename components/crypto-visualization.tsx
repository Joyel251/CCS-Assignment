"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export function CryptoVisualization() {
  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-card to-muted/10 border-border">
        <h2 className="text-2xl font-bold text-foreground mb-6">How Cryptographic Signing Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-chart-1/20 border border-chart-1 flex items-center justify-center">
                <span className="text-chart-1 font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">ED25519 (EdDSA)</h3>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Step 1: Key Generation</p>
                <p>
                  Generate a random 32-byte seed which is expanded to create a private key and public key pair using
                  elliptic curve cryptography (Curve25519).
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Step 2: Message Signing</p>
                <p>
                  Hash your message with SHA-512, then use the private key to create a cryptographic signature that
                  proves you created this message.
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Step 3: Verification</p>
                <p>
                  Anyone with your public key can verify that the signature was created by you and the message hasn't
                  been tampered with.
                </p>
              </div>

              <div className="mt-4 p-3 bg-chart-1/10 border border-chart-1/30 rounded-lg">
                <p className="text-xs font-semibold text-chart-1 mb-2">Key Characteristics:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Small keys (64 bytes total)</li>
                  <li>• Fast signing and verification</li>
                  <li>• Used in SSH, cryptocurrency, etc.</li>
                </ul>
              </div>

              <a
                href="https://ed25519.cr.yp.to/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-chart-1 hover:text-chart-1/80 text-xs font-semibold mt-3"
              >
                View ED25519 Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-chart-2/20 border border-chart-2 flex items-center justify-center">
                <span className="text-chart-2 font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">ECDSA (P-256)</h3>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Step 1: Key Generation</p>
                <p>
                  Generate a random private key and derive a public key using the P-256 elliptic curve (also known as
                  secp256r1 or prime256v1).
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Step 2: Message Signing</p>
                <p>
                  Hash your message with SHA-256, then use the private key and a random nonce to create a signature (r,
                  s pair).
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="font-semibold text-foreground mb-2">Step 3: Verification</p>
                <p>
                  Use the public key to verify that the signature is valid and the message matches. Different nonce =
                  different signature.
                </p>
              </div>

              <div className="mt-4 p-3 bg-chart-2/10 border border-chart-2/30 rounded-lg">
                <p className="text-xs font-semibold text-chart-2 mb-2">Key Characteristics:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Medium key size (65 bytes public)</li>
                  <li>• Non-deterministic (random component)</li>
                  <li>• Used in TLS, blockchain, etc.</li>
                </ul>
              </div>

              <a
                href="https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-chart-2 hover:text-chart-2/80 text-xs font-semibold mt-3"
              >
                View ECDSA Documentation
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-6">Your Input Processing Flow</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground">Your Test Input</p>
                <p className="text-sm text-muted-foreground">Text or file content you provide</p>
              </div>
            </div>

            <div className="ml-6 h-6 border-l-2 border-dashed border-border"></div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-1/20 border-2 border-chart-1 flex items-center justify-center text-chart-1 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground">Data Normalization</p>
                <p className="text-sm text-muted-foreground">
                  Convert text to bytes and pad to your specified data size
                </p>
              </div>
            </div>

            <div className="ml-6 h-6 border-l-2 border-dashed border-border"></div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-2/20 border-2 border-chart-2 flex items-center justify-center text-chart-2 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground">Cryptographic Operations</p>
                <p className="text-sm text-muted-foreground">ED25519 and ECDSA signing & verification operations</p>
              </div>
            </div>

            <div className="ml-6 h-6 border-l-2 border-dashed border-border"></div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-3/20 border-2 border-chart-3 flex items-center justify-center text-chart-3 font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-foreground">Performance Measurement</p>
                <p className="text-sm text-muted-foreground">Measure execution time and memory for each operation</p>
              </div>
            </div>

            <div className="ml-6 h-6 border-l-2 border-dashed border-border"></div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-chart-4/20 border-2 border-chart-4 flex items-center justify-center text-chart-4 font-bold">
                5
              </div>
              <div>
                <p className="font-semibold text-foreground">Statistical Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Calculate averages, percentiles, and generate visualizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Learn More About Cryptography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://cryptography.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground text-sm">Python Cryptography</p>
                <p className="text-xs text-muted-foreground mt-1">Comprehensive cryptography library documentation</p>
              </div>
            </div>
          </a>

          <a
            href="https://en.wikipedia.org/wiki/Elliptic_Curve_Cryptography"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground text-sm">Elliptic Curve Cryptography</p>
                <p className="text-xs text-muted-foreground mt-1">Understanding ECC and its applications</p>
              </div>
            </div>
          </a>

          <a
            href="https://csrc.nist.gov/publications/detail/fips/186-4/final"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground text-sm">NIST FIPS 186-4</p>
                <p className="text-xs text-muted-foreground mt-1">Digital Signature Standard specification</p>
              </div>
            </div>
          </a>

          <a
            href="https://tools.ietf.org/html/rfc8032"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-lg border border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-all"
          >
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-foreground text-sm">RFC 8032 - EdDSA</p>
                <p className="text-xs text-muted-foreground mt-1">Edwards-Curve Digital Signature Algorithm</p>
              </div>
            </div>
          </a>
        </div>
      </Card>
    </div>
  )
}
