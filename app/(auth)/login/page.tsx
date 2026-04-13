'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginSchema } from '@/lib/schemas'
import type { LoginFormData } from '@/lib/schemas'
import { LogoMark } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
    setServerError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    const parsed = loginSchema.safeParse(formData)
    if (!parsed.success) {
      const fieldErrors: Partial<LoginFormData> = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof LoginFormData
        fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      })

      if (result?.error) {
        setServerError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setServerError('Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl p-9 shadow-[0_4px_6px_rgba(0,0,0,.07),0_10px_30px_rgba(0,0,0,.06)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <LogoMark size={32} color="#ff6600" />
        <span className="text-xl font-bold text-[#1e293b]">PYMES-AI</span>
      </div>
      <h2 className="text-[22px] font-bold text-[#1e293b] mb-6">Iniciar sesión</h2>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="mb-4 p-3 bg-[#fee2e2] rounded-lg text-[#dc2626] text-sm font-medium"
        >
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium text-sm text-[#1e293b] mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#1e293b] focus:outline-none focus:border-[#ff6600] focus:ring-[3px] focus:ring-[rgba(255,102,0,.12)] transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block font-medium text-sm text-[#1e293b] mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-[#1e293b] focus:outline-none focus:border-[#ff6600] focus:ring-[3px] focus:ring-[rgba(255,102,0,.12)] transition-all"
          />
          {errors.password && (
            <p className="mt-1 text-sm font-medium text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-[#ff6600] text-white font-semibold py-2.5 rounded-lg hover:bg-[#cc5200] hover:shadow-[0_4px_12px_rgba(255,102,0,.3)] active:scale-[0.98] transition-all duration-150 disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[#64748b]">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-semibold text-[#ff6600] hover:text-[#cc5200] transition-colors">
          Regístrate
        </Link>
      </p>
    </div>
  )
}
