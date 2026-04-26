import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

export function NavMain({
  items,
  activeKey,
  onNavigate,
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  /** URL of the currently active nav item. */
  activeKey?: string
  /** Called when a nav item is clicked. */
  onNavigate?: (url: string) => void
}) {
  // Accordion behavior: at most one main item is expanded at a time.
  // Initial expansion follows whichever item has `isActive: true`.
  const [expandedKey, setExpandedKey] = React.useState<string | null>(
    () => items.find((i) => i.isActive)?.url ?? null
  )

  return (
    <>
      {items.map((item) => (
        item.items?.length ? (
          // Items with sub-items: expandable/collapsible eyebrow sections
          <SidebarGroup key={item.title}>
            <Collapsible
              open={expandedKey === item.url}
              onOpenChange={(open) =>
                setExpandedKey(open ? item.url : null)
              }
            >
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer select-none hover:text-foreground">
                  <span className="flex items-center justify-between w-full">
                    <span>{item.title}</span>
                    <ChevronRightIcon className="size-4 transition-transform duration-200 rotate-90 data-[state=open]:-rotate-90" />
                  </span>
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenu>
                  {item.items.map((subItem) => (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={activeKey === subItem.url}
                      >
                        <a
                          href={subItem.url}
                          onClick={(e) => {
                            e.preventDefault()
                            onNavigate?.(subItem.url)
                          }}
                        >
                          {item.icon}
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        ) : (
          // Items without sub-items: direct clickable navigation
          <SidebarGroup key={item.title}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeKey === item.url}
                >
                  <a
                    href={item.url}
                    onClick={(e) => {
                      e.preventDefault()
                      onNavigate?.(item.url)
                    }}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )
      ))}
    </>
  )
}
