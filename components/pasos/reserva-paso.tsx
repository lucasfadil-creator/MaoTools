'use client'

import { useEffect, useState } from 'react'
import { PasoLayout } from '@/components/paso-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { fmt, type Proveedor } from '@/lib/data'
import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  Info,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
} from 'lucide-react'

type Props = {
  proveedor: Proveedor
  onConfirmar: () => void
}

export function ReservaPaso({ proveedor, onConfirmar }: Props) {
  const [dias, setDias] = useState(1)
  const [fase, setFase] = useState<'form' | 'procesando' | 'confirmada'>('form')

  const alquiler = proveedor.precioDia * dias
  const fee = Math.round(alquiler * 0.08)
  const total = alquiler + fee

  useEffect(() => {
    if (fase !== 'procesando') return
    const t = setTimeout(() => setFase('confirmada'), 1800)
    return () => clearTimeout(t)
  }, [fase])

  return (
    <PasoLayout
      etiqueta="Paso 4 · Reserva, pago y garantía"
      titulo={`Reservá el ${proveedor.herramienta.toLowerCase()} de ${proveedor.nombre}`}
      descripcion="Acá está el momento de mayor fricción del producto: pedir la tarjeta. Por eso la garantía se explica como retención y no como cobro, y recién se solicita cuando el usuario ya decidió reservar."
      ancho="ancho"
    >
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card className="gap-4 p-5">
            <div className="flex items-center gap-2">
              <BadgeCheck className="size-4 text-accent-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Identidad verificada</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['DNI validado', 'Selfie con prueba de vida', 'Teléfono confirmado'].map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  <BadgeCheck className="size-3" aria-hidden="true" />
                  {t}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="gap-4 p-5">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Período de alquiler</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((d) => (
                <Button
                  key={d}
                  size="sm"
                  disabled={fase !== 'form'}
                  variant={dias === d ? 'default' : 'outline'}
                  onClick={() => setDias(d)}
                >
                  {d} {d === 1 ? 'día' : 'días'}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="gap-4 p-5">
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Medio de pago</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="tarjeta">Número de tarjeta</Label>
                <Input
                  id="tarjeta"
                  inputMode="numeric"
                  placeholder="4509 9535 6623 3704"
                  defaultValue="4509 9535 6623 3704"
                  disabled={fase !== 'form'}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="venc">Vencimiento</Label>
                <Input id="venc" placeholder="08/29" defaultValue="08/29" disabled={fase !== 'form'} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="cvv">Código de seguridad</Label>
                <Input id="cvv" placeholder="123" defaultValue="123" disabled={fase !== 'form'} />
              </div>
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Los datos van directo a la pasarela certificada PCI-DSS y quedan tokenizados. La
              plataforma nunca almacena el número de tarjeta.
            </p>
          </Card>

          <Card className="gap-3 border-accent bg-accent/40 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-accent-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">
                La garantía se retiene, no se cobra
              </h2>
            </div>
            <p className="text-sm leading-relaxed">
              Vamos a preautorizar <strong>{fmt(proveedor.garantia)}</strong> en tu tarjeta. Ese
              dinero no se debita: queda inmovilizado y se libera automáticamente en menos de 24
              horas después de devolver la herramienta sin novedades.
            </p>
            <p className="text-xs leading-relaxed text-accent-foreground">
              El monto es menor porque {proveedor.nombre} tiene nivel {proveedor.nivel.toLowerCase()}
              . La buena reputación baja la garantía de las dos partes.
            </p>
          </Card>
        </div>

        <Card className="h-fit gap-4 p-5 lg:sticky lg:top-36">
          <h2 className="font-display text-base font-semibold">Detalle de la operación</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {fmt(proveedor.precioDia)} x {dias} {dias === 1 ? 'día' : 'días'}
              </span>
              <span className="tabular-nums">{fmt(alquiler)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Cargo por servicio (8%)</span>
              <span className="tabular-nums">{fmt(fee)}</span>
            </li>
            <Separator className="my-1" />
            <li className="flex justify-between gap-2 font-semibold">
              <span>Total a pagar hoy</span>
              <span className="tabular-nums">{fmt(total)}</span>
            </li>
            <li className="flex justify-between gap-2 text-muted-foreground">
              <span>Garantía retenida</span>
              <span className="tabular-nums">{fmt(proveedor.garantia)}</span>
            </li>
          </ul>

          <Separator />

          {fase === 'form' && (
            <>
              <Button className="w-full" onClick={() => setFase('procesando')}>
                Confirmar y retener garantía
              </Button>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Al confirmar se genera el contrato digital entre vos y {proveedor.nombre}. Prestá
                actúa como intermediario y no es parte del alquiler.
              </p>
            </>
          )}

          {fase === 'procesando' && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
              Solicitando preautorización al banco…
            </div>
          )}

          {fase === 'confirmada' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-muted/50 p-3">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <ShieldCheck className="size-4 text-accent-foreground" aria-hidden="true" />
                  Reserva confirmada
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  Pago acreditado en custodia. El dinero se libera a {proveedor.nombre} recién
                  cuando cierres la devolución.
                </span>
              </div>

              <div className="flex flex-col gap-1.5 rounded-lg border border-border p-3">
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="size-4" aria-hidden="true" />
                  Punto de encuentro sugerido
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  Plaza Belgrano, entrada por Rivadavia. Hoy de 18:00 a 19:00. Elegido por
                  minimizar el tiempo combinado de traslado y ser un lugar concurrido.
                </span>
              </div>

              <Button className="w-full" onClick={onConfirmar}>
                Ir al acta de entrega
              </Button>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                El chat con {proveedor.nombre} queda enmascarado: nadie ve el teléfono del otro.
              </p>
            </div>
          )}
        </Card>
      </div>
    </PasoLayout>
  )
}
