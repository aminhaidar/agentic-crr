import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

/**
 * Renders inside the prototype's `.overlay` (backdrop + flex centering) with the
 * `.modal` shell as the focus-trapped content, so shadcn's accessible Dialog
 * looks identical to the source markup. The `open` class is applied on mount
 * (content only exists while open) to trigger the prototype's reveal styles.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { modalClassName?: string }
>(({ className, children, modalClassName, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Overlay className={cn("overlay open", className)}>
      <DialogPrimitive.Content
        ref={ref}
        className={cn("modal", modalClassName)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Overlay>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export {
  Dialog,
  DialogPortal,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
