import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === sepolia.id) return null;

  return (
    <div className="border-b border-warning/30 bg-warning/10 text-warning">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>Please switch to Sepolia testnet to use SupaDupa.</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-warning/50 text-warning hover:bg-warning/20"
          disabled={isPending}
          onClick={() => switchChain({ chainId: sepolia.id })}
        >
          {isPending ? "Switching…" : "Switch network"}
        </Button>
      </div>
    </div>
  );
}
