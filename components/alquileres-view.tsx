'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EstadoBadge } from '@/components/estado-badge'
import { useStore } from '@/components/store'
import {
  fechaCorta,
  fmt,
  garantiaDe,
  totalDe,
  YO,
  type Solicitud,
} from '@/lib/tipos'
import { CalendarClock, MapPin, Search, ShieldCheck } from 'lucide-react'

const ENTREGA_LABEL: Record<Solicitud['entrega'], string> = {
  retiro: 'Retiro en domicilio del dueño',
  'punto-medio': 'Punto de encuentro intermedio',
  envio: 'Envío por mensajería',
}

export function AlquileresView() {
  const { solicitudes, herramientas, usuario, cancelar, yo } = useStore()

  const mios = solicitudes.filter((s) => s.solicitanteId === YO)
  const activos = mios.filter(
    (s) => s.estado === 'pendiente' || s.estado === 'aceptada' || s.estado === 'en-curso',
  )
  const cerrados = mios.filter(
    (s) => s.estado === 'finalizada' || s.estado === 'rechazada' || s.estado === 'en-disputa',
  )

  function Fila({ s }: { s: Solicitud }) {
    const h = herramientas.find((x) => x.id === s.herramientaId)
    if (!h) return null
    const dueno = usuario(s.duenoId)
    const { alquiler, fee, total } = totalDe(h, s.dias)
    const garantia = garantiaDe(h, yo.rating)

    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={h.imagen || '/placeholder.svg'}
                alt={h.nombre}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/herramienta/${h.id}`}
                  className="truncate font-display text-sm font-semibold hover:underline"
                >
                  {h.nombre}
                </Link>
                <EstadoBadge estado={s.estado} />
              </div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarClock className="size-3" aria-hidden="true" />
                {fechaCorta(s.desde)} al {fechaCorta(s.hasta)} · {s.dias}{' '}
                {s.dias === 1 ? 'día' : 'días'}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" aria-hidden="true" />
                {ENTREGA_LABEL[s.entrega]}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarFallback className="text-[10px]">{dueno.inicial}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{dueno.nombre}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span>
                {fmt(h.precioDia)} × {s.dias} {s.dias === 1 ? 'día' : 'días'}
              </span>
              <span>{fmt(alquiler)}</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Fee de servicio</span>
              <span>{fmt(fee)}</span>
            </div>
            <div className="flex items-center justify-between font-display font-bold">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>

          {(s.estado === 'aceptada' || s.estado === 'en-curso') && (
            <div className="flex items-start gap-2 rounded-lg bg-accent p-3 text-accent-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="text-xs leading-relaxed">
                Garantía de {fmt(garantia)} preautorizada. Se libera al devolver sin daños.
              </p>
            </div>
          )}

          {s.estado === 'finalizada' && (
            <p className="rounded-lg bg-secondary p-3 text-xs text-muted-foreground">
              Alquiler cerrado sin novedades. Garantía de {fmt(garantia)} liberada.
            </p>
          )}

          {s.estado === 'en-disputa' && s.danoDeclarado && (
            <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              El dueño declaró un daño: {s.danoDeclarado}. Tenés 48 h para responder.
            </p>
          )}

          {s.estado === 'rechazada' && (
            <p className="text-xs text-muted-foreground">
              {s.motivoRechazo ?? 'La solicitud fue rechazada.'} No se realizó ningún cobro.
            </p>
          )}

          {s.estado === 'pendiente' && (
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">Esperando respuesta de {dueno.nombre}</p>
              <Button variant="outline" size="sm" onClick={() => cancelar(s.id)}>
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">Mis alquileres</h1>
          <p className="text-sm text-muted-foreground">
            Seguimiento de las herramientas que pediste prestadas.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">
            <Search className="size-4" aria-hidden="true" />
            Explorar herramientas
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="activos">
        <TabsList>
          <TabsTrigger value="activos">Activos ({activos.length})</TabsTrigger>
          <TabsTrigger value="cerrados">Cerrados ({cerrados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="mt-4">
          {activos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
              <CalendarClock className="size-8 text-muted-foreground" aria-hidden="true" />
              <p className="font-medium">No tenés alquileres activos</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Buscá la herramienta que necesitás y enviá una solicitud al dueño.
              </p>
              <Button asChild size="sm">
                <Link href="/">Explorar herramientas</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activos.map((s) => (
                <Fila key={s.id} s={s} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cerrados" className="mt-4">
          {cerrados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              Todavía no cerraste ningún alquiler.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cerrados.map((s) => (
                <Fila key={s.id} s={s} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
