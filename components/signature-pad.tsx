'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser } from 'lucide-react'

type Props = {
  label: string
  onChange: (firmado: boolean) => void
}

export function SignaturePad({ label, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dibujando = useRef(false)
  const [tieneTrazo, setTieneTrazo] = useState(false)

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = getComputedStyle(canvas).color
  }, [])

  useEffect(() => {
    setup()
    window.addEventListener('resize', setup)
    return () => window.removeEventListener('resize', setup)
  }, [setup])

  function posicion(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = posicion(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    dibujando.current = true
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dibujando.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = posicion(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!tieneTrazo) {
      setTieneTrazo(true)
      onChange(true)
    }
  }

  function end() {
    dibujando.current = false
  }

  function limpiar() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setTieneTrazo(false)
    onChange(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {tieneTrazo && (
          <Button variant="ghost" size="xs" onClick={limpiar}>
            <Eraser aria-hidden="true" />
            Borrar
          </Button>
        )}
      </div>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        aria-label={`Área de firma de ${label}`}
        className="h-28 w-full touch-none rounded-lg border border-dashed border-border bg-muted/40 text-foreground"
      />
      <p className="text-xs text-muted-foreground">
        {tieneTrazo ? 'Firma capturada' : 'Firmá con el dedo o el mouse dentro del recuadro'}
      </p>
    </div>
  )
}
