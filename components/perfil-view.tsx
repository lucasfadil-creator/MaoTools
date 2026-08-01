'use client'

import Link from 'next/link'
import { BadgeCheck, CreditCard, PlusCircle, ShieldCheck, Star } from 'lucide-react'
import { fmt } from '@/lib/data'
import { useStore } from '@/lib/store'
import { HerramientaCard } from '@/components/herramienta-card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function PerfilView() {
  const { yo, misPublicaciones, comoLocatario, comoPrestamista } = useStore()

  const ganado = comoPrestamista
    .filter((o) => o.estado === 'finalizada')
    .reduce((acc, o) => acc + o.precioDia * o.dias, 0)
  const gastado = comoLocatario
    .filter((o) => o.estado === 'finalizada')
    .reduce((acc, o) => acc + o.total, 0)
  const retenido = [...comoLocatario]
    .filter((o) => o.estado === 'en_curso' || o.estado === 'aceptada')
    .reduce((acc, o) => acc + o.garantia, 0)

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent font-display text-xl font-bold text-accent-foreground">
          JM
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-2 font-display text-xl font-bold">
            {yo.nombre}
            <BadgeCheck className="size-5 text-chart-2" aria-hidden="true" />
          </h1>
          <p className="text-sm text-muted-foreground">
            {yo.barrio} · {yo.operaciones} operaciones · miembro desde 2024
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <Star
                className="size-3 fill-current text-chart-3"
                aria-hidden="true"
              />
              {yo.rating}
            </Badge>
            <Badge variant="secondary">{yo.nivel}</Badge>
            <Badge variant="outline">Identidad verificada</Badge>
          </div>
        </div>
        <Link href="/publicar" className={buttonVariants()}>
          <PlusCircle className="size-4" aria-hidden="true" />
          Publicar
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Ganaste prestando</p>
          <p className="font-display text-xl font-bold text-chart-2">
            {fmt(ganado)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Gastaste alquilando</p>
          <p className="font-display text-xl font-bold">{fmt(gastado)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Garantías retenidas</p>
          <p className="font-display text-xl font-bold">{fmt(retenido)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Medios de pago y garantía</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            <CreditCard className="size-4" aria-hidden="true" />
            Visa terminada en 4417
          </span>
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="size-3 text-chart-2" aria-hidden="true" />
            Tokenizada
          </Badge>
        </div>
        <Separator className="my-4" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Las garantías se retienen como preautorización: el dinero no se
          debita, queda bloqueado y se libera dentro de las 24 h de cerrada la
          devolución sin novedades. La plataforma actúa como intermediaria entre
          las partes.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">
            Tus publicaciones ({misPublicaciones.length})
          </h2>
          <Link
            href="/publicar"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Agregar otra
          </Link>
        </div>

        {misPublicaciones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted-foreground">
              No tenés herramientas publicadas todavía.
            </p>
            <Link
              href="/publicar"
              className={buttonVariants({
                variant: 'outline',
                className: 'mt-4',
              })}
            >
              Publicar la primera
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {misPublicaciones.map((h) => (
              <HerramientaCard key={h.id} h={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
