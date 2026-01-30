import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AuthProvider } from "@/contexts/AuthContext";
import UnderConstructionBanner from "@/components/UnderConstructionBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://atual-supermercados.vercel.app"),
  title: "Atual Supermercados | Ofertas, Hortifruti, Açougue e Padaria",
  description:
    "Compre online no Atual Supermercados. Ofertas do dia, hortifruti fresco, açougue, padaria e entrega rápida na sua região.",
  keywords: [
    "supermercado",
    "atual supermercados",
    "ofertas",
    "hortifruti",
    "açougue",
    "padaria",
    "comprar online",
    "entrega supermercado",
  ],
  openGraph: {
    title: "Atual Supermercados",
    description:
      "Ofertas diárias, hortifruti fresco, açougue, padaria e compras online com entrega rápida.",
    type: "website",
    locale: "pt_BR",
    siteName: "Atual Supermercados",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <UnderConstructionBanner />
              {children}
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
