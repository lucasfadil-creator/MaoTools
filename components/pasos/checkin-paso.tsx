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
import { CHECKLIST_TALADRO, type Proveedor } from '@/lib/data'
import { cn } from '@/lib/utils'
import {
  Camera,
  Check,
  FileSignature,
  HardHat,
  MapPin,
  QrCode,
  ShieldAlert,
  Clock3,
} from 'lucide-react'

const FOTOS = [
  { id: 'general', label: 'Vista general', src: '/tools/taladro-percutor.png' },
  { id: 'mandril', label: 'Mandril y mecha', src: '/tools/amoladora.png' },
  { id: 'cable', label: 'Cable y ficha', src: '/tools/lijadora-orbital.png' },
]

type Props = {
  proveedor: Proveedor
  onFirmado: () => void
}

export function CheckinPaso({ proveedor, onFirmado }: Props) {
  const [eppAceptado, setEppAceptado] = useState(false)
  const [escaneado, setEscaneado] = useState(false)
  const [marcados, setMarcados] = useState<Record<string, boolean>>({})
  const [fotos, setFotos] = useState<string[]>([])
  const [firmaLocatario, setFirmaLocatario] = useState(false)
  const [firmaPrestamista, setFirmaPrestamista] = useState(false)

  const checklistCompleto = CHECKLIST_TALADRO.every((i) => marcados[i.id])
  const fotosCompletas = fotos.length === FOTOS.length
  const puedeFirmar = escaneado && checklistCompleto && fotosCompletas
  const listo = puedeFirmar && firmaLocatario && firmaPrestamista

  if (!eppAceptado) {
    return (
      <PasoLayout
        etiqueta="Paso 5 · Antes de la entrega"
        titulo="Advertencia de seguridad obligatoria"
        descripcion="Esta pantalla no se puede saltear. Es la pieza que sostiene el deslinde de responsabilidad por daño físico: el usuario reconoce el riesgo y el EPP requerido antes de recibir la herramienta."
      >
        <Card className="gap-5 border-destructive/40 p-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <ShieldAlert className="size-4.5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-lg font-semibold">
              Taladro percutor · riesgo de proyección de partículas
            </h2>
          </div>

          <ul className="flex flex-col gap-3">
            {[
              'Usá antiparras durante toda la perforación. La percusión sobre revoque desprende esquirlas.',
              'No perfores en línea directa con enchufes, llaves de luz o canillas: puede haber cables o caños.',
              'Desenchufá la herramienta antes de cambiar la mecha.',
              'Prestá es intermediario: el uso de la herramienta es responsabilidad exclusiva de quien la opera.',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed">
                <HardHat
                  className="mt-0.5 size-4 shrink-0 text-destructive"
                  aria-hidden="true"
                />
                {t}
              </li>
            ))}
          </ul>

          <Separator />

          <Button onClick={() => setEppAceptado(true)} className="self-start">
            Leí y acepto las condiciones de uso seguro
          </Button>
        </Card>
      </PasoLayout>
    )
  }

  return (
    <PasoLayout
      etiqueta="Paso 5 · Acta digital de entrega"
      titulo="Check-in: dejar registrado el estado real de la herramienta"
      descripcion="Este es el mecanismo de confianza más importante del modelo. Con checklist, fotos, hora, ubicación y firma de ambas partes, una eventual disputa deja de ser tu palabra contra la suya."
      ancho="ancho"
    >
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-4">
          <Card className="gap-4 p-5">
            <div className="flex items-center gap-2">
              <QrCode className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">
                Validar el encuentro
              </h2>
            </div>
            {escaneado ? (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 text-sm">
                <Check className="size-4 text-accent-foreground" aria-hidden="true" />
                Encuentro validado con {proveedor.nombre} · reserva #PR-4821
              </div>
            ) : (
              <>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Escaneá el código de {proveedor.nombre} para abrir el acta. Sin este paso el
                  alquiler no queda activo ni corre el plazo.
                </p>
                <Button variant="outline" className="self-start" onClick={() => setEscaneado(true)}>
                  <QrCode aria-hidden="true" />
                  Escanear código de la reserva
                </Button>
              </>
            )}
          </Card>

          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-semibold">
                Checklist de estado
              </h2>
              <Badge variant={checklistCompleto ? 'default' : 'secondary'}>
                {Object.values(marcados).filter(Boolean).length}/{CHECKLIST_TALADRO.length}
              </Badge>
            </div>
            <ul className="flex flex-col gap-3">
              {CHECKLIST_TALADRO.map((i) => (
                <li key={i.id} className="flex items-start gap-3">
                  <Checkbox
                    id={i.id}
                    checked={!!marcados[i.id]}
                    disabled={!escaneado}
                    onCheckedChange={(v) =>
                      setMarcados((m) => ({ ...m, [i.id]: v === true }))
                    }
                    className="mt-0.5"
                  />
                  <label htmlFor={i.id} className="flex cursor-pointer flex-col gap-0.5">
                    <span className="text-sm font-medium">{i.label}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {i.detalle}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Si algo no se cumple, el locatario puede rechazar la entrega con reembolso total y
              penalización de reputación para el prestamista.
            </p>
          </Card>

          <Card className="gap-4 p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Camera className="size-4 text-muted-foreground" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold">
                  Evidencia fotográfica
                </h2>
              </div>
              <Badge variant={fotosCompletas ? 'default' : 'secondary'}>
                {fotos.length}/{FOTOS.length} obligatorias
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {FOTOS.map((f) => {
                const tomada = fotos.includes(f.id)
                return (
                  <button
                    key={f.id}
                    disabled={!escaneado || tomada}
                    onClick={() => setFotos((p) => [...p, f.id])}
                    className={cn(
                      'flex flex-col overflow-hidden rounded-lg border text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                      tomada ? 'border-accent-foreground/40' : 'border-dashed border-border',
                      !escaneado && 'opacity-50',
                    )}
                  >
                    <span className="relative flex h-24 items-center justify-center bg-muted/50">
                      {tomada ? (
                        <Image
                          src={f.src || '/placeholder.svg'}
                          alt={`Foto de ${f.label} tomada en el check-in`}
                          width={200}
                          height={200}
                          className="size-full object-cover"
                        />
                      ) : (
                        <Camera className="size-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </span>
                    <span className="flex items-center justify-between gap-1 px-2.5 py-2 text-xs">
                      {f.label}
                      {tomada && (
                        <Check className="size-3.5 text-accent-foreground" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className={cn('gap-4 p-5', !puedeFirmar && 'opacity-60')}>
            <div className="flex items-center gap-2">
              <FileSignature className="size-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold">Firma bilateral</h2>
            </div>
            {puedeFirmar ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <SignaturePad label="Julia M. · locataria" onChange={setFirmaLocatario} />
                <SignaturePad
                  label={`${proveedor.nombre} · prestamista`}
                  onChange={setFirmaPrestamista}
                />
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Las firmas se habilitan recién cuando el encuentro está validado, el checklist
                completo y las tres fotos tomadas.
              </p>
            )}
          </Card>
        </div>

        <Card className="h-fit gap-4 p-5 lg:sticky lg:top-36">
          <h2 className="font-display text-base font-semibold">Acta #PR-4821-IN</h2>
          <ul className="flex flex-col gap-3 text-xs">
            {[
              { icono: MapPin, label: 'Ubicación', valor: 'Plaza Belgrano, entrada Rivadavia' },
              { icono: Clock3, label: 'Sellado de tiempo', valor: 'Hoy, 18:14 (UTC-3)' },
              { icono: QrCode, label: 'Hash del acta', valor: 'a91f…3c7d (inmutable)' },
            ].map((d) => (
              <li key={d.label} className="flex items-start gap-2">
                <d.icono className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="text-sm text-foreground">{d.valor}</span>
                </span>
              </li>
            ))}
          </ul>

          <Separator />

          <ul className="flex flex-col gap-2 text-sm">
            {[
              ['Encuentro validado', escaneado],
              ['Checklist completo', checklistCompleto],
              ['Fotos cargadas', fotosCompletas],
              ['Firma del locatario', firmaLocatario],
              ['Firma del prestamista', firmaPrestamista],
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

          <Button disabled={!listo} onClick={onFirmado} className="w-full">
            Cerrar acta y activar el alquiler
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Al cerrar el acta empieza a correr el plazo de 1 día y la garantía queda retenida
            hasta la devolución.
          </p>
        </Card>
      </div>
    </PasoLayout>
  )
}
