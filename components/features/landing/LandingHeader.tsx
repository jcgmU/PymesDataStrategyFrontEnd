import Link from "next/link";
import { LogoMark } from "@/components/ui";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,.06)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <LogoMark size={28} color="#ff6600" />
          <span className="font-bold text-lg text-[#1e293b]">PYMES-AI</span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#como-funciona"
            className="text-sm font-medium text-[#64748b] hover:text-[#ff6600] transition-colors duration-150"
          >
            Cómo Funciona
          </Link>
          <Link
            href="#beneficios"
            className="text-sm font-medium text-[#64748b] hover:text-[#ff6600] transition-colors duration-150"
          >
            Beneficios
          </Link>
          <Link
            href="#seguridad"
            className="text-sm font-medium text-[#64748b] hover:text-[#ff6600] transition-colors duration-150"
          >
            Seguridad IA
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-[#64748b] hover:text-[#ff6600] transition-colors duration-150"
          >
            FAQ
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#1e293b] px-4 py-2 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-all duration-150"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold bg-[#ff6600] text-white px-4 py-2 rounded-lg hover:bg-[#cc5200] hover:shadow-[0_4px_12px_rgba(255,102,0,.3)] active:scale-[0.98] transition-all duration-150"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
