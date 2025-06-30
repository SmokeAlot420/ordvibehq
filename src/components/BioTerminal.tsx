export default function BioTerminal() {
  return (
    <div className="bio-terminal">
      {/* Terminal Output */}
        <div className="bio-output">
          <div className="terminal-status-bar">
            <span className="status-item text-xs sm:text-sm md:text-base opacity-70">[ALKANES://PROTOCOL]</span>
            <span className="status-item text-xs sm:text-sm md:text-base opacity-70">NODE:880000</span>
            <span className="status-item text-xs sm:text-sm md:text-base opacity-70">STATUS:ACTIVE</span>
          </div>
        </div>
    </div>
  );
}