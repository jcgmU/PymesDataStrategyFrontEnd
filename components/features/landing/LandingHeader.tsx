import Link from "next/link";
import { Database } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#F4F4F5] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-black text-xl text-[#18181B]">
          <Database className="w-7 h-7 text-[#FF6B00]" />
          <span>Data<span className="text-[#0033A0]">Strategy</span></span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#como-funciona"
            className="font-bold text-[#18181B] hover:text-[#FF6B00] transition-colors duration-150"
          >
            Cómo Funciona
          </Link>
          <Link
            href="#beneficios"
            className="font-bold text-[#18181B] hover:text-[#FF6B00] transition-colors duration-150"
          >
            Beneficios
          </Link>
          <Link
            href="#seguridad"
            className="font-bold text-[#18181B] hover:text-[#FF6B00] transition-colors duration-150"
          >
            Seguridad IA
          </Link>
          <Link
            href="#faq"
            className="font-bold text-[#18181B] hover:text-[#FF6B00] transition-colors duration-150"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {/* Ghost button — Iniciar Sesión */}
          <Link
            href="/dashboard"
            className="font-bold py-2 px-5 border-2 border-black bg-transparent text-[#18181B] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
          >
            Iniciar Sesión
          </Link>
          {/* Primary button — Dashboard */}
          <Link
            href="/dashboard"
            className="font-bold py-2 px-5 border-2 border-black bg-[#FF6B00] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
