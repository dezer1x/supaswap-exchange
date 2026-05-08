import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TOKENS } from "@/lib/web3/contracts";
import { TokenAvatar, TokenPair } from "@/components/TokenAvatar";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const VolumeChart = lazy(() => import("@/components/VolumeChart"));

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SupaDupa" },
      {
        name: "description",
        content: "On-chain analytics for the SupaDupa DEX: volume, TVL, top pools and tokens.",
      },
      { property: "og:title", content: "Analytics — SupaDupa" },
      {
        property: "og:description",
        content: "Volume, liquidity, and activity on Sepolia.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const STATS = [
  { label: "Total TVL", value: "$2.24M", change: 4.8 },
  { label: "Volume 24h", value: "$355.4K", change: -1.2 },
  { label: "Total transactions", value: "12,840", change: 6.1 },
  { label: "Active wallets", value: "1,427", change: 2.4 },
];

const TOP_POOLS = [
  { a: TOKENS[0], b: TOKENS[1], tvl: 1284200, vol7: 1480000, fees7: 4440 },
  { a: TOKENS[0], b: TOKENS[2], tvl: 642100, vol7: 720000, fees7: 2160 },
  { a: TOKENS[1], b: TOKENS[2], tvl: 318750, vol7: 290000, fees7: 870 },
];

const TOP_TOKENS = [
  { t: TOKENS[0], price: 1842.31, change: 1.4, vol: 482000 },
  { t: TOKENS[1], price: 1.0, change: -0.05, vol: 215000 },
  { t: TOKENS[2], price: 0.412, change: 7.8, vol: 144000 },
];

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time activity across the SupaDupa protocol.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-xl md:text-2xl font-semibold mt-1 tracking-tight">
              {s.value}
            </div>
            <div
              className={`text-xs mt-1 inline-flex items-center gap-0.5 ${
                s.change >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {s.change >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(s.change)}%
            </div>
          </div>
        ))}
      </div>

      <section className="glass rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold">Volume</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold">$3.21M</div>
            <div className="text-xs text-success">+12.4%</div>
          </div>
        </div>
        <Suspense fallback={<div className="h-[260px] rounded-xl bg-white/[0.02] animate-pulse" />}>
          <VolumeChart />
        </Suspense>
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="glass rounded-2xl overflow-hidden">
          <h2 className="font-semibold p-5 pb-3">Top pools</h2>
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 px-5 py-2 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/[0.04]">
            <span>Pool</span>
            <span className="text-right">TVL</span>
            <span className="text-right">Vol 7d</span>
            <span className="text-right">Fees 7d</span>
          </div>
          {TOP_POOLS.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-3 px-5 py-3 text-sm border-b border-white/[0.03] last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <TokenPair a={p.a} b={p.b} size={22} />
                <span className="truncate">
                  {p.a.symbol}/{p.b.symbol}
                </span>
              </div>
              <span className="text-right">${p.tvl.toLocaleString()}</span>
              <span className="text-right">${p.vol7.toLocaleString()}</span>
              <span className="text-right">${p.fees7.toLocaleString()}</span>
            </div>
          ))}
        </section>

        <section className="glass rounded-2xl overflow-hidden">
          <h2 className="font-semibold p-5 pb-3">Top tokens</h2>
          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] gap-3 px-5 py-2 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/[0.04]">
            <span>Token</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">Volume</span>
          </div>
          {TOP_TOKENS.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr] gap-3 px-5 py-3 text-sm border-b border-white/[0.03] last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <TokenAvatar token={r.t} size={22} />
                <span className="truncate">{r.t.symbol}</span>
              </div>
              <span className="text-right">${r.price.toLocaleString()}</span>
              <span className={`text-right ${r.change >= 0 ? "text-success" : "text-destructive"}`}>
                {r.change >= 0 ? "+" : ""}
                {r.change}%
              </span>
              <span className="text-right">${r.vol.toLocaleString()}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
