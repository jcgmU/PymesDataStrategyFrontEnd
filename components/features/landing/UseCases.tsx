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
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-[#1e293b]">
        Diseñado para cada área
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {cases.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,.08),0_4px_16px_rgba(0,0,0,.04)] p-6 transition-all duration-150 hover:shadow-[0_4px_6px_rgba(0,0,0,.07),0_10px_30px_rgba(0,0,0,.06)] hover:-translate-y-1"
            >
              <div className="mb-4">
                <Icon className="text-[#ff6600]" size={40} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-3">
                {item.title}
              </h3>
              <p className="text-[#64748b] font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
