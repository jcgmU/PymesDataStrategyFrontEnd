export function MetricsBand() {
  return (
    <section className="bg-[#1a1a1a] text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#ff6600]/40">
        <div className="py-4">
          <div className="text-6xl font-extrabold text-[#ff6600] mb-2">50k</div>
          <div className="text-lg font-semibold text-white/80 tracking-wide">
            Registros por Archivo
          </div>
        </div>
        <div className="py-4">
          <div className="text-6xl font-extrabold text-[#ff6600] mb-2">&lt;3m</div>
          <div className="text-lg font-semibold text-white/80 tracking-wide">
            Tiempo de Procesamiento
          </div>
        </div>
        <div className="py-4">
          <div className="text-6xl font-extrabold text-[#ff6600] mb-2">100%</div>
          <div className="text-lg font-semibold text-white/80 tracking-wide">
            Trazabilidad para Auditoría
          </div>
        </div>
      </div>
    </section>
  );
}
