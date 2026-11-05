import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedora",
  description: "Collaborative Indian wedding management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}

