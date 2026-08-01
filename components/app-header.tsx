'use client'

import { PASOS, type Paso } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, RotateCcw, Wrench } from 'lucide-react'

type Props = {
  paso: Paso
  onIr: (paso: Paso) => void
  onReiniciar: () => void
  maxIndice: number
}

export function AppHeader({ paso, onIr, onReiniciar, maxIndice }: Props) {
  const indice = PASOS.findIndex((p) => p.id === paso)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <button
          onClick={() => onIr('inicio')}
          className="flex items-center gap-2 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">Prestá</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            prototipo de flujo
          </span>
        </button>

        <Button variant="ghost" size="sm" onClick={onReiniciar}>
          <RotateCcw aria-hidden="true" />
          Reiniciar demo
        </Button>
      </div>

      {indice > 0 && (
        <nav
          aria-label="Progreso del flujo"
          className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3"
        >
          <ol className="flex items-center gap-1">
            {PASOS.slice(1).map((p, i) => {
              const idxReal = i + 1
              const completado = idxReal < indice
              const activo = idxReal === indice
              const habilitado = idxReal <= maxIndice
              return (
                <li key={p.id} className="flex shrink-0 items-center gap-1">
                  <button
                    disabled={!habilitado}
                    onClick={() => onIr(p.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                      activo && 'bg-primary text-primary-foreground',
                      completado && 'text-foreground hover:bg-muted',
                      !activo && !completado && 'text-muted-foreground',
                      !habilitado && 'cursor-not-allowed opacity-45',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full text-[10px]',
                        activo && 'bg-primary-foreground/25',
                        completado && 'bg-accent text-accent-foreground',
                        !activo && !completado && 'bg-muted',
                      )}
                    >
                      {completado ? <Check className="size-2.5" aria-hidden="true" /> : idxReal}
                    </span>
                    {p.corto}
                  </button>
                  {i < PASOS.length - 2 && (
                    <span className="h-px w-3 bg-border" aria-hidden="true" />
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}
    </header>
  )
}
