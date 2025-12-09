export default function BioTerminal() {
  return (
    <div className="bio-terminal">
      {/* Terminal Output */}
        <div className="bio-output">
          <div className="terminal-status-bar">
            <span className="status-item text-[10px] sm:text-xs md:text-sm opacity-80">[BITPLEX://SPARK]</span>
            <span className="status-item text-[10px] sm:text-xs md:text-sm opacity-80">NODE:880000</span>
            <span className="status-item text-[10px] sm:text-xs md:text-sm opacity-80">STATUS:ACTIVE</span>
          </div>
        </div>
    </div>
  );
}