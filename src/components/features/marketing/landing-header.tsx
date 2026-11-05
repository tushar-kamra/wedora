import Link from "next/link";

export function LandingHeader() {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(73,55,71,0.04)]">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-tablet lg:px-margin">
        <div className="flex items-center gap-space-md">
          <Link
            href="/"
            className="font-headline-md text-headline-md tracking-tight text-primary transition-opacity hover:opacity-90"
          >
            Wedora
          </Link>
        </div>

        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-space-xl md:flex"
        >
          <a
            href="#product"
            className="font-body-md text-body-md font-bold text-primary transition-colors"
          >
            Product
          </a>
          <a
            href="#features"
            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            How It Works
          </a>
          <a
            href="#about"
            className="font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-space-lg">
          <Link
            href="/login"
            className="font-label-lg text-label-lg text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary-container px-space-lg font-label-lg text-label-lg text-on-primary shadow-sm transition-opacity hover:opacity-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

