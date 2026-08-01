'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react'
import {
  calcularCostos,
  diasEntre,
  distancia,
  fmt,
  hoyMas,
  type Herramienta,
} from '@/lib/data'
import { useStore } from '@/lib/store'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

export function HerramientaDetalle({ h }: { h: Herramienta }) {
  const router = useRouter()
  const { usuario, solicitar, despublicar } = useStore()
  const dueno = usuario(h.duenoId)
  const esMia = h.duenoId === 'yo'

  const [desde, setDesde] = useState(hoyMas(1))
  const [hasta, setHasta] = useState(hoyMas(2))
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)

  const rangoValido = new Date(hasta) >= new Date(desde)
  const dias = rangoValido ? diasEntre(desde, hasta) : 1
  const { alquiler, fee, total } = calcularCostos(h.precioDia, dias)
  const instantanea = h.entregaInmediata && dueno.tipo === 'Comercio'

  function enviar() {
    if (!rangoValido) {
      toast.error('La fecha de devolución no puede ser anterior al retiro.')
      return
    }
    setEnviando(true)
    setTimeout(() => {
      solicitar({ herramientaId: h.id, desde, hasta, mensaje })
      toast.success(
        instantanea
          ? 'Reserva confirmada. Garantía preautorizada, no debitada.'
          : 'Solicitud enviada. Te avisamos cuando responda.',
      )
      router.push('/actividad')
    }, 700)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/"
        className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver a explorar
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <div className="relative aspect-16/9 max-h-80 overflow-hidden rounded-xl border border-border bg-secondary">
            <Image
              src={h.imagen || '/placeholder.svg'}
              alt={h.nombre}
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{h.categoria}</Badge>
              <Badge variant="outline">Estado: {h.estado}</Badge>
              {h.entregaInmediata && (
                <Badge className="gap-1 bg-accent text-accent-foreground">
                  <Zap className="size-3" aria-hidden="true" />
                  Entrega inmediata
                </Badge>
              )}
              {h.factura && <Badge variant="outline">Con factura</Badge>}
            </div>
            <h1 className="mt-3 text-balance font-display text-2xl font-bold leading-tight">
              {h.nombre}
            </h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {h.descripcion}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
              {dueno.nombre
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                {dueno.nombre}
                {dueno.verificado && (
                  <BadgeCheck
                    className="size-4 text-chart-2"
                    aria-hidden="true"
                  />
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {dueno.nivel} · {dueno.operaciones} operaciones ·{' '}
                {dueno.respuesta}
              </p>
            </div>
            {dueno.rating > 0 && (
              <span className="flex items-center gap-1 text-sm font-semibold">
                <Star
                  className="size-4 fill-current text-chart-3"
                  aria-hidden="true"
                />
                {dueno.rating}
              </span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Package className="size-4 text-chart-2" aria-hidden="true" />
                Qué incluye
              </h2>
              <ul className="mt-2 flex flex-col gap-1.5 text-xs text-muted-foreground">
                {h.incluye.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <CircleAlert className="size-4 text-destructive" aria-hidden="true" />
                Protección obligatoria
              </h2>
              <ul className="mt-2 flex flex-col gap-1.5 text-xs text-muted-foreground">
                {h.eppRequerido.map((i) => (
                  <li key={i}>· {i}</li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                Vas a tener que confirmar que leíste estas condiciones antes de
                firmar el acta de entrega.
              </p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-2xl font-bold">
                {fmt(h.precioDia)}
              </span>
              <span className="text-sm text-muted-foreground">por día</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden="true" />
              {esMia ? 'En tu domicilio' : `A ${distancia(h.distanciaM)} tuyo`}{' '}
              · {dueno.barrio}
            </p>

            <Separator className="my-4" />

            {esMia ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Esta publicación es tuya. Podés pausarla para que deje de
                  aparecer en las búsquedas.
                </p>
                <Button
                  variant={h.publicada ? 'outline' : 'default'}
                  onClick={() => {
                    despublicar(h.id)
                    toast.success(
                      h.publicada
                        ? 'Publicación pausada'
                        : 'Publicación reactivada',
                    )
                  }}
                >
                  {h.publicada ? 'Pausar publicación' : 'Reactivar publicación'}
                </Button>
                <Link
                  href="/actividad"
                  className={buttonVariants({ variant: 'ghost' })}
                >
                  Ver solicitudes recibidas
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="desde" className="text-xs">
                      Retiro
                    </Label>
                    <Input
                      id="desde"
                      type="date"
                      value={desde}
                      min={hoyMas(0)}
                      onChange={(e) => setDesde(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hasta" className="text-xs">
                      Devolución
                    </Label>
                    <Input
                      id="hasta"
                      type="date"
                      value={hasta}
                      min={desde}
                      onChange={(e) => setHasta(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="mensaje" className="text-xs">
                    Contale para qué la necesitás
                  </Label>
                  <Textarea
                    id="mensaje"
                    rows={3}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Ej: colgar dos cuadros en pared de ladrillo hueco."
                  />
                </div>

                <div className="flex flex-col gap-1.5 rounded-lg bg-secondary p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {fmt(h.precioDia)} x {dias} {dias === 1 ? 'día' : 'días'}
                    </span>
                    <span>{fmt(alquiler)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Servicio de la plataforma
                    </span>
                    <span>{fmt(fee)}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total a pagar</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <div className="flex gap-2 rounded-lg border border-chart-2/30 bg-chart-2/5 p-3">
                  <ShieldCheck
                    className="mt-0.5 size-4 shrink-0 text-chart-2"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Se retiene <strong>{fmt(h.garantia)}</strong> de garantía en
                    tu tarjeta. Es una preautorización: no se debita y se libera
                    dentro de las 24 h de devolver la herramienta sin novedades.
                  </p>
                </div>

                <Button onClick={enviar} disabled={enviando} className="w-full">
                  {enviando
                    ? 'Procesando…'
                    : instantanea
                      ? 'Reservar ahora'
                      : 'Enviar solicitud'}
                </Button>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  {instantanea
                    ? 'Reserva instantánea: se confirma al momento'
                    : `${dueno.nombre.split(' ')[0]} ${dueno.respuesta.toLowerCase()}`}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
