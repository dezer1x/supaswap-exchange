import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Droplets, ExternalLink, Loader2 } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { sepolia } from "wagmi/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { toast } from "sonner";

import { TOKENS } from "@/lib/web3/contracts";
import { TokenAvatar } from "@/components/TokenAvatar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faucet")({
  head: () => ({
    meta: [
      { title: "Faucet — SupaDupa" },
      {
        name: "description",
        content: "Claim free testnet tokens to try the SupaDupa DEX on Sepolia.",
      },
      { property: "og:title", content: "Faucet — SupaDupa" },
      {
        property: "og:description",
        content: "Free Sepolia test tokens, every 24 hours.",
      },
    ],
  }),
  component: FaucetPage,
});

function FaucetPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const wrong = isConnected && chainId !== sepolia.id;
  const tokens = TOKENS.filter((t) => t.faucetAmount);

  return (
    <div className="mx-auto max-w-[420px] pt-4 md:pt-10">
      <div className="glow-card relative">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <span className="h-9 w-9 rounded-xl gradient-bg inline-flex items-center justify-center shadow-[0_0_20px_-4px_oklch(0.58_0.24_295/0.7)]">
              <Droplets className="h-4.5 w-4.5 text-white" />
            </span>
            <div>
              <h1 className="text-lg font-semibold">Testnet Faucet</h1>
              <p className="text-xs text-muted-foreground">
                Get free test tokens to try the DEX
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {tokens.map((t) => (
              <FaucetRow key={t.address} token={t} disabled={!isConnected || wrong} />
            ))}
          </div>

          {!isConnected && (
            <div className="mt-4">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-3 rounded-2xl gradient-bg text-white font-semibold btn-press"
                  >
                    Connect wallet
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          )}

          <p className="mt-4 text-[11px] text-center text-muted-foreground">
            Tokens available every 24 hours per wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

function FaucetRow({
  token,
  disabled,
}: {
  token: (typeof TOKENS)[number];
  disabled: boolean;
}) {
  const { address } = useAccount();
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Persist per-wallet+token cooldown locally for the placeholder UX
  const key = `supadupa.faucet.${address ?? "anon"}.${token.address}`;
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(key);
    if (v) {
      const t = parseInt(v);
      if (t > Date.now()) setCooldownEnd(t);
      else setCooldownEnd(null);
    } else setCooldownEnd(null);
  }, [key]);

  useEffect(() => {
    if (!cooldownEnd) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [cooldownEnd]);

  const remaining = cooldownEnd ? Math.max(0, cooldownEnd - now) : 0;
  const onCooldown = remaining > 0;

  const claim = async () => {
    if (disabled || onCooldown) return;
    setPending(true);
    const id = toast.loading("Claim submitted", { description: "Waiting for confirmation…" });
    setTimeout(() => {
      const fakeHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      setTxHash(fakeHash);
      const end = Date.now() + 24 * 60 * 60 * 1000;
      setCooldownEnd(end);
      localStorage.setItem(key, String(end));
      setPending(false);
      toast.success(`Claimed ${token.faucetAmount} ${token.symbol} ✓`, {
        id,
        description: (
          <a
            href={`https://sepolia.etherscan.io/tx/${fakeHash}`}
            target="_blank"
            rel="noreferrer"
            className="underline text-cyan inline-flex items-center gap-1"
          >
            View tx <ExternalLink className="h-3 w-3" />
          </a>
        ),
      });
    }, 1500);
  };

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
      <TokenAvatar token={token} size={36} />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium leading-tight">{token.name}</div>
        <div className="text-xs text-muted-foreground">
          You will receive {token.faucetAmount} {token.symbol}
        </div>
        {txHash && !onCooldown && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-cyan inline-flex items-center gap-1 mt-0.5 hover:underline"
          >
            tx {txHash.slice(0, 8)}…<ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>
      <button
        onClick={claim}
        disabled={disabled || onCooldown || pending}
        className={cn(
          "px-3.5 py-2 text-sm rounded-full border btn-press min-w-[88px]",
          onCooldown
            ? "border-white/[0.06] text-muted-foreground tabular-nums cursor-not-allowed"
            : disabled
              ? "border-white/[0.06] text-muted-foreground cursor-not-allowed"
              : "border-primary/50 text-foreground hover:bg-primary hover:border-primary",
        )}
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
        ) : onCooldown ? (
          fmt(remaining)
        ) : (
          "Claim"
        )}
      </button>
    </div>
  );
}
