import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import { http } from "viem";

export const wagmiConfig = getDefaultConfig({
  appName: "SupaDupa",
  // Replace via VITE_WALLETCONNECT_PROJECT_ID env var when available.
  projectId:
    (import.meta as any).env?.VITE_WALLETCONNECT_PROJECT_ID ||
    "00000000000000000000000000000000",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
});
