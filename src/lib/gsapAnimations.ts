import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Text reveal animation using clip-path (word by word).
 * Wraps each word in a span with overflow:hidden for cinema-style reveal.
 */
export function animateTextReveal(element: HTMLElement | null, delay = 0) {
  if (!element) return;

  const originalText = element.textContent || "";
  const words = originalText.split(" ");

  element.innerHTML = words
    .map(
      (word) =>
        `<span class="inline-block overflow-hidden"><span class="inline-block">${word}&nbsp;</span></span>`
    )
    .join("");

  const spans = element.querySelectorAll("span > span");

  gsap.fromTo(
    spans,
    { y: "110%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      duration: 0.9,
      delay,
      stagger: 0.06,
      ease: "power4.out",
    }
  );
}

/**
 * Card entry animation with clip-path reveal.
 */
export function animateCardEntry(
  elements: (HTMLElement | null)[],
  delay = 0
) {
  const valid = elements.filter(Boolean) as HTMLElement[];
  if (!valid.length) return;

  gsap.fromTo(
    valid,
    { y: 40, opacity: 0, clipPath: "inset(0 0 24px 0)" },
    {
      y: 0,
      opacity: 1,
      clipPath: "inset(0 0 0px 0)",
      duration: 0.8,
      delay,
      stagger: 0.1,
      ease: "power3.out",
    }
  );
}

/**
 * ScrollTrigger card reveal — use on grid containers.
 */
export function animateScrollCards(container: HTMLElement | null, selector = ".card-reveal") {
  if (!container) return;
  const cards = container.querySelectorAll(selector);
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { y: 48, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        once: true,
      },
    }
  );
}

/**
 * Animated number counter (CountUp effect) on scroll.
 */
export function animateCountUp(
  el: HTMLElement | null,
  target: number,
  suffix = "",
  prefix = ""
) {
  if (!el) return;
  const obj = { val: 0 };

  gsap.to(obj, {
    val: target,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix;
    },
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      once: true,
    },
  });
}

/**
 * Section fade-up reveal via ScrollTrigger.
 */
export function animateSectionEntry(
  el: HTMLElement | null,
  options?: { delay?: number; y?: number; duration?: number }
) {
  if (!el) return;
  const { delay = 0, y = 40, duration = 0.9 } = options ?? {};

  gsap.fromTo(
    el,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    }
  );
}

/**
 * SVG path draw animation (for timeline connector lines).
 */
export function animateSvgDraw(path: SVGPathElement | null, delay = 0) {
  if (!path) return;
  const length = path.getTotalLength();

  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  gsap.to(path, {
    strokeDashoffset: 0,
    duration: 1.5,
    delay,
    ease: "power2.out",
    scrollTrigger: { trigger: path, start: "top 80%", once: true },
  });
}
