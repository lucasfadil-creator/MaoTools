import { HerramientaDetalle } from '@/components/herramienta-detalle'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <HerramientaDetalle id={id} />
}
