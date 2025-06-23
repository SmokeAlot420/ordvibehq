
# FANCY AI Design Landing Page - Recreation Prompt

## Overview
Create a modern, dark-themed landing page for "FANCY" - an AI-powered design tool with an integrated 3D Spline background viewer.

## Required Technologies
- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Spline 3D viewer integration
- Vite as build tool

## Project Structure
```
src/
├── pages/
│   └── Index.tsx          # Main landing page component
├── components/
│   └── ui/                # Shadcn/ui components
├── lib/
│   └── utils.ts           # Utility functions
└── index.css             # Global styles and design system
```

## Step 1: Setup Dependencies
Install the following packages:
```bash
npm install @radix-ui/react-slot
npm install class-variance-authority
npm install clsx
npm install tailwind-merge
npm install lucide-react
npm install tailwindcss-animate
```

## Step 2: HTML Setup (index.html)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FANCY - AI Design Concepts</title>
    <meta name="description" content="The most advanced AI-powered design tool to create stunning concepts in minutes" />
    <meta name="author" content="FANCY" />

    <meta property="og:title" content="FANCY - AI Design Concepts" />
    <meta property="og:description" content="The most advanced AI-powered design tool to create stunning concepts in minutes" />
    <meta property="og:type" content="website" />

    <meta name="twitter:card" content="summary_large_image" />
    
    <!-- CRITICAL: Spline 3D Viewer Script -->
    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.10.4/build/spline-viewer.js"></script>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## Step 3: TypeScript Declaration for Spline Viewer
Create or add to `src/vite-env.d.ts`:
```typescript
/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        style?: React.CSSProperties;
        loading?: string;
        'events-target'?: string;
      };
    }
  }
}

export {};
```

## Step 4: Tailwind Configuration (tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        // Design system colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

## Step 5: Global Styles (src/index.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Step 6: Button Component (src/components/ui/button.tsx)
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

## Step 7: Utility Functions (src/lib/utils.ts)
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Step 8: Main Landing Page Component (src/pages/Index.tsx)
```tsx
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">F</span>
          </div>
          <span className="text-white font-semibold text-lg">FANCY</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Products</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Solutions</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
        </div>
        
        <Button className="bg-white text-black hover:bg-gray-200 transition-colors">
          Start trial
        </Button>
      </nav>

      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <spline-viewer 
          url="https://prod.spline.design/dYsR51OTIcSHoMC5/scene.splinecode"
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-5"></div>

      {/* Hero Content */}
      <div className="relative min-h-screen flex items-center justify-center px-8 z-10">
        <div className="max-w-4xl text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Let <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">FANCY</span>
            <br />
            make concept
            <br />
            for you
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            The most advanced AI-powered design tool to create stunning concepts in minutes. 
            Transform your ideas into reality with our intelligent design system.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-300 px-10 py-4 text-xl font-semibold group">
              Start now
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="ghost" className="text-white border-2 border-gray-600 hover:border-white hover:bg-white/10 transition-all duration-300 px-10 py-4 text-xl group">
              <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
              Watch demo
            </Button>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400/60 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-300/50 rounded-full animate-pulse delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
```

## Key Features Implemented

### 🎨 Design Elements
- **Dark theme** with sophisticated color palette
- **Gradient text effects** for brand emphasis
- **Responsive typography** with large, bold headings
- **Floating particle animations** for visual interest

### 🚀 3D Integration
- **Spline 3D viewer** as immersive background
- **Proper TypeScript declarations** for custom elements
- **Layered z-index system** for content hierarchy
- **Dark overlay** for text readability

### 📱 Responsive Design
- **Mobile-first approach** with breakpoint considerations
- **Flexible button layouts** for different screen sizes
- **Scalable typography** across devices

### 🎯 Interactive Elements
- **Hover animations** on buttons and navigation
- **Transition effects** for smooth interactions
- **Icon animations** with Lucide React
- **Button variants** using class-variance-authority

### ⚡ Performance Optimizations
- **Tree-shakable icon imports** from Lucide React
- **Efficient CSS animations** with Tailwind
- **Optimized Spline viewer integration**

## Critical Notes

1. **Spline Integration**: The TypeScript declaration for `spline-viewer` is essential for compilation
2. **Z-Index Layering**: Proper stacking context ensures content visibility over 3D background
3. **Performance**: Spline viewer loads asynchronously to prevent blocking
4. **Accessibility**: Proper semantic HTML and focus states maintained
5. **Browser Compatibility**: Modern browser features used (CSS Grid, Flexbox, Custom Properties)

## Customization Options

- Replace Spline URL with different 3D scenes
- Modify color scheme via CSS custom properties
- Adjust particle animations timing and positions
- Update typography scale in Tailwind config
- Customize button styles and interactions

This prompt provides a complete foundation for recreating the FANCY AI Design landing page with full 3D background integration.
