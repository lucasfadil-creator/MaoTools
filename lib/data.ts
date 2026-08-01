export type Paso =
  | 'inicio'
  | 'diagnostico'
  | 'resultado'
  | 'busqueda'
  | 'reserva'
  | 'checkin'
  | 'guia'
  | 'checkout'
  | 'cierre'

export const PASOS: { id: Paso; label: string; corto: string }[] = [
  { id: 'inicio', label: 'Inicio', corto: 'Inicio' },
  { id: 'diagnostico', label: 'Diagnóstico IA', corto: 'Diagnóstico' },
  { id: 'resultado', label: 'Qué necesitás', corto: 'Necesidad' },
  { id: 'busqueda', label: 'Disponibilidad cercana', corto: 'Buscar' },
  { id: 'reserva', label: 'Reserva y garantía', corto: 'Reserva' },
  { id: 'checkin', label: 'Acta de entrega', corto: 'Entrega' },
  { id: 'guia', label: 'Guía asistida', corto: 'Guía' },
  { id: 'checkout', label: 'Acta de devolución', corto: 'Devolución' },
  { id: 'cierre', label: 'Cierre', corto: 'Cierre' },
]

export function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

/* ---------------------------------- IA ---------------------------------- */

export type Pregunta = {
  id: string
  texto: string
  ayuda: string
  opciones: string[]
}

export const PREGUNTAS_IA: Pregunta[] = [
  {
    id: 'peso',
    texto: '¿Cuánto pesa aproximadamente el cuadro?',
    ayuda: 'Define el tipo de fijación y la cantidad de anclajes.',
    opciones: ['Menos de 5 kg', 'Entre 5 y 15 kg', 'Más de 15 kg'],
  },
  {
    id: 'sonido',
    texto: '¿Cómo suena la pared al golpearla con los nudillos?',
    ayuda: 'Distingue ladrillo macizo de ladrillo hueco o placa de yeso.',
    opciones: ['Suena hueca', 'Suena maciza', 'No estoy seguro'],
  },
]

export type ItemNecesario = {
  nombre: string
  detalle: string
  tipo: 'herramienta' | 'insumo' | 'epp'
  alquilable: boolean
  precioDia?: number
  precioCompra?: number
}

export const DIAGNOSTICO = {
  material: 'Ladrillo hueco con revoque fino',
  confianza: 0.87,
  tarea: 'Fijar un cuadro de peso medio en pared interior',
  dificultad: 'Baja',
  tiempo: '25 a 40 minutos',
  riesgo: 'bajo' as const,
  items: [
    {
      nombre: 'Taladro percutor',
      detalle: 'Necesario para perforar revoque y ladrillo hueco',
      tipo: 'herramienta',
      alquilable: true,
      precioDia: 6500,
      precioCompra: 98000,
    },
    {
      nombre: 'Nivel de burbuja',
      detalle: '40 cm o superior, para alinear los dos anclajes',
      tipo: 'herramienta',
      alquilable: true,
      precioDia: 900,
      precioCompra: 12000,
    },
    {
      nombre: 'Mecha de widia 6 mm',
      detalle: 'Punta de widia, apta para mampostería',
      tipo: 'insumo',
      alquilable: false,
      precioCompra: 4200,
    },
    {
      nombre: 'Tarugos para hueco 6 mm x2',
      detalle: 'Tipo mariposa o de expansión para ladrillo hueco',
      tipo: 'insumo',
      alquilable: false,
      precioCompra: 1800,
    },
    {
      nombre: 'Tornillos 4 x 40 mm x2',
      detalle: 'Cabeza plana, acordes al tarugo elegido',
      tipo: 'insumo',
      alquilable: false,
      precioCompra: 900,
    },
    {
      nombre: 'Antiparras de seguridad',
      detalle: 'Obligatorias: la percusión desprende partículas',
      tipo: 'epp',
      alquilable: false,
      precioCompra: 5500,
    },
    {
      nombre: 'Barbijo para polvo',
      detalle: 'Recomendado en ambientes cerrados',
      tipo: 'epp',
      alquilable: false,
      precioCompra: 1200,
    },
  ] as ItemNecesario[],
}

/* ------------------------------ Proveedores ------------------------------ */

export type Proveedor = {
  id: string
  nombre: string
  tipo: 'P2P' | 'B2P'
  nivel: string
  rating: number
  operaciones: number
  distanciaM: number
  precioDia: number
  garantia: number
  entregaInmediata: boolean
  factura: boolean
  herramienta: string
  imagen: string
  estado: string
  incluye: string[]
  respuesta: string
  // posición relativa (0-100) dentro del mapa de zona
  x: number
  y: number
}

export const PROVEEDORES: Proveedor[] = [
  {
    id: 'marcos',
    nombre: 'Marcos G.',
    tipo: 'P2P',
    nivel: 'Súper Prestamista',
    rating: 4.9,
    operaciones: 37,
    distanciaM: 400,
    precioDia: 6500,
    garantia: 18000,
    entregaInmediata: true,
    factura: false,
    herramienta: 'Taladro percutor 750 W',
    imagen: '/tools/taladro-percutor.png',
    estado: 'Muy bueno',
    incluye: ['Maletín', 'Mecha 6 mm', 'Manual'],
    respuesta: 'Responde en ~12 min',
    x: 38,
    y: 34,
  },
  {
    id: 'donluis',
    nombre: 'Ferretería Don Luis',
    tipo: 'B2P',
    nivel: 'Comercio verificado',
    rating: 4.7,
    operaciones: 214,
    distanciaM: 1200,
    precioDia: 8200,
    garantia: 22000,
    entregaInmediata: true,
    factura: true,
    herramienta: 'Taladro percutor 900 W',
    imagen: '/tools/amoladora.png',
    estado: 'Como nuevo',
    incluye: ['Juego de mechas', 'Factura A/B', 'Reemplazo inmediato'],
    respuesta: 'Reserva instantánea',
    x: 70,
    y: 62,
  },
  {
    id: 'sofia',
    nombre: 'Sofía R.',
    tipo: 'P2P',
    nivel: 'Confiable',
    rating: 4.5,
    operaciones: 9,
    distanciaM: 900,
    precioDia: 5200,
    garantia: 16000,
    entregaInmediata: false,
    factura: false,
    herramienta: 'Taladro percutor 600 W',
    imagen: '/tools/lijadora-orbital.png',
    estado: 'Bueno',
    incluye: ['Mecha 5 mm'],
    respuesta: 'Responde en ~3 h',
    x: 24,
    y: 68,
  },
]

/* --------------------------------- Actas --------------------------------- */

export type ItemChecklist = {
  id: string
  label: string
  detalle: string
}

export const CHECKLIST_TALADRO: ItemChecklist[] = [
  {
    id: 'carcasa',
    label: 'Carcasa sin fisuras ni golpes',
    detalle: 'Revisar cuerpo, empuñadura y ventilaciones',
  },
  {
    id: 'cable',
    label: 'Cable y ficha en buen estado',
    detalle: 'Sin cortes, empalmes ni recalentamiento',
  },
  {
    id: 'mandril',
    label: 'Mandril ajusta y libera correctamente',
    detalle: 'Probar apriete con la mecha incluida',
  },
  {
    id: 'funcionamiento',
    label: 'Enciende y cambia a percusión',
    detalle: 'Probar ambas velocidades y el selector',
  },
  {
    id: 'accesorios',
    label: 'Accesorios completos según publicación',
    detalle: 'Maletín, mecha 6 mm y manual',
  },
]

/* ---------------------------------- Guía --------------------------------- */

export const GUIA_PASOS = [
  {
    titulo: 'Preparación y seguridad',
    texto:
      'Colocate las antiparras antes de enchufar la herramienta. Despejá la zona y apoyá el cuadro en el piso, no sobre muebles.',
    aviso: 'EPP obligatorio: antiparras.',
  },
  {
    titulo: 'Marcar los puntos',
    texto:
      'Marcá los dos puntos de anclaje separados 30 cm y verificá con el nivel que estén alineados. Medí desde el piso para que el centro del cuadro quede a 1,55 m.',
    aviso: null,
  },
  {
    titulo: 'Verificar que no haya instalaciones',
    texto:
      'Evitá perforar en línea vertical u horizontal directa con enchufes, llaves de luz o canillas. Si hay dudas, corré el punto 15 cm al costado.',
    aviso: 'Si sospechás que hay un caño o cable, no perfores: consultá a un matriculado.',
  },
  {
    titulo: 'Perforar',
    texto:
      'Empezá sin percusión para romper el revoque y evitar que se desgrane. Cuando la mecha entre 5 mm, activá la percusión. Mantené el taladro perpendicular a la pared.',
    aviso: null,
  },
  {
    titulo: 'Colocar tarugos y colgar',
    texto:
      'Limpiá el polvo del agujero, insertá los tarugos tipo mariposa y ajustá los tornillos dejando 4 mm afuera. Colgá el cuadro y verificá con el nivel.',
    aviso: null,
  },
]

export const CONSULTAS_GUIA = [
  {
    pregunta: 'La mecha no avanza, ¿qué hago?',
    respuesta:
      'Casi seguro estás sin percusión o la mecha no es de widia. Verificá el selector del taladro (símbolo de martillo) y confirmá que la punta sea de widia y no de acero rápido. No fuerces: sobrecalentás la mecha y quemás el motor.',
  },
  {
    pregunta: 'El agujero quedó demasiado grande',
    respuesta:
      'Pasá a un tarugo del diámetro siguiente (8 mm) o usá un tarugo químico. No lo rellenes con papel: la fijación no va a resistir el peso del cuadro.',
  },
  {
    pregunta: 'Salió mucho polvo blanco, ¿es normal?',
    respuesta:
      'Sí, es el revoque. Sostené un sobre o un recipiente bajo el punto de perforación y usá barbijo si el ambiente está cerrado.',
  },
]
