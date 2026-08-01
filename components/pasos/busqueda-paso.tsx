'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PasoLayout } from '@/components/paso-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PROVEEDORES, fmt, type Proveedor } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  BadgeCheck,
  Clock3,
  FileText,
  MapPin,
  Star,
  Store,
  Users,
  Zap,
} from 'lucide-react'

const FILTROS_DISTANCIA = [
  { label: 'Hasta 500 m', valor: 500 },
  { label: 'Hasta 1 km', valor: 1000 },
  { label: 'Hasta 3 km', valor: 3000 },
]

type Props = {
  onElegir: (p: Proveedor) => void
}

export function BusquedaPaso({ onElegir }: Props) {
  const [distancia, setDistancia] = useState(3000)
  const [tipo, setTipo] = useState<'todos' | 'P2P' | 'B2P'>('todos')
  const [hover, setHover] = useState<string | null>(null)

  const resultados = PROVEEDORES.filter(
    (p) => p.distanciaM <= distancia && (tipo === 'todos' || p.tipo === tipo),
  )

  return (
    <PasoLayout
      etiqueta="Paso 3 · Catálogo y matching"
      titulo="Taladro percutor disponible en tu zona"
      descripcion="La ubicación se muestra aproximada hasta que la reserva se confirma. Los resultados combinan oferta entre vecinos y ferreterías, que son las que garantizan stock desde el día uno."
      ancho="ancho"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Distancia</span>
        {FILTROS_DISTANCIA.map((f) => (
          <Button
            key={f.valor}
            size="sm"
            variant={distancia === f.valor ? 'default' : 'outline'}
            onClick={() => setDistancia(f.valor)}
          >
            {f.label}
          </Button>
        ))}
        <span className="ml-2 text-xs font-medium text-muted-foreground">Proveedor</span>
        {(
          [
            ['todos', 'Todos'],
            ['P2P', 'Vecinos'],
            ['B2P', 'Ferreterías'],
          ] as const
        ).map(([v, l]) => (
          <Button
            key={v}
            size="sm"
            variant={tipo === v ? 'default' : 'outline'}
            onClick={() => setTipo(v)}
          >
            {l}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <Card className="relative h-72 overflow-hidden bg-muted/50 p-0 lg:sticky lg:top-36 lg:h-[30rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:36px_36px]"
          />
          {[0.35, 0.62, 0.9].map((r, i) => (
            <span
              key={r}
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border"
              style={{ width: `${r * 100}%`, aspectRatio: '1' }}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2 rounded-full bg-background px-1.5 text-[10px] text-muted-foreground">
                {[500, 1000, 3000][i] >= 1000
                  ? `${[500, 1000, 3000][i] / 1000} km`
                  : `${[500, 1000, 3000][i]} m`}
              </span>
            </span>
          ))}

          <span className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
            <span className="flex size-3 items-center justify-center rounded-full bg-primary ring-4 ring-primary/25" />
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium">
              Vos
            </span>
          </span>

          {resultados.map((p) => (
            <button
              key={p.id}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onElegir(p)}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  'flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 text-xs font-medium shadow-sm transition-transform',
                  hover === p.id && 'scale-110 border-primary',
                )}
              >
                {p.tipo === 'B2P' ? (
                  <Store className="size-3" aria-hidden="true" />
                ) : (
                  <Users className="size-3" aria-hidden="true" />
                )}
                {fmt(p.precioDia)}
              </span>
            </button>
          ))}

          <p className="absolute bottom-3 left-3 max-w-[15rem] rounded-lg bg-background/90 px-2.5 py-1.5 text-[11px] leading-relaxed text-muted-foreground backdrop-blur">
            Mapa esquemático de zona con radios de distancia. La posición exacta se revela recién
            al confirmar la reserva.
          </p>
        </Card>

        <div className="flex flex-col gap-3">
          {resultados.length === 0 && (
            <Card className="gap-2 p-5">
              <h2 className="font-display text-base font-semibold">Sin resultados en el radio</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Acá el sistema ofrece activar una alerta de disponibilidad y muestra la opción de
                ferretería más cercana aunque quede fuera del filtro.
              </p>
              <Button variant="outline" size="sm" className="self-start" onClick={() => setDistancia(3000)}>
                Ampliar el radio de búsqueda
              </Button>
            </Card>
          )}

          {resultados.map((p) => (
            <Card
              key={p.id}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              className={cn(
                'flex-row gap-4 overflow-hidden p-4 transition-colors',
                hover === p.id && 'border-primary',
              )}
            >
              <Image
                src={p.imagen || '/placeholder.svg'}
                alt={`${p.herramienta} publicado por ${p.nombre}`}
                width={200}
                height={200}
                className="size-24 shrink-0 rounded-lg object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base font-semibold">{p.herramienta}</h2>
                  <Badge variant={p.tipo === 'B2P' ? 'default' : 'secondary'} className="gap-1">
                    {p.tipo === 'B2P' ? (
                      <Store className="size-3" aria-hidden="true" />
                    ) : (
                      <Users className="size-3" aria-hidden="true" />
                    )}
                    {p.tipo === 'B2P' ? 'Ferretería' : 'Vecino'}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-current text-chart-3" aria-hidden="true" />
                    <span className="font-medium text-foreground">{p.rating}</span>(
                    {p.operaciones})
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden="true" />
                    {p.distanciaM >= 1000 ? `${p.distanciaM / 1000} km` : `${p.distanciaM} m`}
                  </span>
                  <span className="flex items-center gap-1">
                    <BadgeCheck className="size-3 text-accent-foreground" aria-hidden="true" />
                    {p.nivel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 className="size-3" aria-hidden="true" />
                    {p.respuesta}
                  </span>
                  {p.factura && (
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" aria-hidden="true" />
                      Factura
                    </span>
                  )}
                  {p.entregaInmediata && (
                    <span className="flex items-center gap-1">
                      <Zap className="size-3" aria-hidden="true" />
                      Retiro hoy
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground">
                  Estado {p.estado.toLowerCase()} · Incluye {p.incluye.join(', ').toLowerCase()}
                </p>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-display text-lg leading-none font-bold">
                      {fmt(p.precioDia)}
                      <span className="text-xs font-normal text-muted-foreground"> / día</span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Garantía retenida {fmt(p.garantia)}
                    </span>
                  </div>
                  <Button size="sm" onClick={() => onElegir(p)}>
                    Reservar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PasoLayout>
  )
}
