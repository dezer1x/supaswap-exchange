import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TOKENS, type Token } from "@/lib/web3/contracts";
import { TokenAvatar } from "@/components/TokenAvatar";

const RECENT_KEY = "supadupa.recent-tokens";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function TokenSelectorModal({
  open,
  onOpenChange,
  onSelect,
  exclude,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (token: Token) => void;
  exclude?: string;
}) {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>(loadRecent);

  const list = useMemo(
    () =>
      TOKENS.filter(
        (t) =>
          t.address !== exclude &&
          (q === "" ||
            t.symbol.toLowerCase().includes(q.toLowerCase()) ||
            t.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, exclude],
  );

  const recentTokens = TOKENS.filter(
    (t) => recent.includes(t.address) && t.address !== exclude,
  );

  const handleSelect = (t: Token) => {
    const next = [t.address, ...recent.filter((a) => a !== t.address)].slice(0, 4);
    setRecent(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    }
    onSelect(t);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-base">Select a token</DialogTitle>
        </DialogHeader>

        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or symbol"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {recentTokens.length > 0 && q === "" && (
          <div className="px-5 pb-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Recent
            </div>
            <div className="flex flex-wrap gap-2">
              {recentTokens.map((t) => (
                <button
                  key={t.address}
                  onClick={() => handleSelect(t)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] btn-press text-sm"
                >
                  <TokenAvatar token={t} size={20} />
                  {t.symbol}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-h-80 overflow-y-auto border-t border-white/[0.06]">
          {list.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No tokens found
            </div>
          )}
          {list.map((t) => (
            <button
              key={t.address}
              onClick={() => handleSelect(t)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-white/[0.04] transition-colors text-left"
            >
              <TokenAvatar token={t} size={36} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{t.symbol}</div>
                <div className="text-xs text-muted-foreground truncate">{t.name}</div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
