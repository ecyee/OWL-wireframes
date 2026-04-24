import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSignIcon,
  BarChart3Icon,
  FileTextIcon,
  ArrowRightIcon
} from "lucide-react"

const complianceItems = [
  {
    title: "Cost Reports",
    description: "View and analyze spending across your organization",
    icon: DollarSignIcon,
    href: "/compliance-reporting/cost-reports",
  },
  {
    title: "Usage Reports",
    description: "Monitor resource utilization and user activity",
    icon: BarChart3Icon,
    href: "/compliance-reporting/usage-reports",
  },
  {
    title: "Audit Logs",
    description: "Track security events and administrative actions",
    icon: FileTextIcon,
    href: "/compliance-reporting/audit-logs",
  },
]

interface ComplianceReportingProps {
  onNavigate?: (url: string) => void
}

export function ComplianceReporting({ onNavigate }: ComplianceReportingProps) {
  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complianceItems.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="relative group hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  onClick={() => onNavigate?.(item.href)}
                >
                  View {item.title}
                  <ArrowRightIcon className="ml-2 size-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}