
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
        ></spline-viewer>
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
