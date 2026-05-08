import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  AreaSeries,
  type IChartApi,
} from "lightweight-charts";

function generateSeries() {
  const data: { time: string; value: number }[] = [];
  let v = 80000;
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    v = Math.max(20000, v + (Math.random() - 0.45) * 30000);
    data.push({
      time: d.toISOString().slice(0, 10),
      value: Math.round(v),
    });
  }
  return data;
}

export default function VolumeChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#94A3B8",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      crosshair: {
        vertLine: { color: "rgba(124,58,237,0.4)", width: 1, style: 0 },
        horzLine: { color: "rgba(124,58,237,0.4)", width: 1, style: 0 },
      },
      height: 260,
      autoSize: true,
    });
    chartRef.current = chart;

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#7C3AED",
      topColor: "rgba(124,58,237,0.45)",
      bottomColor: "rgba(6,182,212,0.02)",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    series.setData(generateSeries());
    chart.timeScale().fitContent();

    const ro = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[260px]" />;
}
