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
      className="py-24 px-6 bg-white border-y-4 border-black"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16 text-[#18181B]">
          Cómo Funciona
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Horizontal connector — desktop only */}
          <div
            className="hidden md:block absolute top-7 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-[4px] bg-black"
            aria-hidden="true"
          />

          {steps.map(({ number, icon: Icon, title, description }) => (
            <div key={number} className="relative flex flex-col items-center h-full">
              {/* Step number badge */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-[#FF6B00] border-4 border-black flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
                <span className="text-white font-black text-xl">{number}</span>
              </div>

              {/* Card — flex-1 para que las tres ocupen el mismo alto */}
              <div className="flex-1 w-full bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Icon className="w-10 h-10 text-[#0033A0]" />
                </div>
                <h3 className="text-xl font-black uppercase mb-3 text-[#18181B]">
                  {title}
                </h3>
                <p className="text-gray-700 font-medium leading-relaxed">
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
