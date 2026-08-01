'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Camera, MapPin, ShieldCheck, FileSignature, Sparkles } from 'lucide-react'

const PILARES = [
  {
    icono: Camera,
    titulo: 'Diagnóstico por foto',
    texto:
      'Sacás una foto del problema y la IA te dice qué herramienta, qué insumos y qué protección necesitás.',
  },
  {
    icono: MapPin,
    titulo: 'Oferta hiperlocal',
    texto:
      'Vecinos con herramientas ociosas y ferreterías con stock de baja rotación, a metros de tu casa.',
  },
  {
    icono: ShieldCheck,
    titulo: 'Garantía preautorizada',
    texto:
      'No cobramos el depósito: lo retenemos. Si devolvés todo bien, se libera solo en menos de 24 horas.',
  },
  {
    icono: FileSignature,
    titulo: 'Acta digital firmada',
    texto:
      'Checklist con fotos y firma de ambas partes al entregar y al devolver. La disputa deja de ser tu palabra contra la suya.',
  },
]

export function InicioPaso({ onEmpezar }: { onEmpezar: () => void }) {
  return (
    <div className="flex flex-col gap-14 pb-20">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 md:grid-cols-2 md:pt-16">
        <div className="flex flex-col items-start gap-5">
          <Badge variant="secondary" className="gap-1.5">
            <Sparkles className="size-3" aria-hidden="true" />
            Prototipo navegable del flujo completo
          </Badge>
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance md:text-5xl">
            No necesitás un taladro. Necesitás el cuadro colgado.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-pretty text-muted-foreground">
            Prestá conecta a quien tiene una herramienta guardada con quien la necesita hoy. Con
            diagnóstico asistido por IA, identidad validada, garantía retenida y acta de estado
            firmada por ambas partes.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onEmpezar} className="h-11 px-5 text-[0.95rem]">
              <Camera aria-hidden="true" />
              Empezar el diagnóstico
            </Button>
            <span className="text-xs text-muted-foreground">
              No hace falta tarjeta para probarlo
            </span>
          </div>
          <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ['13 min', 'de uso promedio en la vida útil de un taladro'],
              ['3 mercados', 'vecino a vecino, ferretería y empresas'],
              ['< 24 h', 'para liberar la garantía retenida'],
            ].map(([valor, texto]) => (
              <div key={valor} className="flex flex-col">
                <dt className="font-display text-xl font-bold">{valor}</dt>
                <dd className="max-w-[9rem] text-xs leading-relaxed text-muted-foreground">
                  {texto}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Card className="relative overflow-hidden p-0">
          <Image
            src="/diagnostico/pared.png"
            alt="Pared interior con un cuadro apoyado en el zócalo, listo para colgar"
            width={900}
            height={900}
            className="h-72 w-full object-cover md:h-[26rem]"
            priority
          />
          <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-background/95 p-3 backdrop-blur">
            <p className="text-xs font-medium text-accent-foreground">Detectado por la IA</p>
            <p className="mt-1 text-sm leading-relaxed">
              Ladrillo hueco revocado. Vas a necesitar taladro percutor, mecha de widia 6 mm y
              tarugos tipo mariposa.
            </p>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="font-display text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Los cuatro pilares
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILARES.map((p) => (
            <Card key={p.titulo} className="gap-3 p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <p.icono className="size-4.5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-base font-semibold">{p.titulo}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
