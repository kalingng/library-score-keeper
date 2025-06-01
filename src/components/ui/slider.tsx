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
  
  // Updated color palette with new colors for 8/10, 9/10 and 10/10
  const updatedColorPalette = [
    "#CCCCCC", // Score 0: Grey (lowest)
    "#E06666", // Score 1: Pink-Red
    "#E67C43", // Score 2: Orange-Red
    "#F1C232", // Score 3: Orange-Yellow
    "#FFD966", // Score 4: Yellow
    "#DFF2A9", // Score 5: Light Green-Yellow
    "#9FC686", // Score 6: Light Green
    "#76A5AF", // Score 7: Teal
    "#6D9EEB", // Score 8: Blue
    "#4B0082", // Score 9: Indigo
    "#9E1C47"  // Score 10: Burgundy/Red (highest)
  ];
  
  // Calculate which color to use based on the value
  const colorIndex = Math.min(10, Math.floor((value / max) * 11));
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
