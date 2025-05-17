
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Get the value for calculating the gradient color
  const value = props.value?.[0] || 0;
  const max = props.max || 10;
  
  // Updated color palette from the attached image (10 colors from grey to red)
  const updatedColorPalette = [
    "#CCCCCC", // Score 0: Grey (lowest)
    "#3F7CAC", // Score 1: Blue
    "#65B2A9", // Score 2: Teal
    "#8EC386", // Score 3: Green
    "#B6CF71", // Score 4: Light Green
    "#E0DC62", // Score 5: Yellow
    "#F9D45B", // Score 6: Light Orange
    "#F6B26A", // Score 7: Orange
    "#E6866A", // Score 8: Light Red
    "#9E1C47"  // Score 9-10: Burgundy (highest)
  ];
  
  // Calculate which color to use based on the value
  const colorIndex = Math.min(9, Math.floor((value / max) * 10));
  const color = updatedColorPalette[colorIndex];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full" style={{ backgroundColor: color }} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
