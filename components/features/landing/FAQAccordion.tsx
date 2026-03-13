"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "¿Qué pasa si mi Excel tiene columnas desordenadas?",
    answer:
      "No hay problema. El sistema analiza automáticamente la estructura de tu archivo, detecta los tipos de datos por columna y aplica las reglas de limpieza de forma independiente. No necesitas reordenar nada antes de subir tu archivo.",
  },
  {
    question: "¿Necesito saber programar para usar las reglas de IA?",
    answer:
      "No. La interfaz está diseñada para usuarios de negocio sin conocimientos técnicos. La IA genera sugerencias en lenguaje natural y tú simplemente apruebas o rechazas cada acción con un clic. Todo el proceso es visual e intuitivo.",
  },
  {
    question: "¿Cómo se garantiza que no pierdo mi información original?",
    answer:
      "Tu archivo original nunca se modifica. Trabajamos sobre una copia en memoria y te presentamos una vista previa de los cambios antes de aplicarlos. Puedes descargar tanto el archivo limpio como el original en cualquier momento.",
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-24 px-6 bg-[#F4F4F5] border-t-4 border-black">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-12 text-[#18181B]">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-black text-[#18181B] pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`text-[#FF6B00] shrink-0 transition-transform duration-300 ease-in-out ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                    size={24}
                    strokeWidth={2.5}
                  />
                </button>

                {/* Contenedor animado con grid trick */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 border-t-2 border-black">
                      <p className="text-[#18181B] font-medium leading-relaxed pt-4">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
