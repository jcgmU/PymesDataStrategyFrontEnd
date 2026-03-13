import { ChevronRight } from "lucide-react";

const models = [
  {
    label: "Motor Principal",
    name: "Gemini 1.5 Flash",
    description: "Rápido, eficiente y optimizado para análisis estructural de datos tabulares.",
    bg: "bg-[#0033A0]",
    textColor: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#0033A0]",
    opacity: "opacity-100",
  },
  {
    label: "Respaldo 1",
    name: "Claude 3 Haiku",
    description: "Precisión superior en razonamiento sobre anomalías complejas y reglas de negocio.",
    bg: "bg-[#FF6B00]",
    textColor: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-[#FF6B00]",
    opacity: "opacity-80",
  },
  {
    label: "Respaldo 2",
    name: "GPT-4o Mini",
    description: "Fallback robusto con alta disponibilidad cuando los modelos primarios no responden.",
    bg: "bg-green-600",
    textColor: "text-white",
    badgeBg: "bg-white",
    badgeText: "text-green-700",
    opacity: "opacity-60",
  },
];

export function AIStack() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Badge "Próximamente" encima del título */}
        <div className="flex justify-center mb-4">
          <span className="bg-yellow-400 text-black font-bold px-3 py-1 border-2 border-black text-sm uppercase">
            Próximamente
          </span>
        </div>

        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-black uppercase text-center text-[#18181B] mb-4">
          Tolerancia a Fallos IA
        </h2>
        <p className="text-center text-[#18181B] font-medium text-lg mb-16 max-w-2xl mx-auto">
          Si el motor principal falla, el sistema escala automáticamente al siguiente modelo
          sin interrumpir tu trabajo.
        </p>

        {/* Tarjetas horizontales conectadas */}
        <div className="flex flex-col md:flex-row items-center gap-0">
          {models.map((model, index) => (
            <div key={model.name} className="flex flex-col md:flex-row items-center w-full md:w-auto">
              <div
                className={`${model.bg} ${model.textColor} ${model.opacity} border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex-1 w-full md:min-w-[220px]`}
              >
                <div className="mb-3">
                  <span
                    className={`${model.badgeBg} ${model.badgeText} font-black text-xs uppercase px-2 py-1 border border-black`}
                  >
                    {model.label}
                  </span>
                </div>
                <h3 className="text-xl font-black mb-2">{model.name}</h3>
                <p className="text-sm font-medium opacity-90 leading-relaxed">
                  {model.description}
                </p>
              </div>

              {/* Conector entre tarjetas */}
              {index < models.length - 1 && (
                <div className="flex items-center justify-center py-2 md:py-0 md:px-2">
                  <ChevronRight
                    className="text-[#18181B] rotate-90 md:rotate-0"
                    size={32}
                    strokeWidth={2.5}
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
