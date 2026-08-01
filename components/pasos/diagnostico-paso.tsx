'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PasoLayout } from '@/components/paso-layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { DIAGNOSTICO, PREGUNTAS_IA } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Camera, ImageUp, Loader2, ScanSearch, Check } from 'lucide-react'

const ETAPAS = [
  'Analizando la imagen',
  'Identificando material de la superficie',
  'Infiriendo la tarea a resolver',
  'Cruzando con disponibilidad en tu zona',
]

type Props = {
  onContinuar: (respuestas: Record<string, string>) => void
}

export function DiagnosticoPaso({ onContinuar }: Props) {
  const [foto, setFoto] = useState<string | null>(null)
  const [fase, setFase] = useState<'subir' | 'analizando' | 'preguntas'>('subir')
  const [etapa, setEtapa] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (fase !== 'analizando') return
    const t = setInterval(() => {
      setEtapa((e) => {
        if (e >= ETAPAS.length - 1) {
          clearInterval(t)
          setTimeout(() => setFase('preguntas'), 500)
          return e
        }
        return e + 1
      })
    }, 650)
    return () => clearInterval(t)
  }, [fase])

  function analizar(url: string) {
    setFoto(url)
    setEtapa(0)
    setFase('analizando')
  }

  const completas = PREGUNTAS_IA.every((p) => respuestas[p.id])

  return (
    <PasoLayout
      etiqueta="Paso 1 · Módulo de IA"
      titulo="Contale el problema a la IA, no el nombre de la herramienta"
      descripcion="Este es el punto de entrada del producto: el usuario rara vez sabe qué herramienta necesita, pero siempre sabe qué problema tiene. La IA traduce el problema en una lista accionable."
    >
      {fase === 'subir' && (
        <Card className="gap-5 p-6">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Camera className="size-6" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="font-display text-base font-semibold">
                Subí de 1 a 5 fotos de lo que querés resolver
              </p>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                Mostrá la superficie y el objeto. Cuanto mejor se vea el material, más precisa es
                la recomendación.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button onClick={() => analizar('/diagnostico/pared.png')}>
                <ScanSearch aria-hidden="true" />
                Usar la foto de ejemplo
              </Button>
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                <ImageUp aria-hidden="true" />
                Subir una foto propia
              </Button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) analizar(URL.createObjectURL(file))
                }}
              />
            </div>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            En el prototipo el análisis está simulado con una respuesta fija. En producción esto
            corre contra un modelo de visión, con derivación a un profesional matriculado cuando
            detecta tareas de riesgo alto (gas, tablero eléctrico o estructural).
          </p>
        </Card>
      )}

      {fase !== 'subir' && foto && (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_1.2fr]">
          <Card className="overflow-hidden p-0">
            <Image
              src={foto || '/placeholder.svg'}
              alt="Foto del problema a resolver enviada al diagnóstico"
              width={600}
              height={600}
              unoptimized
              className="h-full max-h-72 w-full object-cover"
            />
          </Card>

          <Card className="gap-4 p-5">
            {fase === 'analizando' ? (
              <>
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
                  <p className="font-display text-sm font-semibold">Procesando</p>
                </div>
                <Progress value={((etapa + 1) / ETAPAS.length) * 100} />
                <ul className="flex flex-col gap-2">
                  {ETAPAS.map((e, i) => (
                    <li
                      key={e}
                      className={cn(
                        'flex items-center gap-2 text-sm transition-opacity',
                        i > etapa ? 'text-muted-foreground opacity-50' : 'text-foreground',
                      )}
                    >
                      {i < etapa ? (
                        <Check className="size-3.5 text-accent-foreground" aria-hidden="true" />
                      ) : (
                        <span className="size-3.5 rounded-full border border-current" />
                      )}
                      {e}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-accent text-accent-foreground">
                    {DIAGNOSTICO.material}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Confianza {Math.round(DIAGNOSTICO.confianza * 100)}%
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  Detecté que querés <strong>{DIAGNOSTICO.tarea.toLowerCase()}</strong>. Antes de
                  recomendarte nada necesito confirmar dos cosas.
                </p>

                <div className="flex flex-col gap-4">
                  {PREGUNTAS_IA.map((p) => (
                    <fieldset key={p.id} className="flex flex-col gap-2">
                      <legend className="text-sm font-medium">{p.texto}</legend>
                      <p className="text-xs text-muted-foreground">{p.ayuda}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.opciones.map((o) => (
                          <Button
                            key={o}
                            size="sm"
                            variant={respuestas[p.id] === o ? 'default' : 'outline'}
                            onClick={() => setRespuestas((r) => ({ ...r, [p.id]: o }))}
                          >
                            {o}
                          </Button>
                        ))}
                      </div>
                    </fieldset>
                  ))}
                </div>

                <Button
                  disabled={!completas}
                  onClick={() => onContinuar(respuestas)}
                  className="mt-1 self-start"
                >
                  Ver qué necesito
                </Button>
                {!completas && (
                  <p className="text-xs text-muted-foreground">
                    Respondé las dos preguntas para continuar.
                  </p>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </PasoLayout>
  )
}
