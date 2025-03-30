"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { gsap } from "gsap"

// Simulação de dados do Spotify - em produção, isso viria da API do Spotify
const mockCurrentTrack = {
  name: "Garota de Ipanema",
  artist: "Tom Jobim & Vinícius de Moraes",
  album: "The Best of Bossa Nova",
  albumArt: "/placeholder.svg?height=300&width=300",
  duration: 180, // segundos
  progress: 45, // segundos
  isPlaying: true,
}

export function NowPlaying() {
  const [currentTrack, setCurrentTrack] = useState(mockCurrentTrack)
  const [progress, setProgress] = useState(mockCurrentTrack.progress)

  const albumArtRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Simula o progresso da música
  useEffect(() => {
    if (!currentTrack.isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= currentTrack.duration) {
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentTrack.isPlaying, currentTrack.duration])

  // Animações GSAP
  useEffect(() => {
    // Animação de rotação do disco
    if (currentTrack.isPlaying && albumArtRef.current) {
      gsap.to(albumArtRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    } else if (albumArtRef.current) {
      gsap.to(albumArtRef.current, {
        rotation: "+=20",
        duration: 1,
        ease: "power1.out",
      })
    }

    // Animação de pulso para o progresso
    if (currentTrack.isPlaying && progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        scale: 1.02,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }

    return () => {
      // Limpar animações
      if (albumArtRef.current) {
        gsap.killTweensOf(albumArtRef.current)
      }
      if (progressBarRef.current) {
        gsap.killTweensOf(progressBarRef.current)
      }
    }
  }, [currentTrack.isPlaying])

  // Formata o tempo em minutos:segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlayPause = () => {
    setCurrentTrack((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }))
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-center mb-4">Tocando Agora</h2>

      <div
        ref={albumArtRef}
        className="relative size-48 mb-4 rounded-full overflow-hidden shadow-lg transition-transform"
        style={{ transformOrigin: "center center" }}
      >
        <Image
          src={currentTrack.albumArt || "/placeholder.svg"}
          alt={`${currentTrack.album} cover`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <Button
            variant="secondary"
            size="icon"
            className="size-12 rounded-full bg-white/80 hover:bg-white shadow-md"
            onClick={togglePlayPause}
          >
            {currentTrack.isPlaying ? (
              <Pause className="size-6 text-primary" />
            ) : (
              <Play className="size-6 text-primary ml-1" />
            )}
          </Button>
        </div>
      </div>

      <div className="w-full text-center">
        <h3 className="text-lg font-bold truncate">{currentTrack.name}</h3>
        <p className="text-sm text-gray-600 truncate">{currentTrack.artist}</p>
        <p className="text-xs text-gray-500 truncate">{currentTrack.album}</p>
      </div>

      <div className="w-full mt-4" ref={progressBarRef}>
        <Progress value={(progress / currentTrack.duration) * 100} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
      </div>
    </div>
  )
}

