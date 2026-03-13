import React, { useState } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  Check,
  X,
  PenTool,
  LayoutDashboard,
  Settings,
  LogOut,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Database,
  TrendingUp,
  Zap,
  Clock,
  Users,
  Package,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";

// --- CONFIGURACIÓN DE COLORES CORPORATIVOS ---
const COLORS = {
  primary: "#FF6B00", // Naranja Compensar
  secondary: "#0033A0", // Azul Compensar
  background: "#F4F4F5", // Gris claro
  surface: "#FFFFFF",
  text: "#18181B",
};

// --- COMPONENTES BASE (NEO-BRUTALISM UI) ---

const BrutalButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}) => {
  const baseStyle =
    "font-bold py-3 px-6 border-2 border-black transition-all duration-150 flex items-center justify-center gap-2";
  const activeStyle = disabled
    ? "opacity-50 cursor-not-allowed translate-x-[4px] translate-y-[4px] shadow-none"
    : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none";

  const variants = {
    primary: "bg-[#FF6B00] text-white",
    secondary: "bg-[#0033A0] text-white",
    success: "bg-green-400 text-black",
    danger: "bg-red-400 text-black",
    ghost: "bg-white text-black hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${activeStyle} ${className}`}
    >
      {children}
    </button>
  );
};

const BrutalCard = ({ children, className = "" }) => (
  <div
    className={`bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 ${className}`}
  >
    {children}
  </div>
);

// --- COMPONENTES DE LAYOUT ---

const Header = ({ onNavigate, currentView }) => (
  <header className="bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center sticky top-0 z-50">
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => onNavigate("landing")}
    >
      <Database className="w-8 h-8 text-[#FF6B00]" />
      <span className="text-2xl font-black uppercase tracking-tight">
        Data<span className="text-[#0033A0]">Strategy</span>
      </span>
    </div>

    {currentView === "landing" && (
      <nav className="hidden md:flex gap-8 font-bold uppercase text-sm">
        <a
          href="#como-funciona"
          className="hover:text-[#FF6B00] transition-colors"
        >
          Cómo Funciona
        </a>
        <a
          href="#beneficios"
          className="hover:text-[#FF6B00] transition-colors"
        >
          Beneficios
        </a>
        <a href="#seguridad" className="hover:text-[#FF6B00] transition-colors">
          Seguridad IA
        </a>
        <a href="#faq" className="hover:text-[#FF6B00] transition-colors">
          FAQ
        </a>
      </nav>
    )}

    <div className="flex gap-4">
      {currentView === "landing" ? (
        <>
          <BrutalButton
            variant="ghost"
            onClick={() => onNavigate("dashboard")}
            className="hidden sm:flex !py-2"
          >
            Iniciar Sesión
          </BrutalButton>
          <BrutalButton
            variant="primary"
            onClick={() => onNavigate("dashboard")}
            className="!py-2"
          >
            Dashboard
          </BrutalButton>
        </>
      ) : (
        <BrutalButton
          variant="ghost"
          onClick={() => onNavigate("landing")}
          className="!py-2 !px-3"
        >
          <LogOut className="w-5 h-5" /> Salir
        </BrutalButton>
      )}
    </div>
  </header>
);

const Footer = () => (
  <footer className="bg-black text-white pt-16 pb-8 px-6 border-t-8 border-[#FF6B00]">
    <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-12">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-8 h-8 text-[#FF6B00]" />
          <span className="text-2xl font-black uppercase tracking-tight">
            Data<span className="text-[#0033A0]">Strategy</span>
          </span>
        </div>
        <p className="text-gray-400 max-w-sm font-medium">
          Transformando la manera en que las PYMES y MIPYMES de Bogotá toman
          decisiones basadas en datos estructurados.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-gray-900 border-2 border-gray-700 px-4 py-2 font-bold text-sm text-green-400">
          <ShieldCheck className="w-4 h-4" /> Construido con Clean Architecture
        </div>
      </div>
      <div>
        <h4 className="font-bold uppercase mb-4 text-[#FF6B00]">Producto</h4>
        <ul className="space-y-2 text-gray-400 font-medium">
          <li>
            <a href="#" className="hover:text-white">
              Motor ETL
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Agentes IA
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Auditoría de Datos
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Integración BI
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold uppercase mb-4 text-[#FF6B00]">Legal</h4>
        <ul className="space-y-2 text-gray-400 font-medium">
          <li>
            <a href="#" className="hover:text-white">
              Privacidad
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Términos de Servicio
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white">
              Seguridad de Datos
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto border-t-2 border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-bold text-gray-500">
      <p>
        © 2026 Proyecto de Grado GIIS - SW-005. Fundación Universitaria
        Compensar.
      </p>
      <p>Bogotá D.C., Colombia.</p>
    </div>
  </footer>
);

// --- SECCIONES DE LA LANDING PAGE ---

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    {
      q: "¿Qué pasa si mi Excel tiene columnas desordenadas?",
      a: "No hay problema. La Inteligencia Artificial analiza la estructura y el contenido (metadatos) para identificar qué es cada cosa, sin importar el orden original.",
    },
    {
      q: "¿Necesito saber programar para usar las reglas de IA?",
      a: "En absoluto. El sistema traduce las reglas técnicas a lenguaje de negocios. Tú solo debes hacer clic en 'Aprobar' o 'Descartar' la sugerencia.",
    },
    {
      q: "¿Cómo se garantiza que no pierdo mi información original?",
      a: "El archivo original se almacena de forma inmutable en la nube (AWS S3). Nunca se sobreescribe. Además, mantenemos un registro de trazabilidad granular de cada cambio.",
    },
  ];

  return (
    <div className="space-y-4 max-w-3xl mx-auto w-full">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <button
            className="w-full flex justify-between items-center p-6 text-left font-bold text-lg hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
          >
            {faq.q}
            {openIndex === i ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </button>
          {openIndex === i && (
            <div className="p-6 pt-0 font-medium text-gray-700 border-t-2 border-gray-100">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const LandingView = ({ onNavigate }) => (
  <div className="flex flex-col min-h-screen bg-[#F4F4F5]">
    {/* 1. HERO SECTION */}
    <section className="py-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
      <div className="inline-block bg-[#0033A0] text-white font-bold px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-2 mb-10">
        EXCLUSIVO PARA PYMES EN BOGOTÁ
      </div>
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-[#18181B] mb-8">
        Limpia tus Datos. <br />{" "}
        <span className="text-[#FF6B00]">Multiplica tu Valor.</span>
      </h1>
      <p className="text-xl md:text-2xl font-bold max-w-3xl text-gray-700 mb-12 border-b-4 border-black pb-8">
        Deja de perder horas ordenando Excels manualmente. Nuestro Agente de
        Inteligencia Artificial audita, estandariza y limpia hasta 50.000
        registros en minutos.
      </p>
      <BrutalButton
        onClick={() => onNavigate("dashboard")}
        className="text-2xl px-12 py-6 animate-bounce"
      >
        Inicia tu Transformación <ChevronRight className="w-8 h-8" />
      </BrutalButton>
    </section>

    {/* 2. BANDA DE MÉTRICAS */}
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

    {/* 3. EL PROBLEMA VS LA SOLUCIÓN */}
    <section className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">
        La realidad de la gestión de datos
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <BrutalCard className="bg-red-50 !border-red-900 !shadow-[8px_8px_0px_0px_rgba(127,29,29,1)]">
          <div className="bg-red-100 w-16 h-16 flex items-center justify-center border-2 border-red-900 rounded-full mb-6">
            <X className="w-8 h-8 text-red-700" />
          </div>
          <h3 className="text-3xl font-black uppercase text-red-900 mb-4">
            El Problema
          </h3>
          <ul className="space-y-4 font-bold text-red-800 text-lg">
            <li>• Horas invertidas limpiando celdas manualmente.</li>
            <li>• Formatos inconsistentes (ej. números como texto).</li>
            <li>• Decisiones basadas en datos con errores.</li>
            <li>• Imposibilidad de conectar a Power BI fácilmente.</li>
          </ul>
        </BrutalCard>
        <BrutalCard className="bg-green-50 !border-green-900 !shadow-[8px_8px_0px_0px_rgba(20,83,45,1)]">
          <div className="bg-green-100 w-16 h-16 flex items-center justify-center border-2 border-green-900 rounded-full mb-6">
            <Check className="w-8 h-8 text-green-700" />
          </div>
          <h3 className="text-3xl font-black uppercase text-green-900 mb-4">
            Nuestra Solución
          </h3>
          <ul className="space-y-4 font-bold text-green-800 text-lg">
            <li>• Motor ETL automatizado de alto rendimiento.</li>
            <li>• IA que perfila errores sin que tengas que buscar.</li>
            <li>• Trazabilidad total: Sabes exactamente qué cambió.</li>
            <li>• Archivos limpios y listos para tableros de control.</li>
          </ul>
        </BrutalCard>
      </div>
    </section>

    {/* 4. CÓMO FUNCIONA (FLUJO 3 PASOS) */}
    <section
      id="como-funciona"
      className="py-24 px-6 bg-white border-y-4 border-black"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">
          Flujo Estratégico en 3 Pasos
        </h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Conector visual desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-2 bg-black z-0"></div>

          {[
            {
              n: 1,
              title: "Carga Segura",
              desc: "Sube tu Excel. Usamos streams para no saturar memoria.",
              icon: UploadCloud,
            },
            {
              n: 2,
              title: "Inferencia IA",
              desc: "El agente analiza la estructura y propone reglas de negocio.",
              icon: Cpu,
            },
            {
              n: 3,
              title: "Tú Apruebas",
              desc: "Aprueba las sugerencias. El sistema ejecuta y audita.",
              icon: CheckCircle2,
            },
          ].map((step) => (
            <div
              key={step.n}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 bg-[#FF6B00] text-white rounded-full border-4 border-black flex items-center justify-center text-4xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                {step.n}
              </div>
              <BrutalCard className="w-full">
                <step.icon className="w-10 h-10 text-[#0033A0] mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase mb-2">
                  {step.title}
                </h3>
                <p className="font-medium text-gray-700">{step.desc}</p>
              </BrutalCard>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* 5. MUESTRA VISUAL DE LA CONSOLA (Mockup UI) */}
    <section className="py-24 px-6 bg-[#0033A0] text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <div className="inline-block bg-[#FF6B00] text-black font-black uppercase px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Human-in-the-Loop
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight">
            La IA sugiere.
            <br />
            Tú decides.
          </h2>
          <p className="text-xl font-medium border-l-4 border-[#FF6B00] pl-6 text-blue-100">
            No somos una caja negra. La Inteligencia Artificial perfila las
            anomalías, pero el sistema se detiene y te presenta una interfaz
            clara para que apruebes o descartes cada acción antes de modificar
            un solo dato.
          </p>
        </div>
        <div className="flex-1 w-full">
          <div className="bg-white text-black p-6 border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transform rotate-2">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-4">
              <span className="font-black uppercase bg-black text-white px-2">
                Columna: Salario
              </span>
              <AlertTriangle className="text-[#FF6B00] w-6 h-6" />
            </div>
            <p className="font-bold text-lg mb-2">
              Se detectaron 15 registros tipo texto.
            </p>
            <div className="bg-blue-50 p-3 border-l-4 border-[#0033A0] mb-6">
              <p className="text-sm font-bold text-[#0033A0] uppercase mb-1">
                Sugerencia IA:
              </p>
              <p className="font-medium">
                Convertir a numérico (Rellenar con promedio si falla).
              </p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-green-400 border-2 border-black font-bold py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1">
                <Check className="w-4" /> Aprobar
              </button>
              <button className="flex-1 bg-red-400 border-2 border-black font-bold py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1">
                <X className="w-4" /> Descartar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* 6. CASOS DE USO (Tarjetas) */}
    <section className="py-24 px-6 max-w-6xl mx-auto w-full">
      <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-16">
        Diseñado para cada área
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: TrendingUp,
            title: "Ventas",
            desc: "Estandariza bases de clientes, corrige formatos de precios y elimina duplicados de facturación.",
          },
          {
            icon: Users,
            title: "Nómina",
            desc: "Detecta inconsistencias numéricas en salarios y limpia formatos de identificación.",
          },
          {
            icon: Package,
            title: "Inventario",
            desc: "Armoniza códigos SKU inconsistentes y rellena vacíos críticos en la base de stock.",
          },
        ].map((useCase, i) => (
          <BrutalCard
            key={i}
            className="hover:-translate-y-2 transition-transform"
          >
            <useCase.icon className="w-12 h-12 text-[#FF6B00] mb-4" />
            <h3 className="text-2xl font-black uppercase mb-3 border-b-2 border-black pb-2">
              {useCase.title}
            </h3>
            <p className="font-medium text-gray-700">{useCase.desc}</p>
          </BrutalCard>
        ))}
      </div>
    </section>

    {/* 7. SELLO DE SEGURIDAD IA */}
    <section
      id="seguridad"
      className="bg-black text-white py-16 px-6 border-y-4 border-[#FF6B00]"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
        <div className="w-32 h-32 shrink-0 bg-[#0033A0] rounded-full border-4 border-white flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(255,107,0,1)]">
          <Lock className="w-16 h-16 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase text-[#FF6B00] mb-4">
            Tus datos nunca salen del servidor
          </h2>
          <p className="text-lg font-medium text-gray-300">
            Implementamos{" "}
            <span className="text-white font-bold">Inferencia Estratégica</span>
            . La Inteligencia Artificial NUNCA lee los registros de tu empresa
            (nombres, montos, etc). Solo enviamos la "estructura" o metadatos
            del archivo para garantizar 100% de confidencialidad comercial.
          </p>
        </div>
      </div>
    </section>

    {/* 8. STACK DE IA (Fallback Chain) */}
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">
            Tolerancia a Fallos IA
          </h2>
          <p className="text-xl font-medium text-gray-600">
            Arquitectura de respaldo automático para que tu negocio nunca se
            detenga.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
          <BrutalCard className="flex-1 bg-[#F4F4F5] border-blue-600 !shadow-[6px_6px_0px_0px_rgba(37,99,235,1)]">
            <div className="text-blue-600 font-black mb-2 uppercase text-sm">
              Motor Principal
            </div>
            <h3 className="text-2xl font-black mb-2">Gemini 1.5 Flash</h3>
            <p className="text-sm font-medium">
              Priorizado por su alta velocidad de razonamiento lógico y
              eficiencia en metadatos.
            </p>
          </BrutalCard>
          <div className="hidden md:flex items-center">
            <ChevronRight className="w-8 h-8 text-gray-400" />
          </div>
          <BrutalCard className="flex-1 bg-[#F4F4F5] border-orange-600 !shadow-[6px_6px_0px_0px_rgba(234,88,12,1)] opacity-80">
            <div className="text-orange-600 font-black mb-2 uppercase text-sm">
              Respaldo 1
            </div>
            <h3 className="text-2xl font-black mb-2">Claude 3 Haiku</h3>
            <p className="text-sm font-medium">
              Activación inmediata ante límites de tasa. Ideal para
              estructuración JSON.
            </p>
          </BrutalCard>
          <div className="hidden md:flex items-center">
            <ChevronRight className="w-8 h-8 text-gray-400" />
          </div>
          <BrutalCard className="flex-1 bg-[#F4F4F5] border-green-600 !shadow-[6px_6px_0px_0px_rgba(22,163,74,1)] opacity-60">
            <div className="text-green-600 font-black mb-2 uppercase text-sm">
              Respaldo 2
            </div>
            <h3 className="text-2xl font-black mb-2">GPT-4o Mini</h3>
            <p className="text-sm font-medium">
              Último recurso para garantizar la entrega ininterrumpida de
              reportes.
            </p>
          </BrutalCard>
        </div>
      </div>
    </section>

    {/* 9. FAQ ACCORDION */}
    <section
      id="faq"
      className="py-24 px-6 bg-[#F4F4F5] border-t-4 border-black"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-black uppercase text-center mb-12">
          Preguntas Frecuentes
        </h2>
        <FAQAccordion />
      </div>
    </section>

    {/* 10. CTA MASIVO FINAL */}
    <section className="bg-[#FF6B00] border-y-4 border-black py-32 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-black uppercase text-black leading-tight mb-8">
          Deja de limpiar manualmente.
          <br />
          Empieza a decidir.
        </h2>
        <BrutalButton
          onClick={() => onNavigate("dashboard")}
          variant="ghost"
          className="text-2xl px-16 py-6 border-4 mx-auto !shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105"
        >
          Probar el MVP{" "}
          <Zap className="w-8 h-8 ml-2 text-[#0033A0]" fill="currentColor" />
        </BrutalButton>
      </div>
    </section>
  </div>
);

// --- VISTAS INTERNAS (Sin modificar para mantener funcionalidad del MVP) ---

const DashboardView = ({ onNavigate }) => {
  const mockDatasets = [
    {
      id: 1,
      name: "Ventas_Q1_2026.xlsx",
      date: "12 Mar 2026",
      status: "PENDIENTE DE REVISIÓN",
      rows: "45,230",
    },
    {
      id: 2,
      name: "Nomina_Empleados.xlsx",
      date: "10 Mar 2026",
      status: "COMPLETADO",
      rows: "1,200",
    },
  ];

  return (
    <div className="flex-1 p-8 overflow-auto bg-[#F4F4F5]">
      <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
        <div>
          <h2 className="text-4xl font-black uppercase">Panel de Control</h2>
          <p className="text-lg font-medium text-gray-600 mt-1">
            Sube tus archivos Excel para análisis estructurado.
          </p>
        </div>
        <div className="bg-white border-2 border-black px-4 py-2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          Administrador
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border-4 border-dashed border-black hover:bg-orange-50 transition-colors flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px] cursor-pointer shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-[#0033A0] p-4 rounded-full border-2 border-black mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <UploadCloud className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Arrastra tu Excel aquí</h3>
            <p className="font-medium text-gray-600 mb-6">
              Máximo 50,000 registros (.xlsx)
            </p>
            <BrutalButton variant="primary" className="w-full">
              Seleccionar Archivo
            </BrutalButton>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold uppercase flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Archivos Recientes
          </h3>
          <div className="flex flex-col gap-4">
            {mockDatasets.map((dataset) => (
              <BrutalCard
                key={dataset.id}
                className="flex flex-col sm:flex-row justify-between items-center gap-4 !p-4 hover:-translate-y-1 transition-transform"
              >
                <div>
                  <h4 className="font-bold text-lg">{dataset.name}</h4>
                  <div className="flex gap-4 text-sm font-medium text-gray-600 mt-1">
                    <span>Subido: {dataset.date}</span>
                    <span>•</span>
                    <span>{dataset.rows} filas</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <span
                    className={`px-3 py-1 text-xs font-bold border-2 border-black w-full text-center ${dataset.status === "COMPLETADO" ? "bg-green-300" : "bg-yellow-300"}`}
                  >
                    {dataset.status}
                  </span>
                  {dataset.status === "PENDIENTE DE REVISIÓN" && (
                    <BrutalButton
                      variant="primary"
                      onClick={() => onNavigate("review")}
                      className="!py-2 !px-4 text-sm whitespace-nowrap"
                    >
                      Revisar Anomalías
                    </BrutalButton>
                  )}
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewView = ({ onNavigate }) => {
  const [anomalies, setAnomalies] = useState([
    {
      id: 1,
      column: "Teléfono",
      issue: "Se detectaron 45 valores nulos (celdas vacías).",
      suggestion: "Rellenar con el texto 'No Registra'.",
      status: "pending",
    },
    {
      id: 2,
      column: "Salario_Base",
      issue: "12 registros contienen texto en lugar de números.",
      suggestion: "Forzar conversión a número (Null si falla).",
      status: "pending",
    },
    {
      id: 3,
      column: "NIT_Empresa",
      issue: "Formatos inconsistentes detectados.",
      suggestion: "Estandarizar eliminando guiones y espacios.",
      status: "pending",
    },
  ]);

  const handleAction = (id, action) =>
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: action } : a)),
    );
  const pendingCount = anomalies.filter((a) => a.status === "pending").length;

  return (
    <div className="flex-1 p-8 overflow-auto bg-[#F4F4F5]">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => onNavigate("dashboard")}
          className="font-bold border-b-2 border-black hover:text-[#FF6B00] hover:border-[#FF6B00]"
        >
          &larr; Volver al Dashboard
        </button>
      </div>

      <div className="bg-[#0033A0] text-white border-2 border-black p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-[#FF6B00]" /> Revisión de IA:
            Ventas_Q1.xlsx
          </h2>
          <p className="text-lg font-medium mt-2 opacity-90">
            El Agente IA ha perfilado los datos y sugiere estas reglas de
            limpieza.
          </p>
        </div>
        <div className="bg-white text-black font-black text-2xl px-6 py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          {pendingCount} <br />{" "}
          <span className="text-sm uppercase font-bold">Pendientes</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {anomalies.map((anomaly) => (
          <BrutalCard
            key={anomaly.id}
            className={`flex flex-col transition-all ${anomaly.status !== "pending" ? "opacity-60 bg-gray-50" : ""}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-black text-white font-bold px-3 py-1 text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,107,0,1)]">
                Columna: {anomaly.column}
              </span>
              {anomaly.status === "approved" && (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              )}
              {anomaly.status === "discarded" && (
                <X className="w-8 h-8 text-red-600" />
              )}
            </div>
            <div className="flex-1 space-y-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-1">
                  Anomalía Detectada
                </p>
                <p className="font-bold text-lg">{anomaly.issue}</p>
              </div>
              <div className="bg-blue-50 p-3 border-l-4 border-[#0033A0]">
                <p className="text-xs font-bold uppercase text-[#0033A0] mb-1">
                  Sugerencia IA
                </p>
                <p className="font-medium">{anomaly.suggestion}</p>
              </div>
            </div>
            {anomaly.status === "pending" ? (
              <div className="grid grid-cols-2 gap-2 mt-auto">
                <BrutalButton
                  variant="success"
                  onClick={() => handleAction(anomaly.id, "approved")}
                  className="!p-2 text-sm col-span-2"
                >
                  <Check className="w-4 h-4" /> Aprobar Regla
                </BrutalButton>
                <BrutalButton
                  variant="danger"
                  onClick={() => handleAction(anomaly.id, "discarded")}
                  className="!p-2 text-sm"
                >
                  <X className="w-4 h-4" /> Descartar
                </BrutalButton>
                <BrutalButton variant="ghost" className="!p-2 text-sm">
                  <PenTool className="w-4 h-4" /> Editar
                </BrutalButton>
              </div>
            ) : (
              <div className="mt-auto">
                <BrutalButton
                  variant="ghost"
                  onClick={() => handleAction(anomaly.id, "pending")}
                  className="w-full !p-2 text-sm"
                >
                  Deshacer Acción
                </BrutalButton>
              </div>
            )}
          </BrutalCard>
        ))}
      </div>

      {pendingCount === 0 && (
        <div className="mt-12 flex justify-center animate-bounce">
          <BrutalButton variant="primary" className="text-xl px-12 py-6">
            Ejecutar Motor ETL <UploadCloud className="w-6 h-6 ml-2" />
          </BrutalButton>
        </div>
      )}
    </div>
  );
};

// --- CONTENEDOR PRINCIPAL ---
export default function App() {
  const [currentView, setCurrentView] = useState("landing");

  return (
    <div
      className="min-h-screen font-sans text-gray-900 flex flex-col"
      style={{ backgroundColor: COLORS.background }}
    >
      <Header onNavigate={setCurrentView} currentView={currentView} />

      <div className="flex-1 flex">
        {currentView !== "landing" && (
          <aside className="w-64 bg-white border-r-4 border-black hidden md:flex flex-col shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] z-10">
            <nav className="flex-1 p-4 space-y-2 mt-4">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`w-full flex items-center gap-3 font-bold px-4 py-3 border-2 border-black transition-all ${currentView === "dashboard" ? "bg-[#FF6B00] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1" : "bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
              <button className="w-full flex items-center gap-3 font-bold px-4 py-3 border-2 border-transparent hover:border-black transition-all">
                <Settings className="w-5 h-5" /> Configuración
              </button>
            </nav>
          </aside>
        )}

        <main className="flex-1 flex flex-col w-full overflow-x-hidden">
          {currentView === "landing" && (
            <LandingView onNavigate={setCurrentView} />
          )}
          {currentView === "dashboard" && (
            <DashboardView onNavigate={setCurrentView} />
          )}
          {currentView === "review" && (
            <ReviewView onNavigate={setCurrentView} />
          )}
        </main>
      </div>

      {currentView === "landing" && <Footer />}
    </div>
  );
}
