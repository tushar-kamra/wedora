import Link from "next/link";
import { AuthEditorialPanel } from "@/components/features/auth/auth-editorial-panel";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-surface text-on-surface">
      {/* Top Minimal Auth Header */}
      <header className="fixed top-0 right-0 left-0 z-50 bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-gutter">
          <Link
            href="/"
            className="flex items-center gap-space-sm text-primary transition-opacity hover:opacity-80"
          >
            <span className="font-headline-md text-headline-md tracking-tight">
              Wedora
            </span>
            <span className="pl-space-xs font-label-caption text-label-caption tracking-widest text-on-surface-variant uppercase">
              Wedding Workspace
            </span>
          </Link>

          <div className="flex items-center gap-space-md">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Split Container */}
      <main className="flex min-h-screen w-full flex-col bg-surface pt-16">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1440px] flex-col items-stretch justify-center gap-8 p-4 lg:flex-row lg:p-10">
          {/* LEFT COLUMN: AUTHENTICATION FORM (~45%) */}
          <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-8 shadow-sm sm:p-12 lg:w-[45%] lg:p-14">
            {/* Top Decorative Architectural Line */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary-container/20 via-primary-container to-secondary/30" />
            {children}
          </div>

          {/* RIGHT COLUMN: EDITORIAL PRODUCT COMPOSITION (~55%) */}
          <AuthEditorialPanel />
        </div>
      </main>
    </div>
  );
}

