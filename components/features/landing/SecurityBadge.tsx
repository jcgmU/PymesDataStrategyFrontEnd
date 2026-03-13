import { Lock, ShieldCheck } from "lucide-react";

export function SecurityBadge() {
  return (
    <section id="seguridad" className="bg-black text-white py-16 px-6 border-y-4 border-[#FF6B00]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Badge "Próximamente" */}
        <div className="flex justify-center">
          <span className="bg-yellow-400 text-black font-bold px-3 py-1 border-2 border-black text-sm uppercase">
            Próximamente
          </span>
        </div>

        {/* Ícono en círculo azul */}
        <div className="flex justify-center">
          <div className="bg-[#0033A0] rounded-full p-6 border-4 border-[#FF6B00] shadow-[6px_6px_0px_0px_rgba(255,107,0,1)]">
            <Lock className="text-white" size={48} strokeWidth={2} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-black uppercase text-[#FF6B00] leading-tight">
          Tus datos nunca salen del servidor
        </h2>

        {/* Descripción */}
        <p className="text-lg text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
          Con <span className="text-white font-bold">Inferencia Estratégica</span>, el modelo de IA
          analiza únicamente los metadatos estructurales de tu archivo — tipos de columna, patrones
          estadísticos y rangos — sin procesar el contenido sensible de tus registros.
        </p>

        {/* Features */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3">
            <ShieldCheck className="text-[#FF6B00] shrink-0" size={20} />
            <span className="text-sm font-semibold text-gray-200">
              Sin transmisión de datos personales
            </span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3">
            <ShieldCheck className="text-[#FF6B00] shrink-0" size={20} />
            <span className="text-sm font-semibold text-gray-200">
              Solo metadatos estructurales
            </span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 px-4 py-3">
            <ShieldCheck className="text-[#FF6B00] shrink-0" size={20} />
            <span className="text-sm font-semibold text-gray-200">
              Procesamiento local del archivo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
