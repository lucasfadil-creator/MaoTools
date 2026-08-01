'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useStore } from '@/components/store'
import {
  CATEGORIAS,
  ESTADOS,
  fmt,
  garantiaDe,
  IMAGENES_SUGERIDAS,
  type Categoria,
  type Herramienta,
} from '@/lib/tipos'
import { ImageIcon, Plus, ShieldCheck, X } from 'lucide-react'

export function PublicarForm() {
  const router = useRouter()
  const { publicar } = useStore()

  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('Perforación')
  const [descripcion, setDescripcion] = useState('')
  const [estado, setEstado] = useState<Herramienta['estado']>('Muy bueno')
  const [precioDia, setPrecioDia] = useState('')
  const [valorMercado, setValorMercado] = useState('')
  const [imagen, setImagen] = useState(IMAGENES_SUGERIDAS[0].src)
  const [incluye, setIncluye] = useState<string[]>([])
  const [accesorio, setAccesorio] = useState('')
  const [entregaInmediata, setEntregaInmediata] = useState(true)
  const [factura, setFactura] = useState(false)
  const [errores, setErrores] = useState<Record<string, string>>({})

  const precioSugerido = useMemo(() => {
    const v = Number(valorMercado)
    return v > 0 ? Math.round((v * 0.065) / 100) * 100 : 0
  }, [valorMercado])

  const garantiaEstimada = useMemo(() => {
    const v = Number(valorMercado)
    if (!v) return 0
    return garantiaDe({ valorMercado: v } as Herramienta, 5)
  }, [valorMercado])

  function agregarAccesorio() {
    const val = accesorio.trim()
    if (!val || incluye.includes(val)) return
    setIncluye((prev) => [...prev, val])
    setAccesorio('')
  }

  function validar() {
    const e: Record<string, string> = {}
    if (nombre.trim().length < 4) e.nombre = 'Poné un nombre descriptivo (mínimo 4 caracteres).'
    if (descripcion.trim().length < 20)
      e.descripcion = 'Describí la herramienta con al menos 20 caracteres.'
    if (!precioDia || Number(precioDia) <= 0) e.precioDia = 'Ingresá un precio por día mayor a cero.'
    if (!valorMercado || Number(valorMercado) <= 0)
      e.valorMercado = 'Necesitamos el valor de mercado para calcular la garantía.'
    setErrores(e)
    return Object.keys(e).length === 0
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    const id = publicar({
      nombre: nombre.trim(),
      categoria,
      descripcion: descripcion.trim(),
      imagen,
      estado,
      precioDia: Number(precioDia),
      valorMercado: Number(valorMercado),
      incluye,
      publicada: true,
      entregaInmediata,
      factura,
    })
    router.push(`/herramienta/${id}`)
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="outline" className="w-fit">
          Publicar
        </Badge>
        <h1 className="text-balance font-display text-2xl font-bold tracking-tight md:text-3xl">
          Poné a trabajar una herramienta que tenés guardada
        </h1>
        <p className="text-sm text-muted-foreground">
          Publicar es gratis. Solo cobramos comisión cuando concretás un alquiler.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datos de la herramienta</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Taladro percutor 750 W"
                  aria-invalid={!!errores.nombre}
                />
                {errores.nombre && (
                  <p role="alert" className="text-xs text-destructive">
                    {errores.nombre}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label>Categoría</Label>
                  <Select value={categoria} onValueChange={(v) => setCategoria(v as Categoria)}>
                    <SelectTrigger aria-label="Categoría">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Estado</Label>
                  <Select
                    value={estado}
                    onValueChange={(v) => setEstado(v as Herramienta['estado'])}
                  >
                    <SelectTrigger aria-label="Estado">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Para qué sirve, en qué condiciones está y qué conviene saber antes de usarla."
                  rows={4}
                  aria-invalid={!!errores.descripcion}
                />
                {errores.descripcion && (
                  <p role="alert" className="text-xs text-destructive">
                    {errores.descripcion}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                Foto
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Elegí la imagen que mejor represente tu herramienta.
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {IMAGENES_SUGERIDAS.map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setImagen(img.src)}
                    aria-pressed={imagen === img.src}
                    aria-label={`Usar imagen de ${img.label}`}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      imagen === img.src ? 'border-primary' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <Image
                      src={img.src || '/placeholder.svg'}
                      alt={img.label}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Qué incluye</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  value={accesorio}
                  onChange={(e) => setAccesorio(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                      e.preventDefault()
                      agregarAccesorio()
                    }
                  }}
                  placeholder="Ej: Maletín, mecha 6 mm, manual"
                  aria-label="Agregar accesorio incluido"
                />
                <Button type="button" variant="outline" onClick={agregarAccesorio}>
                  <Plus className="size-4" aria-hidden="true" />
                  Agregar
                </Button>
              </div>
              {incluye.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {incluye.map((i) => (
                    <Badge key={i} variant="secondary" className="gap-1 pr-1">
                      {i}
                      <button
                        type="button"
                        onClick={() => setIncluye((prev) => prev.filter((x) => x !== i))}
                        aria-label={`Quitar ${i}`}
                        className="rounded-sm hover:text-destructive"
                      >
                        <X className="size-3" aria-hidden="true" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Precio y garantía</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="valorMercado">Valor de compra aproximado</Label>
                <Input
                  id="valorMercado"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={valorMercado}
                  onChange={(e) => setValorMercado(e.target.value)}
                  placeholder="98000"
                  aria-invalid={!!errores.valorMercado}
                />
                {errores.valorMercado && (
                  <p role="alert" className="text-xs text-destructive">
                    {errores.valorMercado}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="precioDia">Precio por día</Label>
                <Input
                  id="precioDia"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={precioDia}
                  onChange={(e) => setPrecioDia(e.target.value)}
                  placeholder="6500"
                  aria-invalid={!!errores.precioDia}
                />
                {errores.precioDia && (
                  <p role="alert" className="text-xs text-destructive">
                    {errores.precioDia}
                  </p>
                )}
                {precioSugerido > 0 && (
                  <button
                    type="button"
                    onClick={() => setPrecioDia(String(precioSugerido))}
                    className="w-fit text-xs text-primary underline-offset-2 hover:underline"
                  >
                    Usar precio sugerido: {fmt(precioSugerido)} por día
                  </button>
                )}
              </div>

              {garantiaEstimada > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-accent p-3 text-accent-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p className="text-xs leading-relaxed">
                    Se preautorizará una garantía de hasta{' '}
                    <strong>{fmt(garantiaEstimada)}</strong> en la tarjeta de quien alquile.
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="inmediata"
                    checked={entregaInmediata}
                    onCheckedChange={(v) => setEntregaInmediata(v === true)}
                  />
                  <Label htmlFor="inmediata" className="text-sm font-normal leading-snug">
                    Entrega inmediata: puedo coordinar el mismo día
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="factura"
                    checked={factura}
                    onCheckedChange={(v) => setFactura(v === true)}
                  />
                  <Label htmlFor="factura" className="text-sm font-normal leading-snug">
                    Puedo emitir factura
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Publicar herramienta
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Vas a poder aceptar o rechazar cada solicitud antes de entregarla.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
