import { useEffect, useState } from 'react';

export default function BioTerminal() {
  return (
    <div className="bio-terminal">
      {/* Terminal Output */}
        <div className="bio-output">
          <div className="terminal-status-bar">
            <span className="status-item text-[9px] sm:text-[10px] md:text-xs">[ALKANES://PROTOCOL]</span>
            <span className="status-item text-[9px] sm:text-[10px] md:text-xs hidden sm:inline">NODE:880000</span>
            <span className="status-item text-[9px] sm:text-[10px] md:text-xs">GAS:OPTIMAL</span>
          </div>
        </div>
    </div>
  );
}