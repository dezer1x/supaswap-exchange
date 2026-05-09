import { Link } from "@tanstack/react-router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Swap" },
  { to: "/pools", label: "Pools" },
  { to: "/faucet", label: "Faucet" },
  { to: "/analytics", label: "Analytics" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-200",
        scrolled
          ? "border-b border-white/[0.06] bg-background/60 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-lg gradient-bg shadow-[0_0_20px_-2px_oklch(0.58_0.24_295/0.6)]">
            <span className="text-sm font-black text-white">S</span>
          </span>
          <span className="text-base font-semibold tracking-tight">
            <span className="text-muted-foreground">[</span>
            <span className="gradient-text">SupaDupa</span>
            <span className="text-muted-foreground">]</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-white/[0.06] data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2" translate="no" lang="en">
          <ConnectButton
            accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center justify-around border-t border-white/[0.06] bg-background/60 backdrop-blur-xl">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex-1 text-center py-2.5 text-xs font-medium text-muted-foreground data-[status=active]:text-foreground data-[status=active]:bg-white/[0.04]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
