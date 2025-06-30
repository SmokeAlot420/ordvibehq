import { useEffect, useState } from 'react';

export default function BioTerminal() {
  const [statusIndex, setStatusIndex] = useState(0);
  
  // Chemistry-themed rotating status messages
  const statusMessages = [
    { label: "TEMP", value: "451°K", detail: "IGNITION_READY" },
    { label: "PRESSURE", value: "1ATM", detail: "STABLE" },
    { label: "CATALYST", value: "BC1P", detail: "ACTIVE" },
    { label: "CHAIN_LENGTH", value: "C₁₂H₂₆", detail: "OPTIMAL" },
    { label: "COMBUSTION", value: "BLUE_FLAME", detail: "COMPLETE" },
    { label: "ENTROPY", value: "DECREASING", detail: "ORDERING" },
    { label: "REACTION", value: "EXOTHERMIC", detail: "HEAT_OUT" },
    { label: "BONDS", value: "COVALENT", detail: "STRONG" },
    { label: "STATE", value: "GAS", detail: "VOLATILE" },
    { label: "ENERGY", value: "HIGH", detail: "RELEASING" }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000); // Rotate every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const currentStatus = statusMessages[statusIndex];
  
  return (
    <div className="bio-terminal">
      {/* Terminal Output */}
        <div className="bio-output">
          <div className="terminal-status-bar">
            <span className="status-item text-[9px] sm:text-[10px] md:text-xs">[ALKANES://PROTOCOL]</span>
            <span className="status-item text-[9px] sm:text-[10px] md:text-xs hidden sm:inline">
              {currentStatus.label}:{currentStatus.value}
            </span>
            <span className="status-item text-[9px] sm:text-[10px] md:text-xs">
              {currentStatus.detail}
            </span>
          </div>
        </div>
    </div>
  );
}