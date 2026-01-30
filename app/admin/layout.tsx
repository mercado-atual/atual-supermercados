"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ScanBarcode,
  ShoppingBag,
  Package,
  LogOut,
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/scanner", label: "Scanner", icon: ScanBarcode },
  { href: "/admin/pedidos", label: "Esteira de Pedidos", icon: ShoppingBag },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!isLoginPage && (
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-lg p-2 hover:bg-slate-800 lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
            <Link href="/admin" className="font-bold tracking-tight">
              Admin Atual
            </Link>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Ver site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-700 bg-slate-900 px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                    pathname === href
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      )}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
        {children}
      </main>
    </div>
  );
}
