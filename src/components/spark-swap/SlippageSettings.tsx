import { useState } from "react";

interface SlippageSettingsProps {
  slippageBps: number;
  onSlippageChange: (bps: number) => void;
  options?: number[];
}

const DEFAULT_OPTIONS = [50, 100, 200, 500]; // 0.5%, 1%, 2%, 5%

export function SlippageSettings({
  slippageBps,
  onSlippageChange,
  options = DEFAULT_OPTIONS,
}: SlippageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="spark-settings">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="spark-btn-settings"
      >
        <span className="spark-prefix">▸</span>
        SLIPPAGE: {slippageBps / 100}%
        <span className="spark-caret">{isOpen ? "▴" : "▾"}</span>
      </button>
      {isOpen && (
        <div className="spark-settings-panel">
          <div className="spark-slippage-options">
            {options.map((bps) => (
              <button
                key={bps}
                onClick={() => onSlippageChange(bps)}
                className={`spark-slippage-btn ${slippageBps === bps ? "active" : ""}`}
              >
                {bps / 100}%
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
