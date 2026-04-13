import { X, Check } from "lucide-react";

const problems = [
  "Horas perdidas ordenando Excels manualmente",
  "Errores humanos que arruinan reportes clave",
  "Sin trazabilidad: no sabes quién cambió qué ni cuándo",
  "Imposible escalar: más datos = más caos",
];

const solutions = [
  "IA procesa hasta 50.000 registros en minutos",
  "Estandarización automática con reglas configurables",
  "Registro inmutable de cada transformación para auditoría",
  "Escala con tu negocio sin añadir personal",
];

export function ProblemSolution() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-[#1e293b]">
        La realidad de la gestión de datos
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problema */}
        <div className="bg-[#fee2e2] rounded-[10px] p-6 shadow-[0_1px_3px_rgba(0,0,0,.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center">
              <X className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#dc2626]">
              El Problema
            </h3>
          </div>
          <ul className="space-y-4">
            {problems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <X className="w-5 h-5 text-[#dc2626] mt-0.5 shrink-0" />
                <span className="font-medium text-[#1e293b]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solución */}
        <div className="bg-[#d1fae5] rounded-[10px] p-6 shadow-[0_1px_3px_rgba(0,0,0,.08)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#059669] rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#059669]">
              Nuestra Solución
            </h3>
          </div>
          <ul className="space-y-4">
            {solutions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#059669] mt-0.5 shrink-0" />
                <span className="font-medium text-[#1e293b]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
