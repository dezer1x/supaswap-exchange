import { cn } from "@/lib/utils";
import type { Token } from "@/lib/web3/contracts";

export function TokenAvatar({
  token,
  size = 32,
  className,
}: {
  token: Token;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br ring-1 ring-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0",
        token.color,
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {token.symbol.slice(0, 2)}
    </div>
  );
}

export function TokenPair({ a, b, size = 28 }: { a: Token; b: Token; size?: number }) {
  return (
    <div className="flex items-center" style={{ width: size * 1.65 }}>
      <TokenAvatar token={a} size={size} />
      <TokenAvatar token={b} size={size} className="-ml-2 ring-2 ring-card" />
    </div>
  );
}
