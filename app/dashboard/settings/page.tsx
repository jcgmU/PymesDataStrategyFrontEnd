"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

const profileSchema = z.object({
  name: z.string().min(2, { error: "El nombre debe tener al menos 2 caracteres" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { user, accessToken } = useAuth();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Rellenar el formulario con los datos actuales del usuario
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse({ name });

    if (!result.success) {
      const fieldErrors: Partial<ProfileFormData> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProfileFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSaving(true);
    try {
      await apiClient.patch(
        API_ENDPOINTS.auth.updateMe(),
        { name: result.data.name },
        accessToken
      );
      toast.success("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      toast.error("Error al guardar los cambios. Intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
        <div>
          <h2 className="text-4xl font-black uppercase">Configuración</h2>
          <p className="text-lg font-medium text-gray-600 mt-1">
            Gestiona tu perfil y preferencias de cuenta.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="max-w-lg">
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="text-xl font-bold uppercase mb-6 border-b-2 border-black pb-3">
            Perfil de Usuario
          </h3>

          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="mb-5">
              <label
                htmlFor="settings-name"
                className="block text-sm font-bold uppercase mb-1"
              >
                Nombre
              </label>
              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 border-2 border-black bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-1 transition-shadow duration-150"
                disabled={isSaving}
              />
              {errors.name && (
                <p className="mt-1 text-sm font-medium text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="mb-6">
              <label
                htmlFor="settings-email"
                className="block text-sm font-bold uppercase mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="settings-email"
                type="email"
                value={user?.email ?? ""}
                readOnly
                disabled
                className="w-full px-4 py-2 border-2 border-black bg-gray-100 text-gray-500 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
              <p className="mt-1 text-xs font-medium text-gray-500">
                El correo electrónico no se puede modificar.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full font-bold py-3 px-6 border-2 border-black bg-[#FF6B00] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            >
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
