import type { ReactNode } from 'react'
import { LogoMark } from '@/components/ui'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo — branding (oculto en mobile) */}
      <div
        className="hidden md:flex flex-1 items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #3d1a00 40%, #ff6600 100%)' }}
      >
        <div className="max-w-sm text-white">
          <LogoMark size={52} color="#fff" />
          <h1 className="text-4xl font-extrabold mt-5 mb-4">PYMES-AI</h1>
          <p className="text-base leading-7 text-white/80 mb-8">
            Analiza tus datos empresariales con inteligencia artificial.
          </p>
          <ul className="space-y-3 text-[15px] text-white/85">
            <li>✦ Detección automática de anomalías</li>
            <li>✦ Correcciones asistidas por IA</li>
            <li>✦ Datasets listos para análisis</li>
          </ul>
        </div>
      </div>
      {/* Lado derecho — formulario */}
      <div className="w-full md:w-[480px] flex items-center justify-center p-8 bg-[#f1f5f9]">
        {children}
      </div>
    </div>
  )
}
