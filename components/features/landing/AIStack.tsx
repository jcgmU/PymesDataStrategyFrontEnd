import { ChevronRight } from "lucide-react";

const models = [
  {
    label: "Motor Principal",
    name: "Gemini 1.5 Flash",
    description: "Rápido, eficiente y optimizado para análisis estructural de datos tabulares.",
    bg: "bg-[#1e293b]",
    textColor: "text-white",
    badgeBg: "bg-[#ff6600]",
    badgeText: "text-white",
    opacity: "opacity-100",
  },
  {
    label: "Respaldo 1",
    name: "Claude 3 Haiku",
    description: "Precisión superior en razonamiento sobre anomalías complejas y reglas de negocio.",
    bg: "bg-[#ff6600]",
    textColor: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#ff6600]",
    opacity: "opacity-80",
  },
  {
    label: "Respaldo 2",
    name: "GPT-4o Mini",
    description: "Fallback robusto con alta disponibilidad cuando los modelos primarios no responden.",
    bg: "bg-[#059669]",
    textColor: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#059669]",
    opacity: "opacity-60",
  },
];

export function AIStack() {
  return (
    <section className="py-24 px-6 bg-[#f1f5f9]">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-[#fef3c7] text-[#d97706] font-semibold px-4 py-1 rounded-full text-sm border border-[#fcd34d]">
            Próximamente
          </span>
        </div>

        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#1e293b] mb-4">
          Tolerancia a Fallos IA
        </h2>
        <p className="text-center text-[#64748b] font-medium text-lg mb-16 max-w-2xl mx-auto">
          Si el motor principal falla, el sistema escala automáticamente al siguiente modelo
          sin interrumpir tu trabajo.
        </p>

        {/* Tarjetas horizontales */}
        <div className="flex flex-col md:flex-row items-center gap-0">
          {models.map((model, index) => (
            <div key={model.name} className="flex flex-col md:flex-row items-center w-full md:w-auto">
              <div
                className={`${model.bg} ${model.textColor} ${model.opacity} rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,.07)] p-6 flex-1 w-full md:min-w-[220px]`}
              >
                <div className="mb-3">
                  <span
                    className={`${model.badgeBg} ${model.badgeText} font-semibold text-xs uppercase px-2 py-1 rounded-md`}
                  >
                    {model.label}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                <p className="text-sm font-medium opacity-90 leading-relaxed">
                  {model.description}
                </p>
              </div>

              {/* Conector */}
              {index < models.length - 1 && (
                <div className="flex items-center justify-center py-2 md:py-0 md:px-2">
                  <ChevronRight
                    className="text-[#64748b] rotate-90 md:rotate-0"
                    size={28}
                    strokeWidth={2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
