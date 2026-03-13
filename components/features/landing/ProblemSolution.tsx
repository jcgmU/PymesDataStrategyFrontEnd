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
      <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16 text-[#18181B]">
        La realidad de la gestión de datos
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Problema */}
        <div className="bg-red-50 border-2 border-red-900 shadow-[6px_6px_0px_0px_rgba(127,29,29,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-900 flex items-center justify-center border-2 border-black">
              <X className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase text-red-900">
              El Problema
            </h3>
          </div>
          <ul className="space-y-4">
            {problems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-700 mt-0.5 shrink-0" />
                <span className="font-semibold text-red-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solución */}
        <div className="bg-green-50 border-2 border-green-900 shadow-[6px_6px_0px_0px_rgba(20,83,45,1)] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-900 flex items-center justify-center border-2 border-black">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase text-green-900">
              Nuestra Solución
            </h3>
          </div>
          <ul className="space-y-4">
            {solutions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                <span className="font-semibold text-green-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
