'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useStore } from '@/components/store'
import {
  diasEntre,
  distancia,
  EPP_POR_CATEGORIA,
  fmt,
  garantiaDe,
  hoyISO,
  totalDe,
  YO,
  type Solicitud,
} from '@/lib/tipos'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Check,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  TriangleAlert,
} from 'lucide-react'

export function HerramientaDetalle({ id }: { id: string }) {
  const router = useRouter()
  const { herramienta, usuario, solicitar, yo } = useStore()
  const h = herramienta(id)

  const [desde, setDesde] = useState(hoyISO(1))
  const [hasta, setHasta] = useState(hoyISO(2))
  const [entrega, setEntrega] = useState<Solicitud['entrega']>('punto-medio')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const dias = useMemo(() => diasEntre(desde, hasta), [desde, hasta])

  if (!h) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="font-display text-lg font-semibold">Esta herramienta ya no está disponible</p>
        <Button asChild variant="outline">
          <Link href="/">Volver a explorar</Link>
        </Button>
      </div>
    )
  }

  const dueno = usuario(h.duenoId)
  const esMia = h.duenoId === YO
  const { alquiler, fee, total } = totalDe(h, dias)
  const garantia = garantiaDe(h, yo.rating)

  function enviar() {
    if (!h) return
    if (new Date(hasta) < new Date(desde)) {
      setError('La fecha de devolución no puede ser anterior al retiro.')
      return
    }
    if (mensaje.trim().length < 10) {
      setError('Contale al dueño para qué la necesitás (mínimo 10 caracteres).')
      return
    }
    setError('')
    solicitar({ herramientaId: h.id, desde, hasta, dias, mensaje: mensaje.trim(), entrega })
    router.push('/alquileres')
  }

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => router.back()}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver
      </Button>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-border bg-muted">
            <Image
              src={h.imagen || '/placeholder.svg'}
              alt={h.nombre}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{h.categoria}</Badge>
              <Badge variant="outline">{h.estado}</Badge>
              {h.entregaInmediata && <Badge>Entrega inmediata</Badge>}
              {h.factura && <Badge variant="outline">Con factura</Badge>}
            </div>
            <h1 className="text-balance font-display text-2xl font-bold tracking-tight md:text-3xl">
              {h.nombre}
            </h1>
            <p className="text-pretty leading-relaxed text-muted-foreground">{h.descripcion}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="size-4 text-muted-foreground" aria-hidden="true" />
                Qué incluye
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {h.incluye.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dueño</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarFallback>{dueno.inicial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <p className="flex items-center gap-1.5 font-medium">
                  {dueno.nombre}
                  {dueno.verificado && (
                    <BadgeCheck className="size-4 text-primary" aria-label="Verificado" />
                  )}
                </p>
                <p className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 fill-current" aria-hidden="true" />
                    {dueno.rating} · {dueno.operaciones} operaciones
                  </span>
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" aria-hidden="true" />
                  {dueno.zona}
                  {h.distanciaM > 0 && ` · a ${distancia(h.distanciaM)}`}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {dueno.nivel}
              </Badge>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/50 p-4">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Seguridad de uso</p>
              <p className="text-sm text-muted-foreground">{EPP_POR_CATEGORIA[h.categoria]}</p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          {esMia ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Esta publicación es tuya</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Gestioná las solicitudes que recibas y el estado de la publicación desde tu panel.
                </p>
                <Button asChild>
                  <Link href="/mis-herramientas">Ir a mis herramientas</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-baseline gap-1 font-display text-2xl">
                  {fmt(h.precioDia)}
                  <span className="text-sm font-normal text-muted-foreground">por día</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="desde" className="text-xs">
                      Retiro
                    </Label>
                    <Input
                      id="desde"
                      type="date"
                      value={desde}
                      min={hoyISO(0)}
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

                <div className="flex flex-col gap-2">
                  <Label className="text-xs">Modalidad de entrega</Label>
                  <RadioGroup
                    value={entrega}
                    onValueChange={(v) => setEntrega(v as Solicitud['entrega'])}
                    className="gap-2"
                  >
                    {(
                      [
                        ['retiro', 'Retiro en domicilio del dueño'],
                        ['punto-medio', 'Punto de encuentro intermedio'],
                        ['envio', 'Envío por mensajería'],
                      ] as const
                    ).map(([v, label]) => (
                      <div key={v} className="flex items-center gap-2">
                        <RadioGroupItem value={v} id={`entrega-${v}`} />
                        <Label htmlFor={`entrega-${v}`} className="text-sm font-normal">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="mensaje" className="text-xs">
                    Mensaje para {dueno.nombre}
                  </Label>
                  <Textarea
                    id="mensaje"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    placeholder="Contale para qué la necesitás y cómo la vas a cuidar."
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {fmt(h.precioDia)} × {dias} {dias === 1 ? 'día' : 'días'}
                    </span>
                    <span>{fmt(alquiler)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fee de servicio</span>
                    <span>{fmt(fee)}</span>
                  </div>
                  <div className="flex items-center justify-between font-display font-bold">
                    <span>Total a pagar</span>
                    <span>{fmt(total)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-accent p-3 text-accent-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p className="text-xs leading-relaxed">
                    Garantía de <strong>{fmt(garantia)}</strong> preautorizada en tu tarjeta. No se
                    cobra: se libera automáticamente al devolver sin daños.
                  </p>
                </div>

                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button onClick={enviar} className="w-full">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Enviar solicitud de alquiler
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No se cobra nada hasta que el dueño acepte.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
