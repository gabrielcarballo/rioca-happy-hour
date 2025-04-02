"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { NowPlaying } from "@/components/now-playing"
import { QueueList } from "@/components/queue-list"
import { SearchSongs } from "@/components/search-songs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RioHeader } from "@/components/rio-header"

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const nowPlayingRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Configuração da timeline de animação
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    // Animação de entrada dos elementos
    tl.fromTo(headerRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(nowPlayingRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, "-=0.4")
      .fromTo(tabsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")

    return () => {
      // Limpar animações quando o componente for desmontado
      tl.kill()
    }
  }, [])

  return (
    <main
      ref={mainRef}
      className="min-h-screen relative"
      style={{
        backgroundImage: "url('/riocabackground.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay para melhorar a legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

      <div className="container max-w-md mx-auto px-4 py-6 relative z-10">
        <div ref={headerRef} className="glass-container py-6">
          <RioHeader />
        </div>

        <div ref={nowPlayingRef} className="mt-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4">
          <NowPlaying />
        </div>

        <div ref={tabsRef}>
          <Tabs defaultValue="queue" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-md">
              <TabsTrigger value="queue">Fila de Músicas</TabsTrigger>
              <TabsTrigger value="search">Adicionar Música</TabsTrigger>
            </TabsList>
            <TabsContent value="queue" className="mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4">
              <QueueList />
            </TabsContent>
            <TabsContent value="search" className="mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4">
              <SearchSongs />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

