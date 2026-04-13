import { Lock, ShieldCheck } from "lucide-react";

export function SecurityBadge() {
  return (
    <section id="seguridad" className="bg-[#1a1a1a] text-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Badge "Próximamente" */}
        <div className="flex justify-center">
          <span className="bg-[#fef3c7] text-[#d97706] font-semibold px-4 py-1 rounded-full text-sm border border-[#fcd34d]">
            Próximamente
          </span>
        </div>

        {/* Ícono en círculo naranja */}
        <div className="flex justify-center">
          <div className="bg-[#ff6600] rounded-full p-6 shadow-[0_0_40px_rgba(255,102,0,.4)]">
            <Lock className="text-white" size={48} strokeWidth={2} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#ff6600] leading-tight">
          Tus datos nunca salen del servidor
        </h2>

        {/* Descripción */}
        <p className="text-lg text-white/70 font-medium max-w-2xl mx-auto leading-relaxed">
          Con <span className="text-white font-bold">Inferencia Estratégica</span>, el modelo de IA
          analiza únicamente los metadatos estructurales de tu archivo — tipos de columna, patrones
          estadísticos y rangos — sin procesar el contenido sensible de tus registros.
        </p>

        {/* Features */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          {[
            "Sin transmisión de datos personales",
            "Solo metadatos estructurales",
            "Procesamiento local del archivo",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-lg px-4 py-3">
              <ShieldCheck className="text-[#ff6600] shrink-0" size={20} />
              <span className="text-sm font-medium text-white/80">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
