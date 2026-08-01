'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  HERRAMIENTAS_SEED,
  SOLICITUDES_SEED,
  USUARIOS,
  YO,
  type Acta,
  type Herramienta,
  type Solicitud,
  type Usuario,
} from '@/lib/tipos'

type NuevaHerramienta = Omit<
  Herramienta,
  'id' | 'duenoId' | 'distanciaM' | 'x' | 'y'
>

type NuevaSolicitud = {
  herramientaId: string
  desde: string
  hasta: string
  dias: number
  mensaje: string
  entrega: Solicitud['entrega']
}

type Store = {
  yo: Usuario
  usuarios: Usuario[]
  herramientas: Herramienta[]
  solicitudes: Solicitud[]
  usuario: (id: string) => Usuario
  herramienta: (id: string) => Herramienta | undefined
  publicar: (h: NuevaHerramienta) => string
  editarHerramienta: (id: string, cambios: Partial<Herramienta>) => void
  eliminarHerramienta: (id: string) => void
  solicitar: (s: NuevaSolicitud) => string
  responder: (id: string, acepta: boolean, motivo?: string) => void
  cancelar: (id: string) => void
  registrarEntrega: (id: string, acta: Acta) => void
  registrarDevolucion: (id: string, acta: Acta, dano?: string) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [herramientas, setHerramientas] = useState<Herramienta[]>(HERRAMIENTAS_SEED)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(SOLICITUDES_SEED)

  const usuario = useCallback(
    (id: string) => USUARIOS.find((u) => u.id === id) ?? USUARIOS[0],
    [],
  )

  const herramienta = useCallback(
    (id: string) => herramientas.find((h) => h.id === id),
    [herramientas],
  )

  const publicar = useCallback((h: NuevaHerramienta) => {
    const id = `h-${Date.now()}`
    setHerramientas((prev) => [
      { ...h, id, duenoId: YO, distanciaM: 0, x: 50, y: 50 },
      ...prev,
    ])
    return id
  }, [])

  const editarHerramienta = useCallback((id: string, cambios: Partial<Herramienta>) => {
    setHerramientas((prev) => prev.map((h) => (h.id === id ? { ...h, ...cambios } : h)))
  }, [])

  const eliminarHerramienta = useCallback((id: string) => {
    setHerramientas((prev) => prev.filter((h) => h.id !== id))
    setSolicitudes((prev) => prev.filter((s) => s.herramientaId !== id))
  }, [])

  const solicitar = useCallback(
    (s: NuevaSolicitud) => {
      const h = herramientas.find((x) => x.id === s.herramientaId)
      const id = `s-${Date.now()}`
      setSolicitudes((prev) => [
        {
          ...s,
          id,
          solicitanteId: YO,
          duenoId: h?.duenoId ?? '',
          estado: 'pendiente',
          creada: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
      return id
    },
    [herramientas],
  )

  const responder = useCallback((id: string, acepta: boolean, motivo?: string) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: acepta ? 'aceptada' : 'rechazada',
              motivoRechazo: acepta ? undefined : motivo,
            }
          : s,
      ),
    )
  }, [])

  const cancelar = useCallback((id: string) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: 'rechazada', motivoRechazo: 'Cancelada por el solicitante' } : s,
      ),
    )
  }, [])

  const registrarEntrega = useCallback((id: string, acta: Acta) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: 'en-curso', actaEntrega: acta } : s)),
    )
  }, [])

  const registrarDevolucion = useCallback((id: string, acta: Acta, dano?: string) => {
    setSolicitudes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: dano ? 'en-disputa' : 'finalizada',
              actaDevolucion: acta,
              danoDeclarado: dano,
            }
          : s,
      ),
    )
  }, [])

  const value = useMemo<Store>(
    () => ({
      yo: USUARIOS.find((u) => u.id === YO)!,
      usuarios: USUARIOS,
      herramientas,
      solicitudes,
      usuario,
      herramienta,
      publicar,
      editarHerramienta,
      eliminarHerramienta,
      solicitar,
      responder,
      cancelar,
      registrarEntrega,
      registrarDevolucion,
    }),
    [
      herramientas,
      solicitudes,
      usuario,
      herramienta,
      publicar,
      editarHerramienta,
      eliminarHerramienta,
      solicitar,
      responder,
      cancelar,
      registrarEntrega,
      registrarDevolucion,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
