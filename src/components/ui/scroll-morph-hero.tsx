"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

export interface ProjectPreview {
  title: string;
  subtitle: string;
  href: string;
  src: string;
  accent: string;
}

interface FlipCardProps {
  project: ProjectPreview;
  index: number;
  target: { x: number; y: number; rotation: number; scale: number; opacity: number };
}

const IMG_WIDTH = 132;
const IMG_HEIGHT = 178;
const MAX_SCROLL = 3000;

const DEFAULT_PROJECTS: ProjectPreview[] = [
  {
    title: "SmbaMusic",
    subtitle: "YouTube music player",
    href: "https://smbamusic.vercel.app/",
    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=85",
    accent: "#ff5f9e",
  },
  {
    title: "Trip Packing Helper",
    subtitle: "Smart checklist builder",
    href: "https://smba11.github.io/trip-packing-helper/",
    src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=85",
    accent: "#36d6a4",
  },
  {
    title: "The Imposter Game",
    subtitle: "Party game of deception",
    href: "https://smba11.github.io/the-imposters-game/",
    src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=85",
    accent: "#7c5cff",
  },
  {
    title: "Imposter Online",
    subtitle: "Synced real-time voting",
    href: "https://imposter-online-7w5d.onrender.com/",
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=85",
    accent: "#5d84ff",
  },
  {
    title: "SMBAFLEX",
    subtitle: "Private cinema app",
    href: "https://smbaflex.vercel.app/",
    src: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=85",
    accent: "#f20d19",
  },
];

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

function FlipCard({ project, index, target }: FlipCardProps) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noreferrer"
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 42,
        damping: 16,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      aria-label={`Open ${project.title}`}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-[22px] border border-white/15 bg-neutral-900 shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={project.src} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/55">
              {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 text-base font-black leading-tight text-white">{project.title}</p>
          </div>
        </div>

        <div
          className="absolute inset-0 flex h-full w-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/20 bg-neutral-950 p-4 shadow-2xl"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="h-2 w-12 rounded-full" style={{ background: project.accent }} />
          <div>
            <p className="text-lg font-black leading-tight text-white">{project.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/60">{project.subtitle}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
            Open <ExternalLink size={13} />
          </span>
        </div>
      </motion.div>
    </motion.a>
  );
}

export default function IntroAnimation({ projects = DEFAULT_PROJECTS }: { projects?: ProjectPreview[] }) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const total = projects.length;

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  const morphProgress = useTransform(virtualScroll, [0, 700], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
  const scrollRotate = useTransform(virtualScroll, [700, MAX_SCROLL], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 80);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2100);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const scatterPositions = useMemo(() => {
    return projects.map(() => ({
      x: (Math.random() - 0.5) * 1300,
      y: (Math.random() - 0.5) * 900,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, [projects]);

  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothMouseX, smoothScrollRotate]);

  const contentOpacity = useTransform(smoothMorph, [0.78, 1], [0, 1]);
  const contentY = useTransform(smoothMorph, [0.78, 1], [20, 0]);

  return (
    <div ref={containerRef} className="relative h-full min-h-screen w-full overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.16),transparent_34%),linear-gradient(180deg,#0d0d0d,#020202)]" />
      <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center">
        <div className="pointer-events-none absolute top-1/2 z-0 flex -translate-y-1/2 flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="max-w-2xl text-4xl font-black tracking-tight text-white md:text-6xl"
          >
            Projects you can step inside.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.58 - morphValue } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-5 text-xs font-bold tracking-[0.24em] text-white/55"
          >
            SCROLL TO BROWSE
          </motion.p>
        </div>

        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="pointer-events-none absolute top-[9%] z-10 flex max-w-3xl flex-col items-center justify-center px-4 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/45">Selected work</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Scroll through every project.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62 md:text-base">
            Hover a card to flip it. Click any card to open the live project in a new tab.
          </p>
        </motion.div>

        <div className="relative flex h-full min-h-screen w-full items-center justify-center">
          {projects.map((project, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 154;
              const lineTotalWidth = total * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2 + lineSpacing / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);
              const circleRadius = Math.min(minDimension * 0.35, 360);
              const circleAngle = (i / total) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.6);
              const arcRadius = baseRadius * (isMobile ? 1.35 : 1.05);
              const arcApexY = containerSize.height * (isMobile ? 0.38 : 0.24);
              const arcCenterY = arcApexY + arcRadius;
              const spreadAngle = isMobile ? 96 : 126;
              const startAngle = -90 - spreadAngle / 2;
              const step = total <= 1 ? 0 : spreadAngle / (total - 1);
              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;
              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.35 : 1.72,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return <FlipCard key={project.href} project={project} index={i} target={target} />;
          })}
        </div>
      </div>
    </div>
  );
}
