import { AlertTriangle, Check, X } from "lucide-react";

export function HITLSection() {
  return (
    <section className="py-24 px-6" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #3d1a00 50%, #ff6600 100%)' }}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Lado izquierdo: texto */}
        <div className="flex-1 space-y-6">
          <div className="inline-block bg-[#ff6600] text-white font-semibold uppercase px-4 py-1 rounded-full text-sm">
            Human-in-the-Loop
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight text-white">
            La IA sugiere.<br />Tú decides.
          </h2>
          <p className="text-xl font-medium border-l-4 border-[#ff6600] pl-6 text-white/80 leading-relaxed">
            No somos una caja negra. La Inteligencia Artificial perfila las anomalías,
            pero el sistema se detiene y te presenta una interfaz clara para que apruebes
            o descartes cada acción antes de modificar un solo dato.
          </p>
        </div>

        {/* Lado derecho: mockup UI card */}
        <div className="flex-1 w-full">
          <div className="bg-white rounded-[10px] p-6 shadow-[0_20px_40px_rgba(0,0,0,.3)] transform rotate-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#1e293b] text-white font-semibold text-sm px-3 py-1 rounded-md">
                  Columna: Salario
                </span>
                <AlertTriangle className="text-[#ff6600]" size={20} />
              </div>
            </div>

            {/* Descripción del problema */}
            <p className="text-[#1e293b] font-semibold mb-4 text-base">
              Se detectaron <span className="font-bold">15 registros</span> tipo texto.
            </p>

            {/* Sugerencia IA */}
            <div className="bg-[#fff0e6] border border-[#ffcba4] rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold uppercase mb-1 text-[#ff6600]">Sugerencia IA</p>
              <p className="font-medium text-sm text-[#1e293b]">
                Convertir a numérico (Rellenar con promedio si falla)
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-[#059669] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#047857] transition-colors text-sm">
                <Check size={16} />
                Aprobar
              </button>
              <button className="flex items-center gap-2 bg-[#dc2626] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#b91c1c] transition-colors text-sm">
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
