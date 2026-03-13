import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
      {/* Badge exclusivo */}
      <div className="inline-block bg-[#0033A0] text-white font-bold px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 mb-10">
        EXCLUSIVO PARA PYMES EN BOGOTÁ
      </div>

      {/* Headline */}
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-[#18181B] mb-8">
        Limpia tus Datos.{" "}
        <br />
        <span className="text-[#FF6B00]">Multiplica tu Valor.</span>
      </h1>

      {/* Subheadline */}
      <p className="text-xl md:text-2xl font-bold max-w-3xl text-gray-700 mb-12 border-b-4 border-black pb-8">
        Deja de perder horas ordenando Excels manualmente. Nuestro Agente de
        Inteligencia Artificial audita, estandariza y limpia hasta 50.000
        registros en minutos.
      </p>

      {/* CTA animado */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 animate-bounce bg-[#FF6B00] text-white font-bold py-3 px-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 text-lg"
      >
        Inicia tu Transformación
        <ChevronRight className="w-5 h-5" />
      </Link>
    </section>
  );
}
