import Link from "next/link";
import { Zap } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="bg-[#FF6B00] border-y-4 border-black py-32 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black uppercase text-black leading-tight mb-8">
          Deja de limpiar manualmente.<br />Empieza a decidir.
        </h2>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 bg-white text-black font-black uppercase text-xl px-8 py-4 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          Probar el MVP
          <Zap className="text-[#0033A0]" size={24} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
