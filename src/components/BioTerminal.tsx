import { useEffect, useState } from 'react';

export default function BioTerminal() {
  return (
    <div className="bio-terminal">
      {/* Terminal Output */}
        <div className="bio-output">
          <div className="terminal-status-bar">
            <span className="status-item">[ALKANES://PROTOCOL]</span>
            <span className="status-item">NODE:880000</span>
            <span className="status-item">GAS:OPTIMAL</span>
          </div>
        </div>
    </div>
  );
}