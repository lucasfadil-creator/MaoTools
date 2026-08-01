export type Usuario = {
  id: string
  nombre: string
  inicial: string
  tipo: 'particular' | 'comercio'
  nivel: string
  rating: number
  operaciones: number
  verificado: boolean
  zona: string
}

export type Herramienta = {
  id: string
  nombre: string
  categoria: Categoria
  descripcion: string
  imagen: string
  estado: 'Como nuevo' | 'Muy bueno' | 'Bueno' | 'Con uso'
  precioDia: number
  valorMercado: number
  duenoId: string
  incluye: string[]
  publicada: boolean
  entregaInmediata: boolean
  factura: boolean
  distanciaM: number
  x: number
  y: number
}

export type Categoria =
  | 'Perforación'
  | 'Corte'
  | 'Lijado y pintura'
  | 'Jardín'
  | 'Medición'
  | 'Plomería'
  | 'Elevación'

export const CATEGORIAS: Categoria[] = [
  'Perforación',
  'Corte',
  'Lijado y pintura',
  'Jardín',
  'Medición',
  'Plomería',
  'Elevación',
]

export const ESTADOS: Herramienta['estado'][] = [
  'Como nuevo',
  'Muy bueno',
  'Bueno',
  'Con uso',
]

export const IMAGENES_SUGERIDAS = [
  { src: '/tools/taladro-percutor.png', label: 'Taladro percutor' },
  { src: '/tools/amoladora.png', label: 'Amoladora' },
  { src: '/tools/lijadora-orbital.png', label: 'Lijadora orbital' },
  { src: '/tools/caladora.png', label: 'Sierra caladora' },
  { src: '/tools/nivel-laser.png', label: 'Nivel láser' },
  { src: '/tools/escalera.png', label: 'Escalera' },
  { src: '/tools/hidrolavadora.png', label: 'Hidrolavadora' },
  { src: '/tools/atornillador.png', label: 'Atornillador' },
  { src: '/tools/pistola-calor.png', label: 'Pistola de calor' },
]

export type EstadoSolicitud =
  | 'pendiente'
  | 'rechazada'
  | 'aceptada'
  | 'en-curso'
  | 'finalizada'
  | 'en-disputa'

export type Acta = {
  fecha: string
  checklist: string[]
  observaciones: string
  firmaDueno: boolean
  firmaSolicitante: boolean
}

export type Solicitud = {
  id: string
  herramientaId: string
  solicitanteId: string
  duenoId: string
  desde: string
  hasta: string
  dias: number
  mensaje: string
  estado: EstadoSolicitud
  creada: string
  entrega: 'retiro' | 'punto-medio' | 'envio'
  actaEntrega?: Acta
  actaDevolucion?: Acta
  motivoRechazo?: string
  danoDeclarado?: string
}

/* --------------------------------- Dinero -------------------------------- */

export const FEE_SERVICIO = 0.08
export const COMISION_PLATAFORMA = 0.12

export function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export function garantiaDe(h: Herramienta, rating = 5) {
  const factor = rating >= 4.8 ? 0.5 : rating >= 4.3 ? 0.75 : 1
  return Math.round(Math.min(h.valorMercado * 0.2, 40000) * factor)
}

export function totalDe(h: Herramienta, dias: number) {
  const alquiler = h.precioDia * dias
  const fee = Math.round(alquiler * FEE_SERVICIO)
  return { alquiler, fee, total: alquiler + fee }
}

export function distancia(m: number) {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`
}

export function fechaCorta(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  })
}

export function hoyISO(offsetDias = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDias)
  return d.toISOString().slice(0, 10)
}

export function diasEntre(desde: string, hasta: string) {
  const a = new Date(desde + 'T12:00:00').getTime()
  const b = new Date(hasta + 'T12:00:00').getTime()
  return Math.max(1, Math.round((b - a) / 86400000) + 1)
}

/* -------------------------------- Semilla -------------------------------- */

export const YO = 'yo'

export const USUARIOS: Usuario[] = [
  {
    id: YO,
    nombre: 'Julia Pereyra',
    inicial: 'JP',
    tipo: 'particular',
    nivel: 'Confiable',
    rating: 4.8,
    operaciones: 11,
    verificado: true,
    zona: 'Villa Crespo',
  },
  {
    id: 'marcos',
    nombre: 'Marcos G.',
    inicial: 'MG',
    tipo: 'particular',
    nivel: 'Súper Prestamista',
    rating: 4.9,
    operaciones: 37,
    verificado: true,
    zona: 'Villa Crespo',
  },
  {
    id: 'donluis',
    nombre: 'Ferretería Don Luis',
    inicial: 'DL',
    tipo: 'comercio',
    nivel: 'Comercio verificado',
    rating: 4.7,
    operaciones: 214,
    verificado: true,
    zona: 'Almagro',
  },
  {
    id: 'sofia',
    nombre: 'Sofía R.',
    inicial: 'SR',
    tipo: 'particular',
    nivel: 'Confiable',
    rating: 4.5,
    operaciones: 9,
    verificado: true,
    zona: 'Chacarita',
  },
  {
    id: 'nico',
    nombre: 'Nicolás B.',
    inicial: 'NB',
    tipo: 'particular',
    nivel: 'Nuevo',
    rating: 4.2,
    operaciones: 3,
    verificado: true,
    zona: 'Paternal',
  },
]

export const HERRAMIENTAS_SEED: Herramienta[] = [
  {
    id: 'h1',
    nombre: 'Taladro percutor 750 W',
    categoria: 'Perforación',
    descripcion: 'Ideal para mampostería y ladrillo hueco. Dos velocidades y selector de percusión.',
    imagen: '/tools/taladro-percutor.png',
    estado: 'Muy bueno',
    precioDia: 6500,
    valorMercado: 98000,
    duenoId: 'marcos',
    incluye: ['Maletín', 'Mecha 6 mm', 'Manual'],
    publicada: true,
    entregaInmediata: true,
    factura: false,
    distanciaM: 400,
    x: 38,
    y: 34,
  },
  {
    id: 'h2',
    nombre: 'Amoladora angular 4½"',
    categoria: 'Corte',
    descripcion: 'Corte de hierro y cerámico. Se entrega con disco nuevo y protector.',
    imagen: '/tools/amoladora.png',
    estado: 'Como nuevo',
    precioDia: 7400,
    valorMercado: 112000,
    duenoId: 'donluis',
    incluye: ['Disco de corte', 'Protector', 'Llave', 'Factura A/B'],
    publicada: true,
    entregaInmediata: true,
    factura: true,
    distanciaM: 1200,
    x: 70,
    y: 62,
  },
  {
    id: 'h3',
    nombre: 'Lijadora orbital 300 W',
    categoria: 'Lijado y pintura',
    descripcion: 'Para preparar muebles y paredes antes de pintar. Bolsa recolectora incluida.',
    imagen: '/tools/lijadora-orbital.png',
    estado: 'Bueno',
    precioDia: 4200,
    valorMercado: 62000,
    duenoId: 'sofia',
    incluye: ['3 hojas de lija', 'Bolsa recolectora'],
    publicada: true,
    entregaInmediata: false,
    factura: false,
    distanciaM: 900,
    x: 24,
    y: 68,
  },
  {
    id: 'h4',
    nombre: 'Escalera plegable 6 escalones',
    categoria: 'Elevación',
    descripcion: 'Aluminio reforzado, hasta 120 kg. Se retira solo con vehículo o a pie cerca.',
    imagen: '/tools/escalera.png',
    estado: 'Muy bueno',
    precioDia: 3100,
    valorMercado: 74000,
    duenoId: 'nico',
    incluye: ['Tacos antideslizantes'],
    publicada: true,
    entregaInmediata: true,
    factura: false,
    distanciaM: 1600,
    x: 58,
    y: 20,
  },
  {
    id: 'h5',
    nombre: 'Hidrolavadora 1600 W',
    categoria: 'Jardín',
    descripcion: 'Limpieza de patios, veredas y autos. Manguera de 5 m y dos picos.',
    imagen: '/tools/hidrolavadora.png',
    estado: 'Como nuevo',
    precioDia: 8900,
    valorMercado: 145000,
    duenoId: 'donluis',
    incluye: ['Manguera 5 m', 'Pico turbo', 'Pico abanico', 'Factura A/B'],
    publicada: true,
    entregaInmediata: true,
    factura: true,
    distanciaM: 1250,
    x: 76,
    y: 48,
  },
  {
    id: 'h6',
    nombre: 'Sierra caladora 550 W',
    categoria: 'Corte',
    descripcion: 'Cortes rectos y curvos en madera y melamina. Incluye tres hojas.',
    imagen: '/tools/caladora.png',
    estado: 'Bueno',
    precioDia: 5100,
    valorMercado: 68000,
    duenoId: 'marcos',
    incluye: ['3 hojas de sierra', 'Guía paralela'],
    publicada: true,
    entregaInmediata: false,
    factura: false,
    distanciaM: 420,
    x: 42,
    y: 44,
  },
  {
    id: 'h7',
    nombre: 'Nivel láser autonivelante',
    categoria: 'Medición',
    descripcion: 'Línea horizontal y vertical hasta 10 m. Trípode chico incluido.',
    imagen: '/tools/nivel-laser.png',
    estado: 'Como nuevo',
    precioDia: 4800,
    valorMercado: 88000,
    duenoId: 'sofia',
    incluye: ['Trípode', 'Estuche', 'Pilas'],
    publicada: true,
    entregaInmediata: true,
    factura: false,
    distanciaM: 950,
    x: 20,
    y: 56,
  },
  /* --- Publicadas por el usuario actual --- */
  {
    id: 'h8',
    nombre: 'Atornillador inalámbrico 12 V',
    categoria: 'Perforación',
    descripcion: 'Dos baterías y cargador rápido. Perfecto para armar muebles.',
    imagen: '/tools/atornillador.png',
    estado: 'Muy bueno',
    precioDia: 3800,
    valorMercado: 56000,
    duenoId: YO,
    incluye: ['2 baterías', 'Cargador', 'Set de puntas'],
    publicada: true,
    entregaInmediata: true,
    factura: false,
    distanciaM: 0,
    x: 50,
    y: 50,
  },
  {
    id: 'h9',
    nombre: 'Pistola de calor 2000 W',
    categoria: 'Lijado y pintura',
    descripcion: 'Para remover pintura vieja y termocontraer. Dos temperaturas.',
    imagen: '/tools/pistola-calor.png',
    estado: 'Bueno',
    precioDia: 2900,
    valorMercado: 41000,
    duenoId: YO,
    incluye: ['2 boquillas'],
    publicada: false,
    entregaInmediata: false,
    factura: false,
    distanciaM: 0,
    x: 50,
    y: 50,
  },
]

export const SOLICITUDES_SEED: Solicitud[] = [
  {
    id: 's1',
    herramientaId: 'h8',
    solicitanteId: 'nico',
    duenoId: YO,
    desde: hoyISO(1),
    hasta: hoyISO(2),
    dias: 2,
    mensaje: 'Hola! Necesito armar un placard el finde. Lo cuido y lo devuelvo cargado.',
    estado: 'pendiente',
    creada: hoyISO(0),
    entrega: 'punto-medio',
  },
  {
    id: 's2',
    herramientaId: 'h8',
    solicitanteId: 'sofia',
    duenoId: YO,
    desde: hoyISO(-4),
    hasta: hoyISO(-3),
    dias: 2,
    mensaje: 'Para colgar unas repisas en la cocina.',
    estado: 'finalizada',
    creada: hoyISO(-6),
    entrega: 'retiro',
    actaEntrega: {
      fecha: hoyISO(-4),
      checklist: ['carcasa', 'bateria', 'funcionamiento', 'accesorios'],
      observaciones: '',
      firmaDueno: true,
      firmaSolicitante: true,
    },
    actaDevolucion: {
      fecha: hoyISO(-3),
      checklist: ['carcasa', 'bateria', 'funcionamiento', 'accesorios'],
      observaciones: 'Devuelto con las dos baterías cargadas.',
      firmaDueno: true,
      firmaSolicitante: true,
    },
  },
  {
    id: 's3',
    herramientaId: 'h1',
    solicitanteId: YO,
    duenoId: 'marcos',
    desde: hoyISO(0),
    hasta: hoyISO(1),
    dias: 2,
    mensaje: 'Necesito colgar un cuadro pesado en pared de ladrillo hueco.',
    estado: 'aceptada',
    creada: hoyISO(-1),
    entrega: 'punto-medio',
  },
]

/* ------------------------------- Checklists ------------------------------ */

export const CHECKLIST_POR_CATEGORIA: Record<Categoria, { id: string; label: string }[]> = {
  Perforación: [
    { id: 'carcasa', label: 'Carcasa sin fisuras ni golpes' },
    { id: 'cable', label: 'Cable, ficha o batería en buen estado' },
    { id: 'mandril', label: 'Mandril ajusta y libera correctamente' },
    { id: 'funcionamiento', label: 'Enciende y cambia de modo' },
    { id: 'accesorios', label: 'Accesorios completos según publicación' },
  ],
  Corte: [
    { id: 'carcasa', label: 'Carcasa y empuñadura sin daños' },
    { id: 'protector', label: 'Protector de disco presente y firme' },
    { id: 'disco', label: 'Disco u hoja en condiciones de uso' },
    { id: 'funcionamiento', label: 'Enciende y frena correctamente' },
    { id: 'accesorios', label: 'Accesorios completos según publicación' },
  ],
  'Lijado y pintura': [
    { id: 'carcasa', label: 'Carcasa sin fisuras' },
    { id: 'base', label: 'Base o boquilla sin deformaciones' },
    { id: 'aspiracion', label: 'Bolsa o filtro limpio' },
    { id: 'funcionamiento', label: 'Enciende y regula velocidad' },
    { id: 'accesorios', label: 'Accesorios completos según publicación' },
  ],
  Jardín: [
    { id: 'carcasa', label: 'Cuerpo sin fisuras ni pérdidas' },
    { id: 'mangueras', label: 'Mangueras y conexiones sin fugas' },
    { id: 'funcionamiento', label: 'Enciende y presuriza' },
    { id: 'accesorios', label: 'Accesorios completos según publicación' },
  ],
  Medición: [
    { id: 'carcasa', label: 'Carcasa y visor sin golpes' },
    { id: 'calibracion', label: 'Autonivelación y lectura correctas' },
    { id: 'pilas', label: 'Pilas o batería con carga' },
    { id: 'accesorios', label: 'Estuche y soportes completos' },
  ],
  Plomería: [
    { id: 'carcasa', label: 'Cuerpo sin fisuras' },
    { id: 'sellos', label: 'Sellos y juntas sin pérdidas' },
    { id: 'funcionamiento', label: 'Funciona en todos los modos' },
    { id: 'accesorios', label: 'Accesorios completos según publicación' },
  ],
  Elevación: [
    { id: 'estructura', label: 'Estructura sin dobladuras ni fisuras' },
    { id: 'trabas', label: 'Trabas y bisagras funcionan' },
    { id: 'apoyos', label: 'Tacos antideslizantes presentes' },
    { id: 'accesorios', label: 'Accesorios completos según publicación' },
  ],
}

export const EPP_POR_CATEGORIA: Record<Categoria, string> = {
  Perforación: 'Antiparras obligatorias. La percusión desprende partículas.',
  Corte: 'Antiparras, guantes y protección auditiva obligatorias.',
  'Lijado y pintura': 'Barbijo y antiparras obligatorios en ambientes cerrados.',
  Jardín: 'Calzado cerrado y antiparras. No apuntar el chorro a personas.',
  Medición: 'No mirar directamente el haz láser.',
  Plomería: 'Guantes y antiparras. Cortar el suministro antes de operar.',
  Elevación: 'Apoyar sobre superficie firme. No usar el último escalón.',
}
