'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, MapPin, Star, Zap } from 'lucide-react'
import { distancia, fmt, type Herramienta } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'

export function HerramientaCard({ h }: { h: Herramienta }) {
  const { usuario } = useStore()
  const dueno = usuario(h.duenoId)
  const esMia = h.duenoId === 'yo'

  return (
    <Link
      href={`/herramienta/${h.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-secondary">
        <Image
          src={h.imagen || '/placeholder.svg'}
          alt={h.nombre}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          <Badge variant="secondary" className="bg-background/90 text-xs">
            {h.categoria}
          </Badge>
          {esMia && (
            <Badge className="bg-primary text-xs text-primary-foreground">
              Tuya
            </Badge>
          )}
        </div>
        {h.entregaInmediata && !esMia && (
          <Badge className="absolute right-2 top-2 gap-1 bg-accent text-xs text-accent-foreground">
            <Zap className="size-3" aria-hidden="true" />
            Inmediata
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-pretty text-sm font-semibold leading-snug">
            {h.nombre}
          </h3>
          {dueno.rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              <Star
                className="size-3 fill-current text-chart-3"
                aria-hidden="true"
              />
              {dueno.rating}
            </span>
          )}
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{dueno.nombre}</span>
          {dueno.verificado && (
            <BadgeCheck
              className="size-3.5 shrink-0 text-chart-2"
              aria-hidden="true"
            />
          )}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden="true" />
            {esMia ? 'En tu domicilio' : distancia(h.distanciaM)}
          </span>
          <span className="text-sm font-bold">
            {fmt(h.precioDia)}
            <span className="text-xs font-normal text-muted-foreground">
              {' '}
              /día
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
