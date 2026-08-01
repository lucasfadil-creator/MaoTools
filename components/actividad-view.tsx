'use client'

import Link from 'next/link'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { OperacionCard } from '@/components/operacion-card'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function Vacio({
  texto,
  cta,
  href,
}: {
  texto: string
  cta: string
  href: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-10 text-center">
      <p className="text-sm text-muted-foreground">{texto}</p>
      <Link
        href={href}
        className={buttonVariants({ variant: 'outline', className: 'mt-4' })}
      >
        {cta}
      </Link>
    </div>
  )
}

export function ActividadView() {
  const { comoLocatario, comoPrestamista, pendientesDeRespuesta } = useStore()

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-bold leading-tight">
          Tu actividad
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todo lo que alquilaste y todo lo que prestaste, en un solo lugar.
        </p>
      </header>

      <Tabs defaultValue="alquilo">
        <TabsList>
          <TabsTrigger value="alquilo" className="gap-1.5">
            <ArrowDownLeft className="size-4" aria-hidden="true" />
            Alquilo ({comoLocatario.length})
          </TabsTrigger>
          <TabsTrigger value="presto" className="gap-1.5">
            <ArrowUpRight className="size-4" aria-hidden="true" />
            Presto ({comoPrestamista.length})
            {pendientesDeRespuesta > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {pendientesDeRespuesta}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alquilo" className="mt-4 flex flex-col gap-3">
          {comoLocatario.length === 0 ? (
            <Vacio
              texto="Todavía no alquilaste ninguna herramienta."
              cta="Explorar herramientas"
              href="/"
            />
          ) : (
            comoLocatario.map((op) => (
              <OperacionCard key={op.id} op={op} rol="locatario" />
            ))
          )}
        </TabsContent>

        <TabsContent value="presto" className="mt-4 flex flex-col gap-3">
          {comoPrestamista.length === 0 ? (
            <Vacio
              texto="Nadie te pidió una herramienta todavía."
              cta="Publicar una herramienta"
              href="/publicar"
            />
          ) : (
            comoPrestamista.map((op) => (
              <OperacionCard key={op.id} op={op} rol="prestamista" />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
