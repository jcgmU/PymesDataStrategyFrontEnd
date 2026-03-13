# PymesDataStrategyFrontEnd

> **Proyecto de Grado GIIS SW-005 — Fundación Universitaria Compensar**
> Plataforma ETL con IA y Human-in-the-Loop para PYMES en Bogotá, Colombia.

![Estado](https://img.shields.io/badge/Fase%201-MVP%20COMPLETADO-brightgreen)
![Tests](https://img.shields.io/badge/tests-82%20pasando-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-blue)

---

## 📋 Descripción

**PymesDataStrategyFrontEnd** es la interfaz web de la plataforma **PymesDataStrategy**, un sistema ETL (Extract, Transform, Load) potenciado con Inteligencia Artificial y un proceso de validación **Human-in-the-Loop (HITL)** diseñado específicamente para pequeñas y medianas empresas (PYMES) de Bogotá.

La plataforma permite a las PYMES cargar, transformar y analizar sus datos empresariales de forma guiada, con sugerencias de IA que un analista humano revisa y aprueba antes de aplicar, garantizando calidad y trazabilidad en cada transformación.

### 🔗 Repositorios

| Repositorio | Enlace |
|---|---|
| **Frontend** (este repo) | https://github.com/jcgmU/PymesDataStrategyFrontEnd.git |
| **Backend** | https://github.com/jcgmU/PymesDataStrategyBackEnd.git |

---

## 🏗️ Arquitectura de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │               app/layout.tsx                    │    │
│  │         (Root Layout + Providers)               │    │
│  └──────────────────────┬──────────────────────────┘    │
│                         │                               │
│          ┌──────────────┴──────────────┐                │
│          ▼                             ▼                │
│  ┌───────────────┐           ┌─────────────────────┐    │
│  │  app/page.tsx │           │ app/dashboard/      │    │
│  │  Landing Page │           │ layout.tsx (Sidebar)│    │
│  │  12 secciones │           └──────────┬──────────┘    │
│  └───────┬───────┘                      │               │
│          │                    ┌─────────┼──────────┐    │
│          │                    ▼         ▼          ▼    │
│  ┌───────▼──────────┐  ┌──────────┐ ┌──────────┐ ┌───┐ │
│  │ components/      │  │dashboard/│ │datasets/ │ │re-│ │
│  │ features/landing │  │ page.tsx │ │ page.tsx │ │vi-│ │
│  │  (12 componentes)│  └──────────┘ │ upload/  │ │ew/│ │
│  └──────────────────┘               │ page.tsx │ │[id│ │
│                                     └──────────┘ └───┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Estado Global                      │    │
│  │   Zustand v5 (stores/)  +  React Query v5       │    │
│  │              (services/)                        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 15.1.6 | Framework React con App Router |
| **React** | 19 | UI Library |
| **TypeScript** | Estricto | Tipado estático |
| **Tailwind CSS** | v4 | Estilos CSS-first (sin `tailwind.config.ts`) |
| **Zustand** | v5 | Estado global |
| **React Query** | v5 | Data fetching y caché del servidor |
| **lucide-react** | Latest | Sistema de iconos |
| **Vitest** | Latest | Unit testing |
| **Playwright** | Latest | E2E testing |
| **pnpm** | — | Gestor de paquetes |

---

## 🎨 Sistema de Diseño Neo-Brutalism

La interfaz implementa un sistema de diseño **Neo-Brutalismo** con identidad visual de la Fundación Universitaria Compensar.

### Paleta de Colores

| Token | Valor HEX | Uso |
|---|---|---|
| `primary` | `#FF6B00` | Naranja — acciones principales, CTA |
| `secondary` | `#0033A0` | Azul institucional Compensar |
| `background` | `#F4F4F5` | Fondo general de la aplicación |
| `text` | `#18181B` | Texto principal |

### Componentes Primitivos

- **`BrutalButton`** — Botón con borde negro sólido, sombra offset de `4px` y efecto de presión al hacer clic.
- **`BrutalCard`** — Tarjeta con borde negro sólido y sombra offset de `6px`.

Los estilos base están definidos en `app/globals.css` usando las variables CSS nativas de Tailwind v4.

---

## 📁 Estructura del Proyecto

```
frontend/
├── app/
│   ├── page.tsx                      # Landing page (12 componentes)
│   ├── layout.tsx                    # Root layout (suppressHydrationWarning)
│   ├── globals.css                   # Design system Tailwind v4
│   ├── providers.tsx                 # React Query + Zustand providers
│   └── dashboard/
│       ├── layout.tsx                # Dashboard con Sidebar
│       ├── page.tsx                  # Home dashboard
│       ├── datasets/
│       │   ├── page.tsx              # Lista de datasets
│       │   └── upload/page.tsx       # Subir dataset
│       └── review/
│           └── [id]/page.tsx         # Revisión Human-in-the-Loop
├── components/
│   ├── features/
│   │   └── landing/                  # 12 componentes de la landing
│   │       ├── LandingHeader.tsx
│   │       ├── HeroSection.tsx
│   │       ├── MetricsBand.tsx
│   │       ├── ProblemSolution.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── HITLSection.tsx
│   │       ├── UseCases.tsx
│   │       ├── SecurityBadge.tsx
│   │       ├── AIStack.tsx
│   │       ├── FAQAccordion.tsx
│   │       ├── FinalCTA.tsx
│   │       └── LandingFooter.tsx
│   └── ui/                           # Componentes reutilizables (BrutalButton, BrutalCard…)
├── stores/                           # Zustand stores
├── services/                         # API services (React Query hooks)
├── types/                            # TypeScript types compartidos
├── __tests__/                        # Unit tests (Vitest)
├── e2e/                              # E2E tests (Playwright)
└── public/
    └── compensar-logo.png            # Logo institucional
```

---

## ✅ Funcionalidades Implementadas

### Landing Page
Landing pública con 12 secciones que comunican la propuesta de valor de la plataforma:

| # | Componente | Descripción |
|---|---|---|
| 1 | `LandingHeader` | Navegación fija con logo y CTA |
| 2 | `HeroSection` | Hero principal con headline y call-to-action |
| 3 | `MetricsBand` | Banda de métricas clave de impacto |
| 4 | `ProblemSolution` | Problema del mercado vs. solución propuesta |
| 5 | `HowItWorks` | Flujo de trabajo en 3 pasos (ETL + IA) |
| 6 | `HITLSection` | Explicación del proceso Human-in-the-Loop |
| 7 | `UseCases` | Casos de uso para PYMES (retail, logística, etc.) |
| 8 | `SecurityBadge` | Seguridad y cumplimiento *(próximamente)* |
| 9 | `AIStack` | Stack de IA utilizado *(próximamente)* |
| 10 | `FAQAccordion` | Preguntas frecuentes con acordeón |
| 11 | `FinalCTA` | Llamada a la acción final |
| 12 | `LandingFooter` | Footer con links e información institucional |

### Dashboard
- **Layout con Sidebar** — Navegación lateral persistente entre secciones.
- **Home Dashboard** — Vista general con métricas del sistema.
- **Gestión de Datasets** — Lista de datasets cargados y subida de nuevos archivos.
- **Revisión Human-in-the-Loop** — Pantalla de revisión de transformaciones sugeridas por la IA, con flujo de aprobación o rechazo por parte del analista humano.

---

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** >= 18
- **pnpm** >= 8
- Backend corriendo en `http://localhost:3000` (ver [repositorio backend](https://github.com/jcgmU/PymesDataStrategyBackEnd.git))

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/jcgmU/PymesDataStrategyFrontEnd.git
cd PymesDataStrategyFrontEnd

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con los valores correspondientes

# 4. Iniciar en modo desarrollo
pnpm dev
```

La aplicación estará disponible en **http://localhost:3001**.

### Comandos Disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo en el puerto 3001 |
| `pnpm build` | Genera el build de producción |
| `pnpm start` | Inicia el servidor en modo producción |
| `pnpm test` | Ejecuta los 82 unit tests con Vitest |
| `pnpm lint` | Verifica el código con ESLint |
| `pnpm typecheck` | Verifica los tipos TypeScript |

---

## 🔧 Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# URL base del backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | URL base del backend REST API |

---

## 🧪 Tests

El proyecto cuenta con **82 unit tests** que cubren los componentes principales de la interfaz.

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar en modo watch
pnpm test --watch

# Ver cobertura
pnpm test --coverage
```

Los tests están ubicados en el directorio `__tests__/` y utilizan **Vitest** con **React Testing Library**.

---

## 🔌 Conexión con el Backend

El frontend consume la API REST del backend mediante **React Query v5**.

| Detalle | Valor |
|---|---|
| **Backend URL** | `http://localhost:3000` |
| **Frontend URL** | `http://localhost:3001` |
| **Protocolo** | REST / JSON |
| **Auth** | *(Fase 2 — JWT)* |

Los servicios de API están organizados en `services/` como custom hooks de React Query, manteniendo la lógica de fetching separada de los componentes.

**Repositorio del backend:** https://github.com/jcgmU/PymesDataStrategyBackEnd.git

---

## 🗺️ Próximos Pasos — Fase 2

- [ ] **Autenticación JWT** — Login, registro y manejo de sesiones con tokens.
- [ ] **Integración IA** — Visualización de sugerencias de transformación generadas por los modelos de IA del backend.
- [ ] **Dashboard ampliado** — Más pantallas: historial de transformaciones, reportes, exportación de datos.
- [ ] **Roles y permisos** — Diferenciación entre administrador, analista y visualizador.
- [ ] **Notificaciones en tiempo real** — WebSockets para alertas del proceso ETL.
- [ ] **Modo oscuro** — Soporte para tema claro/oscuro en el sistema de diseño.
- [ ] **Internacionalización (i18n)** — Soporte inicial en español; extensible a inglés.

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2025 GIIS SW-005 — Fundación Universitaria Compensar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**Proyecto de Grado GIIS SW-005**
Fundación Universitaria Compensar — Bogotá, Colombia

</div>
