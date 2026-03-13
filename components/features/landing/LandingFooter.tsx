import Image from "next/image";
import Link from "next/link";
import { Database, ShieldCheck } from "lucide-react";

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
    <footer className="bg-black text-white pt-16 pb-8 px-6 border-t-8 border-[#FF6B00]">
      <div className="max-w-7xl mx-auto">
        {/* Grid 4 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo + descripción (ocupa 2 columnas en md+) */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-black text-2xl text-white"
            >
              <Database className="w-8 h-8 text-[#FF6B00]" />
              <span>
                Data<span className="text-[#0033A0]">Strategy</span>
              </span>
            </Link>

            <p className="text-gray-400 font-medium max-w-sm leading-relaxed">
              Plataforma ETL con Inteligencia Artificial y Human-in-the-Loop
              para PYMES en Bogotá. Limpia, estandariza y audita tus datos en
              minutos.
            </p>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-900 border-2 border-green-400 px-4 py-2">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-bold text-sm">
                Construido con Clean Architecture
              </span>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h4 className="font-black uppercase text-[#FF6B00] mb-4 tracking-wider">
              Producto
            </h4>
            <ul className="space-y-2">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white font-medium transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-black uppercase text-[#FF6B00] mb-4 tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-white font-medium transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t-2 border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 font-medium text-sm space-y-1 text-center md:text-left">
            <p>© 2026 Proyecto de Grado GIIS - SW-005. Fundación Universitaria Compensar.</p>
            <p>Bogotá D.C., Colombia.</p>
          </div>
          <Image
            src="/compensar-logo.png"
            alt="Fundación Universitaria Compensar"
            width={120}
            height={48}
            className="object-contain opacity-70 hover:opacity-100 transition-opacity duration-200"
          />
        </div>
      </div>
    </footer>
  );
}
