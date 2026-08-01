'use client'

import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { distancia, fmt, type Herramienta } from '@/lib/data'
import { useStore } from '@/lib/store'

export function MapaZona({
  herramientas,
  seleccionada,
  onSeleccionar,
}: {
  herramientas: Herramienta[]
  seleccionada?: string
  onSeleccionar?: (id: string) => void
}) {
  const { usuario } = useStore()
  const activa = herramientas.find((h) => h.id === seleccionada)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-16/10 w-full bg-secondary">
        {/* grilla de calles */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
            backgroundSize: '11% 14%',
          }}
        />
        {/* avenida */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 bg-border/70"
        />

        {/* tu ubicación */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%', top: '50%' }}
        >
          <span className="relative flex size-3.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-2 opacity-60" />
            <span className="relative inline-flex size-3.5 rounded-full border-2 border-background bg-chart-2" />
          </span>
          <span className="sr-only">Tu ubicación</span>
        </div>

        {herramientas.map((h) => {
          const activo = h.id === seleccionada
          return (
            <button
              key={h.id}
              type="button"
              onClick={() => onSeleccionar?.(h.id)}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className={cn(
                'absolute flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold shadow-sm transition-transform',
                activo
                  ? 'z-10 scale-110 border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:scale-105',
              )}
            >
              <MapPin className="size-3" aria-hidden="true" />
              {fmt(h.precioDia)}
              <span className="sr-only">{h.nombre}</span>
            </button>
          )
        })}
      </div>

      <div className="border-t border-border p-3">
        {activa ? (
          <Link
            href={`/herramienta/${activa.id}`}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="min-w-0">
              <span className="block truncate font-semibold">
                {activa.nombre}
              </span>
              <span className="block text-xs text-muted-foreground">
                {usuario(activa.duenoId).nombre} ·{' '}
                {activa.duenoId === 'yo'
                  ? 'tu domicilio'
                  : distancia(activa.distanciaM)}
              </span>
            </span>
            <span className="shrink-0 text-sm font-bold text-primary">
              Ver ficha
            </span>
          </Link>
        ) : (
          <p className="text-xs text-muted-foreground">
            Tocá un precio en el mapa para ver la herramienta. La ubicación
            exacta se revela recién cuando la reserva queda confirmada.
          </p>
        )}
      </div>
    </div>
  )
}
