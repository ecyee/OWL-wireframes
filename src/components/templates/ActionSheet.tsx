import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

/**
 * Canonical transient surface for taking record-level action.
 *
 * Slides in from the right (shadcn `Sheet` with side="right"),
 * renders a header (title + description), a scrollable body for the
 * form, and a sticky footer with Cancel / primary action.
 *
 * Always mount inside `AppShellLayout`'s `children` — the Sheet
 * portals to the body, so it layers correctly over the content pane
 * without leaking through navigation.
 *
 * Use this for create / edit / delete-confirm flows. For destructive
 * confirmations that need extra friction, compose an `AlertDialog`
 * inside the body rather than reusing this template.
 *
 * Naming: previously `CrudSheet`. Renamed to "Action Sheet" because
 * it is the surface the user uses to take an action on a record,
 * regardless of whether the action is CRUD. See
 * `docs/interaction-model.md` for the full interaction taxonomy.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <Button onClick={() => setOpen(true)}>Edit cluster</Button>
 *
 * <ActionSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Edit cluster"
 *   description="Update the connection details for this cluster."
 *   submitLabel="Save changes"
 *   onSubmit={async () => {
 *     await saveCluster()
 *     setOpen(false)
 *   }}
 * >
 *   <ClusterForm />
 * </ActionSheet>
 * ```
 */
export interface ActionSheetProps {
  /** Controlled open state. */
  open: boolean
  /** Controlled open-state setter. */
  onOpenChange: (open: boolean) => void
  /** Title shown in the sheet header. */
  title: string
  /** Optional subtitle shown under the title. */
  description?: string
  /** Form fields or other body content. */
  children: React.ReactNode
  /**
   * Label for the primary submit button. Defaults to "Save".
   * Omit when `onSubmit` is not provided to hide the footer.
   */
  submitLabel?: string
  /** Label for the cancel button. Defaults to "Cancel". */
  cancelLabel?: string
  /**
   * Called when the primary button is pressed. If returns a Promise,
   * the button shows disabled state until it resolves. If omitted,
   * the footer is hidden and the sheet becomes read-only.
   */
  onSubmit?: () => void | Promise<void>
  /**
   * Called when the cancel button or close control is pressed.
   * Defaults to `() => onOpenChange(false)`.
   */
  onCancel?: () => void
  /**
   * Variant of the primary button. Use `destructive` for delete /
   * remove flows. Defaults to `default`.
   */
  submitVariant?: "default" | "destructive"
  /** Override the sheet width. Defaults to a comfortable form width. */
  className?: string
}

export function ActionSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  submitVariant = "default",
  className,
}: ActionSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!onSubmit) return
    try {
      setIsSubmitting(true)
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    else onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={
          className ??
          // Width: ~50% wider than shadcn's default side sheet. Stock
          // applies `data-[side=right]:sm:max-w-sm` — we must match
          // that scope so tailwind-merge sees our rule as a conflict
          // and keeps our value. Without `data-[side=right]:`, both
          // rules survive and CSS specificity picks the stock one.
          "flex w-full flex-col gap-0 p-0 " +
            "data-[side=right]:sm:max-w-2xl md:max-w-3xl"
        }
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {onSubmit && (
          <SheetFooter className="flex-row justify-end gap-2 border-t px-6 py-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={submitVariant === "destructive" ? "destructive" : "default"}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {submitLabel}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
