import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

type Props = {
  etiqueta: string
  titulo: string
  descripcion: string
  children: ReactNode
  ancho?: 'normal' | 'ancho'
}

export function PasoLayout({
  etiqueta,
  titulo,
  descripcion,
  children,
  ancho = 'normal',
}: Props) {
  return (
    <main
      className={`mx-auto flex w-full flex-col gap-6 px-4 py-8 pb-20 ${
        ancho === 'ancho' ? 'max-w-6xl' : 'max-w-3xl'
      }`}
    >
      <header className="flex flex-col items-start gap-2">
        <Badge variant="secondary">{etiqueta}</Badge>
        <h1 className="font-display text-2xl leading-tight font-bold tracking-tight text-balance md:text-3xl">
          {titulo}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
          {descripcion}
        </p>
      </header>
      {children}
    </main>
  )
}
