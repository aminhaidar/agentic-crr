import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * Wraps Radix Switch in the prototype's `.switch` button styling. The knob is
 * drawn by the prototype's `::after` pseudo-element, so no Thumb is rendered;
 * the `on` class is driven by the checked state.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, checked, defaultChecked, ...props }, ref) => {
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const isOn = checked ?? internal;
  return (
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(v) => {
        if (checked === undefined) setInternal(v);
        props.onCheckedChange?.(v);
      }}
      className={cn("switch", isOn && "on", className)}
      {...props}
    />
  );
});
Switch.displayName = "Switch";

export { Switch };
