import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { Web3Providers } from "@/components/Web3Providers";
import { Header } from "@/components/Header";
import { NetworkBanner } from "@/components/NetworkBanner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium gradient-bg btn-press"
        >
          Back to Swap
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground break-words">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-6 inline-flex h-10 items-center rounded-full px-5 text-sm font-medium gradient-bg btn-press"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SupaDupa — DEX on Sepolia" },
      {
        name: "description",
        content:
          "SupaDupa is a fast, minimal decentralized exchange on the Ethereum Sepolia testnet. Swap tokens, provide liquidity, claim from the faucet.",
      },
      { property: "og:title", content: "SupaDupa — DEX on Sepolia" },
      {
        property: "og:description",
        content: "Swap, pool, and explore on the SupaDupa testnet DEX.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SupaDupa — DEX on Sepolia" },
      { name: "description", content: "SupaSwap Exchange is a decentralized exchange web application for trading tokens on Ethereum Sepolia testnet." },
      { property: "og:description", content: "SupaSwap Exchange is a decentralized exchange web application for trading tokens on Ethereum Sepolia testnet." },
      { name: "twitter:description", content: "SupaSwap Exchange is a decentralized exchange web application for trading tokens on Ethereum Sepolia testnet." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/18de9107-c3a8-4b8c-9d0c-3f7a96318e2c/id-preview-3aab7618--2efe756a-40bf-49a1-b6cc-cc40fb099490.lovable.app-1778236435940.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/18de9107-c3a8-4b8c-9d0c-3f7a96318e2c/id-preview-3aab7618--2efe756a-40bf-49a1-b6cc-cc40fb099490.lovable.app-1778236435940.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="dark">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Providers>
        <div className="relative min-h-screen text-foreground">
          {/* Ambient background layers */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage:
                  "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 40%, transparent 80%)",
              }}
            />
            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              }}
            />
            {/* Floating orbs */}
            <div
              className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full opacity-70 blur-3xl animate-orb-1"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.58 0.24 295 / 0.65), transparent)",
              }}
            />
            <div
              className="absolute top-1/3 -right-20 h-[460px] w-[560px] rounded-full opacity-60 blur-3xl animate-orb-2"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.78 0.14 210 / 0.6), transparent)",
              }}
            />
            <div
              className="absolute bottom-0 -left-32 h-[420px] w-[520px] rounded-full opacity-50 blur-3xl animate-orb-3"
              style={{
                background:
                  "radial-gradient(closest-side, oklch(0.65 0.22 320 / 0.55), transparent)",
              }}
            />
            {/* Vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </div>

          <Header />
          <NetworkBanner />
          <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
            <Outlet />
          </main>
          <footer className="border-t border-white/[0.06] mt-16">
            <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
              <span>© {new Date().getFullYear()} SupaDupa Protocol · Sepolia testnet</span>
              <span>Not financial advice. Test tokens only.</span>
            </div>
          </footer>
          <Toaster
            theme="dark"
            position="bottom-right"
            duration={5000}
            toastOptions={{
              style: {
                background: "rgba(18,18,26,0.92)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#F8FAFC",
                backdropFilter: "blur(12px)",
              },
            }}
          />
        </div>
      </Web3Providers>
    </QueryClientProvider>
  );
}
