'use client'

import Link from 'next/link'
import {
  MapPin,
  MessageSquare,
  Wrench,
  Repeat2,
  ShieldCheck,
  Star,
  ArrowRight,
  Search,
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmt, distancia } from '@/lib/data'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: MapPin,
    titulo: 'Encontrá herramientas cerca',
    desc: 'Visualizá en el mapa qué herramientas están disponibles en tu zona de Rosario.',
    href: '/mapa',
    cta: 'Ver mapa',
  },
  {
    icon: MessageSquare,
    titulo: 'Asistente con IA',
    desc: 'No sabés qué herramienta necesitás para tu tarea? Consultá a nuestro chatbot y te guiamos.',
    href: '/chat',
    cta: 'Consultar',
  },
  {
    icon: Repeat2,
    titulo: 'Alquilá y prestá',
    desc: 'Publicá las herramientas que no usás y generá ingresos. Alquilá lo que necesitás por días.',
    href: '/publicar',
    cta: 'Publicar',
  },
  {
    icon: ShieldCheck,
    titulo: 'Garantía y acta digital',
    desc: 'Cada alquiler incluye garantía preautorizada y acta digital firmada en la entrega.',
    href: '/explorar',
    cta: 'Explorar',
  },
]

export function HomeView() {
  const { herramientas, usuario } = useStore()

  const destacadas = herramientas
    .filter((h) => h.publicada && h.duenoId !== 'yo')
    .sort((a, b) => a.distanciaM - b.distanciaM)
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 text-center md:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative flex flex-col items-center gap-5">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Wrench className="size-7" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-balance font-display text-3xl font-bold leading-tight md:text-4xl">
              Alquilá la herramienta,
              <br />
              resolvé el problema
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-balance text-muted-foreground">
              MaoTools conecta vecinos y ferreterías de Rosario para compartir
              herramientas. Sin compras innecesarias, con garantía y acta
              digital en cada entrega.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/mapa" className={buttonVariants({ size: 'lg' })}>
              <MapPin className="size-4" aria-hidden="true" />
              Ver herramientas cerca
            </Link>
            <Link
              href="/chat"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <MessageSquare className="size-4" aria-hidden="true" />
              Consultar con IA
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            <MapPin className="mr-1 inline size-3" aria-hidden="true" />
            Rosario, Santa Fe — zona centro y barrios cercanos
          </p>
        </div>
      </section>

      {/* Stats */}
      <section
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Estadísticas de la plataforma"
      >
        {[
          { valor: `${herramientas.filter((h) => h.publicada).length}`, label: 'herramientas disponibles' },
          { valor: '7', label: 'prestamistas activos' },
          { valor: '4.7', label: 'rating promedio' },
          { valor: '100%', label: 'identidades verificadas' },
        ].map(({ valor, label }) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center"
          >
            <span className="font-display text-2xl font-bold text-primary">
              {valor}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold">
          Todo lo que necesitás
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, titulo, desc, href, cta }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/50"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-sm font-medium text-primary">
                {cta}
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Destacadas cerca */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">
            Herramientas cerca tuyo
          </h2>
          <Link
            href="/explorar"
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver todas
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {destacadas.map((h) => {
            const dueno = usuario(h.duenoId)
            return (
              <Link
                key={h.id}
                href={`/herramienta/${h.id}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Wrench className="size-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-primary">
                    {fmt(h.precioDia)}/día
                  </span>
                </div>
                <div>
                  <p className="font-semibold leading-tight">{h.nombre}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {dueno.nombre}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" aria-hidden="true" />
                    {distancia(h.distanciaM)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-chart-3 text-chart-3" aria-hidden="true" />
                    {dueno.rating}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* CTA buscar */}
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-10 text-center">
        <h2 className="font-display text-xl font-bold">
          No encontrás lo que buscás?
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Explorá el catálogo completo o usá el buscador para encontrar la
          herramienta exacta que necesitás en tu zona.
        </p>
        <Link href="/explorar" className={buttonVariants()}>
          <Search className="size-4" aria-hidden="true" />
          Explorar catálogo
        </Link>
      </section>
    </div>
  )
}
