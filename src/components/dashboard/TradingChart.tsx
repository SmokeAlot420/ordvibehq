import { useEffect, useRef, useState, useCallback } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, HistogramData, Time } from "lightweight-charts";
import { usePoolOHLCV, usePools, type Pool, type OHLCVData } from "@/hooks/useFlashnet";

type Interval = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

const INTERVALS: { label: string; value: Interval }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
];

interface TradingChartProps {
  initialPoolId?: string;
  height?: number;
}

/**
 * TradingChart - Cyberpunk candlestick chart using lightweight-charts
 * Features: Pool selector, timeframe buttons, volume bars, auto-refresh
 */
export function TradingChart({ initialPoolId, height = 400 }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [selectedPoolId, setSelectedPoolId] = useState<string>(initialPoolId || "");
  const [interval, setInterval] = useState<Interval>("1h");

  const { data: pools = [] } = usePools();
  const { data: ohlcv = [], isLoading, error } = usePoolOHLCV(selectedPoolId || null, interval, 100);

  // Auto-select first pool if none provided
  useEffect(() => {
    if (!selectedPoolId && pools.length > 0) {
      setSelectedPoolId(pools[0].poolId);
    }
  }, [pools, selectedPoolId]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(52, 211, 153, 0.8)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      },
      grid: {
        vertLines: { color: "rgba(52, 211, 153, 0.08)" },
        horzLines: { color: "rgba(52, 211, 153, 0.08)" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#34d399",
          width: 1,
          style: 2,
          labelBackgroundColor: "#065f46",
        },
        horzLine: {
          color: "#34d399",
          width: 1,
          style: 2,
          labelBackgroundColor: "#065f46",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(52, 211, 153, 0.2)",
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: "rgba(52, 211, 153, 0.2)",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Candlestick series
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#4ade80",
      downColor: "#f87171",
      borderUpColor: "#4ade80",
      borderDownColor: "#f87171",
      wickUpColor: "#4ade80",
      wickDownColor: "#f87171",
    });

    // Volume series (histogram below)
    const volumeSeries = chart.addHistogramSeries({
      color: "rgba(52, 211, 153, 0.3)",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [height]);

  // Update chart data
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !ohlcv.length) return;

    const candleData: CandlestickData<Time>[] = ohlcv.map((d: OHLCVData) => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData: HistogramData<Time>[] = ohlcv.map((d: OHLCVData) => ({
      time: d.time as Time,
      value: d.volume,
      color: d.close >= d.open ? "rgba(74, 222, 128, 0.4)" : "rgba(248, 113, 113, 0.4)",
    }));

    candleSeriesRef.current.setData(candleData);
    volumeSeriesRef.current.setData(volumeData);

    // Fit content to view
    chartRef.current?.timeScale().fitContent();
  }, [ohlcv]);

  const selectedPool = pools.find((p) => p.poolId === selectedPoolId);

  return (
    <div className="trading-chart">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-controls-left">
          {/* Pool Selector */}
          <select
            value={selectedPoolId}
            onChange={(e) => setSelectedPoolId(e.target.value)}
            className="chart-pool-select"
          >
            {pools.map((pool) => (
              <option key={pool.poolId} value={pool.poolId}>
                {pool.assetA.ticker}/{pool.assetB.ticker}
              </option>
            ))}
          </select>

          {/* Timeframe Buttons */}
          <div className="chart-timeframes">
            {INTERVALS.map((int) => (
              <button
                key={int.value}
                onClick={() => setInterval(int.value)}
                className={`timeframe-btn ${interval === int.value ? "active" : ""}`}
              >
                {int.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Info */}
        {selectedPool && (
          <div className="chart-price-info">
            <span className="price-current">${selectedPool.currentPrice.toFixed(2)}</span>
            <span className={`price-change ${selectedPool.priceChange24h >= 0 ? "positive" : "negative"}`}>
              {selectedPool.priceChange24h >= 0 ? "+" : ""}
              {selectedPool.priceChange24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="chart-container" ref={chartContainerRef}>
        {isLoading && (
          <div className="chart-loading">
            <span className="loading-text">LOADING_CHART_DATA...</span>
          </div>
        )}
        {error && (
          <div className="chart-error">
            <span className="error-icon">!</span>
            <span className="error-text">{(error as Error).message}</span>
          </div>
        )}
      </div>

      <style>{`
        .trading-chart {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
          background: rgba(52, 211, 153, 0.03);
        }

        .chart-controls-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .chart-pool-select {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(52, 211, 153, 0.3);
          border-radius: 4px;
          color: #34d399;
          padding: 6px 12px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          min-width: 140px;
        }

        .chart-pool-select:focus {
          outline: none;
          border-color: #34d399;
        }

        .chart-pool-select option {
          background: #0a0a0a;
          color: #34d399;
        }

        .chart-timeframes {
          display: flex;
          gap: 4px;
        }

        .timeframe-btn {
          background: transparent;
          border: 1px solid rgba(52, 211, 153, 0.2);
          color: rgba(52, 211, 153, 0.6);
          padding: 4px 10px;
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border-radius: 2px;
        }

        .timeframe-btn:hover {
          border-color: rgba(52, 211, 153, 0.5);
          color: #34d399;
        }

        .timeframe-btn.active {
          background: rgba(52, 211, 153, 0.15);
          border-color: #34d399;
          color: #34d399;
        }

        .chart-price-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .price-current {
          font-size: 18px;
          font-weight: 700;
          color: #5eead4;
          font-family: 'JetBrains Mono', monospace;
        }

        .price-change {
          font-size: 13px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
        }

        .price-change.positive {
          color: #4ade80;
        }

        .price-change.negative {
          color: #f87171;
        }

        .chart-container {
          position: relative;
          min-height: ${height}px;
        }

        .chart-loading,
        .chart-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10;
        }

        .loading-text {
          color: rgba(52, 211, 153, 0.6);
          font-size: 11px;
          letter-spacing: 1px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 0.5; }
        }

        .chart-error {
          flex-direction: column;
          gap: 8px;
        }

        .error-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(248, 113, 113, 0.2);
          border: 1px solid #f87171;
          border-radius: 50%;
          color: #f87171;
          font-weight: 700;
        }

        .error-text {
          color: #f87171;
          font-size: 11px;
        }

        @media (max-width: 768px) {
          .chart-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .chart-controls-left {
            flex-wrap: wrap;
          }

          .chart-price-info {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}

export default TradingChart;
