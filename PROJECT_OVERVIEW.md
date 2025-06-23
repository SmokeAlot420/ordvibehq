# Alkanes Coming Soon - Technical Documentation

## 🎯 Project Overview

This is a **teaser/coming soon page** for the **Alkanes metaprotocol** - a Bitcoin Layer 1 smart contract platform. The page serves as a pre-launch landing page to collect wallet addresses from early adopters interested in **VibeCoders NFT** and **REACTION token** drops on the Alkanes protocol.

### Key Goals
- Create a **premium, Apple-level** user experience
- Showcase the **chemistry/scientific theme** of Alkanes (CH₄, molecular structures)
- Collect **Bitcoin Taproot addresses** for future airdrops
- Build anticipation for the Alkanes ecosystem launch

---

## 🧪 What is Alkanes?

**Alkanes** is a Bitcoin metaprotocol that brings smart contracts to Bitcoin Layer 1:

- **UTXO-native design** - Works with Bitcoin's transaction model
- **Protorunes messaging** - Advanced Bitcoin scripting capabilities  
- **Metashrew runtime** - Execution environment for smart contracts
- **Chemistry theme** - Named after hydrocarbon molecules (CH₄ = methane)

The project represents the next evolution of Bitcoin functionality, enabling complex applications while maintaining Bitcoin's security guarantees.

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling and responsive design

### UI Components & Design System
- **shadcn/ui** - Modern, accessible component library
- **Radix UI** primitives for robust component foundations
- **Lucide React** - Beautiful, customizable icons
- **React Icons** - Additional icon library

### Animation Libraries
- **Framer Motion** - Professional physics-based animations
- **GSAP (GreenSock)** - High-performance timeline animations
- **Lottie React** - Vector animation support (installed but not actively used)

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **TypeScript** - Type safety and developer experience

---

## 🎨 Design Philosophy

### Visual Theme: **Scientific Chemistry Lab**
- **Color Palette**: Emerald green (#00ff7f), cyan blue (#00d4ff), orange accents (#ff6b35)
- **Typography**: Monospace fonts for code-like feel (`alkanes.experiment()`)
- **Glass Morphism**: Translucent UI elements with backdrop blur
- **Particle Systems**: Flowing data visualization inspired by Bitcoin mempool

### Animation Strategy: **Apple-Level Polish**
- **60fps smooth animations** using hardware acceleration
- **Spring physics** for natural, bouncy interactions
- **Micro-interactions** on hover, focus, and click events
- **Layered depth** with parallax and floating elements

---

## 🧬 Component Architecture

### Main Components

#### `src/pages/Index.tsx`
**Primary landing page component**
- Manages wallet input state
- Orchestrates background particle animation
- Handles form submission logic
- Integrates all visual elements

#### `src/components/AnimatedTestTube.tsx`
**Hero animation component**
- **Framer Motion** powered 3D test tube
- **State-driven animations** (liquid level, color changes)
- **Interactive physics** (hover tilt, click scale)
- **Chemistry elements** (floating CH₄, H₂O symbols)
- **Multiple animation layers**:
  - Liquid bubbling and color transitions
  - Glass reflections and lighting
  - Energy particles floating inside
  - Outer glow effects

#### Background Animation System
**GSAP-powered particle system**
- **80 flowing particles** with smooth trajectories
- **SVG gradient paths** that draw and fade
- **Dynamic background gradients** that shift colors
- **Apple-style easing** curves for natural motion

---

## 🎭 Animation Details

### Test Tube Animations (Framer Motion)
```typescript
// Key animation features:
- Liquid level changes (40% → 75%)
- Color transitions (blue → green → orange)
- 3D rotation effects (rotateY: [0, 10, -10, 0])
- Hover interactions (scale: 1.15, rotateZ: 5)
- Bubble particles with physics
- Glass reflection effects
```

### Background Particles (GSAP)
```typescript
// Particle system features:
- 80 individual animated elements
- Smooth sine.inOut easing
- Random trajectories and timing
- Gradient color schemes
- Hardware-accelerated transforms
```

### UI Micro-interactions (CSS + Tailwind)
```css
/* Apple-style button animations */
.apple-button:hover {
  transform: scale(1.02) translateY(-1px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 📁 File Structure

```
alkanes-coming-soon/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   └── AnimatedTestTube.tsx   # Main hero animation
│   ├── pages/
│   │   ├── Index.tsx              # Landing page
│   │   └── NotFound.tsx           # 404 page
│   ├── hooks/                     # Custom React hooks
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── index.css                  # Global styles + animations
│   └── main.tsx                   # App entry point
├── public/                        # Static assets
├── components.json                # shadcn/ui configuration
├── tailwind.config.ts             # Tailwind configuration
├── vite.config.ts                 # Vite build configuration
└── package.json                   # Dependencies and scripts
```

---

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → Runs on http://localhost:7777 (or next available port)

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Server Ports
The Vite dev server automatically finds available ports:
- **Primary**: `localhost:7777`
- **Fallbacks**: `7778`, `7779`, `7780`, etc.

### Hot Module Replacement (HMR)
- **Instant updates** for React components
- **CSS hot reload** without page refresh
- **State preservation** during development

---

## 🎯 User Experience Flow

### 1. Landing Experience
- User arrives at a **dark, mysterious page**
- **Animated test tube** immediately draws attention
- **Flowing particles** create dynamic background
- **Glass morphism UI** appears with subtle entrance

### 2. Interaction Points
- **Test tube hover**: Scales and tilts with spring physics
- **Input focus**: Field lifts with glow effect
- **Button hover**: Scales with shadow and color shift
- **Form submission**: Captures wallet address

### 3. Visual Feedback
- **Chemistry symbols** float around test tube (CH₄, H₂O)
- **Liquid color changes** every 3 seconds
- **Particle flows** create sense of data movement
- **Responsive design** adapts to all screen sizes

---

## 🔧 Configuration Files

### `vite.config.ts`
```typescript
// Key configurations:
- Port: 7777 (with automatic fallback)
- React plugin for JSX support
- Path aliases (@/ → src/)
- Build optimizations
```

### `tailwind.config.ts`
```typescript
// Custom configurations:
- Extended color palette for chemistry theme
- Animation utilities
- Glass morphism utilities
- Responsive breakpoints
```

### `components.json`
```json
// shadcn/ui setup:
- TypeScript support
- Tailwind CSS integration
- Component path aliases
- Utility configurations
```

---

## 🎨 Design Tokens

### Colors
```css
/* Primary Chemistry Palette */
--emerald-400: #34d399    /* Test tube liquid */
--cyan-400: #22d3ee       /* Energy particles */
--orange-500: #f97316     /* Accent elements */

/* Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.05)
--glass-border: rgba(255, 255, 255, 0.1)
--backdrop-blur: blur(20px) saturate(180%)
```

### Typography
```css
/* Font Families */
font-mono: 'ui-monospace', 'SFMono-Regular'  /* Code elements */
font-sans: 'Inter', 'system-ui'              /* UI text */

/* Key Text Styles */
.title: text-4xl md:text-6xl font-black
.subtitle: text-lg md:text-xl font-mono
.input: placeholder-gray-400
```

### Animations
```css
/* Timing Functions (Apple-style) */
--ease-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
--ease-sine: cubic-bezier(0.445, 0.05, 0.55, 0.95)
```

---

## 🚨 Known Issues & Limitations

### Resolved Issues
- ✅ **Three.js conflicts**: Removed incompatible @react-three/fiber dependencies
- ✅ **GSAP MotionPath**: Replaced premium plugin with basic transforms
- ✅ **Orange cork element**: Removed distracting test tube stopper

### Current Limitations
- **No backend integration**: Form submission only logs to console
- **Static content**: No CMS or dynamic content management
- **Single page**: No routing or additional pages implemented

### Performance Considerations
- **80 particles**: May impact performance on low-end devices
- **Multiple animations**: Consider reducing on mobile
- **Large bundle**: Framer Motion adds ~100kb to bundle size

---

## 🔮 Future Enhancements

### Immediate Improvements
- **Backend integration** for wallet address collection
- **Form validation** with error states
- **Loading states** and success feedback
- **Mobile optimization** for particle count

### Advanced Features
- **Lottie animations** for even smoother effects
- **WebGL shaders** for advanced particle systems
- **Sound design** for interaction feedback
- **Analytics integration** for user tracking

### Content Expansion
- **About page** explaining Alkanes protocol
- **Roadmap section** with timeline
- **Team profiles** and project details
- **Documentation links** and resources

---

## 📞 Developer Handoff

### Prerequisites for New Developers
- **Node.js 18+** and npm/yarn
- **Modern browser** with ES6+ support
- **Basic React/TypeScript** knowledge
- **Tailwind CSS** familiarity

### Key Files to Understand
1. **`src/pages/Index.tsx`** - Main page logic and GSAP animations
2. **`src/components/AnimatedTestTube.tsx`** - Framer Motion test tube
3. **`src/index.css`** - Global styles and animation classes
4. **`package.json`** - Dependencies and available scripts

### Development Tips
- **Hot reload**: Changes appear instantly during development
- **Component isolation**: Test tube can be developed independently
- **Animation debugging**: Use browser dev tools performance tab
- **Responsive testing**: Test on multiple screen sizes

### Deployment Ready
- **Static build**: `npm run build` creates optimized bundle
- **No server required**: Can deploy to any static hosting
- **Environment agnostic**: No environment variables needed
- **SEO friendly**: Meta tags and semantic HTML included

---

*This project represents a cutting-edge approach to Bitcoin ecosystem marketing, combining technical excellence with compelling visual design to create anticipation for the Alkanes protocol launch.* 