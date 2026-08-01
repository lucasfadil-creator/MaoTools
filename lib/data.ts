/* ============================================================================
   Dominio del marketplace de alquiler de herramientas.
   Un mismo usuario puede alquilar (locatario) y prestar (prestamista).
   ========================================================================== */

export function fmt(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(n)
}

export function distancia(m: number) {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`
}

export function hoyMas(dias: number) {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

export function fechaCorta(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  })
}

export function diasEntre(desde: string, hasta: string) {
  const a = new Date(desde).getTime()
  const b = new Date(hasta).getTime()
  return Math.max(1, Math.round((b - a) / 86400000) + 1)
}

/* --------------------------------- Usuarios ------------------------------- */

export type Usuario = {
  id: string
  nombre: string
  tipo: 'Particular' | 'Comercio'
  nivel: 'Nuevo' | 'Confiable' | 'Súper Prestamista' | 'Comercio verificado'
  rating: number
  operaciones: number
  verificado: boolean
  respuesta: string
  barrio: string
}

export const YO = 'yo'

export const USUARIOS: Record<string, Usuario> = {
  yo: {
    id: 'yo',
    nombre: 'Julia Medina',
    tipo: 'Particular',
    nivel: 'Confiable',
    rating: 4.8,
    operaciones: 12,
    verificado: true,
    respuesta: 'Respondés en ~20 min',
    barrio: 'Villa Crespo',
  },
  marcos: {
    id: 'marcos',
    nombre: 'Marcos Gil',
    tipo: 'Particular',
    nivel: 'Súper Prestamista',
    rating: 4.9,
    operaciones: 37,
    verificado: true,
    respuesta: 'Responde en ~12 min',
    barrio: 'Villa Crespo',
  },
  donluis: {
    id: 'donluis',
    nombre: 'Ferretería Don Luis',
    tipo: 'Comercio',
    nivel: 'Comercio verificado',
    rating: 4.7,
    operaciones: 214,
    verificado: true,
    respuesta: 'Reserva instantánea',
    barrio: 'Almagro',
  },
  sofia: {
    id: 'sofia',
    nombre: 'Sofía Ramos',
    tipo: 'Particular',
    nivel: 'Confiable',
    rating: 4.5,
    operaciones: 9,
    verificado: true,
    respuesta: 'Responde en ~3 h',
    barrio: 'Chacarita',
  },
  nicolas: {
    id: 'nicolas',
    nombre: 'Nicolás Ferrer',
    tipo: 'Particular',
    nivel: 'Nuevo',
    rating: 0,
    operaciones: 0,
    verificado: true,
    respuesta: 'Responde en ~1 h',
    barrio: 'Paternal',
  },
  paula: {
    id: 'paula',
    nombre: 'Paula Sosa',
    tipo: 'Particular',
    nivel: 'Confiable',
    rating: 4.6,
    operaciones: 15,
    verificado: true,
    respuesta: 'Responde en ~40 min',
    barrio: 'Villa Crespo',
  },
  obrasur: {
    id: 'obrasur',
    nombre: 'Corralón Obra Sur',
    tipo: 'Comercio',
    nivel: 'Comercio verificado',
    rating: 4.4,
    operaciones: 88,
    verificado: true,
    respuesta: 'Reserva instantánea',
    barrio: 'Colegiales',
  },
}

/* ------------------------------- Herramientas ----------------------------- */

export const CATEGORIAS = [
  'Perforación',
  'Corte',
  'Lijado',
  'Cerámica',
  'Limpieza',
  'Altura',
  'Soldadura',
  'Demolición',
] as const

export type Categoria = (typeof CATEGORIAS)[number]

export type Estado = 'Como nuevo' | 'Muy bueno' | 'Bueno'

export type Herramienta = {
  id: string
  nombre: string
  categoria: Categoria
  descripcion: string
  imagen: string
  duenoId: string
  precioDia: number
  garantia: number
  estado: Estado
  distanciaM: number
  entregaInmediata: boolean
  factura: boolean
  incluye: string[]
  eppRequerido: string[]
  publicada: boolean
  /* posición relativa 0-100 dentro del mapa de zona */
  x: number
  y: number
}

export const HERRAMIENTAS: Herramienta[] = [
  {
    id: 'h-taladro-marcos',
    nombre: 'Taladro percutor 750 W',
    categoria: 'Perforación',
    descripcion:
      'Percutor con selector de dos velocidades. Ideal para ladrillo hueco, macizo y madera. Lo uso poco, está muy cuidado.',
    imagen: '/tools/taladro-percutor.png',
    duenoId: 'marcos',
    precioDia: 6500,
    garantia: 18000,
    estado: 'Muy bueno',
    distanciaM: 400,
    entregaInmediata: true,
    factura: false,
    incluye: ['Maletín rígido', 'Mecha widia 6 mm', 'Manual'],
    eppRequerido: ['Antiparras', 'Barbijo para polvo'],
    publicada: true,
    x: 38,
    y: 34,
  },
  {
    id: 'h-taladro-donluis',
    nombre: 'Taladro percutor 900 W profesional',
    categoria: 'Perforación',
    descripcion:
      'Equipo de línea profesional del comercio. Se entrega revisado, con factura y reemplazo inmediato ante falla.',
    imagen: '/tools/taladro-percutor.png',
    duenoId: 'donluis',
    precioDia: 8200,
    garantia: 22000,
    estado: 'Como nuevo',
    distanciaM: 1200,
    entregaInmediata: true,
    factura: true,
    incluye: ['Juego de 5 mechas', 'Empuñadura lateral', 'Factura A/B'],
    eppRequerido: ['Antiparras', 'Barbijo para polvo'],
    publicada: true,
    x: 70,
    y: 62,
  },
  {
    id: 'h-amoladora-sofia',
    nombre: 'Amoladora angular 4½"',
    categoria: 'Corte',
    descripcion:
      'Para cortar hierro, cerámico y desbastar. Incluye dos discos nuevos. Requiere protección facial obligatoria.',
    imagen: '/tools/amoladora.png',
    duenoId: 'sofia',
    precioDia: 5200,
    garantia: 16000,
    estado: 'Bueno',
    distanciaM: 900,
    entregaInmediata: false,
    factura: false,
    incluye: ['Disco de corte', 'Disco de desbaste', 'Protector'],
    eppRequerido: ['Máscara facial', 'Guantes', 'Protección auditiva'],
    publicada: true,
    x: 24,
    y: 68,
  },
  {
    id: 'h-lijadora-yo',
    nombre: 'Lijadora orbital 300 W',
    categoria: 'Lijado',
    descripcion:
      'La compré para restaurar una mesa y quedó sin uso. Suave, con aspiración de polvo integrada.',
    imagen: '/tools/lijadora-orbital.png',
    duenoId: 'yo',
    precioDia: 4200,
    garantia: 12000,
    estado: 'Como nuevo',
    distanciaM: 0,
    entregaInmediata: true,
    factura: false,
    incluye: ['Bolsa de aspiración', '5 hojas de lija grano 120'],
    eppRequerido: ['Barbijo para polvo', 'Antiparras'],
    publicada: true,
    x: 50,
    y: 48,
  },
  {
    id: 'h-escalera-yo',
    nombre: 'Escalera extensible de aluminio 5 m',
    categoria: 'Altura',
    descripcion:
      'Escalera liviana con zapatas antideslizantes. La retiran y devuelven por el garage del edificio.',
    imagen: '/tools/escalera.png',
    duenoId: 'yo',
    precioDia: 3800,
    garantia: 15000,
    estado: 'Muy bueno',
    distanciaM: 0,
    entregaInmediata: false,
    factura: false,
    incluye: ['Zapatas de goma', 'Correa de traslado'],
    eppRequerido: ['Calzado cerrado'],
    publicada: true,
    x: 52,
    y: 44,
  },
  {
    id: 'h-sierra-marcos',
    nombre: 'Sierra circular 1400 W',
    categoria: 'Corte',
    descripcion:
      'Para cortes rectos en madera y placas. Disco nuevo de 24 dientes. Pido experiencia previa de uso.',
    imagen: '/tools/sierra-circular.png',
    duenoId: 'marcos',
    precioDia: 7400,
    garantia: 24000,
    estado: 'Muy bueno',
    distanciaM: 400,
    entregaInmediata: true,
    factura: false,
    incluye: ['Disco 24 dientes', 'Guía paralela', 'Llave'],
    eppRequerido: ['Antiparras', 'Protección auditiva', 'Guantes'],
    publicada: true,
    x: 36,
    y: 30,
  },
  {
    id: 'h-hidro-donluis',
    nombre: 'Hidrolavadora 130 bar',
    categoria: 'Limpieza',
    descripcion:
      'Para patios, veredas, rejas y frentes. Se entrega con manguera de 8 m y dos lanzas intercambiables.',
    imagen: '/tools/hidrolavadora.png',
    duenoId: 'donluis',
    precioDia: 9600,
    garantia: 28000,
    estado: 'Como nuevo',
    distanciaM: 1200,
    entregaInmediata: true,
    factura: true,
    incluye: ['Manguera 8 m', 'Lanza turbo', 'Lanza abanico'],
    eppRequerido: ['Calzado cerrado', 'Antiparras'],
    publicada: true,
    x: 72,
    y: 58,
  },
  {
    id: 'h-soldadora-obrasur',
    nombre: 'Soldadora inverter 200 A',
    categoria: 'Soldadura',
    descripcion:
      'Equipo liviano para electrodo revestido. Se alquila únicamente a usuarios con experiencia acreditada.',
    imagen: '/tools/soldadora.png',
    duenoId: 'obrasur',
    precioDia: 11800,
    garantia: 40000,
    estado: 'Muy bueno',
    distanciaM: 2100,
    entregaInmediata: false,
    factura: true,
    incluye: ['Porta electrodo', 'Pinza de masa', 'Máscara fotosensible'],
    eppRequerido: ['Máscara de soldar', 'Guantes de cuero', 'Delantal'],
    publicada: true,
    x: 84,
    y: 26,
  },
  {
    id: 'h-ceramica-paula',
    nombre: 'Cortadora de cerámica manual 60 cm',
    categoria: 'Cerámica',
    descripcion:
      'Corte limpio en porcelanato y cerámico hasta 60 cm. No hace ruido ni polvo, ideal para departamentos.',
    imagen: '/tools/cortadora-ceramica.png',
    duenoId: 'paula',
    precioDia: 4800,
    garantia: 14000,
    estado: 'Bueno',
    distanciaM: 650,
    entregaInmediata: true,
    factura: false,
    incluye: ['Rueda de widia de repuesto'],
    eppRequerido: ['Guantes'],
    publicada: true,
    x: 46,
    y: 72,
  },
  {
    id: 'h-demoledor-obrasur',
    nombre: 'Martillo demoledor 1500 W',
    categoria: 'Demolición',
    descripcion:
      'Para romper contrapisos y revoques. Pesado: se recomienda traslado en vehículo y uso de a dos personas.',
    imagen: '/tools/martillo-demoledor.png',
    duenoId: 'obrasur',
    precioDia: 15400,
    garantia: 55000,
    estado: 'Muy bueno',
    distanciaM: 2100,
    entregaInmediata: false,
    factura: true,
    incluye: ['Cincel plano', 'Puntero', 'Grasa lubricante'],
    eppRequerido: [
      'Protección auditiva',
      'Antiparras',
      'Guantes antivibración',
      'Calzado de seguridad',
    ],
    publicada: true,
    x: 86,
    y: 40,
  },
]

/* -------------------------------- Operaciones ------------------------------ */

export type EstadoOperacion =
  | 'solicitada'
  | 'rechazada'
  | 'aceptada'
  | 'en_curso'
  | 'finalizada'
  | 'cancelada'

export type Acta = {
  fecha: string
  items: string[]
  nota: string
  firmaDueno: boolean
  firmaLocatario: boolean
  novedad: boolean
}

export type Operacion = {
  id: string
  herramientaId: string
  duenoId: string
  locatarioId: string
  desde: string
  hasta: string
  dias: number
  precioDia: number
  garantia: number
  fee: number
  total: number
  estado: EstadoOperacion
  mensaje: string
  creada: string
  entrega?: Acta
  devolucion?: Acta
  calificacion?: number
}

export const FEE = 0.08

export function calcularCostos(precioDia: number, dias: number) {
  const alquiler = precioDia * dias
  const fee = Math.round(alquiler * FEE)
  return { alquiler, fee, total: alquiler + fee }
}

export const OPERACIONES_INICIALES: Operacion[] = [
  {
    id: 'op-1',
    herramientaId: 'h-taladro-donluis',
    duenoId: 'donluis',
    locatarioId: 'yo',
    desde: hoyMas(2),
    hasta: hoyMas(3),
    dias: 2,
    precioDia: 8200,
    garantia: 22000,
    fee: 1312,
    total: 17712,
    estado: 'solicitada',
    mensaje: 'Necesito colgar dos cuadros pesados en pared de ladrillo hueco.',
    creada: hoyMas(0),
  },
  {
    id: 'op-2',
    herramientaId: 'h-amoladora-sofia',
    duenoId: 'sofia',
    locatarioId: 'yo',
    desde: hoyMas(-1),
    hasta: hoyMas(1),
    dias: 3,
    precioDia: 5200,
    garantia: 16000,
    fee: 1248,
    total: 16848,
    estado: 'en_curso',
    mensaje: 'Corte de rejas del balcón.',
    creada: hoyMas(-2),
    entrega: {
      fecha: hoyMas(-1),
      items: ['carcasa', 'cable', 'accesorios', 'funcionamiento'],
      nota: 'Disco de corte con desgaste leve, ya declarado por la dueña.',
      firmaDueno: true,
      firmaLocatario: true,
      novedad: false,
    },
  },
  {
    id: 'op-3',
    herramientaId: 'h-escalera-yo',
    duenoId: 'yo',
    locatarioId: 'nicolas',
    desde: hoyMas(1),
    hasta: hoyMas(1),
    dias: 1,
    precioDia: 3800,
    garantia: 15000,
    fee: 304,
    total: 4104,
    estado: 'solicitada',
    mensaje: 'Es para pintar el frente de casa, la devuelvo el mismo día.',
    creada: hoyMas(0),
  },
  {
    id: 'op-4',
    herramientaId: 'h-lijadora-yo',
    duenoId: 'yo',
    locatarioId: 'paula',
    desde: hoyMas(-3),
    hasta: hoyMas(0),
    dias: 4,
    precioDia: 4200,
    garantia: 12000,
    fee: 1344,
    total: 18144,
    estado: 'en_curso',
    mensaje: 'Restauración de una cómoda antigua.',
    creada: hoyMas(-4),
    entrega: {
      fecha: hoyMas(-3),
      items: ['carcasa', 'cable', 'accesorios', 'funcionamiento'],
      nota: '',
      firmaDueno: true,
      firmaLocatario: true,
      novedad: false,
    },
  },
  {
    id: 'op-5',
    herramientaId: 'h-lijadora-yo',
    duenoId: 'yo',
    locatarioId: 'marcos',
    desde: hoyMas(-14),
    hasta: hoyMas(-12),
    dias: 3,
    precioDia: 4200,
    garantia: 12000,
    fee: 1008,
    total: 13608,
    estado: 'finalizada',
    mensaje: 'Lijado de puerta de entrada.',
    creada: hoyMas(-16),
    entrega: {
      fecha: hoyMas(-14),
      items: ['carcasa', 'cable', 'accesorios', 'funcionamiento'],
      nota: '',
      firmaDueno: true,
      firmaLocatario: true,
      novedad: false,
    },
    devolucion: {
      fecha: hoyMas(-12),
      items: ['carcasa', 'cable', 'accesorios', 'funcionamiento'],
      nota: 'Devuelta limpia y con las lijas repuestas.',
      firmaDueno: true,
      firmaLocatario: true,
      novedad: false,
    },
    calificacion: 5,
  },
]

/* ---------------------------- Checklist de actas --------------------------- */

export type ItemChecklist = { id: string; label: string; detalle: string }

export const CHECKLIST_BASE: ItemChecklist[] = [
  {
    id: 'carcasa',
    label: 'Cuerpo sin fisuras ni golpes',
    detalle: 'Revisar carcasa, empuñadura y ventilaciones',
  },
  {
    id: 'cable',
    label: 'Cable, ficha o partes móviles en orden',
    detalle: 'Sin cortes, empalmes ni juego excesivo',
  },
  {
    id: 'funcionamiento',
    label: 'Funciona correctamente en la prueba',
    detalle: 'Probar encendido y todas las velocidades o posiciones',
  },
  {
    id: 'accesorios',
    label: 'Accesorios completos según la publicación',
    detalle: 'Contrastar con el listado de "incluye"',
  },
  {
    id: 'limpieza',
    label: 'Estado de limpieza aceptable',
    detalle: 'Se documenta para evitar reclamos posteriores',
  },
]
