import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CloudProviderModalProps {
  onComplete: () => void
  onCancel: () => void
}

type CloudProvider = "aws" | "gcp" | "azure"

export function CloudProviderModal({
  onComplete,
  onCancel,
}: CloudProviderModalProps) {
  const [selectedProvider, setSelectedProvider] = React.useState<CloudProvider>("aws")
  const [region, setRegion] = React.useState("us-east-1")
  const [arnRole, setArnRole] = React.useState("role-here-lorem-ipsum")

  const providers = [
    { id: "aws" as const, name: "AWS" },
    { id: "gcp" as const, name: "GCP" },
    { id: "azure" as const, name: "Azure" },
  ]

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Anaconda wordmark */}
      <img
        src="/brand/anaconda-logo.svg"
        alt="Anaconda"
        className="mb-6 h-8 w-auto select-none"
        draggable={false}
      />

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Configure Cloud Compute Provider</CardTitle>
          <CardDescription>Select your cloud provider and configure the connection settings.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Cloud Provider Selection */}
          <div className="grid grid-cols-3 gap-4">
            {providers.map((provider) => (
              <Card
                key={provider.id}
                className={cn(
                  "cursor-pointer transition-colors border-2",
                  selectedProvider === provider.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <CardContent className="flex items-center justify-center h-24 p-4">
                  <span className="text-lg font-medium">{provider.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Configuration Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arn-role">ARN Role</Label>
              <Input
                id="arn-role"
                value={arnRole}
                onChange={(e) => setArnRole(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={onComplete}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Connect
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}