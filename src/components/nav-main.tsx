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
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          item.items?.length ? (
            // Items with sub-items: expandable/collapsible sections
            <Collapsible
              key={item.title}
              asChild
              open={expandedKey === item.url}
              onOpenChange={(open) =>
                setExpandedKey(open ? item.url : null)
              }
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <ChevronRightIcon className="size-4 transition-transform duration-200 data-[state=open]:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
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
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // Items without sub-items: direct clickable navigation
            <SidebarMenuItem key={item.title}>
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
          )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
