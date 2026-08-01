'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { CATEGORIAS, distancia, fmt } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// Rosario center
const ROSARIO_CENTER: [number, number] = [-32.9468, -60.6393]

// Distribute tools around Rosario with realistic coordinates
const OFFSETS: Record<string, [number, number]> = {
  'h-taladro-marcos':   [-32.9390, -60.6510],
  'h-taladro-donluis':  [-32.9510, -60.6290],
  'h-amoladora-sofia':  [-32.9620, -60.6480],
  'h-lijadora-yo':      [-32.9468, -60.6393],
  'h-escalera-yo':      [-32.9460, -60.6380],
  'h-sierra-marcos':    [-32.9370, -60.6540],
  'h-hidro-donluis':    [-32.9530, -60.6250],
  'h-soldadora-obrasur':[-32.9310, -60.6450],
  'h-ceramica-paula':   [-32.9550, -60.6420],
  'h-demoledor-obrasur':[-32.9295, -60.6390],
}

// Dynamically import Leaflet components (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false },
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false },
)
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false },
)
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false },
)
const CircleMarker = dynamic(
  () => import('react-leaflet').then((m) => m.CircleMarker),
  { ssr: false },
)

export function MapaRosario() {
  const { herramientas, usuario } = useStore()
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState<string>('todas')
  const [seleccionada, setSeleccionada] = useState<string | null>(null)

  const resultados = useMemo(() => {
    const texto = q.trim().toLowerCase()
    return herramientas.filter((h) => {
      if (!h.publicada) return false
      if (categoria !== 'todas' && h.categoria !== categoria) return false
      if (!texto) return true
      return (
        h.nombre.toLowerCase().includes(texto) ||
        h.categoria.toLowerCase().includes(texto)
      )
    })
  }, [herramientas, q, categoria])

  const herramientaSeleccionada = resultados.find(
    (h) => h.id === seleccionada,
  )

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold leading-tight">
          Herramientas en Rosario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <MapPin className="mr-1 inline size-3.5" aria-hidden="true" />
          Zona centro y barrios. Tu ubicación aparece en azul.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscá taladro, escalera, hidrolavadora…"
            aria-label="Buscar herramientas en el mapa"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoria('todas')}
            aria-pressed={categoria === 'todas'}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              categoria === 'todas'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              aria-pressed={categoria === c}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                categoria === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Mapa Leaflet */}
      <div className="overflow-hidden rounded-xl border border-border" style={{ height: 420 }}>
        <MapContainer
          center={ROSARIO_CENTER}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Tu ubicación */}
          <CircleMarker
            center={ROSARIO_CENTER}
            radius={8}
            pathOptions={{
              color: 'oklch(0.52 0.09 195)',
              fillColor: 'oklch(0.52 0.09 195)',
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>
              <span className="text-xs font-medium">Tu ubicación — Rosario</span>
            </Popup>
          </CircleMarker>

          {/* Pins de herramientas */}
          {resultados.map((h) => {
            const coords = OFFSETS[h.id] ?? [
              ROSARIO_CENTER[0] + (Math.sin(h.id.length * 13) * 0.02),
              ROSARIO_CENTER[1] + (Math.cos(h.id.length * 7) * 0.025),
            ]
            const dueno = usuario(h.duenoId)
            const activa = h.id === seleccionada
            return (
              <CircleMarker
                key={h.id}
                center={coords}
                radius={activa ? 14 : 10}
                pathOptions={{
                  color: activa
                    ? 'oklch(0.62 0.185 28)'
                    : 'oklch(0.62 0.185 28)',
                  fillColor: activa
                    ? 'oklch(0.62 0.185 28)'
                    : 'oklch(0.99 0.004 85)',
                  fillOpacity: activa ? 0.95 : 0.9,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSeleccionada(h.id),
                }}
              >
                <Popup>
                  <div className="flex flex-col gap-1 py-0.5" style={{ minWidth: 180 }}>
                    <p className="font-semibold text-sm leading-tight">{h.nombre}</p>
                    <p className="text-xs text-gray-500">{dueno.nombre} · {distancia(h.distanciaM)}</p>
                    <p className="text-xs font-bold" style={{ color: 'oklch(0.62 0.185 28)' }}>
                      {fmt(h.precioDia)}/día
                    </p>
                    <a
                      href={`/herramienta/${h.id}`}
                      className="mt-1 text-xs font-medium underline"
                      style={{ color: 'oklch(0.62 0.185 28)' }}
                    >
                      Ver ficha
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>

      {/* Resultado seleccionado o lista */}
      {herramientaSeleccionada ? (
        <div className="flex items-start justify-between gap-4 rounded-xl border border-primary/30 bg-card p-4">
          <div className="min-w-0">
            <p className="font-semibold">{herramientaSeleccionada.nombre}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {usuario(herramientaSeleccionada.duenoId).nombre} ·{' '}
              {herramientaSeleccionada.duenoId === 'yo'
                ? 'tu domicilio'
                : distancia(herramientaSeleccionada.distanciaM)}
            </p>
            <p className="mt-1 text-sm">
              <span className="font-bold text-primary">
                {fmt(herramientaSeleccionada.precioDia)}
              </span>
              <span className="text-muted-foreground">/día</span>
            </p>
          </div>
          <Link
            href={`/herramienta/${herramientaSeleccionada.id}`}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            Ver ficha
          </Link>
        </div>
      ) : (
        <div>
          <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            {resultados.length} herramientas disponibles — tocá un punto para
            ver el detalle
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {resultados.slice(0, 4).map((h) => {
              const dueno = usuario(h.duenoId)
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSeleccionada(h.id)}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <MapPin className="size-4 text-primary" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {h.nombre}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {dueno.nombre} · {distancia(h.distanciaM)}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-primary">
                    {fmt(h.precioDia)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
