'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { SignaturePad } from '@/components/signature-pad'
import {
  CHECKLIST_POR_CATEGORIA,
  EPP_POR_CATEGORIA,
  type Acta,
  type Categoria,
} from '@/lib/tipos'
import { TriangleAlert } from 'lucide-react'

type Props = {
  abierto: boolean
  onAbrir: (v: boolean) => void
  categoria: Categoria
  tipo: 'entrega' | 'devolucion'
  nombreContraparte: string
  onConfirmar: (acta: Acta, dano?: string) => void
}

export function ActaDialog({
  abierto,
  onAbrir,
  categoria,
  tipo,
  nombreContraparte,
  onConfirmar,
}: Props) {
  const items = CHECKLIST_POR_CATEGORIA[categoria]
  const [marcados, setMarcados] = useState<string[]>([])
  const [observaciones, setObservaciones] = useState('')
  const [firmaA, setFirmaA] = useState(false)
  const [firmaB, setFirmaB] = useState(false)
  const [error, setError] = useState('')

  const faltantes = items.filter((i) => !marcados.includes(i.id))
  const hayFallas = faltantes.length > 0

  function toggle(id: string) {
    setMarcados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function confirmar() {
    if (!firmaA || !firmaB) {
      setError('El acta requiere la firma de ambas partes.')
      return
    }
    if (hayFallas && observaciones.trim().length < 10) {
      setError('Hay ítems no verificados: describí el problema en las observaciones.')
      return
    }
    setError('')
    const acta: Acta = {
      fecha: new Date().toISOString().slice(0, 10),
      checklist: marcados,
      observaciones: observaciones.trim(),
      firmaDueno: true,
      firmaSolicitante: true,
    }
    onConfirmar(acta, tipo === 'devolucion' && hayFallas ? observaciones.trim() : undefined)
    onAbrir(false)
    setMarcados([])
    setObservaciones('')
    setFirmaA(false)
    setFirmaB(false)
  }

  return (
    <Dialog open={abierto} onOpenChange={onAbrir}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Acta digital de {tipo === 'entrega' ? 'entrega' : 'devolución'}
          </DialogTitle>
          <DialogDescription>
            Revisen juntos el estado de la herramienta y firmen ambos. El acta queda registrada con
            fecha y sirve como prueba ante cualquier disputa.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-2 rounded-lg border border-border bg-secondary/50 p-3">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              {EPP_POR_CATEGORIA[categoria]}
            </p>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-medium">Checklist de estado</legend>
            {items.map((i) => (
              <div key={i.id} className="flex items-start gap-2">
                <Checkbox
                  id={`chk-${tipo}-${i.id}`}
                  checked={marcados.includes(i.id)}
                  onCheckedChange={() => toggle(i.id)}
                />
                <Label
                  htmlFor={`chk-${tipo}-${i.id}`}
                  className="text-sm font-normal leading-snug"
                >
                  {i.label}
                </Label>
              </div>
            ))}
          </fieldset>

          {hayFallas && marcados.length > 0 && (
            <p className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              {faltantes.length} {faltantes.length === 1 ? 'ítem no verificado' : 'ítems no verificados'}.
              {tipo === 'devolucion'
                ? ' Esto abrirá una disputa y la garantía quedará retenida.'
                : ' Podés rechazar la entrega si el estado no coincide con la publicación.'}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`obs-${tipo}`} className="text-sm">
              Observaciones
            </Label>
            <Textarea
              id={`obs-${tipo}`}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalles del estado, rayones previos, accesorios faltantes..."
              rows={3}
            />
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <SignaturePad label="Firma del dueño" onChange={setFirmaA} />
            <SignaturePad label={`Firma de ${nombreContraparte}`} onChange={setFirmaB} />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onAbrir(false)}>
            Cancelar
          </Button>
          <Button onClick={confirmar}>Firmar y registrar acta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
