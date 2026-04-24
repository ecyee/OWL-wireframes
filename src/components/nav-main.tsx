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
  label = "Platform",
  items,
  activeKey,
  onNavigate,
}: {
  /** Sidebar group label shown above the items. */
  label?: string
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
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={expandedKey === item.url}
            onOpenChange={(open) =>
              setExpandedKey(open ? item.url : null)
            }
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={activeKey === item.url}
              >
                <a
                  href={item.url}
                  onClick={(e) => {
                    e.preventDefault()
                    // Clicking the main item: select it AND collapse
                    // all other submenus, expanding this one.
                    setExpandedKey(item.url)
                    onNavigate?.(item.url)
                  }}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRightIcon />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
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
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
