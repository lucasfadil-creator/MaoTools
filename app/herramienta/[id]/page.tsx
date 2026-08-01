'use client'

import { use } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { HerramientaDetalle } from '@/components/herramienta-detalle'
import { buttonVariants } from '@/components/ui/button'

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { herramienta } = useStore()
  const h = herramienta(id)

  if (!h) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center">
        <p className="text-sm font-medium">Esta herramienta ya no existe</p>
        <Link
          href="/"
          className={buttonVariants({ variant: 'outline', className: 'mt-4' })}
        >
          Volver a explorar
        </Link>
      </div>
    )
  }

  return <HerramientaDetalle h={h} />
}
