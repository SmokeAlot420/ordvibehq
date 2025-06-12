
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 relative z-10">
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

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-black to-black"></div>
        
        {/* 3D Spoon Element */}
        <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 rotate-12">
          <div className="relative">
            {/* Spoon handle */}
            <div className="w-2 h-80 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-600 rounded-full shadow-2xl transform rotate-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
            </div>
            
            {/* Spoon bowl */}
            <div className="absolute -top-4 -left-6 w-16 h-20 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 rounded-full shadow-2xl transform -rotate-12">
              <div className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
              <div className="absolute top-1 left-2 w-3 h-3 bg-white/60 rounded-full blur-sm"></div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-amber-400/20 blur-3xl scale-150 rounded-full"></div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400/60 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl text-left">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Let <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">FANCY</span>
            <br />
            make concept
            <br />
            for you
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
            The most advanced AI-powered design tool to create stunning concepts in minutes. 
            Transform your ideas into reality with our intelligent design system.
          </p>
          
          <div className="flex items-center space-x-4">
            <Button className="bg-white text-black hover:bg-gray-200 transition-all duration-300 px-8 py-3 text-lg font-semibold group">
              Start now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="ghost" className="text-white border border-gray-600 hover:border-white transition-all duration-300 px-8 py-3 text-lg group">
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch demo
            </Button>
          </div>
        </div>

        {/* Curved lines decoration */}
        <div className="absolute top-1/2 left-0 w-full h-full pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <path
              d="M0 400 Q300 200 600 400 T1200 400"
              stroke="url(#gradient1)"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M0 450 Q300 250 600 450 T1200 450"
              stroke="url(#gradient2)"
              strokeWidth="1"
              fill="none"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgb(251, 191, 36)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="rgb(255, 255, 255)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Index;
