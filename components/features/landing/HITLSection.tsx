import { AlertTriangle, Check, X } from "lucide-react";

export function HITLSection() {
  return (
    <section className="py-24 px-6 bg-[#0033A0] text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Lado izquierdo: texto */}
        <div className="flex-1 space-y-6">
          <div className="inline-block bg-[#FF6B00] text-black font-black uppercase px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Human-in-the-Loop
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight">
            La IA sugiere.<br />Tú decides.
          </h2>
          <p className="text-xl font-medium border-l-4 border-[#FF6B00] pl-6 text-blue-100">
            No somos una caja negra. La Inteligencia Artificial perfila las anomalías,
            pero el sistema se detiene y te presenta una interfaz clara para que apruebes
            o descartes cada acción antes de modificar un solo dato.
          </p>
        </div>

        {/* Lado derecho: mockup UI card */}
        <div className="flex-1 w-full">
          <div className="bg-white text-black p-6 border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transform rotate-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-black text-white font-black text-sm px-3 py-1 uppercase">
                  Columna: Salario
                </span>
                <AlertTriangle className="text-[#FF6B00]" size={20} />
              </div>
            </div>

            {/* Descripción del problema */}
            <p className="text-[#18181B] font-semibold mb-4 text-base">
              Se detectaron <span className="font-black">15 registros</span> tipo texto.
            </p>

            {/* Sugerencia IA */}
            <div className="bg-[#0033A0] text-white p-4 border-2 border-black mb-6">
              <p className="text-xs font-black uppercase mb-1 text-blue-200">Sugerencia IA</p>
              <p className="font-semibold text-sm">
                Convertir a numérico (Rellenar con promedio si falla)
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-green-500 text-white font-black uppercase px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-sm">
                <Check size={16} />
                Aprobar
              </button>
              <button className="flex items-center gap-2 bg-red-500 text-white font-black uppercase px-4 py-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-sm">
                <X size={16} />
                Descartar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
