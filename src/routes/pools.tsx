import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { Plus, Sparkles } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { TOKENS, type Token } from "@/lib/web3/contracts";
import { TokenPair } from "@/components/TokenAvatar";
import { AddLiquidityModal } from "@/components/AddLiquidityModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pools")({
  head: () => ({
    meta: [
      { title: "Pools — SupaDupa" },
      {
        name: "description",
        content:
          "Provide liquidity to SupaDupa pools on Sepolia and earn a share of trading fees.",
      },
      { property: "og:title", content: "Pools — SupaDupa" },
      {
        property: "og:description",
        content: "Earn fees by adding liquidity to Sepolia trading pairs.",
      },
    ],
  }),
  component: PoolsPage,
});

const POOLS = [
  { a: TOKENS[0], b: TOKENS[1], tvl: 1284200, vol24: 218400, apr: 18.4 },
  { a: TOKENS[0], b: TOKENS[2], tvl: 642100, vol24: 95800, apr: 12.7 },
  { a: TOKENS[1], b: TOKENS[2], tvl: 318750, vol24: 41200, apr: 22.1 },
];

function PoolsPage() {
  const { isConnected } = useAccount();
  const [open, setOpen] = useState<{ a?: Token; b?: Token } | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Pools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide liquidity, earn fees from every swap.
        </p>
      </header>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm uppercase tracking-wider text-muted-foreground">
            Your positions
          </h2>
          <button
            onClick={() => setOpen({})}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full gradient-bg text-white font-medium btn-press"
          >
            <Plus className="h-3.5 w-3.5" /> New position
          </button>
        </div>

        <div className="glass rounded-2xl p-8">
          {!isConnected ? (
            <EmptyState
              title="Connect a wallet to see your positions"
              cta={
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="px-4 py-2 rounded-full gradient-bg text-white text-sm font-medium btn-press"
                    >
                      Connect wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              }
            />
          ) : (
            <EmptyState
              title="No active positions"
              subtitle="Add liquidity to a pool to earn fees."
              cta={
                <button
                  onClick={() => setOpen({})}
                  className="px-4 py-2 rounded-full gradient-bg text-white text-sm font-medium btn-press"
                >
                  Add liquidity
                </button>
              }
            />
          )}
        </div>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">
          All pools
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-4 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-white/[0.06]">
            <span>Pool</span>
            <span className="text-right">TVL</span>
            <span className="text-right">Volume 24h</span>
            <span className="text-right">APR</span>
            <span></span>
          </div>
          {POOLS.map((p, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[1fr_auto] md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] gap-4 px-5 py-4 hover-lift",
                i !== POOLS.length - 1 && "border-b border-white/[0.04]",
              )}
            >
              <div className="flex items-center gap-3 col-span-2 md:col-span-1">
                <TokenPair a={p.a} b={p.b} />
                <span className="font-medium text-sm">
                  {p.a.symbol}/{p.b.symbol}
                </span>
              </div>
              <Cell label="TVL">${p.tvl.toLocaleString()}</Cell>
              <Cell label="Vol 24h">${p.vol24.toLocaleString()}</Cell>
              <Cell label="APR">
                <span className="text-success">{p.apr}%</span>
              </Cell>
              <button
                onClick={() => setOpen({ a: p.a, b: p.b })}
                className="px-3 py-1.5 text-xs rounded-full border border-white/[0.08] hover:border-primary/50 hover:bg-primary/10 btn-press whitespace-nowrap"
              >
                Add liquidity
              </button>
            </div>
          ))}
        </div>
      </section>

      {open && (
        <AddLiquidityModal
          open={!!open}
          onOpenChange={(v) => !v && setOpen(null)}
          initialA={open.a}
          initialB={open.b}
        />
      )}
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex md:block items-center justify-between text-sm md:text-right">
      <span className="md:hidden text-xs text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}

function EmptyState({
  title,
  subtitle,
  cta,
}: {
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="text-center py-6">
      <div className="mx-auto mb-3 h-12 w-12 rounded-2xl gradient-bg inline-flex items-center justify-center shadow-[0_0_30px_-6px_oklch(0.58_0.24_295/0.7)]">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div className="font-medium">{title}</div>
      {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
