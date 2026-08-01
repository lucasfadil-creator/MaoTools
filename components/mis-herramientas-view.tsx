'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActaDialog } from '@/components/acta-dialog'
import { EstadoBadge } from '@/components/estado-badge'
import { useStore } from '@/components/store'
import { fechaCorta, fmt, totalDe, COMISION_PLATAFORMA, YO } from '@/lib/tipos'
import {
  Check,
  Eye,
  EyeOff,
  Inbox,
  PlusCircle,
  Star,
  Trash2,
  X,
} from 'lucide-react'

export function MisHerramientasView() {
  const {
    herramientas,
    solicitudes,
    usuario,
    editarHerramienta,
    eliminarHerramienta,
    responder,
    registrarEntrega,
    registrarDevolucion,
  } = useStore()

  const [actaActiva, setActaActiva] = useState<{
    solicitudId: string
    tipo: 'entrega' | 'devolucion'
  } | null>(null)

  const mias = herramientas.filter((h) => h.duenoId === YO)
  const recibidas = solicitudes.filter((s) => s.duenoId === YO)
  const pendientes = recibidas.filter((s) => s.estado === 'pendiente')
  const activas = recibidas.filter((s) => s.estado === 'aceptada' || s.estado === 'en-curso')
  const historial = recibidas.filter(
    (s) => s.estado === 'finalizada' || s.estado === 'rechazada' || s.estado === 'en-disputa',
  )

  const ganado = historial
    .filter((s) => s.estado === 'finalizada')
    .reduce((acc, s) => {
      const h = herramientas.find((x) => x.id === s.herramientaId)
      if (!h) return acc
      return acc + Math.round(totalDe(h, s.dias).alquiler * (1 - COMISION_PLATAFORMA))
    }, 0)

  const solicitudActa = actaActiva
    ? recibidas.find((s) => s.id === actaActiva.solicitudId)
    : undefined
  const herramientaActa = solicitudActa
    ? herramientas.find((h) => h.id === solicitudActa.herramientaId)
    : undefined

  function SolicitudCard({ id }: { id: string }) {
    const s = recibidas.find((x) => x.id === id)!
    const h = herramientas.find((x) => x.id === s.herramientaId)
    const solicitante = usuario(s.solicitanteId)
    if (!h) return null
    const { alquiler } = totalDe(h, s.dias)
    const neto = Math.round(alquiler * (1 - COMISION_PLATAFORMA))

    return (
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex items-start gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={h.imagen || '/placeholder.svg'}
                alt={h.nombre}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-display text-sm font-semibold">{h.nombre}</p>
                <EstadoBadge estado={s.estado} />
              </div>
              <p className="text-xs text-muted-foreground">
                {fechaCorta(s.desde)} al {fechaCorta(s.hasta)} · {s.dias}{' '}
                {s.dias === 1 ? 'día' : 'días'}
              </p>
              <p className="text-xs text-muted-foreground">
                Recibís <strong className="text-foreground">{fmt(neto)}</strong> neto
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-secondary/60 p-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{solicitante.inicial}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-xs font-medium">
                {solicitante.nombre}
                <span className="flex items-center gap-0.5 text-muted-foreground">
                  <Star className="size-3 fill-current" aria-hidden="true" />
                  {solicitante.rating}
                </span>
              </p>
              <p className="text-pretty text-xs text-muted-foreground">{s.mensaje}</p>
            </div>
          </div>

          {s.estado === 'pendiente' && (
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => responder(s.id, true)}>
                <Check className="size-4" aria-hidden="true" />
                Aceptar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => responder(s.id, false, 'No disponible en esas fechas')}
              >
                <X className="size-4" aria-hidden="true" />
                Rechazar
              </Button>
            </div>
          )}

          {s.estado === 'aceptada' && (
            <Button
              size="sm"
              onClick={() => setActaActiva({ solicitudId: s.id, tipo: 'entrega' })}
            >
              Registrar entrega con acta
            </Button>
          )}

          {s.estado === 'en-curso' && (
            <Button
              size="sm"
              onClick={() => setActaActiva({ solicitudId: s.id, tipo: 'devolucion' })}
            >
              Registrar devolución
            </Button>
          )}

          {s.estado === 'en-disputa' && s.danoDeclarado && (
            <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              Disputa abierta: {s.danoDeclarado}. La garantía queda retenida hasta resolver.
            </p>
          )}

          {s.estado === 'rechazada' && s.motivoRechazo && (
            <p className="text-xs text-muted-foreground">Motivo: {s.motivoRechazo}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold tracking-tight">Mis herramientas</h1>
          <p className="text-sm text-muted-foreground">
            Gestioná tus publicaciones y las solicitudes que recibís.
          </p>
        </div>
        <Button asChild>
          <Link href="/publicar">
            <PlusCircle className="size-4" aria-hidden="true" />
            Publicar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Publicadas', String(mias.filter((h) => h.publicada).length)],
          ['Solicitudes nuevas', String(pendientes.length)],
          ['En curso', String(activas.length)],
          ['Ganado', fmt(ganado)],
        ].map(([label, valor]) => (
          <Card key={label}>
            <CardContent className="flex flex-col gap-1 p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-display text-xl font-bold">{valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="solicitudes">
        <TabsList>
          <TabsTrigger value="solicitudes">
            Solicitudes
            {pendientes.length > 0 && (
              <Badge className="ml-1.5 h-4 px-1 text-[10px]">{pendientes.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="publicaciones">Publicaciones ({mias.length})</TabsTrigger>
          <TabsTrigger value="historial">Historial ({historial.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="solicitudes" className="mt-4 flex flex-col gap-6">
          {pendientes.length === 0 && activas.length === 0 ? (
            <Vacio
              titulo="No tenés solicitudes activas"
              texto="Cuando alguien quiera alquilar una de tus herramientas, la vas a ver acá."
            />
          ) : (
            <>
              {pendientes.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    Esperando tu respuesta
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {pendientes.map((s) => (
                      <SolicitudCard key={s.id} id={s.id} />
                    ))}
                  </div>
                </section>
              )}
              {activas.length > 0 && (
                <section className="flex flex-col gap-3">
                  <h2 className="text-sm font-medium text-muted-foreground">En curso</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {activas.map((s) => (
                      <SolicitudCard key={s.id} id={s.id} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="publicaciones" className="mt-4">
          {mias.length === 0 ? (
            <Vacio
              titulo="Todavía no publicaste ninguna herramienta"
              texto="Publicá una herramienta que tengas guardada y empezá a generar ingresos."
              accion
            />
          ) : (
            <div className="flex flex-col gap-3">
              {mias.map((h) => (
                <Card key={h.id}>
                  <CardContent className="flex flex-wrap items-center gap-4 p-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={h.imagen || '/placeholder.svg'}
                        alt={h.nombre}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Link
                        href={`/herramienta/${h.id}`}
                        className="truncate font-display text-sm font-semibold hover:underline"
                      >
                        {h.nombre}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {h.categoria} · {h.estado} · {fmt(h.precioDia)} por día
                      </p>
                      <Badge variant={h.publicada ? 'default' : 'secondary'} className="w-fit">
                        {h.publicada ? 'Visible' : 'Pausada'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarHerramienta(h.id, { publicada: !h.publicada })}
                      >
                        {h.publicada ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                        {h.publicada ? 'Pausar' : 'Publicar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarHerramienta(h.id)}
                        aria-label={`Eliminar ${h.nombre}`}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historial" className="mt-4">
          {historial.length === 0 ? (
            <Vacio titulo="Sin historial todavía" texto="Acá vas a ver los alquileres cerrados." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {historial.map((s) => (
                <SolicitudCard key={s.id} id={s.id} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {solicitudActa && herramientaActa && actaActiva && (
        <ActaDialog
          abierto
          onAbrir={(v) => !v && setActaActiva(null)}
          categoria={herramientaActa.categoria}
          tipo={actaActiva.tipo}
          nombreContraparte={usuario(solicitudActa.solicitanteId).nombre}
          onConfirmar={(acta, dano) => {
            if (actaActiva.tipo === 'entrega') registrarEntrega(solicitudActa.id, acta)
            else registrarDevolucion(solicitudActa.id, acta, dano)
            setActaActiva(null)
          }}
        />
      )}
    </div>
  )
}

function Vacio({
  titulo,
  texto,
  accion,
}: {
  titulo: string
  texto: string
  accion?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
      <Inbox className="size-8 text-muted-foreground" aria-hidden="true" />
      <p className="font-medium">{titulo}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{texto}</p>
      {accion && (
        <Button asChild size="sm">
          <Link href="/publicar">Publicar herramienta</Link>
        </Button>
      )}
    </div>
  )
}
