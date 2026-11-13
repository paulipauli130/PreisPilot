import type { Metadata } from "next";
import "./globals.css";
import "./theme.css";

export const metadata: Metadata = {
  title: "Sparwache – Preise im Blick",
  description: "Produkte vergleichen, Preisverläufe verstehen und den besten Moment zum Kaufen finden.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="de"><body>{children}</body></html>;
}
