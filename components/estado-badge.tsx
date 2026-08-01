import { Badge } from '@/components/ui/badge'
import type { EstadoSolicitud } from '@/lib/tipos'

const MAPA: Record<
  EstadoSolicitud,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  pendiente: { label: 'Pendiente', variant: 'outline' },
  aceptada: { label: 'Aceptada', variant: 'default' },
  'en-curso': { label: 'En curso', variant: 'default' },
  finalizada: { label: 'Finalizada', variant: 'secondary' },
  rechazada: { label: 'Rechazada', variant: 'secondary' },
  'en-disputa': { label: 'En disputa', variant: 'destructive' },
}

export function EstadoBadge({ estado }: { estado: EstadoSolicitud }) {
  const { label, variant } = MAPA[estado]
  return (
    <Badge variant={variant} className="shrink-0">
      {label}
    </Badge>
  )
}
