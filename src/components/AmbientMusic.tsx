import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function AmbientMusic() {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Try multiple autoplay strategies
    if (audioRef.current && isLoaded) {
      audioRef.current.volume = 0.7;
      
      // Strategy 1: Immediate play attempt
      const tryAutoplay = () => {
        if (audioRef.current && !isPlaying) {
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Audio is playing');
                setIsPlaying(true);
              })
              .catch(err => {
                console.log('Autoplay attempt failed:', err);
                setIsPlaying(false);
              });
          }
        }
      };

      // Try immediately
      tryAutoplay();
      
      // Strategy 2: Try after a delay (sometimes works better)
      const timer1 = setTimeout(tryAutoplay, 1000);
      const timer2 = setTimeout(tryAutoplay, 2000);
      
      // Strategy 3: Try with user gesture simulation (some browsers)
      const timer3 = setTimeout(() => {
        if (!isPlaying && audioRef.current) {
          // Create a silent buffer to unlock audio context
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            const buffer = audioContext.createBuffer(1, 1, 22050);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);
            
            // Now try to play the actual audio
            setTimeout(tryAutoplay, 100);
          }
        }
      }, 500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isLoaded, isPlaying]);

  // Try to play on any user interaction with the page
  useEffect(() => {
    const tryPlay = () => {
      if (!hasInteracted.current && audioRef.current && isLoaded && !isPlaying) {
        hasInteracted.current = true;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log('Started playing on page interaction');
          })
          .catch(() => {});
      }
    };

    // Listen for any click or key press on the page
    document.addEventListener('click', tryPlay);
    document.addEventListener('keydown', tryPlay);
    document.addEventListener('touchstart', tryPlay);

    return () => {
      document.removeEventListener('click', tryPlay);
      document.removeEventListener('keydown', tryPlay);
      document.removeEventListener('touchstart', tryPlay);
    };
  }, [isLoaded, isPlaying]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    // If not playing yet (autoplay was blocked), start playing on first click
    if (!isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('Started playing on user interaction');
      });
      return;
    }

    // Toggle mute
    if (isMuted) {
      audioRef.current.volume = 0.7;
    } else {
      audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={toggleMute}
        className="group relative p-3
                   bg-black/20 backdrop-blur-md border border-green-500/10 
                   rounded-full transition-all duration-300
                   hover:bg-black/30 hover:border-green-500/20
                   hover:shadow-[0_0_20px_rgba(0,255,127,0.1)]"
        disabled={!isLoaded}
      >
        <div className="relative">
          {!isMuted ? (
            <Volume2 className="w-5 h-5 text-green-500/50 transition-all group-hover:text-green-500/70" />
          ) : (
            <VolumeX className="w-5 h-5 text-green-500/30 transition-all group-hover:text-green-500/50" />
          )}
        </div>

        {/* Audio element - autoplay with loop */}
        <audio
          ref={audioRef}
          loop
          autoPlay
          muted={false}
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/monoliths.mp3" type="audio/mpeg" />
          <source src="/monoliths.ogg" type="audio/ogg" />
        </audio>
      </button>

      {/* Subtle pulse effect when playing */}
      {!isMuted && isPlaying && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
        </div>
      )}
      
    </div>
  );
}