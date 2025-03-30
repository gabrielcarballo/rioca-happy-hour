"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { gsap } from "gsap"

// Simulação de resultados de busca - em produção, isso viria da API do Spotify
const mockSearchResults = [
  {
    id: "1",
    name: "Águas de Março",
    artist: "Elis Regina & Tom Jobim",
    albumArt: "/placeholder.svg?height=60&width=60",
    duration: "3:32",
  },
  {
    id: "2",
    name: "Samba de Verão",
    artist: "Marcos Valle",
    albumArt: "/placeholder.svg?height=60&width=60",
    duration: "2:55",
  },
  {
    id: "3",
    name: "Taj Mahal",
    artist: "Jorge Ben Jor",
    albumArt: "/placeholder.svg?height=60&width=60",
    duration: "4:10",
  },
  {
    id: "4",
    name: "País Tropical",
    artist: "Jorge Ben Jor",
    albumArt: "/placeholder.svg?height=60&width=60",
    duration: "3:48",
  },
  {
    id: "5",
    name: "Berimbau",
    artist: "Astrud Gilberto",
    albumArt: "/placeholder.svg?height=60&width=60",
    duration: "2:47",
  },
]

export function SearchSongs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const loadingRef = useRef<HTMLDivElement>(null)

  // Animações GSAP
  useEffect(() => {
    if (!searchContainerRef.current) return

    // Animação de entrada do container
    gsap.fromTo(
      searchContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
    )

    // Animação de foco no input
    if (searchInputRef.current) {
      const input = searchInputRef.current.querySelector("input")

      if (input) {
        input.addEventListener("focus", () => {
          gsap.to(searchInputRef.current, {
            boxShadow: "0 0 0 2px rgba(138, 79, 255, 0.5)",
            duration: 0.3,
          })
        })

        input.addEventListener("blur", () => {
          gsap.to(searchInputRef.current, {
            boxShadow: "none",
            duration: 0.3,
          })
        })
      }
    }

    return () => {
      // Limpar animações e event listeners
      gsap.killTweensOf(searchContainerRef.current)

      if (searchInputRef.current) {
        const input = searchInputRef.current.querySelector("input")
        if (input) {
          input.removeEventListener("focus", () => {})
          input.removeEventListener("blur", () => {})
        }
      }
    }
  }, [])

  // Animação dos resultados de busca
  useEffect(() => {
    if (!resultsRef.current || !searchResults.length) return

    // Animação de entrada dos resultados
    gsap.fromTo(resultsRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })

    // Animação de entrada dos itens
    itemsRef.current.forEach((item, index) => {
      if (!item) return

      gsap.fromTo(
        item,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          delay: 0.1 + index * 0.05,
          ease: "power2.out",
        },
      )
    })

    return () => {
      // Limpar animações
      if (resultsRef.current) {
        gsap.killTweensOf(resultsRef.current)
      }

      itemsRef.current.forEach((item) => {
        if (item) gsap.killTweensOf(item)
      })
    }
  }, [searchResults])

  // Animação de loading
  useEffect(() => {
    if (!loadingRef.current) return

    if (isSearching) {
      gsap.to(loadingRef.current, {
        rotation: 360,
        duration: 1,
        repeat: -1,
        ease: "none",
      })
    } else {
      gsap.killTweensOf(loadingRef.current)
    }

    return () => {
      if (loadingRef.current) {
        gsap.killTweensOf(loadingRef.current)
      }
    }
  }, [isSearching])

  // Simula a busca de músicas
  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchResults([])

    // Simula uma chamada de API
    setTimeout(() => {
      setSearchResults(mockSearchResults)
      setIsSearching(false)
    }, 800)
  }

  // Simula a adição de uma música à fila
  const handleAddToQueue = (songId: string) => {
    const song = searchResults.find((s) => s.id === songId)
    if (!song) return

    // Aqui você faria a chamada para a API do Spotify para adicionar à fila

    // Animação do botão
    const button = document.querySelector(`[data-song-id="${songId}"]`)
    if (button) {
      gsap.to(button, {
        scale: 1.3,
        duration: 0.2,
        onComplete: () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.2,
          })
        },
      })
    }

    toast.success("Música adicionada à fila", {
      description: `${song.name} - ${song.artist}`,
      duration: 3000,
    })
  }

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
    <div ref={searchContainerRef}>
      <h2 className="text-xl font-semibold mb-4">Buscar Músicas</h2>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1" ref={searchInputRef}>
          <Input
            placeholder="Busque por título ou artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-8"
          />
          <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
        </div>
        <Button onClick={handleSearch} disabled={isSearching} className="btn-rio">
          Buscar
        </Button>
      </div>

      {isSearching ? (
        <div className="flex justify-center py-8">
          <div ref={loadingRef} className="rounded-full size-8 border-b-2 border-primary"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div ref={resultsRef}>
          <ScrollArea className="h-[300px] pr-4">
            {searchResults.map((song, index) => (
              <div
                key={song.id}
                ref={(el) => (itemsRef.current[index] = el)}
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{song.duration}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 rounded-full"
                    onClick={() => handleAddToQueue(song.id)}
                    data-song-id={song.id}
                  >
                    <Plus className="size-4" />
                    <span className="sr-only">Adicionar à fila</span>
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      ) : searchQuery ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <p>Nenhum resultado encontrado</p>
          <p className="text-sm">Tente outra busca</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Search className="size-12 mb-2 opacity-50" />
          <p>Busque por suas músicas favoritas</p>
          <p className="text-sm">Digite o nome da música ou do artista</p>
        </div>
      )}
    </div>
  )
}

