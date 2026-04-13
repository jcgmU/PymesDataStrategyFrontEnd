import Link from "next/link";
import { Zap } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="bg-[#ff6600] py-32 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8">
          Deja de limpiar manualmente.<br />Empieza a decidir.
        </h2>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 bg-white text-[#1e293b] font-bold text-xl px-8 py-4 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,.12)] hover:shadow-[0_10px_30px_rgba(0,0,0,.15)] hover:scale-105 active:scale-[0.98] transition-all duration-150"
        >
          Probar el MVP
          <Zap className="text-[#ff6600]" size={24} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
