'use client'

import { useChat } from 'ai/react'
import { Send, Bot, User, Wrench, RotateCcw, Loader2 } from 'lucide-react'
import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const SUGERENCIAS = [
  '¿Qué herramientas necesito para instalar un piso flotante?',
  'Quiero pintar las paredes de mi departamento, ¿qué necesito?',
  '¿Cómo cortar cerámicas sin romperlas?',
  'Necesito hacer una canaleta en la pared para ocultar cables',
]

export function ChatbotView() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } =
    useChat({ api: '/api/chat' })

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSugerencia(texto: string) {
    // Append user message and fetch response
    const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, content: texto }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages.map(({ role, content }) => ({ role, content })) }),
    })
      .then((res) => res.body)
      .then(async (body) => {
        if (!body) return
        const reader = body.getReader()
        const decoder = new TextDecoder()
        let text = ''
        const aiId = `a-${Date.now()}`

        setMessages([...newMessages, { id: aiId, role: 'assistant', content: '' }])

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          // Parse SSE data chunks
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('0:"')) {
              const raw = line.slice(2)
              try {
                text += JSON.parse(raw)
              } catch {
                // skip malformed
              }
            }
          }
          setMessages([
            ...newMessages,
            { id: aiId, role: 'assistant', content: text },
          ])
        }
      })
      .catch(() => {})
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      !(e.keyCode === 229)
    ) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const vacio = messages.length === 0

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-0 flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
            <Bot className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">
              Asistente MaoTools
            </h1>
            <p className="text-xs text-muted-foreground">
              Consultá qué herramientas necesitás para tu tarea
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setMessages([])}
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
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'flex gap-3',
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                {/* Avatar */}
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

                {/* Bubble */}
                <div
                  className={cn(
                    'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-primary text-primary-foreground'
                      : 'rounded-tl-sm border border-border bg-card text-card-foreground',
                  )}
                >
                  {m.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Bot className="size-4" aria-hidden="true" />
                </span>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
                  <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Cargando respuesta" />
                  <span className="text-sm text-muted-foreground">
                    Pensando...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring"
      >
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ej: quiero reparar el baño, necesito poner cerámicos..."
          aria-label="Mensaje al asistente"
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          style={{ maxHeight: 120 }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Enviar mensaje"
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
            isLoading || !input.trim()
              ? 'cursor-not-allowed bg-muted text-muted-foreground'
              : 'bg-primary text-primary-foreground hover:opacity-90',
          )}
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
