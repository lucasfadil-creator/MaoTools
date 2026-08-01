'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Camera, Check, Info, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CATEGORIAS, fmt, type Categoria, type Estado } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const IMAGENES = [
  { src: '/tools/taladro-percutor.png', label: 'Taladro' },
  { src: '/tools/amoladora.png', label: 'Amoladora' },
  { src: '/tools/lijadora-orbital.png', label: 'Lijadora' },
  { src: '/tools/sierra-circular.png', label: 'Sierra' },
  { src: '/tools/hidrolavadora.png', label: 'Hidrolavadora' },
  { src: '/tools/escalera.png', label: 'Escalera' },
  { src: '/tools/cortadora-ceramica.png', label: 'Cortadora' },
  { src: '/tools/soldadora.png', label: 'Soldadora' },
]

const EPP_OPCIONES = [
  'Antiparras',
  'Guantes',
  'Barbijo para polvo',
  'Protección auditiva',
  'Máscara facial',
  'Calzado cerrado',
]

const ESTADOS: Estado[] = ['Como nuevo', 'Muy bueno', 'Bueno']

export function PublicarForm() {
  const router = useRouter()
  const { publicar } = useStore()

  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState<Categoria>('Perforación')
  const [descripcion, setDescripcion] = useState('')
  const [imagen, setImagen] = useState(IMAGENES[0].src)
  const [precioDia, setPrecioDia] = useState(5000)
  const [valorCompra, setValorCompra] = useState(60000)
  const [estado, setEstado] = useState<Estado>('Muy bueno')
  const [incluye, setIncluye] = useState('')
  const [epp, setEpp] = useState<string[]>(['Antiparras'])
  const [inmediata, setInmediata] = useState(true)
  const [factura, setFactura] = useState(false)

  const garantiaSugerida = Math.round((valorCompra * 0.2) / 500) * 500
  const gananciaMensual = precioDia * 4
  const completo = nombre.trim().length > 2 && descripcion.trim().length > 10

  function toggleEpp(v: string) {
    setEpp((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
    )
  }

  function guardar() {
    if (!completo) {
      toast.error('Completá el nombre y una descripción de al menos 10 letras.')
      return
    }
    const id = publicar({
      nombre: nombre.trim(),
      categoria,
      descripcion: descripcion.trim(),
      imagen,
      precioDia,
      garantia: garantiaSugerida,
      estado,
      entregaInmediata: inmediata,
      factura,
      incluye: incluye
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      eppRequerido: epp,
    })
    toast.success('Publicada. Ya aparece en las búsquedas de tu zona.')
    router.push(`/herramienta/${id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-balance font-display text-2xl font-bold leading-tight">
          Publicá una herramienta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Poné a trabajar lo que tenés guardado. Vos definís el precio, la
          garantía y a quién se la prestás.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Qué vas a prestar</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nombre">Nombre de la herramienta</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Taladro percutor 750 W"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select
                    value={categoria}
                    onValueChange={(v) => setCategoria(v as Categoria)}
                  >
                    <SelectTrigger id="categoria" className="w-full">
                      <SelectValue>{(v: string) => v}</SelectValue>
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
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={estado}
                    onValueChange={(v) => setEstado(v as Estado)}
                  >
                    <SelectTrigger id="estado" className="w-full">
                      <SelectValue>{(v: string) => v}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
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
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Contá el estado real, para qué sirve y cualquier condición de uso."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="incluye">Accesorios incluidos</Label>
                <Input
                  id="incluye"
                  value={incluye}
                  onChange={(e) => setIncluye(e.target.value)}
                  placeholder="Separalos con comas: maletín, mecha 6 mm, manual"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Camera className="size-4 text-chart-2" aria-hidden="true" />
              Foto de la publicación
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              En el prototipo elegís una foto de catálogo. En producción se sube
              desde la cámara y se reconoce el modelo automáticamente.
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-8">
              {IMAGENES.map((img) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setImagen(img.src)}
                  aria-pressed={imagen === img.src}
                  aria-label={`Usar imagen de ${img.label}`}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border-2 bg-secondary transition-colors',
                    imagen === img.src
                      ? 'border-primary'
                      : 'border-transparent hover:border-border',
                  )}
                >
                  <Image
                    src={img.src || '/placeholder.svg'}
                    alt={img.label}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {imagen === img.src && (
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary">
                      <Check
                        className="size-3 text-primary-foreground"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">
              Protección obligatoria para quien la use
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              El locatario tiene que aceptar estas condiciones antes de firmar
              el acta de entrega. Es tu principal resguardo.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {EPP_OPCIONES.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleEpp(o)}
                  aria-pressed={epp.includes(o)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    epp.includes(o)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Precio y garantía</h2>

            <div className="mt-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="valor">Valor de compra aproximado</Label>
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  step={1000}
                  value={valorCompra}
                  onChange={(e) => setValorCompra(Number(e.target.value) || 0)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="precio">Precio por día</Label>
                <Input
                  id="precio"
                  type="number"
                  min={0}
                  step={100}
                  value={precioDia}
                  onChange={(e) => setPrecioDia(Number(e.target.value) || 0)}
                />
              </div>

              <div className="flex gap-2 rounded-lg bg-secondary p-3">
                <Sparkles
                  className="mt-0.5 size-4 shrink-0 text-chart-3"
                  aria-hidden="true"
                />
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Sugerimos cobrar entre{' '}
                  <strong>{fmt(Math.round(valorCompra * 0.05))}</strong> y{' '}
                  <strong>{fmt(Math.round(valorCompra * 0.09))}</strong> por
                  día, y retener{' '}
                  <strong>{fmt(garantiaSugerida)}</strong> de garantía (20% del
                  valor).
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="inmediata" className="text-xs font-normal">
                  Acepto entregas inmediatas
                </Label>
                <Switch
                  id="inmediata"
                  checked={inmediata}
                  onCheckedChange={setInmediata}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="factura" className="text-xs font-normal">
                  Puedo emitir factura
                </Label>
                <Switch
                  id="factura"
                  checked={factura}
                  onCheckedChange={setFactura}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-chart-2/30 bg-chart-2/5 p-5">
            <p className="text-xs text-muted-foreground">
              Si la alquilás 4 días al mes ganás
            </p>
            <p className="font-display text-2xl font-bold text-chart-2">
              {fmt(gananciaMensual)}
              <span className="text-sm font-normal text-muted-foreground">
                {' '}
                /mes
              </span>
            </p>
            <p className="mt-2 flex gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
              La plataforma cobra 8% al locatario. Vos recibís el monto completo
              del alquiler al cerrarse la devolución.
            </p>
          </section>

          <Button onClick={guardar} disabled={!completo} size="lg">
            Publicar herramienta
          </Button>
        </aside>
      </div>
    </div>
  )
}
