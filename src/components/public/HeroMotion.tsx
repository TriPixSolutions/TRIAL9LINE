'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ButtonRoll } from './ButtonRoll'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function HeroMotion() {
  const containerRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const mediaContainerRef = useRef<HTMLDivElement>(null)
  const floatingCardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Check reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) return

      // Short ordered hero entrance sequence
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      if (badgeRef.current) {
        tl.from(badgeRef.current, {
          opacity: 0,
          y: -12,
          duration: 0.6,
        })
      }

      if (headingRef.current) {
        tl.from(
          headingRef.current,
          {
            opacity: 0,
            y: 24,
            duration: 0.8,
          },
          '-=0.4'
        )
      }

      if (paragraphRef.current) {
        tl.from(
          paragraphRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.7,
          },
          '-=0.5'
        )
      }

      if (actionsRef.current) {
        tl.from(
          actionsRef.current.children,
          {
            opacity: 0,
            y: 14,
            duration: 0.6,
            stagger: 0.1,
          },
          '-=0.4'
        )
      }

      if (mediaContainerRef.current) {
        tl.from(
          mediaContainerRef.current,
          {
            opacity: 0,
            scale: 0.98,
            y: 20,
            duration: 0.9,
          },
          '-=0.5'
        )
      }

      // Small bounded parallax on the floating reel card during scroll
      if (floatingCardRef.current && mediaContainerRef.current) {
        gsap.to(floatingCardRef.current, {
          y: -28,
          ease: 'none',
          scrollTrigger: {
            trigger: mediaContainerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} className="relative w-full p-2.5 sm:p-4 md:p-6 bg-[#faf9fc]">
      {/* ATMOSPHERIC PLUM-INDIGO HERO CONTAINER WITH SOFT ROUNDED EDGES */}
      <div className="relative w-full rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-gradient-to-b from-[#2d0744] via-[#4e0a50] to-[#1a153f] text-white pt-28 sm:pt-36 md:pt-44 pb-12 sm:pb-16 md:pb-24 px-4 sm:px-8 md:px-12 border border-white/10 shadow-xl">
        {/* Subtle radial light bloom in background */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] md:h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(226,146,220,0.18)_0%,rgba(78,10,80,0)_70%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Content Centered Stack */}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center z-10">
          {/* Eyebrow capsule badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 font-sans text-xs uppercase tracking-widest font-semibold mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#feaaf7] animate-pulse" />
            <span>Toronto · Creative &amp; Marketing Studio</span>
          </div>

          {/* Expressive Editorial Serif Headline with Selective Italic Emphasis */}
          <h1
            ref={headingRef}
            className="font-serif font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.05] text-white mb-6"
          >
            Creative stories.<br />
            <span className="italic font-normal text-white">Lasting</span> impressions.
          </h1>

          {/* Neutral, readable sans-serif supporting text */}
          <p
            ref={paragraphRef}
            className="font-sans text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal"
          >
            Film, photography and marketing for restaurants and ambitious brands. Based in Toronto.
          </p>

          {/* Compact capsule actions */}
          <div ref={actionsRef} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14">
            <ButtonRoll href="/work" variant="white" size="lg" showArrow={false}>
              Explore our work ↓
            </ButtonRoll>
            <ButtonRoll href="/contact" variant="secondary" size="lg" showArrow={true}>
              Start a project
            </ButtonRoll>
          </div>
        </div>

        {/* LAYERED 2D MEDIA COMPOSITION */}
        <div
          ref={mediaContainerRef}
          className="relative max-w-5xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/15 aspect-[16/9] md:aspect-[21/9] bg-black/40 mt-2 sm:mt-4"
        >
          {/* Main production studio image */}
          <Image
            src="/images/agency/film-production.webp"
            alt="Cinema camera in a minimal film studio"
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />

          {/* Soft cinematic vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

          {/* Bottom metadata banner */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-white/90">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-fixed" />
              <span>TRAIL9INE REEL // CULINARY CINEMA · 4K PRORES</span>
            </div>
            <span className="hidden sm:inline-block font-sans text-xs uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              Toronto · On Set
            </span>
          </div>

          {/* LAYER 2: Floating Bounded Parallax Reel Card */}
          <div
            ref={floatingCardRef}
            className="hidden sm:block absolute top-6 right-6 w-44 md:w-52 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/25 bg-black/60 z-20"
          >
            <Image
              src="/images/agency/social-strategy.webp"
              alt="Social media content planning"
              fill
              sizes="220px"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="font-sans text-[11px] uppercase tracking-wider text-white font-semibold">
                Social Reel · 9:16
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
