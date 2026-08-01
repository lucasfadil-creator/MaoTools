'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Check, MessageSquare, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  fechaCorta,
  fmt,
  type EstadoOperacion,
  type Operacion,
} from '@/lib/data'
import { useStore } from '@/lib/store'
import { ActaDialog } from '@/components/acta-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const ETIQUETA: Record<EstadoOperacion, { texto: string; clase: string }> = {
  solicitada: {
    texto: 'Esperando respuesta',
    clase: 'bg-chart-3/15 text-chart-3 border-chart-3/30',
  },
  aceptada: {
    texto: 'Aceptada, a coordinar entrega',
    clase: 'bg-chart-2/15 text-chart-2 border-chart-2/30',
  },
  en_curso: {
    texto: 'En curso',
    clase: 'bg-primary/15 text-primary border-primary/30',
  },
  finalizada: {
    texto: 'Finalizada',
    clase: 'bg-secondary text-muted-foreground border-border',
  },
  rechazada: {
    texto: 'Rechazada',
    clase: 'bg-secondary text-muted-foreground border-border',
  },
  cancelada: {
    texto: 'Cancelada',
    clase: 'bg-secondary text-muted-foreground border-border',
  },
}

export function OperacionCard({
  op,
  rol,
}: {
  op: Operacion
  rol: 'locatario' | 'prestamista'
}) {
  const { herramienta, usuario, responder, cancelar, calificar } = useStore()
  const [acta, setActa] = useState<'entrega' | 'devolucion' | null>(null)

  const h = herramienta(op.herramientaId)
  if (!h) return null

  const soyDueno = rol === 'prestamista'
  const contraparte = usuario(soyDueno ? op.locatarioId : op.duenoId)
  const etiqueta = ETIQUETA[op.estado]

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
          <Image
            src={h.imagen || '/placeholder.svg'}
            alt={h.nombre}
            fill
            sizes="64px"
            className="object-cover"
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <Link
              href={`/herramienta/${h.id}`}
              className="text-pretty text-sm font-semibold hover:underline"
            >
              {h.nombre}
            </Link>
            <Badge variant="outline" className={cn('text-xs', etiqueta.clase)}>
              {etiqueta.texto}
            </Badge>
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {soyDueno ? 'Se la alquila' : 'Se la alquilás a'}{' '}
            <strong className="font-medium text-foreground">
              {contraparte.nombre}
            </strong>{' '}
            · {fechaCorta(op.desde)} al {fechaCorta(op.hasta)} ({op.dias}{' '}
            {op.dias === 1 ? 'día' : 'días'})
          </p>

          <p className="mt-1 text-xs">
            <span className="font-semibold">{fmt(op.total)}</span>
            <span className="text-muted-foreground">
              {' '}
              · garantía retenida {fmt(op.garantia)}
            </span>
          </p>
        </div>
      </div>

      {op.mensaje && op.estado === 'solicitada' && (
        <p className="flex gap-2 rounded-lg bg-secondary p-2.5 text-xs text-muted-foreground">
          <MessageSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {op.mensaje}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {op.estado === 'solicitada' && soyDueno && (
          <>
            <Button
              size="sm"
              onClick={() => {
                responder(op.id, true)
                toast.success('Solicitud aceptada. Coordiná la entrega.')
              }}
            >
              <Check className="size-4" aria-hidden="true" />
              Aceptar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                responder(op.id, false)
                toast('Solicitud rechazada')
              }}
            >
              <X className="size-4" aria-hidden="true" />
              Rechazar
            </Button>
          </>
        )}

        {op.estado === 'solicitada' && !soyDueno && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              cancelar(op.id)
              toast('Solicitud cancelada')
            }}
          >
            Cancelar solicitud
          </Button>
        )}

        {op.estado === 'aceptada' && (
          <Button size="sm" onClick={() => setActa('entrega')}>
            Firmar acta de entrega
          </Button>
        )}

        {op.estado === 'en_curso' && (
          <Button size="sm" onClick={() => setActa('devolucion')}>
            Registrar devolución
          </Button>
        )}

        {op.estado === 'finalizada' && !op.calificacion && (
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs text-muted-foreground">
              Calificá a {contraparte.nombre.split(' ')[0]}:
            </span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} estrellas`}
                onClick={() => {
                  calificar(op.id, n)
                  toast.success('Gracias por calificar')
                }}
                className="text-muted-foreground hover:text-chart-3"
              >
                <Star className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {op.estado === 'finalizada' && op.calificacion && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Calificaste con
            {Array.from({ length: op.calificacion }).map((_, i) => (
              <Star
                key={i}
                className="size-3.5 fill-current text-chart-3"
                aria-hidden="true"
              />
            ))}
          </p>
        )}
      </div>

      {acta && (
        <ActaDialog
          op={op}
          h={h}
          tipo={acta}
          abierto
          onOpenChange={(v) => !v && setActa(null)}
        />
      )}
    </article>
  )
}
