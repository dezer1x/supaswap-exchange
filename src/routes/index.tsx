import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, Settings2, Wallet, Loader2 } from "lucide-react";
import { useAccount, useBalance, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { TOKENS, type Token } from "@/lib/web3/contracts";
import { TokenAvatar } from "@/components/TokenAvatar";
import { TokenSelectorModal } from "@/components/TokenSelectorModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swap — SupaDupa DEX" },
      {
        name: "description",
        content:
          "Swap testnet tokens instantly on SupaDupa, the minimal DEX on Ethereum Sepolia.",
      },
      { property: "og:title", content: "Swap — SupaDupa DEX" },
      {
        property: "og:description",
        content: "Trade tokens on Sepolia with low slippage and a clean UI.",
      },
    ],
  }),
  component: SwapPage,
});

function useTokenBalance(token: Token) {
  const { address } = useAccount();
  const isNative =
    token.address === "0x0000000000000000000000000000000000000000";
  const { data } = useBalance({
    address,
    token: isNative ? undefined : (token.address as `0x${string}`),
    chainId: sepolia.id,
    query: {
      enabled: !!address && !isNative,
    },
  });
  return data;
}

function SwapPage() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const wrongNetwork = isConnected && chainId !== sepolia.id;

  const [tokenIn, setTokenIn] = useState<Token>(TOKENS[0]);
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS[1]);
  const [amountIn, setAmountIn] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [showSlippage, setShowSlippage] = useState(false);
  const [pickerFor, setPickerFor] = useState<"in" | "out" | null>(null);
  const [flipping, setFlipping] = useState(false);

  const balIn = useTokenBalance(tokenIn);
  const balOut = useTokenBalance(tokenOut);

  // Mock rate (since contracts are placeholders). Stable mock 1 IN = 1842.31 OUT-ish
  const rate = useMemo(() => {
    const seed = (tokenIn.symbol + tokenOut.symbol).length;
    return 0.4521 + seed * 0.137;
  }, [tokenIn, tokenOut]);

  const amountOut = useMemo(() => {
    const n = parseFloat(amountIn);
    if (!isFinite(n) || n <= 0) return "";
    return (n * rate).toFixed(6);
  }, [amountIn, rate]);

  const priceImpact = useMemo(() => {
    const n = parseFloat(amountIn);
    if (!isFinite(n) || n <= 0) return 0;
    return Math.min(8, n * 0.04);
  }, [amountIn]);

  const impactColor =
    priceImpact < 1 ? "text-success" : priceImpact < 3 ? "text-warning" : "text-destructive";

  const flip = () => {
    setFlipping(true);
    setTimeout(() => setFlipping(false), 300);
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn(amountOut);
  };

  const onSwap = () => {
    if (!isConnected) return;
    const t = toast.loading("Swap submitted", {
      description: "Waiting for confirmation…",
    });
    setTimeout(() => {
      toast.success("Swap confirmed ✓", {
        id: t,
        description: (
          <a
            href="https://sepolia.etherscan.io"
            target="_blank"
            rel="noreferrer"
            className="underline text-cyan"
          >
            View on Sepolia Etherscan
          </a>
        ),
      });
    }, 1800);
  };

  const insufficient =
    isConnected &&
    balIn &&
    parseFloat(amountIn || "0") > parseFloat(balIn.formatted);

  const disabled =
    !isConnected || wrongNetwork || !amountIn || parseFloat(amountIn) <= 0 || !!insufficient;

  return (
    <div className="mx-auto max-w-[480px] pt-4 md:pt-10">
      <div className="glow-card relative">
        <div className="glass rounded-3xl p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold">Swap</h1>
            <button
              onClick={() => setShowSlippage((s) => !s)}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
              aria-label="Settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
          </div>

          {showSlippage && (
            <div className="mb-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Slippage tolerance</span>
                <span className="font-medium">{slippage}%</span>
              </div>
              <div className="flex gap-2">
                {[0.1, 0.5, 1].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSlippage(v)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border btn-press",
                      slippage === v
                        ? "border-primary/60 bg-primary/15 text-foreground"
                        : "border-white/[0.06] text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {v}%
                  </button>
                ))}
                <input
                  type="number"
                  step="0.1"
                  value={slippage}
                  onChange={(e) => setSlippage(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="ml-auto w-20 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-right"
                />
              </div>
            </div>
          )}

          {/* You pay */}
          <TokenInput
            label="You pay"
            token={tokenIn}
            amount={amountIn}
            onAmountChange={setAmountIn}
            onPick={() => setPickerFor("in")}
            balance={balIn?.formatted}
            onMax={() => balIn && setAmountIn(balIn.formatted)}
            error={insufficient ? "Insufficient balance" : undefined}
          />

          {/* Flip */}
          <div className="relative my-1 flex justify-center">
            <button
              onClick={flip}
              className="h-9 w-9 -my-3 inline-flex items-center justify-center rounded-xl bg-card border border-white/[0.08] hover:border-primary/40 hover:bg-card/80 btn-press z-10"
              aria-label="Flip tokens"
            >
              <ArrowDown
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  flipping && "rotate-180",
                )}
              />
            </button>
          </div>

          {/* You receive */}
          <TokenInput
            label="You receive"
            token={tokenOut}
            amount={amountOut}
            readOnly
            onPick={() => setPickerFor("out")}
            balance={balOut?.formatted}
          />

          {/* Info */}
          {amountIn && parseFloat(amountIn) > 0 && (
            <div className="mt-3 px-1 py-2 text-xs space-y-1.5">
              <Row
                label="Rate"
                value={`1 ${tokenIn.symbol} ≈ ${rate.toFixed(4)} ${tokenOut.symbol}`}
              />
              <Row
                label="Price impact"
                value={
                  <span className={impactColor}>{priceImpact.toFixed(2)}%</span>
                }
              />
              <Row
                label="Slippage"
                value={
                  <button
                    onClick={() => setShowSlippage(true)}
                    className="hover:text-foreground transition-colors"
                  >
                    {slippage}%
                  </button>
                }
              />
            </div>
          )}

          {/* CTA */}
          <div className="mt-4">
            {!isConnected ? (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full h-13 py-3.5 rounded-2xl gradient-bg text-white font-semibold btn-press inline-flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_oklch(0.58_0.24_295/0.7)]"
                  >
                    <Wallet className="h-4 w-4" /> Connect wallet
                  </button>
                )}
              </ConnectButton.Custom>
            ) : (
              <button
                onClick={onSwap}
                disabled={disabled}
                className={cn(
                  "w-full py-3.5 rounded-2xl font-semibold transition-all inline-flex items-center justify-center gap-2",
                  disabled
                    ? "bg-white/[0.04] text-muted-foreground cursor-not-allowed"
                    : "gradient-bg text-white btn-press shadow-[0_0_30px_-8px_oklch(0.58_0.24_295/0.7)]",
                )}
              >
                {wrongNetwork
                  ? "Switch to Sepolia"
                  : insufficient
                    ? `Insufficient ${tokenIn.symbol}`
                    : !amountIn
                      ? "Enter an amount"
                      : "Swap"}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Powered by <span className="gradient-text font-medium">[SupaDupa]</span> Protocol
      </p>

      <TokenSelectorModal
        open={pickerFor !== null}
        onOpenChange={(v) => !v && setPickerFor(null)}
        exclude={pickerFor === "in" ? tokenOut.address : tokenIn.address}
        onSelect={(t) => {
          if (pickerFor === "in") setTokenIn(t);
          else setTokenOut(t);
        }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground/90">{value}</span>
    </div>
  );
}

function TokenInput({
  label,
  token,
  amount,
  onAmountChange,
  onPick,
  balance,
  onMax,
  readOnly,
  error,
}: {
  label: string;
  token: Token;
  amount: string;
  onAmountChange?: (v: string) => void;
  onPick: () => void;
  balance?: string;
  onMax?: () => void;
  readOnly?: boolean;
  error?: string;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-4 hover:border-white/[0.1] transition-colors">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>{label}</span>
        {balance !== undefined && (
          <button
            type="button"
            onClick={onMax}
            disabled={!onMax}
            className="hover:text-foreground transition-colors disabled:cursor-default"
          >
            Balance: {Number(balance).toFixed(4)}
            {onMax && <span className="ml-1 text-primary">Max</span>}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onPick}
          className="flex items-center gap-2 px-2.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] btn-press shrink-0"
        >
          <TokenAvatar token={token} size={24} />
          <span className="font-semibold text-sm">{token.symbol}</span>
          <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <input
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.]/g, "");
            onAmountChange?.(v);
          }}
          className={cn(
            "flex-1 min-w-0 w-full bg-transparent outline-none text-right text-2xl md:text-3xl font-medium tracking-tight placeholder:text-muted-foreground/40 truncate",
            readOnly && "text-muted-foreground",
          )}
        />
      </div>
      {error && <div className="mt-2 text-xs text-destructive text-right">{error}</div>}
    </div>
  );
}
