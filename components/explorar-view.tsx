'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { LayoutGrid, Map, PlusCircle, Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIAS } from '@/lib/data'
import { useStore } from '@/lib/store'
import { HerramientaCard } from '@/components/herramienta-card'
import { MapaZona } from '@/components/mapa-zona'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Orden = 'cerca' | 'precio' | 'rating'

const ORDENES: Record<Orden, string> = {
  cerca: 'Más cerca',
  precio: 'Menor precio',
  rating: 'Mejor reputación',
}

export function ExplorarView() {
  const { herramientas, usuario, comoLocatario, pendientesDeRespuesta } =
    useStore()
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState<string>('todas')
  const [orden, setOrden] = useState<Orden>('cerca')
  const [soloInmediata, setSoloInmediata] = useState(false)
  const [vista, setVista] = useState<'lista' | 'mapa'>('lista')
  const [pin, setPin] = useState<string>()

  const resultados = useMemo(() => {
    const texto = q.trim().toLowerCase()
    const lista = herramientas.filter((h) => {
      if (!h.publicada) return false
      if (categoria !== 'todas' && h.categoria !== categoria) return false
      if (soloInmediata && !h.entregaInmediata) return false
      if (!texto) return true
      return (
        h.nombre.toLowerCase().includes(texto) ||
        h.categoria.toLowerCase().includes(texto) ||
        h.descripcion.toLowerCase().includes(texto) ||
        usuario(h.duenoId).nombre.toLowerCase().includes(texto)
      )
    })
    return [...lista].sort((a, b) => {
      if (orden === 'precio') return a.precioDia - b.precioDia
      if (orden === 'rating')
        return usuario(b.duenoId).rating - usuario(a.duenoId).rating
      return a.distanciaM - b.distanciaM
    })
  }, [herramientas, q, categoria, soloInmediata, orden, usuario])

  const enCurso = comoLocatario.filter((o) => o.estado === 'en_curso').length

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-lg">
            <h1 className="text-balance font-display text-2xl font-bold leading-tight">
              Alquilá la herramienta que necesitás, prestá la que no usás
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Vecinos y ferreterías de tu zona. Identidad verificada, garantía
              retenida y acta digital en cada entrega.
            </p>
          </div>
          <Link href="/publicar" className={buttonVariants()}>
            <PlusCircle className="size-4" aria-hidden="true" />
            Publicar una herramienta
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/actividad"
            className="rounded-lg border border-border px-3 py-2 hover:bg-secondary"
          >
            <span className="block text-base font-bold">{enCurso}</span>
            <span className="text-muted-foreground">alquileres en curso</span>
          </Link>
          <Link
            href="/actividad"
            className="rounded-lg border border-border px-3 py-2 hover:bg-secondary"
          >
            <span className="block text-base font-bold">
              {pendientesDeRespuesta}
            </span>
            <span className="text-muted-foreground">
              solicitudes esperando tu respuesta
            </span>
          </Link>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-56 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscá taladro, escalera, hidrolavadora…"
              aria-label="Buscar herramientas"
              className="pl-9"
            />
          </div>

          <Select value={orden} onValueChange={(v) => setOrden(v as Orden)}>
            <SelectTrigger className="w-44" aria-label="Ordenar por">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              <SelectValue>{(v: Orden) => ORDENES[v]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ORDENES) as Orden[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {ORDENES[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
            <Switch
              id="inmediata"
              checked={soloInmediata}
              onCheckedChange={setSoloInmediata}
            />
            <Label htmlFor="inmediata" className="text-xs">
              Entrega inmediata
            </Label>
          </div>

          <div className="flex overflow-hidden rounded-md border border-border">
            <button
              type="button"
              onClick={() => setVista('lista')}
              aria-pressed={vista === 'lista'}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium',
                vista === 'lista'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <LayoutGrid className="size-4" aria-hidden="true" />
              Lista
            </button>
            <button
              type="button"
              onClick={() => setVista('mapa')}
              aria-pressed={vista === 'mapa'}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-xs font-medium',
                vista === 'mapa'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <Map className="size-4" aria-hidden="true" />
              Mapa
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['todas', ...CATEGORIAS].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              aria-pressed={categoria === c}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                categoria === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground',
              )}
            >
              {c === 'todas' ? 'Todas' : c}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-3 text-xs text-muted-foreground">
          {resultados.length} herramientas disponibles en tu zona
        </p>

        {vista === 'mapa' ? (
          <MapaZona
            herramientas={resultados}
            seleccionada={pin}
            onSeleccionar={setPin}
          />
        ) : resultados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-10 text-center">
            <p className="text-sm font-medium">
              No hay herramientas que coincidan con tu búsqueda
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Probá quitar filtros, o publicá la tuya para que otros la
              encuentren.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((h) => (
              <HerramientaCard key={h.id} h={h} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
