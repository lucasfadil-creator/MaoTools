'use client'

import { Send, Bot, User, Wrench, RotateCcw, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const SUGERENCIAS = [
  '¿Qué herramientas necesito para instalar un piso flotante?',
  'Quiero pintar las paredes de mi departamento, ¿qué necesito?',
  '¿Cómo cortar cerámicas sin romperlas?',
  'Necesito hacer una canaleta en la pared para ocultar cables',
]

type Mensaje = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const CONVERSACIONES: Record<string, Mensaje[]> = {
  '¿Qué herramientas necesito para instalar un piso flotante?': [
    {
      id: 'u1',
      role: 'user',
      content: '¿Qué herramientas necesito para instalar un piso flotante?',
    },
    {
      id: 'a1',
      role: 'assistant',
      content: `Para instalar un piso flotante en tu hogar vas a necesitar lo siguiente:

Herramientas esenciales:

Sierra ingletadora — para cortar las tablas al largo exacto de cada ambiente. Es la herramienta más importante de este trabajo.

Mazo de goma y taco de golpeo — para encajar las tablas sin dañar los cantos del machimbre.

Escuadra y metro — para trazar cortes precisos y verificar que la primera fila quede perfectamente a escuadra.

Separadores de dilatación — van en el perímetro para dejar el espacio que el piso necesita para moverse con la temperatura.

Herramientas convenientes:

Sierra caladora — ideal para los cortes curvos alrededor de marcos de puertas o tuberías.

Nivel de burbuja — para verificar que la base esté pareja antes de empezar.

Tip de seguridad: usá protección auditiva y anteojos cuando cortés las tablas.

Podés buscar todas estas herramientas disponibles en MaoTools Rosario.`,
    },
  ],
  'Quiero pintar las paredes de mi departamento, ¿qué necesito?': [
    {
      id: 'u2',
      role: 'user',
      content: 'Quiero pintar las paredes de mi departamento, ¿qué necesito?',
    },
    {
      id: 'a2',
      role: 'assistant',
      content: `Para pintar las paredes de tu depto, te armo la lista por etapas:

Preparación de la superficie:

Lijadora orbital — para lijar y emparejar irregularidades o pintura vieja descascarada.

Espátula — para sacar pintura suelta y aplicar masilla donde haga falta.

Herramientas de pintura:

Rodillo de felpa (nap 12mm) — el ideal para paredes interiores, da un acabado uniforme y rápido.

Bandeja para rodillo — para distribuir la pintura de forma pareja.

Pinceles de 2" y 3" — para los bordes, esquinas y marcos donde el rodillo no llega.

Convenientes:

Pistola de pintura — si tenés muchas habitaciones, acelera mucho el trabajo.

Plastico protector + cinta de papel — para cubrir pisos, zócalos y marcos.

Tip: aplicá siempre dos manos de pintura, dejando secar bien entre capa y capa.

Encontrás rodillos, lijas y pistolas disponibles ahora mismo en MaoTools.`,
    },
  ],
  '¿Cómo cortar cerámicas sin romperlas?': [
    {
      id: 'u3',
      role: 'user',
      content: '¿Cómo cortar cerámicas sin romperlas?',
    },
    {
      id: 'a3',
      role: 'assistant',
      content: `Buena pregunta. La clave está en usar la herramienta correcta según el tipo de cerámico.

Para cortes rectos:

Cortadora de cerámica manual (cutter) — perfecta para porcellanatos y cerámicos estándar de hasta 60cm. Marcás, presionás y parte limpio. Es la más rápida y barata de alquilar.

Para cortes curvos o irregulares:

Amoladora con disco diamantado — te permite hacer cortes a medida alrededor de desagotes, cañerías o esquinas complicadas.

Para piezas grandes o porcellanato grueso:

Sierra de agua (wet saw) — la más precisa para piezas de gran formato. El agua enfría el disco y evita que la cerámica se parta.

Tip de seguridad: siempre usá antiparras y guantes al cortar. Los bordes recién cortados son muy filosos.

Truco: marcá primero con lápiz y regla antes de cortar. Una línea clara evita la mayoría de los errores.

En MaoTools tenés todas estas opciones disponibles para alquilar por día o por semana.`,
    },
  ],
  'Necesito hacer una canaleta en la pared para ocultar cables': [
    {
      id: 'u4',
      role: 'user',
      content: 'Necesito hacer una canaleta en la pared para ocultar cables',
    },
    {
      id: 'a4',
      role: 'assistant',
      content: `Para hacer una canaleta en la pared y pasar cables, necesitás estas herramientas:

Esenciales:

Rozadora eléctrica — es la herramienta específica para este trabajo. Hace el surco recto y prolijo en mampostería sin esfuerzo. Mucho mejor que la amoladora para este fin.

Martillo + cincel — para limpiar los bordes del surco y ensancharlo donde haga falta.

Aspiradora industrial — el polvo que genera la rozadora es mucho, conviene tenerla a mano para ir limpiando.

Para cerrar la canaleta después:

Espátula — para aplicar la mezcla o yeso que tapa el surco una vez que está el cable adentro.

Lija de mano — para emparejar la superficie una vez que seca.

Conveniente:

Detector de metales/tensión — antes de rozar, verificá que no haya caños o cables eléctricos existentes en esa zona de la pared.

Tip de seguridad: siempre cortá la electricidad del sector donde vayas a trabajar.

La rozadora es el equipo clave acá, podés alquilarla en MaoTools por el día.`,
    },
  ],
}

export function ChatbotView() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [input, setInput] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, escribiendo])

  function simularRespuesta(pregunta: string) {
    const userMsg: Mensaje = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: pregunta,
    }
    setMensajes((prev) => [...prev, userMsg])
    setEscribiendo(true)

    // Buscar una respuesta de ejemplo o generar una genérica
    const matchKey = Object.keys(CONVERSACIONES).find((k) =>
      pregunta.toLowerCase().includes(k.toLowerCase().slice(0, 20)),
    )
    const respuestaEjemplo =
      matchKey
        ? CONVERSACIONES[matchKey][1]
        : {
            id: `a-${Date.now()}`,
            role: 'assistant' as const,
            content: `Para tu tarea te puedo recomendar las siguientes herramientas:

Taladro percutor — esencial para perforar en mampostería o madera según la tarea.

Amoladora angular — versátil para cortes y desbaste de materiales.

Nivel y cinta métrica — para asegurarte de que todo quede a escuadra y con las medidas correctas.

Consultame más detalles sobre tu tarea y te armo una lista más específica. También podés buscar directamente en el catálogo de MaoTools Rosario para ver disponibilidad.`,
          }

    setTimeout(() => {
      setEscribiendo(false)
      setMensajes((prev) => [
        ...prev,
        { ...respuestaEjemplo, id: `a-${Date.now()}` },
      ])
    }, 1400)
  }

  function handleSugerencia(texto: string) {
    simularRespuesta(texto)
  }

  function handleEnviar() {
    const texto = input.trim()
    if (!texto) return
    setInput('')
    simularRespuesta(texto)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const vacio = mensajes.length === 0

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-0 flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Bot className="size-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold leading-tight">
                Asistente MaoTools
              </h1>
              <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                <Sparkles className="size-2.5" aria-hidden="true" />
                Vista previa
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Consultá qué herramientas necesitás para tu tarea
            </p>
          </div>
        </div>
        {mensajes.length > 0 && (
          <button
            type="button"
            onClick={() => setMensajes([])}
            aria-label="Nueva conversación"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Nueva consulta
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {vacio ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 py-8">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wrench className="size-8" aria-hidden="true" />
            </div>
            <div className="text-center">
              <h2 className="font-display text-xl font-bold">
                ¿Qué vas a hacer hoy?
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Contame la tarea que tenés que hacer y te digo exactamente qué
                herramientas alquilar en MaoTools.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGERENCIAS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSugerencia(s)}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-2">
            {mensajes.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-3',
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground',
                  )}
                  aria-hidden="true"
                >
                  {m.role === 'user' ? (
                    <User className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </span>

                <div
                  className={cn(
                    'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-primary text-primary-foreground'
                      : 'rounded-tl-sm border border-border bg-card text-card-foreground',
                  )}
                >
                  {m.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {escribiendo && (
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Bot className="size-4" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mt-4 flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: quiero reparar el baño, necesito poner cerámicos..."
          aria-label="Mensaje al asistente"
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          style={{ maxHeight: 120 }}
        />
        <button
          type="button"
          onClick={handleEnviar}
          disabled={!input.trim() || escribiendo}
          aria-label="Enviar mensaje"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
            !input.trim() || escribiendo
              ? 'cursor-not-allowed bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90',
          )}
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
