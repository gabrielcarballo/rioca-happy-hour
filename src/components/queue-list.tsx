"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Clock, Music2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { gsap } from "gsap"

// Simulação de dados da fila - em produção, isso viria da API do Spotify
const mockQueue = [
  {
    id: "1",
    name: "Mas Que Nada",
    artist: "Sergio Mendes",
    albumArt: "/masquenadamock.jpeg?height=60&width=60",
    duration: "3:45",
  },
  {
    id: "2",
    name: "Aquarela do Brasil",
    artist: "Gal Costa",
    albumArt: "/aqueareladobrasilmock.jpeg?height=60&width=60",
    duration: "4:12",
  },
  {
    id: "3",
    name: "Chega de Saudade",
    artist: "João Gilberto",
    albumArt: "/chegadesaudademock.jpeg?height=60&width=60",
    duration: "2:58",
  },
  {
    id: "4",
    name: "Corcovado",
    artist: "Astrud Gilberto",
    albumArt: "/corcovadomock.jpeg?height=60&width=60",
    duration: "3:22",
  },
]

export function QueueList() {
  const [queue, setQueue] = useState(mockQueue)
  const listRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  // Animações GSAP
  useEffect(() => {
    if (!listRef.current) return

    // Animação de entrada da lista
    gsap.fromTo(listRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })

    // Animação de entrada dos itens da lista
    itemsRef.current.forEach((item, index) => {
      if (!item) return

      gsap.fromTo(
        item,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          delay: 0.1 + index * 0.08,
          ease: "power2.out",
        },
      )
    })

    return () => {
      // Limpar animações
      gsap.killTweensOf(listRef.current)
      itemsRef.current.forEach((item) => {
        if (item) gsap.killTweensOf(item)
      })
    }
  }, [queue])

  // Configurar animações de hover
  const handleMouseEnter = (index: number) => {
    if (!itemsRef.current[index]) return

    gsap.to(itemsRef.current[index], {
      backgroundColor: "rgba(243, 244, 246, 0.8)",
      scale: 1.02,
      duration: 0.2,
      ease: "power1.out",
    })
  }

  const handleMouseLeave = (index: number) => {
    if (!itemsRef.current[index]) return

    gsap.to(itemsRef.current[index], {
      backgroundColor: "rgba(255, 255, 255, 0)",
      scale: 1,
      duration: 0.2,
      ease: "power1.out",
    })
  }

  return (
    <div ref={listRef}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Próximas Músicas</h2>
        <span className="text-sm text-gray-500">{queue.length} na fila</span>
      </div>

      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Music2 className="size-12 mb-2 opacity-50" />
          <p>Nenhuma música na fila</p>
          <p className="text-sm">Adicione músicas para ouvir em seguida</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px] pr-4">
          {queue.map((song, index) => (
            <div
              key={song.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className="flex items-center gap-3 p-2 rounded-lg transition-colors"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div className="flex-shrink-0 size-10 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                <Image
                  src={song.albumArt || "/placeholder.svg"}
                  alt={`${song.name} cover`}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{song.name}</p>
                <p className="text-sm text-gray-500 truncate">{song.artist}</p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="size-3 mr-1" />
                {song.duration}
              </div>
            </div>
          ))}
        </ScrollArea>
      )}
    </div>
  )
}

