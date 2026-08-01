'use client'

import { useState } from 'react'
import { PasoLayout } from '@/components/paso-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { CONSULTAS_GUIA, GUIA_PASOS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { ArrowRight, Check, MessageCircleQuestion, Sparkles, TriangleAlert } from 'lucide-react'

type Mensaje = { rol: 'usuario' | 'ia'; texto: string }

type Props = {
  onDevolver: () => void
}

export function GuiaPaso({ onDevolver }: Props) {
  const [actual, setActual] = useState(0)
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      rol: 'ia',
      texto:
        'Ya tenés el taladro. Te acompaño paso a paso con el contexto del diagnóstico: ladrillo hueco revocado, cuadro de peso medio y dos anclajes con tarugo mariposa.',
    },
  ])
  const [usadas, setUsadas] = useState<string[]>([])

  const terminado = actual >= GUIA_PASOS.length - 1
  const paso = GUIA_PASOS[actual]

  function consultar(pregunta: string, respuesta: string) {
    setUsadas((u) => [...u, pregunta])
    setMensajes((m) => [...m, { rol: 'usuario', texto: pregunta }, { rol: 'ia', texto: respuesta }])
  }

  return (
    <PasoLayout
      etiqueta="Paso 6 · IA durante la ejecución"
      titulo="La IA no termina en la recomendación: te acompaña mientras hacés el trabajo"
      descripcion="Acá está el diferencial defendible del producto. No vendemos acceso a una herramienta, vendemos la resolución del problema, y por eso la asistencia sigue después de la entrega."
      ancho="ancho"
    >
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">
                Paso {actual + 1} de {GUIA_PASOS.length}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {Math.round(((actual + 1) / GUIA_PASOS.length) * 100)}% completado
              </span>
            </div>
            <Progress value={((actual + 1) / GUIA_PASOS.length) * 100} />

            <h2 className="font-display text-xl font-bold tracking-tight text-balance">
              {paso.titulo}
            </h2>
            <p className="text-sm leading-relaxed text-pretty">{paso.texto}</p>

            {paso.aviso && (
              <p className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs leading-relaxed text-destructive">
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                {paso.aviso}
              </p>
            )}

            <Separator />

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={actual === 0}
                onClick={() => setActual((a) => a - 1)}
              >
                Anterior
              </Button>
              {!terminado ? (
                <Button size="sm" onClick={() => setActual((a) => a + 1)}>
                  Siguiente paso
                  <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <Badge className="gap-1 bg-accent text-accent-foreground">
                  <Check className="size-3" aria-hidden="true" />
                  Trabajo terminado
                </Badge>
              )}
            </div>
          </Card>

          <Card className="gap-3 p-5">
            <h3 className="font-display text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Recorrido
            </h3>
            <ol className="flex flex-col gap-2">
              {GUIA_PASOS.map((p, i) => (
                <li key={p.titulo}>
                  <button
                    onClick={() => setActual(i)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                      i === actual ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted/60',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]',
                        i < actual
                          ? 'bg-accent text-accent-foreground'
                          : i === actual
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted',
                      )}
                    >
                      {i < actual ? <Check className="size-3" aria-hidden="true" /> : i + 1}
                    </span>
                    {p.titulo}
                  </button>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-36 lg:h-fit">
          <Card className="gap-4 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Consultá durante el trabajo</h2>
            </div>

            <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto">
              {mensajes.map((m, i) => (
                <li
                  key={i}
                  className={cn(
                    'max-w-[92%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                    m.rol === 'ia'
                      ? 'bg-muted/70'
                      : 'self-end bg-primary text-primary-foreground',
                  )}
                >
                  {m.texto}
                </li>
              ))}
            </ul>

            <Separator />

            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MessageCircleQuestion className="size-3.5" aria-hidden="true" />
                Consultas frecuentes en este paso
              </span>
              {CONSULTAS_GUIA.filter((c) => !usadas.includes(c.pregunta)).map((c) => (
                <Button
                  key={c.pregunta}
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start py-1.5 text-left whitespace-normal"
                  onClick={() => consultar(c.pregunta, c.respuesta)}
                >
                  {c.pregunta}
                </Button>
              ))}
              {usadas.length === CONSULTAS_GUIA.length && (
                <p className="text-xs text-muted-foreground">
                  Todas las consultas de ejemplo fueron respondidas.
                </p>
              )}
            </div>
          </Card>

          <Card className="gap-3 p-5">
            <h2 className="font-display text-base font-semibold">¿Terminaste?</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cuando el trabajo esté listo, coordinás la devolución. La app avisa 24 h y 2 h antes
              del vencimiento para evitar multas por mora.
            </p>
            <Button onClick={onDevolver} disabled={!terminado} className="w-full">
              Ir a la devolución
            </Button>
            {!terminado && (
              <p className="text-xs text-muted-foreground">
                Recorré los {GUIA_PASOS.length} pasos de la guía para continuar.
              </p>
            )}
          </Card>
        </div>
      </div>
    </PasoLayout>
  )
}
