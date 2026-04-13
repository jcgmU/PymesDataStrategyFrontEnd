import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
      {/* Badge */}
      <div className="inline-block bg-[#fff0e6] text-[#ff6600] font-semibold px-5 py-2 rounded-full text-sm mb-10 border border-[#ffcba4]">
        EXCLUSIVO PARA PYMES EN BOGOTÁ
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[#1e293b] mb-8">
        Limpia tus Datos.{" "}
        <br />
        <span className="text-[#ff6600]">Multiplica tu Valor.</span>
      </h1>

      {/* Subheadline */}
      <p className="text-xl md:text-2xl font-medium max-w-3xl text-[#64748b] mb-12 leading-relaxed">
        Deja de perder horas ordenando Excels manualmente. Nuestro Agente de
        Inteligencia Artificial audita, estandariza y limpia hasta 50.000
        registros en minutos.
      </p>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 animate-bounce bg-[#ff6600] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#cc5200] hover:shadow-[0_4px_12px_rgba(255,102,0,.3)] active:scale-[0.98] transition-all duration-150 text-lg"
      >
        Inicia tu Transformación
        <ChevronRight className="w-5 h-5" />
      </Link>
    </section>
  );
}
