/**
 * @module gsapAnimations
 * Funções de animação GSAP reutilizáveis para o FluxMetric Dashboard.
 * Todas as animações pausam quando a aba fica inativa (visibilitychange).
 */

// Lazy import para evitar SSR issues
let gsapInstance: typeof import("gsap").gsap | null = null;

async function getGsap() {
  if (gsapInstance) return gsapInstance;
  const { gsap } = await import("gsap");
  gsapInstance = gsap;

  // Pausar/retomar animações com visibilidade do documento
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });

  return gsap;
}

/**
 * Anima cards com entrada em stagger (cascata de baixo para cima).
 * @param elements - Array de elementos ou ref HTMLElement[]
 * @param delay - Delay inicial antes de iniciar (default: 0)
 */
export async function animateCardEntry(
  elements: (HTMLElement | null)[],
  delay = 0
): Promise<void> {
  const gsap = await getGsap();
  const validElements = elements.filter(Boolean) as HTMLElement[];
  if (!validElements.length) return;

  gsap.fromTo(
    validElements,
    { opacity: 0, y: 24, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.07,
      delay,
    }
  );
}

/**
 * Anima um contador numérico de 0 até o valor alvo.
 * @param element - Elemento HTML onde o número será exibido
 * @param targetValue - Valor final do contador
 * @param duration - Duração da animação em segundos (default: 1.5)
 * @param suffix - Sufixo para exibir após o número (ex: "%", "k")
 */
export async function animateCountUp(
  element: HTMLElement | null,
  targetValue: number,
  duration = 1.5,
  suffix = ""
): Promise<void> {
  if (!element) return;
  const gsap = await getGsap();

  const counter = { value: 0 };
  gsap.to(counter, {
    value: targetValue,
    duration,
    ease: "power2.out",
    onUpdate() {
      element.textContent = Math.round(counter.value).toLocaleString("pt-BR") + suffix;
    },
  });
}

/**
 * Anima uma barra de progresso crescendo para a largura alvo.
 * @param element - Elemento da barra (deve ter display:block)
 * @param percentage - Percentagem alvo (0-100)
 * @param duration - Duração em segundos (default: 0.8)
 */
export async function animateBarGrow(
  element: HTMLElement | null,
  percentage: number,
  duration = 0.8
): Promise<void> {
  if (!element) return;
  const gsap = await getGsap();

  gsap.fromTo(
    element,
    { width: "0%" },
    {
      width: `${Math.min(100, Math.max(0, percentage))}%`,
      duration,
      ease: "power3.out",
    }
  );
}

/**
 * Animação de entrada de texto (simula SplitText com spans).
 * @param element - Elemento de texto
 * @param delay - Delay inicial
 */
export async function animateTextReveal(
  element: HTMLElement | null,
  delay = 0
): Promise<void> {
  if (!element) return;
  const gsap = await getGsap();

  const text = element.textContent ?? "";
  element.innerHTML = text
    .split("")
    .map((char) => `<span style="display:inline-block">${char === " " ? "&nbsp;" : char}</span>`)
    .join("");

  const spans = element.querySelectorAll("span");
  gsap.fromTo(
    spans,
    { opacity: 0, y: 20, rotationX: -30 },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.04,
      stagger: 0.03,
      ease: "power2.out",
      delay,
    }
  );
}

/**
 * Animação de glow pulsante em um elemento.
 * @param element - Elemento alvo
 * @param color - Cor do glow em hex (default: primary blue)
 */
export async function animateGlowPulse(
  element: HTMLElement | null,
  color = "#4f87ff"
): Promise<void> {
  if (!element) return;
  const gsap = await getGsap();

  gsap.to(element, {
    boxShadow: `0 0 30px ${color}80, 0 0 60px ${color}40`,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
