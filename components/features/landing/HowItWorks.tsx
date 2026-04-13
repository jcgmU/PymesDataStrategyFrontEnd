import { UploadCloud, Cpu, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: UploadCloud,
    title: "Carga Segura",
    description:
      "Sube tu archivo Excel o CSV. Todos los datos viajan cifrados y se almacenan en un entorno seguro y aislado.",
  },
  {
    number: 2,
    icon: Cpu,
    title: "Inferencia IA",
    description:
      "Nuestro agente detecta tipos de datos, inconsistencias y errores, y aplica transformaciones inteligentes automáticamente.",
  },
  {
    number: 3,
    icon: CheckCircle2,
    title: "Tú Apruebas",
    description:
      "Revisas cada cambio propuesto, aceptas o rechazas con un clic, y descargas el archivo limpio con reporte de auditoría.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-24 px-6 bg-white border-y border-[#e2e8f0]"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-[#1e293b]">
          Cómo Funciona
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Horizontal connector — desktop only */}
          <div
            className="hidden md:block absolute top-7 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-[#e2e8f0]"
            aria-hidden="true"
          />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative flex flex-col items-center h-full">
              {/* Step number badge */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-[#ff6600] flex items-center justify-center mb-6 shrink-0">
                <span className="text-white font-bold text-xl">{number}</span>
              </div>

              {/* Card */}
              <div className="flex-1 w-full bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08),0_4px_16px_rgba(0,0,0,.04)] p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-[#ff6600]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#1e293b]">
                  {title}
                </h3>
                <p className="text-[#64748b] font-medium leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
