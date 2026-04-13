import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/ui";

const productLinks = [
  { label: "Cómo Funciona", href: "#como-funciona" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Seguridad IA", href: "#seguridad" },
  { label: "Dashboard", href: "/dashboard" },
];

const legalLinks = [
  { label: "Términos de Uso", href: "/terminos" },
  { label: "Política de Privacidad", href: "/privacidad" },
  { label: "Tratamiento de Datos", href: "/datos" },
  { label: "FAQ", href: "#faq" },
];

export function LandingFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + descripción */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <LogoMark size={28} color="#ff6600" />
              <span className="font-bold text-xl text-white">PYMES-AI</span>
            </Link>

            <p className="text-[#94a3b8] font-medium max-w-sm leading-relaxed">
              Plataforma ETL con Inteligencia Artificial y Human-in-the-Loop
              para PYMES en Bogotá. Limpia, estandariza y audita tus datos en
              minutos.
            </p>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#059669]/20 border border-[#059669]/40 rounded-lg px-4 py-2">
              <ShieldCheck className="w-5 h-5 text-[#059669]" />
              <span className="text-[#6ee7b7] font-medium text-sm">
                Construido con Clean Architecture
              </span>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h4 className="font-semibold text-[#ff6600] mb-4 text-sm uppercase tracking-wider">
              Producto
            </h4>
            <ul className="space-y-2">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[#94a3b8] hover:text-white text-sm font-medium transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-[#ff6600] mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[#94a3b8] hover:text-white text-sm font-medium transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-[#334155] pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[#64748b] text-sm space-y-1 text-center md:text-left">
            <p>© 2026 Proyecto de Grado GIIS - SW-005. Fundación Universitaria Compensar.</p>
            <p>Bogotá D.C., Colombia.</p>
          </div>
          <Image
            src="/compensar-logo.png"
            alt="Fundación Universitaria Compensar"
            width={120}
            height={48}
            className="object-contain opacity-60 hover:opacity-100 transition-opacity duration-200"
          />
        </div>
      </div>
    </footer>
  );
}
