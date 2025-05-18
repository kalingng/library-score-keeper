
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Use the same color palette as the slider for consistency
  const updatedColorPalette = [
    "#CCCCCC", // Score 0-1: Grey (lowest)
    "#E06666", // Score 2: Pink-Red
    "#E67C43", // Score 3: Orange-Red
    "#F1C232", // Score 4: Orange-Yellow
    "#FFD966", // Score 5: Yellow
    "#DFF2A9", // Score 6: Light Green-Yellow
    "#9FC686", // Score 7: Light Green
    "#76A5AF", // Score 8: Teal
    "#6D9EEB", // Score 9: Blue
    "#9E1C47"  // Score 10: Burgundy/Red (highest)
  ];
  
  // Calculate color based on value percentage
  const percentage = value || 0;
  const colorIndex = Math.min(9, Math.floor((percentage / 100) * 10));
  const color = updatedColorPalette[colorIndex];

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 transition-all"
        style={{ 
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: color
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
