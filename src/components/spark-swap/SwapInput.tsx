interface SwapInputProps {
  value: string;
  onChange: (value: string) => void;
  tokenTicker: string;
}

export function SwapInput({ value, onChange, tokenTicker }: SwapInputProps) {
  return (
    <div className="spark-section">
      <div className="spark-section-header">
        <span className="spark-label">AMOUNT_IN ({tokenTicker})</span>
      </div>
      <div className="spark-input-wrapper">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (/^[0-9]*\.?[0-9]*$/.test(val)) {
              onChange(val);
            }
          }}
          placeholder="0.00000000"
          className="spark-input"
        />
        <span className="spark-input-suffix">{tokenTicker}</span>
      </div>
    </div>
  );
}
