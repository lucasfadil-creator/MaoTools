'use client'

import { PasoLayout } from '@/components/paso-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { DIAGNOSTICO, fmt } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Clock, Gauge, HardHat, PackageOpen, Search, TriangleAlert, Wrench } from 'lucide-react'

const GRUPOS = [
  {
    tipo: 'herramienta' as const,
    titulo: 'Herramientas a conseguir',
    icono: Wrench,
    nota: 'Disponibles para alquilar cerca tuyo',
  },
  {
    tipo: 'insumo' as const,
    titulo: 'Insumos consumibles',
    icono: PackageOpen,
    nota: 'No se alquilan: se compran en la ferretería del pedido',
  },
  {
    tipo: 'epp' as const,
    titulo: 'Protección personal',
    icono: HardHat,
    nota: 'Se muestra de nuevo, sin poder saltearse, antes de la entrega',
  },
]

type Props = {
  respuestas: Record<string, string>
  onBuscar: () => void
}

export function ResultadoPaso({ respuestas, onBuscar }: Props) {
  const insumos = DIAGNOSTICO.items.filter((i) => i.tipo !== 'herramienta')
  const costoInsumos = insumos.reduce((a, i) => a + (i.precioCompra ?? 0), 0)
  const costoAlquiler = DIAGNOSTICO.items
    .filter((i) => i.alquilable)
    .reduce((a, i) => a + (i.precioDia ?? 0), 0)
  const costoCompra = DIAGNOSTICO.items
    .filter((i) => i.tipo === 'herramienta')
    .reduce((a, i) => a + (i.precioCompra ?? 0), 0)

  const opciones = [
    {
      nombre: 'Alquilar en Prestá',
      total: costoAlquiler + costoInsumos,
      detalle: 'Alquiler por 1 día + insumos + protección',
      recomendado: true,
    },
    {
      nombre: 'Comprar las herramientas',
      total: costoCompra + costoInsumos,
      detalle: 'Quedan en tu casa, con un uso estimado de 13 minutos al año',
      recomendado: false,
    },
    {
      nombre: 'Contratar a un instalador',
      total: 42000,
      detalle: 'Precio promedio de la zona por visita mínima',
      recomendado: false,
    },
  ]

  const maxTotal = Math.max(...opciones.map((o) => o.total))

  return (
    <PasoLayout
      etiqueta="Paso 2 · Resultado del diagnóstico"
      titulo="Esto es lo que necesitás para resolverlo"
      descripcion="La IA no devuelve una herramienta suelta: devuelve el kit completo del trabajo, la dificultad, el tiempo estimado y la comparación económica contra las alternativas."
      ancho="ancho"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icono: Gauge, label: 'Dificultad', valor: DIAGNOSTICO.dificultad },
          { icono: Clock, label: 'Tiempo estimado', valor: DIAGNOSTICO.tiempo },
          {
            icono: HardHat,
            label: 'Nivel de riesgo',
            valor: 'Bajo · apto para hacerlo vos',
          },
        ].map((m) => (
          <Card key={m.label} className="flex-row items-center gap-3 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <m.icono className="size-4.5" aria-hidden="true" />
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              <span className="text-sm font-medium">{m.valor}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="gap-2 border-accent bg-accent/40 p-4">
        <p className="text-sm leading-relaxed">
          <strong>Ajuste por tus respuestas:</strong> como indicaste{' '}
          <em>{(respuestas.peso ?? '').toLowerCase()}</em> y que la pared{' '}
          <em>{(respuestas.sonido ?? '').toLowerCase()}</em>, cambio el tarugo común por tarugo
          tipo mariposa y sumo un segundo punto de anclaje.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-4">
          {GRUPOS.map((g) => {
            const items = DIAGNOSTICO.items.filter((i) => i.tipo === g.tipo)
            return (
              <Card key={g.tipo} className="gap-3 p-5">
                <div className="flex items-center gap-2">
                  <g.icono className="size-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="font-display text-base font-semibold">{g.titulo}</h2>
                </div>
                <p className="-mt-1 text-xs text-muted-foreground">{g.nota}</p>
                <ul className="flex flex-col">
                  {items.map((i, idx) => (
                    <li key={i.nombre}>
                      {idx > 0 && <Separator className="my-3" />}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium">{i.nombre}</span>
                            {g.tipo === 'epp' && (
                              <Badge variant="destructive" className="gap-1">
                                <TriangleAlert className="size-3" aria-hidden="true" />
                                Obligatorio
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs leading-relaxed text-muted-foreground">
                            {i.detalle}
                          </span>
                        </div>
                        <span className="shrink-0 text-right text-sm">
                          {i.alquilable ? (
                            <>
                              <span className="font-medium">{fmt(i.precioDia ?? 0)}</span>
                              <span className="block text-xs text-muted-foreground">por día</span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium">{fmt(i.precioCompra ?? 0)}</span>
                              <span className="block text-xs text-muted-foreground">compra</span>
                            </>
                          )}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        <Card className="h-fit gap-4 p-5 lg:sticky lg:top-36">
          <h2 className="font-display text-base font-semibold">Comparación de costo</h2>
          <ul className="flex flex-col gap-4">
            {opciones.map((o) => (
              <li key={o.nombre} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      'text-sm',
                      o.recomendado ? 'font-semibold' : 'text-muted-foreground',
                    )}
                  >
                    {o.nombre}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{fmt(o.total)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full',
                      o.recomendado ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                    style={{ width: `${(o.total / maxTotal) * 100}%` }}
                  />
                </div>
                <span className="text-xs leading-relaxed text-muted-foreground">{o.detalle}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Alquilar sale{' '}
            <strong className="text-foreground">
              {Math.round((1 - opciones[0].total / opciones[1].total) * 100)}% menos
            </strong>{' '}
            que comprar y resuelve el mismo problema.
          </p>
          <Button onClick={onBuscar} className="w-full">
            <Search aria-hidden="true" />
            Ver disponibilidad cerca mío
          </Button>
        </Card>
      </div>
    </PasoLayout>
  )
}
