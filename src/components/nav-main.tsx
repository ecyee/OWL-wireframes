import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
  return (
    <>
      {items.map((item) => (
        item.items?.length ? (
          // Items with sub-items: always expanded eyebrow sections
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>
              {item.title}
            </SidebarGroupLabel>
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
