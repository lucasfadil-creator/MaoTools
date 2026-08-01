'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStore } from '@/components/store'
import { cn } from '@/lib/utils'
import { CalendarClock, Hammer, PlusCircle, Search, Wrench } from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Explorar', icon: Search },
  { href: '/mis-herramientas', label: 'Mis herramientas', icon: Wrench },
  { href: '/alquileres', label: 'Mis alquileres', icon: CalendarClock },
]

export function Nav() {
  const pathname = usePathname()
  const { yo, solicitudes } = useStore()

  const pendientes = solicitudes.filter(
    (s) => s.duenoId === yo.id && s.estado === 'pendiente',
  ).length

  function activo(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Hammer className="size-4" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">Prestá</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Principal">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  activo(l.href)
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
                {l.href === '/mis-herramientas' && pendientes > 0 && (
                  <span className="absolute -top-0.5 right-0 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {pendientes}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <Button asChild size="sm">
              <Link href="/publicar">
                <PlusCircle className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Publicar herramienta</span>
                <span className="sm:hidden">Publicar</span>
              </Link>
            </Button>
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{yo.inicial}</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-xs font-medium">{yo.nombre}</p>
                <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                  {yo.nivel}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background md:hidden"
        aria-label="Principal móvil"
      >
        {LINKS.map((l) => {
          const Icon = l.icon
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium',
                activo(l.href) ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {l.label}
              {l.href === '/mis-herramientas' && pendientes > 0 && (
                <span className="absolute right-1/4 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {pendientes}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
