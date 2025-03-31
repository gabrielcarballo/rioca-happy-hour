"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { NowPlaying } from "@/components/now-playing"
import { QueueList } from "@/components/queue-list"
import { SearchSongs } from "@/components/search-songs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RioHeader } from "@/components/rio-header"
import Image from "next/image"

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

    // Animação de fundo
    gsap.to(mainRef.current, {
      backgroundPosition: "100% 100%",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    })

    return () => {
      // Limpar animações quando o componente for desmontado
      tl.kill()
    }
  }, [])

  return (
    <main ref={mainRef} className="min-h-screen rio-gradient">
      <div className="container max-w-md mx-auto px-4 py-6">
        <Image src="/riocabackground.jpg" alt="Hotel Rio Logo" fill className="object-contain" priority />

        <div ref={headerRef} className="glass-container py-6">
          <RioHeader />
        </div>

        <div ref={nowPlayingRef} className="mt-6 card-rio">
          <NowPlaying />
        </div>

        <div ref={tabsRef}>
          <Tabs defaultValue="queue" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="queue">Fila de Músicas</TabsTrigger>
              <TabsTrigger value="search">Adicionar Música</TabsTrigger>
            </TabsList>
            <TabsContent value="queue" className="mt-2 card-rio">
              <QueueList />
            </TabsContent>
            <TabsContent value="search" className="mt-2 card-rio">
              <SearchSongs />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

