import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  delay?: number;
  duration?: number;
  y?: number;
  clipReveal?: boolean;
  stagger?: number;
}

/**
 * Hook declarativo para GSAP ScrollTrigger reveals.
 * Retorna ref para aplicar na section/container desejado.
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    delay = 0,
    duration = 0.8,
    y = 32,
    clipReveal = false,
    stagger = 0,
  } = options;

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger > 0 ? gsap.utils.toArray(el.children) : [el];

    if (clipReveal) {
      gsap.fromTo(
        targets,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    } else {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [delay, duration, y, clipReveal, stagger]);

  return ref;
}
