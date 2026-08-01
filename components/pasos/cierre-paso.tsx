'use client'

import { useEffect, useState } from 'react'
import { PasoLayout } from '@/components/paso-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { fmt, type Proveedor } from '@/lib/data'
import type { ResultadoCheckout } from '@/components/pasos/checkout-paso'
import { cn } from '@/lib/utils'
import {
  ArrowRight,
  Gavel,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Star,
  TrendingUp,
} from 'lucide-react'

type Props = {
  proveedor: Proveedor
  resultado: ResultadoCheckout
  onReiniciar: () => void
}

export function CierrePaso({ proveedor, resultado, onReiniciar }: Props) {
  const [liberando, setLiberando] = useState(resultado === 'sin-novedades')
  const [estrellas, setEstrellas] = useState(0)
  const [calificado, setCalificado] = useState(false)

  useEffect(() => {
    if (!liberando) return
    const t = setTimeout(() => setLiberando(false), 1600)
    return () => clearTimeout(t)
  }, [liberando])

  const alquiler = proveedor.precioDia
  const fee = Math.round(alquiler * 0.08)
  const comision = Math.round(alquiler * 0.12)

  return (
    <PasoLayout
      etiqueta="Paso 8 · Cierre de la operación"
      titulo={
        resultado === 'sin-novedades'
          ? 'Garantía liberada, dinero liquidado y reputación actualizada'
          : 'Disputa abierta: la garantía queda retenida hasta la resolución'
      }
      descripcion="El ciclo cierra donde empieza la retención: si la experiencia fue previsible y el dinero volvió cuando tenía que volver, el usuario reserva de nuevo."
      ancho="ancho"
    >
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-4">
          {resultado === 'sin-novedades' ? (
            <Card className="gap-4 border-accent bg-accent/30 p-5">
              <div className="flex items-center gap-2">
                {liberando ? (
                  <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="size-4 text-accent-foreground" aria-hidden="true" />
                )}
                <h2 className="font-display text-base font-semibold">
                  {liberando
                    ? 'Liberando la preautorización…'
                    : `Garantía de ${fmt(proveedor.garantia)} liberada`}
                </h2>
              </div>
              <p className="text-sm leading-relaxed">
                {liberando
                  ? 'Se envía la orden de liberación al banco emisor.'
                  : 'El dinero nunca se debitó: se levantó la retención sobre el límite de la tarjeta. El compromiso público es hacerlo en menos de 24 horas.'}
              </p>
            </Card>
          ) : (
            <Card className="gap-4 border-destructive/40 p-5">
              <div className="flex items-center gap-2">
                <Gavel className="size-4 text-destructive" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold">Disputa #DP-1140 abierta</h2>
              </div>
              <ol className="flex flex-col gap-3">
                {[
                  ['Ahora', 'Se notifica al locatario con la evidencia cargada por el prestamista.'],
                  ['48 horas', 'Plazo del locatario para aceptar el daño o presentar su descargo.'],
                  ['Si acepta', 'Se debita el monto acordado de la garantía y se libera el resto.'],
                  [
                    'Si no acepta',
                    'Interviene la mediación de la plataforma, con resolución en hasta 7 días hábiles.',
                  ],
                  [
                    'Si supera la garantía',
                    'Se activa la cobertura opcional contratada en la reserva.',
                  ],
                ].map(([etapa, texto]) => (
                  <li key={etapa} className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5 shrink-0">
                      {etapa}
                    </Badge>
                    <span className="text-sm leading-relaxed text-muted-foreground">{texto}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Sin acta de check-in con evidencia, la disputa se resuelve a favor del locatario.
                Por eso el acta no es opcional en el flujo.
              </p>
            </Card>
          )}

          <Card className="gap-4 p-5">
            <h2 className="font-display text-base font-semibold">
              Calificación bidireccional
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Las reseñas se publican recién cuando ambas partes califican o cuando vence el plazo,
              para evitar represalias cruzadas.
            </p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  aria-label={`Calificar con ${n} estrellas`}
                  onClick={() => setEstrellas(n)}
                  disabled={calificado}
                  className="rounded outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Star
                    className={cn(
                      'size-6 transition-colors',
                      n <= estrellas ? 'fill-current text-chart-3' : 'text-muted-foreground/40',
                    )}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            {calificado ? (
              <p className="text-sm">
                Calificación enviada. {proveedor.nombre} también te calificó a vos.
              </p>
            ) : (
              <Button
                size="sm"
                className="self-start"
                disabled={estrellas === 0}
                onClick={() => setCalificado(true)}
              >
                Enviar calificación
              </Button>
            )}
          </Card>

          <Card className="gap-3 p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Retención</h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El riesgo real del modelo es la baja frecuencia de uso. Un mes después, la app vuelve
              con una sugerencia contextual basada en el proyecto que ya resolviste.
            </p>
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm leading-relaxed">
              ¿Otro proyecto? Quienes colgaron cuadros después alquilaron una lijadora orbital para
              renovar los marcos.
            </div>
          </Card>
        </div>

        <Card className="h-fit gap-4 p-5 lg:sticky lg:top-36">
          <h2 className="font-display text-base font-semibold">Cómo se reparte el dinero</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Pagó la locataria</span>
              <span className="tabular-nums">{fmt(alquiler + fee)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Cobra {proveedor.nombre}</span>
              <span className="tabular-nums">
                {resultado === 'sin-novedades' ? fmt(alquiler - comision) : 'en custodia'}
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Comisión de la plataforma (12%)</span>
              <span className="tabular-nums">{fmt(comision)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Cargo por servicio (8%)</span>
              <span className="tabular-nums">{fmt(fee)}</span>
            </li>
            <Separator className="my-1" />
            <li className="flex justify-between gap-2 font-semibold">
              <span>Ingreso de Prestá</span>
              <span className="tabular-nums">{fmt(comision + fee)}</span>
            </li>
          </ul>

          <Separator />

          <h3 className="font-display text-sm font-semibold">Métrica North Star</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            No medimos alquileres iniciados: medimos <strong className="text-foreground">problemas
            resueltos</strong>, es decir operaciones con check-out cerrado. Es la única métrica que
            captura el valor real entregado.
          </p>

          <Separator />

          <Button onClick={onReiniciar} variant="outline" className="w-full">
            <RotateCcw aria-hidden="true" />
            Recorrer el flujo de nuevo
          </Button>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <ArrowRight className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Próximos módulos a prototipar: publicación de herramientas, CRM de ferreterías y back
            office de disputas.
          </p>
        </Card>
      </div>
    </PasoLayout>
  )
}
