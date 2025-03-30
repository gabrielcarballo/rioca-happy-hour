"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"

export function RioHeader() {
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Animação do logo
    gsap.fromTo(
      logoRef.current,
      { rotation: -10, scale: 0.9 },
      {
        rotation: 0,
        scale: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      },
    )

    // Animação de hover no logo
    logoRef.current?.addEventListener("mouseenter", () => {
      gsap.to(logoRef.current, {
        rotation: 5,
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      })
    })

    logoRef.current?.addEventListener("mouseleave", () => {
      gsap.to(logoRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      })
    })

    return () => {
      // Limpar event listeners
      logoRef.current?.removeEventListener("mouseenter", () => {})
      logoRef.current?.removeEventListener("mouseleave", () => {})
    }
  }, [])

  return (
    <div className="flex flex-col items-center text-center">
      <div ref={logoRef} className="relative size-24 cursor-pointer">
        <Image src="/logo.png" alt="Hotel Rio Logo" fill className="object-contain" priority />
      </div>
      <h1 ref={titleRef} className="text-rio-title mt-2">
        Rio Music Lounge
      </h1>
      <p ref={subtitleRef} className="text-rio-subtitle mt-1 max-w-xs">
        Descubra o que está tocando e adicione suas músicas favoritas à nossa playlist
      </p>
    </div>
  )
}

