
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
  
  // Use Spectral-10 color scale (values from loading.io/color/feature/Spectral-10/)
  const spectral10Colors = [
    "#5e4fa2", // Score 0: Blue (lowest)
    "#3288bd", // Score 1: Light blue
    "#66c2a5", // Score 2: Teal
    "#abdda4", // Score 3: Light green
    "#e6f598", // Score 4: Yellow-green
    "#fee08b", // Score 5: Light yellow
    "#fdae61", // Score 6: Light orange
    "#f46d43", // Score 7: Orange-red
    "#d53e4f", // Score 8-9: Red
    "#9e0142"  // Score 10: Dark red (highest)
  ];
  
  // Calculate which color to use based on the value
  const colorIndex = Math.min(9, Math.floor((value / max) * 10));
  const color = spectral10Colors[colorIndex];

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
