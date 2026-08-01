'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Camera, CircleAlert, MapPin, ShieldCheck } from 'lucide-react'
import {
  CHECKLIST_BASE,
  fmt,
  type Herramienta,
  type Operacion,
} from '@/lib/data'
import { useStore } from '@/lib/store'
import { SignaturePad } from '@/components/signature-pad'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type Props = {
  op: Operacion
  h: Herramienta
  tipo: 'entrega' | 'devolucion'
  abierto: boolean
  onOpenChange: (v: boolean) => void
}

export function ActaDialog({ op, h, tipo, abierto, onOpenChange }: Props) {
  const { registrarActa, usuario } = useStore()
  const esEntrega = tipo === 'entrega'
  const soyDueno = op.duenoId === 'yo'
  const contraparte = usuario(soyDueno ? op.locatarioId : op.duenoId)

  const [aceptaEpp, setAceptaEpp] = useState(false)
  const [items, setItems] = useState<string[]>([])
  const [fotos, setFotos] = useState(0)
  const [nota, setNota] = useState('')
  const [novedad, setNovedad] = useState(false)
  const [firmaA, setFirmaA] = useState(false)
  const [firmaB, setFirmaB] = useState(false)

  const eppOk = !esEntrega || aceptaEpp
  const checklistOk = novedad || items.length === CHECKLIST_BASE.length
  const puedeCerrar = eppOk && checklistOk && fotos >= 2 && firmaA && firmaB

  function toggle(id: string) {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function cerrar() {
    registrarActa(op.id, tipo, {
      fecha: new Date().toISOString().slice(0, 10),
      items,
      nota,
      firmaDueno: true,
      firmaLocatario: true,
      novedad,
    })
    onOpenChange(false)
    toast.success(
      esEntrega
        ? 'Acta de entrega firmada. El alquiler está en curso.'
        : novedad
          ? 'Disputa abierta. La garantía queda retenida hasta la resolución.'
          : `Devolución cerrada. Se libera la garantía de ${fmt(op.garantia)}.`,
    )
  }

  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {esEntrega ? 'Acta de entrega' : 'Acta de devolución'}
          </DialogTitle>
          <DialogDescription>
            {h.nombre} · con {contraparte.nombre}. Ambas partes revisan, dejan
            constancia y firman.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          {esEntrega && (
            <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CircleAlert
                  className="size-4 text-destructive"
                  aria-hidden="true"
                />
                Condiciones de uso seguro
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
                {h.eppRequerido.map((e) => (
                  <li key={e}>· {e} obligatorio durante todo el uso</li>
                ))}
                <li>
                  · No modificar la herramienta ni retirarle las protecciones
                </li>
              </ul>
              <div className="mt-3 flex items-start gap-2">
                <Checkbox
                  id="epp"
                  checked={aceptaEpp}
                  onCheckedChange={(v) => setAceptaEpp(v === true)}
                />
                <Label
                  htmlFor="epp"
                  className="text-xs font-normal leading-relaxed"
                >
                  Leí y acepto las condiciones. Entiendo que la plataforma es
                  intermediaria y no responde por el uso que le dé.
                </Label>
              </div>
            </section>
          )}

          <section>
            <p className="text-sm font-semibold">Checklist de estado</p>
            <div className="mt-2 flex flex-col gap-2.5">
              {CHECKLIST_BASE.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Checkbox
                    id={`${tipo}-${c.id}`}
                    checked={items.includes(c.id)}
                    onCheckedChange={() => toggle(c.id)}
                  />
                  <Label
                    htmlFor={`${tipo}-${c.id}`}
                    className="flex flex-col items-start gap-0.5 text-xs font-normal"
                  >
                    <span className="font-medium">{c.label}</span>
                    <span className="text-muted-foreground">{c.detalle}</span>
                  </Label>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm font-semibold">Evidencia fotográfica</p>
            <p className="text-xs text-muted-foreground">
              Mínimo 2 fotos. Quedan selladas con hora y ubicación.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFotos((f) => Math.min(4, f + 1))}
              >
                <Camera className="size-4" aria-hidden="true" />
                Tomar foto
              </Button>
              {Array.from({ length: fotos }).map((_, i) => (
                <span
                  key={i}
                  className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary text-xs font-medium"
                >
                  {i + 1}
                </span>
              ))}
            </div>
            {fotos > 0 && (
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="size-3" aria-hidden="true" />
                Villa Crespo · {new Date().toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </section>

          {!esEntrega && (
            <section className="rounded-lg border border-border p-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="novedad"
                  checked={novedad}
                  onCheckedChange={(v) => setNovedad(v === true)}
                />
                <Label
                  htmlFor="novedad"
                  className="text-xs font-normal leading-relaxed"
                >
                  Hay una novedad respecto del acta de entrega (daño, faltante o
                  desgaste no previsto)
                </Label>
              </div>
              {novedad && (
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
                  Se abre una disputa: la garantía de {fmt(op.garantia)} queda
                  retenida y la otra parte tiene 48 h para presentar evidencia
                  antes de que medie la plataforma.
                </p>
              )}
            </section>
          )}

          <section className="flex flex-col gap-1.5">
            <Label htmlFor="nota" className="text-sm font-semibold">
              Observaciones
            </Label>
            <Textarea
              id="nota"
              rows={2}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej: se entrega con el disco de corte ya desgastado."
            />
          </section>

          <Separator />

          <section className="grid gap-4 sm:grid-cols-2">
            <SignaturePad
              label={soyDueno ? 'Tu firma (dueño)' : `Firma de ${contraparte.nombre}`}
              onChange={setFirmaA}
            />
            <SignaturePad
              label={soyDueno ? `Firma de ${contraparte.nombre}` : 'Tu firma (locatario)'}
              onChange={setFirmaB}
            />
          </section>

          <div className="flex gap-2 rounded-lg bg-secondary p-3">
            <ShieldCheck
              className="mt-0.5 size-4 shrink-0 text-chart-2"
              aria-hidden="true"
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {esEntrega
                ? `Al firmar, la garantía de ${fmt(op.garantia)} queda preautorizada y el alquiler pasa a estar en curso.`
                : `Sin novedades, la garantía de ${fmt(op.garantia)} se libera dentro de las 24 h y se acredita el pago al dueño.`}
            </p>
          </div>

          <Button onClick={cerrar} disabled={!puedeCerrar} size="lg">
            {esEntrega
              ? 'Firmar acta y comenzar alquiler'
              : novedad
                ? 'Cerrar con disputa'
                : 'Cerrar devolución y liberar garantía'}
          </Button>
          {!puedeCerrar && (
            <p className="-mt-2 text-center text-[11px] text-muted-foreground">
              Faltan: {!eppOk && 'aceptar condiciones · '}
              {!checklistOk && 'completar el checklist · '}
              {fotos < 2 && 'al menos 2 fotos · '}
              {(!firmaA || !firmaB) && 'ambas firmas'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
