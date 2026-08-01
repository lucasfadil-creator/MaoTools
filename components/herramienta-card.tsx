'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useStore } from '@/components/store'
import { distancia, fmt, type Herramienta } from '@/lib/tipos'
import { MapPin, Star, Zap } from 'lucide-react'

export function HerramientaCard({ herramienta }: { herramienta: Herramienta }) {
  const { usuario } = useStore()
  const dueno = usuario(herramienta.duenoId)

  return (
    <Link href={`/herramienta/${herramienta.id}`} className="group block">
      <Card className="h-full overflow-hidden p-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 overflow-hidden bg-muted">
          <Image
            src={herramienta.imagen || '/placeholder.svg'}
            alt={herramienta.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {herramienta.entregaInmediata && (
            <Badge className="absolute left-2 top-2 gap-1">
              <Zap className="size-3" aria-hidden="true" />
              Inmediata
            </Badge>
          )}
          {!herramienta.publicada && (
            <Badge variant="secondary" className="absolute right-2 top-2">
              Pausada
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-pretty font-display text-sm font-semibold leading-tight">
              {herramienta.nombre}
            </h3>
            <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="size-3 fill-current" aria-hidden="true" />
              {dueno.rating}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            {dueno.nombre} · {herramienta.estado}
          </p>

          <div className="mt-1 flex items-center justify-between gap-2">
            <p className="font-display text-base font-bold">
              {fmt(herramienta.precioDia)}
              <span className="text-xs font-normal text-muted-foreground"> /día</span>
            </p>
            {herramienta.distanciaM > 0 && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden="true" />
                {distancia(herramienta.distanciaM)}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
