'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginSchema } from '@/lib/schemas'
import type { LoginFormData } from '@/lib/schemas'

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
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        {/* Header */}
        <div className="mb-8 border-b-4 border-black pb-6">
          <h1 className="text-3xl font-black uppercase leading-tight">
            Data<span className="text-[#FF6B00]">Strategy</span>
          </h1>
          <p className="text-lg font-bold uppercase mt-2">Iniciar Sesión</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-700 font-bold text-sm"
          >
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-bold text-sm uppercase mb-1">
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
              className="w-full border-2 border-black px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            />
            {errors.email && (
              <p className="mt-1 text-sm font-medium text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-bold text-sm uppercase mb-1">
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
              className="w-full border-2 border-black px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
            />
            {errors.password && (
              <p className="mt-1 text-sm font-medium text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#FF6B00] text-white font-black uppercase py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center font-medium text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-bold text-[#0033A0] underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
