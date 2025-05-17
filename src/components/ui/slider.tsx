
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
  
  // Updated color palette from grey to red (10 colors)
  const updatedColorPalette = [
    "#CCCCCC", // Score 1: Grey (lowest)
    "#B5B9CF", // Score 2
    "#9EA6CF", // Score 3
    "#869ACF", // Score 4
    "#6F8CCF", // Score 5
    "#D4AD9C", // Score 6
    "#D49C89", // Score 7
    "#D38A77", // Score 8
    "#D27964", // Score 9
    "#9E1C47"  // Score 10: Red (highest)
  ];
  
  // Calculate which color to use based on the value
  const colorIndex = Math.max(0, Math.min(9, Math.floor((value / max) * 10) - 1));
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
