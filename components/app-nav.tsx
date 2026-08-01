'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Home, Map, MessageSquare, PlusCircle, Repeat2, UserRound, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const LINKS = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/mapa', label: 'Mapa', icon: Map },
  { href: '/explorar', label: 'Explorar', icon: Compass },
  { href: '/chat', label: 'Chat IA', icon: MessageSquare },
  { href: '/publicar', label: 'Publicar', icon: PlusCircle },
  { href: '/actividad', label: 'Actividad', icon: Repeat2 },
]

function esActivo(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export function AppNav() {
  const pathname = usePathname()
  const { yo, pendientesDeRespuesta } = useStore()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Wrench className="size-4" aria-hidden="true" />
            </span>
            <span className="font-display text-base font-bold tracking-tight">
              MaoTools
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const activo = esActivo(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={activo ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    activo
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                  {href === '/actividad' && pendientesDeRespuesta > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {pendientesDeRespuesta}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <Link href="/perfil" className="ml-auto flex items-center gap-2">
            <span className="hidden text-right text-xs leading-tight sm:block">
              <span className="block font-medium">{yo.nombre}</span>
              <span className="block text-muted-foreground">
                Alquila y presta
              </span>
            </span>
            <Avatar className="size-8">
              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                JM
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/95 backdrop-blur md:hidden"
        aria-label="Principal móvil"
      >
        {LINKS.map(({ href, label, icon: Icon }) => {
          const activo = esActivo(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={activo ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium',
                activo ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <span className="relative">
                <Icon className="size-5" aria-hidden="true" />
                {href === '/actividad' && pendientesDeRespuesta > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {pendientesDeRespuesta}
                  </span>
                )}
              </span>
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
