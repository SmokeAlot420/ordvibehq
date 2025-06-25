import { useEffect, useRef, useState } from 'react';

export default function TerminalText() {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const fullText = 'OrdVibeHQ';
  const asciiArt = [
    '⚗️ ALKANES::METAPROTOCOL',
    '> wasmi::fuel::metered',
    '> inscribing UTXO #880000...',
    '> $METHANE $FARTANE $GOJI',
    '> 100x OR NOTHING',
    '> DEGEN::MODE::ACTIVATED'
  ];
  const [currentLine, setCurrentLine] = useState(0);
  const [showAscii, setShowAscii] = useState(false);

  useEffect(() => {
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Type out main text
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowAscii(true), 500);
      }
    }, 100);

    // Random glitch
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 4000);

    return () => {
      clearInterval(cursorInterval);
      clearInterval(typeInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  useEffect(() => {
    if (showAscii && currentLine < asciiArt.length) {
      const lineTimeout = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 300);
      return () => clearTimeout(lineTimeout);
    }
  }, [showAscii, currentLine]);

  const glitchText = (text: string) => {
    if (!glitchActive) return text;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコ';
    return text.split('').map(char => 
      Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
    ).join('');
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <span className="terminal-dot terminal-red" />
        <span className="terminal-dot terminal-yellow" />
        <span className="terminal-dot terminal-green" />
        <span className="terminal-title">ALKANES://DEGEN_TERMINAL_v420.69</span>
      </div>
      
      <div className="terminal-body">
        <div className="terminal-line">
          <span className="terminal-prompt">alkanes@btc:~$</span>
          <span className="terminal-command">./ordvibe.sh --moon</span>
        </div>
        
        <div className="terminal-output">
          <pre className="ascii-art">
{`    ___           ___     ___                  
   /\\  \\         /\\  \\   /\\  \\                 
  /::\\  \\       /::\\  \\ /::\\  \\                
 /:/\\:\\  \\     /:/\\:\\__/:/\\:\\__\\               
/:/ /::\\  \\   /:/ /:/  \\:\\:\\/__/               
/:/_/:/\\:\\__\\ /:/_/:/__/_\\:\\\\__\\               
\\:\\/:/  \\/__/ \\:\\/:::::/  \\/__/                
 \\::/__/       \\::/~~/~~                       
  \\:\\  \\        \\:\\~~\\                         
   \\:\\__\\        \\:\\__\\                        
    \\/__/         \\/__/    VIBE::HQ`}
          </pre>
          
          <div className={`terminal-main-text ${glitchActive ? 'glitch-text' : ''}`}>
            <span className="terminal-angle">&gt;&gt;&gt;</span>
            {glitchText(displayText)}
            {showCursor && <span className="terminal-cursor">_</span>}
          </div>
          
          {showAscii && (
            <div className="terminal-ascii-lines">
              {asciiArt.slice(0, currentLine).map((line, i) => (
                <div key={i} className="terminal-line fade-in">
                  <span className="terminal-prompt-mini">›</span>
                  <span className={`terminal-output-text ${i === currentLine - 1 ? 'typing' : ''}`}>
                    {line}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="terminal-footer">
          <span className="terminal-status">[CONNECTED]</span>
          <span className="terminal-gas">⛽ GAS: 69420</span>
          <span className="terminal-block">BLOCK: 880000</span>
        </div>
      </div>
    </div>
  );
}