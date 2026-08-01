'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PasoLayout } from '@/components/paso-layout'
import { SignaturePad } from '@/components/signature-pad'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { CHECKLIST_TALADRO, fmt, type Proveedor } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Check,
  Clock3,
  FileSignature,
  ScanSearch,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'

export type ResultadoCheckout = 'sin-novedades' | 'disputa'

type Props = {
  proveedor: Proveedor
  onCerrar: (resultado: ResultadoCheckout) => void
}

export function CheckoutPaso({ proveedor, onCerrar }: Props) {
  const [marcados, setMarcados] = useState<Record<string, boolean>>({})
  const [modo, setModo] = useState<'ok' | 'dano' | null>(null)
  const [descripcion, setDescripcion] = useState('')
  const [comparado, setComparado] = useState(false)
  const [firmaLocatario, setFirmaLocatario] = useState(false)
  const [firmaPrestamista, setFirmaPrestamista] = useState(false)

  const checklistCompleto = CHECKLIST_TALADRO.every((i) => marcados[i.id])
  const listoOk = modo === 'ok' && checklistCompleto && firmaLocatario && firmaPrestamista
  const listoDano = modo === 'dano' && comparado && descripcion.trim().length > 8

  return (
    <PasoLayout
      etiqueta="Paso 7 · Acta digital de devolución"
      titulo="Check-out: el mismo checklist, contra la evidencia del check-in"
      descripcion="La devolución no es un botón de confirmación: es la comparación contra el acta inicial. De acá salen las dos ramas críticas del negocio, la liberación automática de la garantía y la disputa."
      ancho="ancho"
    >
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold">
                Revisión de estado al devolver
              </h2>
              <Badge variant={checklistCompleto ? 'default' : 'secondary'}>
                {Object.values(marcados).filter(Boolean).length}/{CHECKLIST_TALADRO.length}
              </Badge>
            </div>
            <ul className="flex flex-col gap-3">
              {CHECKLIST_TALADRO.map((i) => (
                <li key={i.id} className="flex items-start gap-3">
                  <Checkbox
                    id={`out-${i.id}`}
                    checked={!!marcados[i.id]}
                    onCheckedChange={(v) => setMarcados((m) => ({ ...m, [i.id]: v === true }))}
                    className="mt-0.5"
                  />
                  <label htmlFor={`out-${i.id}`} className="flex cursor-pointer flex-col gap-0.5">
                    <span className="text-sm font-medium">{i.label}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {i.detalle}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="gap-4 p-5">
            <h2 className="font-display text-base font-semibold">
              ¿Cómo cierra {proveedor.nombre} la devolución?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setModo('ok')}
                className={cn(
                  'flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  modo === 'ok' ? 'border-primary bg-muted/50' : 'border-border hover:bg-muted/40',
                )}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <ShieldCheck className="size-4 text-accent-foreground" aria-hidden="true" />
                  Sin novedades
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  La herramienta vuelve como salió. Se libera la garantía y se paga al prestamista.
                </span>
              </button>

              <button
                onClick={() => setModo('dano')}
                className={cn(
                  'flex flex-col gap-1.5 rounded-xl border p-4 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                  modo === 'dano'
                    ? 'border-destructive bg-destructive/10'
                    : 'border-border hover:bg-muted/40',
                )}
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <TriangleAlert className="size-4 text-destructive" aria-hidden="true" />
                  Reportar un daño
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  Se mantiene la garantía retenida y se abre una disputa con plazos y evidencia.
                </span>
              </button>
            </div>
          </Card>

          {modo === 'dano' && (
            <Card className="gap-4 border-destructive/40 p-5">
              <h2 className="font-display text-base font-semibold">Evidencia del daño</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Check-in · mandril', src: '/tools/amoladora.png' },
                  { label: 'Check-out · mandril', src: '/tools/taladro-percutor.png' },
                ].map((f) => (
                  <figure key={f.label} className="overflow-hidden rounded-lg border border-border">
                    <Image
                      src={f.src || '/placeholder.svg'}
                      alt={f.label}
                      width={300}
                      height={200}
                      className="h-28 w-full object-cover"
                    />
                    <figcaption className="px-2.5 py-1.5 text-xs text-muted-foreground">
                      {f.label}
                    </figcaption>
                  </figure>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => setComparado(true)}
                disabled={comparado}
              >
                <ScanSearch aria-hidden="true" />
                Comparar con la IA
              </Button>

              {comparado && (
                <p className="rounded-lg border border-border bg-muted/50 p-3 text-xs leading-relaxed">
                  <strong>Análisis comparativo:</strong> se detecta una diferencia en la zona del
                  mandril respecto del acta de entrega. La IA aporta el indicio, no dicta el
                  veredicto: la resolución queda en manos de la mediación con la evidencia de ambas
                  partes.
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="detalle-dano" className="text-sm font-medium">
                  Descripción del daño
                </label>
                <Textarea
                  id="detalle-dano"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="El mandril quedó desalineado y no ajusta mechas de 6 mm."
                  rows={3}
                />
              </div>
            </Card>
          )}

          {modo === 'ok' && (
            <Card className={cn('gap-4 p-5', !checklistCompleto && 'opacity-60')}>
              <div className="flex items-center gap-2">
                <FileSignature className="size-4 text-muted-foreground" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold">
                  Firma bilateral de devolución
                </h2>
              </div>
              {checklistCompleto ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <SignaturePad label="Julia M. · locataria" onChange={setFirmaLocatario} />
                  <SignaturePad
                    label={`${proveedor.nombre} · prestamista`}
                    onChange={setFirmaPrestamista}
                  />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Completá el checklist para habilitar las firmas.
                </p>
              )}
            </Card>
          )}
        </div>

        <Card className="h-fit gap-4 p-5 lg:sticky lg:top-36">
          <h2 className="font-display text-base font-semibold">Acta #PR-4821-OUT</h2>

          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Devolución</span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-3.5" aria-hidden="true" />
                En plazo
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Multa por mora</span>
              <span className="tabular-nums">{fmt(0)}</span>
            </li>
            <li className="flex justify-between gap-2">
              <span className="text-muted-foreground">Garantía retenida</span>
              <span className="tabular-nums">{fmt(proveedor.garantia)}</span>
            </li>
          </ul>

          <Separator />

          <ul className="flex flex-col gap-2 text-sm">
            {[
              ['Checklist revisado', checklistCompleto],
              ['Cierre seleccionado', modo !== null],
              [
                'Firmas o evidencia',
                modo === 'ok' ? firmaLocatario && firmaPrestamista : listoDano,
              ],
            ].map(([label, ok]) => (
              <li key={label as string} className="flex items-center justify-between gap-2">
                <span className={ok ? 'text-foreground' : 'text-muted-foreground'}>
                  {label as string}
                </span>
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full',
                    ok ? 'bg-accent text-accent-foreground' : 'bg-muted',
                  )}
                >
                  {ok ? <Check className="size-2.5" aria-hidden="true" /> : null}
                </span>
              </li>
            ))}
          </ul>

          {modo === 'dano' ? (
            <Button
              variant="destructive"
              disabled={!listoDano}
              onClick={() => onCerrar('disputa')}
              className="w-full"
            >
              Abrir disputa y retener garantía
            </Button>
          ) : (
            <Button disabled={!listoOk} onClick={() => onCerrar('sin-novedades')} className="w-full">
              Cerrar devolución sin novedades
            </Button>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground">
            El desgaste normal corre por cuenta del prestamista; el mal uso, por cuenta del
            locatario. El checklist firmado es lo que permite distinguirlos.
          </p>
        </Card>
      </div>
    </PasoLayout>
  )
}
