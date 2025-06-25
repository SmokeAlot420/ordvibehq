import { useEffect, useState } from 'react';

export default function GhostTerminal() {
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showStatus, setShowStatus] = useState(false);
  const fullText = 'OrdVibeHQ';
  
  useEffect(() => {
    // Cursor blink
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    // Type out text
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setText(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => setShowStatus(true), 1000);
      }
    }, 120);

    return () => {
      clearInterval(cursorInterval);
      clearInterval(typeInterval);
    };
  }, []);

  return (
    <div className="ghost-terminal">
      <div className="ghost-main">
        <span className="ghost-prompt">&gt;</span>
        <span className="ghost-text">{text}</span>
        {showCursor && <span className="ghost-cursor">_</span>}
      </div>
      
      {showStatus && (
        <div className="ghost-status">
          <span>[CONNECTED]</span>
          <span className="ghost-protocol">alkanes://btc</span>
        </div>
      )}
    </div>
  );
}