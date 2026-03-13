export function MetricsBand() {
  return (
    <section className="bg-black text-white border-y-4 border-black py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x-4 divide-[#FF6B00]">
        <div className="py-4">
          <div className="text-6xl font-black text-[#FF6B00] mb-2">50k</div>
          <div className="text-xl font-bold uppercase tracking-wider">
            Registros por Archivo
          </div>
        </div>
        <div className="py-4">
          <div className="text-6xl font-black text-[#FF6B00] mb-2">&lt;3m</div>
          <div className="text-xl font-bold uppercase tracking-wider">
            Tiempo de Procesamiento
          </div>
        </div>
        <div className="py-4">
          <div className="text-6xl font-black text-[#FF6B00] mb-2">100%</div>
          <div className="text-xl font-bold uppercase tracking-wider">
            Trazabilidad para Auditoría
          </div>
        </div>
      </div>
    </section>
  );
}
