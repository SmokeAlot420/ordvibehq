# 🧪 Alkanes - A Chemistry-Inspired Web3 Coming Soon Page

> Building in public: A minimalist, high-performance coming soon page with terminal aesthetics and ambient vibes.

![Alkanes Preview](https://ordvibehq.com/og-preview.png)

## 🚀 What's This?

This is a coming soon page for the Alkanes project - an experiment in creating atmospheric web experiences. It features:

- 🧪 **Animated Chemistry**: Interactive test tube with bubbling effects
- 🎵 **Ambient Music**: Dark terminal vibes that play automatically
- ⚡ **Lightning Fast**: Optimized to just 187KB (gzipped)
- 🌐 **Web3 Ready**: Taproot wallet address collection
- 🎨 **Terminal Aesthetic**: Green-on-black hacker vibes

## 📸 Screenshots

<details>
<summary>Click to see the site in action</summary>

- Animated test tube with particle effects
- Sleek form for Twitter/X handles and Bitcoin addresses
- Ambient music controls
- Mobile-optimized responsive design

</details>

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite (for lightning-fast builds)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase (for waitlist storage)
- **Music**: Ambient track from OpenGameArt

## 🎯 Quick Start (For Beginners)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- A code editor (I recommend [VS Code](https://code.visualstudio.com/))

### 1️⃣ Clone the Project

```bash
# Copy this project to your computer
git clone https://github.com/yourusername/alkanes-coming-soon.git

# Go into the project folder
cd alkanes-coming-soon
```

### 2️⃣ Install Dependencies

```bash
# Install all the packages this project needs
npm install
```

### 3️⃣ Set Up Supabase (Database)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy your `anon public` key and `URL`
5. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4️⃣ Run the Development Server

```bash
# Start the local development server
npm run dev
```

Open http://localhost:5173 in your browser. You should see the site running!

## 📚 Educational Deep Dive

### Project Structure

```
alkanes-coming-soon/
├── src/
│   ├── components/        # React components
│   │   ├── AnimatedTestTube.tsx    # The bubbling test tube
│   │   ├── AppleBackground.tsx     # Particle background
│   │   ├── BioTerminal.tsx         # Terminal status display
│   │   └── AmbientMusic.tsx        # Music player
│   ├── pages/
│   │   └── Index.tsx              # Main page component
│   └── index.css                  # Global styles
├── public/
│   └── monoliths.mp3             # Ambient music file
└── package.json                  # Project dependencies
```

### Key Concepts Explained

#### 1. **Component-Based Architecture**
Each visual element is a separate component. This makes code reusable and easier to maintain:

```tsx
// Example: The test tube is its own component
<AnimatedTestTube />
```

#### 2. **State Management**
We use React hooks to manage form data:

```tsx
const [wallet, setWallet] = useState("");
const [twitter, setTwitter] = useState("");
```

#### 3. **Performance Optimization**
- Reduced from 75+ dependencies to just 16
- Removed unused components
- Optimized CSS from 2000+ lines to 600

#### 4. **Responsive Design**
Mobile-first approach with Tailwind CSS:

```css
/* Desktop: 80 particles, Mobile: 40 particles */
const particleCount = isMobile ? 40 : 80;
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Netlify

1. Build the project: `npm run build`
2. Drag the `dist` folder to [netlify.com](https://netlify.com)

### Option 3: Any Static Host

The `npm run build` command creates a `dist` folder with static files that can be hosted anywhere.

## 🎨 Customization Guide

### Change the Chemistry Theme

1. **Colors**: Edit the CSS variables in `src/index.css`
2. **Animations**: Modify `framer-motion` values in components
3. **Text**: Update the mysterious messages in `Index.tsx`

### Add Your Own Music

1. Replace `public/monoliths.mp3` with your track
2. Keep it under 10MB for best performance
3. Use ambient/atmospheric tracks for best effect

### Modify the Form

The form collects Twitter handles and Bitcoin addresses. To change:

1. Edit `src/pages/Index.tsx`
2. Update the Supabase table schema
3. Modify validation logic

## 📊 Performance Metrics

- **Bundle Size**: 187KB gzipped (3x smaller than original)
- **Load Time**: < 1 second on 4G
- **Lighthouse Score**: 95+ Performance
- **Dependencies**: Only 16 (minimal bloat)

## 🤝 Contributing

Feel free to fork, improve, and share! Some ideas:

- Add more animation effects
- Create different chemistry themes
- Improve the ambient music player
- Add more Web3 integrations

## 📝 License

MIT - Use this however you want!

## 🚬 Credits

Built by SmokeDev - Follow the journey on [Twitter](https://twitter.com/yourusername)

---

*"Building in public, one experiment at a time"* 🧪