import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TOKENS, type Token } from "@/lib/web3/contracts";
import { TokenAvatar } from "@/components/TokenAvatar";
import { TokenSelectorModal } from "@/components/TokenSelectorModal";
import { ArrowDown, Plus } from "lucide-react";
import { toast } from "sonner";

export function AddLiquidityModal({
  open,
  onOpenChange,
  initialA,
  initialB,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialA?: Token;
  initialB?: Token;
}) {
  const [a, setA] = useState<Token>(initialA ?? TOKENS[0]);
  const [b, setB] = useState<Token>(initialB ?? TOKENS[1]);
  const [amtA, setAmtA] = useState("");
  const [pickerFor, setPickerFor] = useState<"a" | "b" | null>(null);

  const ratio = useMemo(() => 0.4521 + (a.symbol + b.symbol).length * 0.137, [a, b]);
  const amtB = useMemo(() => {
    const n = parseFloat(amtA);
    if (!isFinite(n) || n <= 0) return "";
    return (n * ratio).toFixed(6);
  }, [amtA, ratio]);
  const share = useMemo(() => {
    const n = parseFloat(amtA);
    if (!n) return 0;
    return Math.min(99.99, n / (n + 8400) * 100);
  }, [amtA]);

  const confirm = () => {
    onOpenChange(false);
    const id = toast.loading("Adding liquidity…");
    setTimeout(() => {
      toast.success("Liquidity added ✓", {
        id,
        description: `${amtA} ${a.symbol} + ${amtB} ${b.symbol}`,
      });
      setAmtA("");
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-strong max-w-md">
          <DialogHeader>
            <DialogTitle>Add liquidity</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mt-2">
            <PoolInput
              token={a}
              amount={amtA}
              onAmount={setAmtA}
              onPick={() => setPickerFor("a")}
            />
            <div className="flex justify-center">
              <div className="h-8 w-8 -my-2 rounded-lg bg-card border border-white/[0.08] inline-flex items-center justify-center z-10">
                <Plus className="h-3.5 w-3.5" />
              </div>
            </div>
            <PoolInput
              token={b}
              amount={amtB}
              onPick={() => setPickerFor("b")}
              readOnly
            />
          </div>

          {amtA && (
            <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs space-y-1.5">
              <div className="flex justify-between text-muted-foreground">
                <span>Pool rate</span>
                <span className="text-foreground/90">
                  1 {a.symbol} = {ratio.toFixed(4)} {b.symbol}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pool share after</span>
                <span className="text-foreground/90">{share.toFixed(2)}%</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              onClick={confirm}
              disabled={!amtA || parseFloat(amtA) <= 0}
              className="w-full py-3 rounded-2xl gradient-bg text-white font-semibold btn-press disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-none disabled:bg-white/[0.04]"
            >
              {!amtA ? "Enter an amount" : "Confirm add liquidity"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TokenSelectorModal
        open={pickerFor !== null}
        onOpenChange={(v) => !v && setPickerFor(null)}
        exclude={pickerFor === "a" ? b.address : a.address}
        onSelect={(t) => {
          if (pickerFor === "a") setA(t);
          else setB(t);
        }}
      />
    </>
  );
}

function PoolInput({
  token,
  amount,
  onAmount,
  onPick,
  readOnly,
}: {
  token: Token;
  amount: string;
  onAmount?: (v: string) => void;
  onPick: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.025] border border-white/[0.06] p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onPick}
          className="flex items-center gap-2 px-2.5 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] btn-press shrink-0"
        >
          <TokenAvatar token={token} size={22} />
          <span className="font-semibold text-sm">{token.symbol}</span>
          <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <input
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmount?.(e.target.value.replace(/[^0-9.]/g, ""))}
          className="flex-1 min-w-0 w-full bg-transparent outline-none text-right text-2xl font-medium tracking-tight placeholder:text-muted-foreground/40 truncate"
        />
      </div>
    </div>
  );
}
