import { TrendingUp, Users, Package } from "lucide-react";

const cases = [
  {
    icon: TrendingUp,
    title: "Ventas",
    description:
      "Limpia y normaliza reportes de ventas automáticamente. Detecta duplicados, corrige formatos de fecha y estandariza nombres de productos para análisis más precisos.",
  },
  {
    icon: Users,
    title: "Nómina",
    description:
      "Valida datos de empleados, detecta inconsistencias en salarios y formatos de CURP o RFC antes de procesar pagos. Evita errores costosos en nómina.",
  },
  {
    icon: Package,
    title: "Inventario",
    description:
      "Unifica catálogos de productos, detecta SKUs duplicados y corrige unidades de medida inconsistentes. Mantén tu inventario siempre confiable.",
  },
];

export function UseCases() {
  return (
    <section id="beneficios" className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16 text-[#18181B]">
        Diseñado para cada área
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {cases.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 hover:-translate-y-2 transition-transform"
            >
              <div className="mb-4">
                <Icon className="text-[#FF6B00]" size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black uppercase text-[#18181B] mb-3">
                {item.title}
              </h3>
              <p className="text-[#18181B] font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
