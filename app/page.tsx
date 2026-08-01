'use client'

import { useState } from 'react'
import { AppHeader } from '@/components/app-header'
import { InicioPaso } from '@/components/pasos/inicio-paso'
import { DiagnosticoPaso } from '@/components/pasos/diagnostico-paso'
import { ResultadoPaso } from '@/components/pasos/resultado-paso'
import { BusquedaPaso } from '@/components/pasos/busqueda-paso'
import { ReservaPaso } from '@/components/pasos/reserva-paso'
import { CheckinPaso } from '@/components/pasos/checkin-paso'
import { GuiaPaso } from '@/components/pasos/guia-paso'
import { CheckoutPaso, type ResultadoCheckout } from '@/components/pasos/checkout-paso'
import { CierrePaso } from '@/components/pasos/cierre-paso'
import { PASOS, type Paso, type Proveedor } from '@/lib/data'

export default function Page() {
  const [paso, setPaso] = useState<Paso>('inicio')
  const [maxIndice, setMaxIndice] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [proveedor, setProveedor] = useState<Proveedor | null>(null)
  const [resultado, setResultado] = useState<ResultadoCheckout>('sin-novedades')

  function ir(destino: Paso) {
    const idx = PASOS.findIndex((p) => p.id === destino)
    setMaxIndice((m) => Math.max(m, idx))
    setPaso(destino)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function reiniciar() {
    setRespuestas({})
    setProveedor(null)
    setResultado('sin-novedades')
    setMaxIndice(0)
    setPaso('inicio')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader paso={paso} onIr={ir} onReiniciar={reiniciar} maxIndice={maxIndice} />

      {paso === 'inicio' && <InicioPaso onEmpezar={() => ir('diagnostico')} />}

      {paso === 'diagnostico' && (
        <DiagnosticoPaso
          onContinuar={(r) => {
            setRespuestas(r)
            ir('resultado')
          }}
        />
      )}

      {paso === 'resultado' && (
        <ResultadoPaso respuestas={respuestas} onBuscar={() => ir('busqueda')} />
      )}

      {paso === 'busqueda' && (
        <BusquedaPaso
          onElegir={(p) => {
            setProveedor(p)
            ir('reserva')
          }}
        />
      )}

      {paso === 'reserva' && proveedor && (
        <ReservaPaso proveedor={proveedor} onConfirmar={() => ir('checkin')} />
      )}

      {paso === 'checkin' && proveedor && (
        <CheckinPaso proveedor={proveedor} onFirmado={() => ir('guia')} />
      )}

      {paso === 'guia' && <GuiaPaso onDevolver={() => ir('checkout')} />}

      {paso === 'checkout' && proveedor && (
        <CheckoutPaso
          proveedor={proveedor}
          onCerrar={(r) => {
            setResultado(r)
            ir('cierre')
          }}
        />
      )}

      {paso === 'cierre' && proveedor && (
        <CierrePaso proveedor={proveedor} resultado={resultado} onReiniciar={reiniciar} />
      )}
    </div>
  )
}
