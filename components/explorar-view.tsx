'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HerramientaCard } from '@/components/herramienta-card'
import { useStore } from '@/components/store'
import { CATEGORIAS, YO, type Categoria } from '@/lib/tipos'
import { PlusCircle, Search, SlidersHorizontal, X } from 'lucide-react'

type Orden = 'distancia' | 'precio-asc' | 'precio-desc' | 'rating'

export function ExplorarView() {
  const { herramientas, usuario } = useStore()
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState<Categoria | 'todas'>('todas')
  const [orden, setOrden] = useState<Orden>('distancia')
  const [maxPrecio, setMaxPrecio] = useState('')
  const [soloInmediata, setSoloInmediata] = useState(false)

  const resultados = useMemo(() => {
    const texto = q.trim().toLowerCase()
    let lista = herramientas.filter((h) => h.publicada && h.duenoId !== YO)

    if (texto) {
      lista = lista.filter(
        (h) =>
          h.nombre.toLowerCase().includes(texto) ||
          h.categoria.toLowerCase().includes(texto) ||
          h.descripcion.toLowerCase().includes(texto),
      )
    }
    if (categoria !== 'todas') lista = lista.filter((h) => h.categoria === categoria)
    if (maxPrecio) lista = lista.filter((h) => h.precioDia <= Number(maxPrecio))
    if (soloInmediata) lista = lista.filter((h) => h.entregaInmediata)

    const ordenada = [...lista]
    if (orden === 'distancia') ordenada.sort((a, b) => a.distanciaM - b.distanciaM)
    if (orden === 'precio-asc') ordenada.sort((a, b) => a.precioDia - b.precioDia)
    if (orden === 'precio-desc') ordenada.sort((a, b) => b.precioDia - a.precioDia)
    if (orden === 'rating')
      ordenada.sort((a, b) => usuario(b.duenoId).rating - usuario(a.duenoId).rating)
    return ordenada
  }, [herramientas, q, categoria, maxPrecio, soloInmediata, orden, usuario])

  const hayFiltros = categoria !== 'todas' || !!maxPrecio || soloInmediata || !!q

  function limpiar() {
    setQ('')
    setCategoria('todas')
    setMaxPrecio('')
    setSoloInmediata(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-balance font-display text-2xl font-bold tracking-tight md:text-3xl">
            Alquilá la herramienta que necesitás, cerca tuyo
          </h1>
          <p className="text-pretty text-sm text-muted-foreground md:text-base">
            Herramientas de vecinos y ferreterías verificadas. Reservá por día, con garantía
            preautorizada y acta digital de estado.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Taladro, amoladora, escalera..."
              aria-label="Buscar herramienta"
              className="pl-9"
            />
          </div>
          <Button asChild variant="outline">
            <Link href="/publicar">
              <PlusCircle className="size-4" aria-hidden="true" />
              Publicar la mía
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoria === 'todas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoria('todas')}
          >
            Todas
          </Button>
          {CATEGORIAS.map((c) => (
            <Button
              key={c}
              variant={categoria === c ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoria(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
          Filtros
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="maxPrecio" className="text-xs">
            Precio máximo por día
          </Label>
          <Input
            id="maxPrecio"
            type="number"
            inputMode="numeric"
            min={0}
            value={maxPrecio}
            onChange={(e) => setMaxPrecio(e.target.value)}
            placeholder="Sin límite"
            className="h-9 w-36"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Ordenar por</Label>
          <Select value={orden} onValueChange={(v) => setOrden(v as Orden)}>
            <SelectTrigger className="h-9 w-44" aria-label="Ordenar resultados">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distancia">Más cerca</SelectItem>
              <SelectItem value="precio-asc">Precio: menor</SelectItem>
              <SelectItem value="precio-desc">Precio: mayor</SelectItem>
              <SelectItem value="rating">Mejor reputación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant={soloInmediata ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSoloInmediata((v) => !v)}
        >
          Entrega inmediata
        </Button>

        {hayFiltros && (
          <Button variant="ghost" size="sm" onClick={limpiar}>
            <X className="size-4" aria-hidden="true" />
            Limpiar
          </Button>
        )}

        <span className="ml-auto text-sm text-muted-foreground">
          {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </section>

      {resultados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No encontramos herramientas con esos filtros</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Probá ampliar la búsqueda o publicá la tuya para que otros vecinos la puedan alquilar.
          </p>
          <Button variant="outline" size="sm" onClick={limpiar}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((h) => (
            <HerramientaCard key={h.id} herramienta={h} />
          ))}
        </div>
      )}

      <section className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-secondary/50 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="w-fit">
            Ganá con lo que ya tenés
          </Badge>
          <h2 className="font-display text-lg font-bold">
            ¿Tenés herramientas guardadas sin usar?
          </h2>
          <p className="text-sm text-muted-foreground">
            Publicalas gratis, definí el precio por día y aceptá solo las solicitudes que quieras.
          </p>
        </div>
        <Button asChild>
          <Link href="/publicar">
            <PlusCircle className="size-4" aria-hidden="true" />
            Publicar herramienta
          </Link>
        </Button>
      </section>
    </div>
  )
}
