'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  HERRAMIENTAS,
  OPERACIONES_INICIALES,
  USUARIOS,
  YO,
  calcularCostos,
  diasEntre,
  type Acta,
  type Herramienta,
  type Operacion,
  type Usuario,
} from './data'

type NuevaHerramienta = Omit<
  Herramienta,
  'id' | 'duenoId' | 'distanciaM' | 'x' | 'y' | 'publicada'
>

type Store = {
  yo: Usuario
  herramientas: Herramienta[]
  operaciones: Operacion[]
  usuario: (id: string) => Usuario
  herramienta: (id: string) => Herramienta | undefined
  misPublicaciones: Herramienta[]
  comoLocatario: Operacion[]
  comoPrestamista: Operacion[]
  pendientesDeRespuesta: number
  publicar: (h: NuevaHerramienta) => string
  despublicar: (id: string) => void
  solicitar: (input: {
    herramientaId: string
    desde: string
    hasta: string
    mensaje: string
  }) => string
  responder: (opId: string, acepta: boolean) => void
  cancelar: (opId: string) => void
  registrarActa: (
    opId: string,
    tipo: 'entrega' | 'devolucion',
    acta: Acta,
  ) => void
  calificar: (opId: string, estrellas: number) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [herramientas, setHerramientas] = useState<Herramienta[]>(HERRAMIENTAS)
  const [operaciones, setOperaciones] =
    useState<Operacion[]>(OPERACIONES_INICIALES)

  const usuario = useCallback((id: string) => USUARIOS[id] ?? USUARIOS[YO], [])

  const herramienta = useCallback(
    (id: string) => herramientas.find((h) => h.id === id),
    [herramientas],
  )

  const publicar = useCallback((h: NuevaHerramienta) => {
    const id = `h-${Date.now()}`
    setHerramientas((prev) => [
      {
        ...h,
        id,
        duenoId: YO,
        distanciaM: 0,
        publicada: true,
        x: 44 + Math.round(Math.random() * 14),
        y: 40 + Math.round(Math.random() * 14),
      },
      ...prev,
    ])
    return id
  }, [])

  const despublicar = useCallback((id: string) => {
    setHerramientas((prev) =>
      prev.map((h) => (h.id === id ? { ...h, publicada: !h.publicada } : h)),
    )
  }, [])

  const solicitar = useCallback<Store['solicitar']>(
    ({ herramientaId, desde, hasta, mensaje }) => {
      const h = herramientas.find((x) => x.id === herramientaId)
      if (!h) return ''
      const dias = diasEntre(desde, hasta)
      const { fee, total } = calcularCostos(h.precioDia, dias)
      const id = `op-${Date.now()}`
      setOperaciones((prev) => [
        {
          id,
          herramientaId,
          duenoId: h.duenoId,
          locatarioId: YO,
          desde,
          hasta,
          dias,
          precioDia: h.precioDia,
          garantia: h.garantia,
          fee,
          total,
          // los comercios con reserva instantánea aceptan al toque
          estado: h.entregaInmediata && USUARIOS[h.duenoId]?.tipo === 'Comercio'
            ? 'aceptada'
            : 'solicitada',
          mensaje,
          creada: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
      return id
    },
    [herramientas],
  )

  const responder = useCallback((opId: string, acepta: boolean) => {
    setOperaciones((prev) =>
      prev.map((o) =>
        o.id === opId ? { ...o, estado: acepta ? 'aceptada' : 'rechazada' } : o,
      ),
    )
  }, [])

  const cancelar = useCallback((opId: string) => {
    setOperaciones((prev) =>
      prev.map((o) => (o.id === opId ? { ...o, estado: 'cancelada' } : o)),
    )
  }, [])

  const registrarActa = useCallback<Store['registrarActa']>(
    (opId, tipo, acta) => {
      setOperaciones((prev) =>
        prev.map((o) =>
          o.id === opId
            ? {
                ...o,
                [tipo]: acta,
                estado: tipo === 'entrega' ? 'en_curso' : 'finalizada',
              }
            : o,
        ),
      )
    },
    [],
  )

  const calificar = useCallback((opId: string, estrellas: number) => {
    setOperaciones((prev) =>
      prev.map((o) => (o.id === opId ? { ...o, calificacion: estrellas } : o)),
    )
  }, [])

  const value = useMemo<Store>(() => {
    const comoLocatario = operaciones.filter((o) => o.locatarioId === YO)
    const comoPrestamista = operaciones.filter((o) => o.duenoId === YO)
    return {
      yo: USUARIOS[YO],
      herramientas,
      operaciones,
      usuario,
      herramienta,
      misPublicaciones: herramientas.filter((h) => h.duenoId === YO),
      comoLocatario,
      comoPrestamista,
      pendientesDeRespuesta: comoPrestamista.filter(
        (o) => o.estado === 'solicitada',
      ).length,
      publicar,
      despublicar,
      solicitar,
      responder,
      cancelar,
      registrarActa,
      calificar,
    }
  }, [
    herramientas,
    operaciones,
    usuario,
    herramienta,
    publicar,
    despublicar,
    solicitar,
    responder,
    cancelar,
    registrarActa,
    calificar,
  ])

  return <StoreContext value={value}>{children}</StoreContext>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore debe usarse dentro de StoreProvider')
  return ctx
}
