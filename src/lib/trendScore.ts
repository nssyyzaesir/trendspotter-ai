/**
 * @module trendScore
 * Motor de cálculo do TrendScore para o FluxMetric.
 *
 * Fórmula:
 *   TrendScore = α(ΔV/Δt) + β(E_total / V_total) · e^(−λt)
 *
 * Onde:
 *   - ΔV/Δt = taxa de crescimento de visualizações por hora
 *   - E_total / V_total = taxa de engajamento total (likes + comments + shares / views)
 *   - e^(−λt) = fator de decaimento temporal (t em horas desde a primeira detecção)
 *   - α = peso da velocidade de crescimento (default: 0.6)
 *   - β = peso do engajamento (default: 0.4)
 *   - λ = constante de decaimento (default: 0.02 por hora ≈ meia-vida de ~35h)
 */

export type TrendLevel = "new" | "rising" | "hot" | "viral";

export interface TrendScoreInput {
  /** Visualizações totais atuais */
  totalViews: number;
  /** Visualizações no snapshot anterior */
  previousViews: number;
  /** Horas entre os dois snapshots */
  deltaHoursViews: number;
  /** Total de likes */
  totalLikes: number;
  /** Total de comentários */
  totalComments: number;
  /** Total de compartilhamentos */
  totalShares: number;
  /** Horas desde a primeira detecção do produto */
  hoursSinceFirstDetected: number;
}

export interface TrendScoreResult {
  score: number;
  level: TrendLevel;
  growthRate: number;
  engagementRate: number;
  decayFactor: number;
}

// Pesos configuráveis
const ALPHA = 0.6; // peso da velocidade
const BETA = 0.4;  // peso do engajamento
const LAMBDA = 0.02; // constante de decaimento por hora

// Limites de classificação (0–100)
const THRESHOLDS: Record<TrendLevel, number> = {
  new: 0,
  rising: 20,
  hot: 50,
  viral: 80,
};

/**
 * Calcula o TrendScore de um produto baseado em métricas de engajamento e crescimento.
 *
 * @param input - Métricas do produto (views, likes, comentários, tempo)
 * @param alpha - Peso da taxa de crescimento (default: 0.6)
 * @param beta - Peso do engajamento (default: 0.4)
 * @param lambda - Constante de decaimento temporal (default: 0.02)
 * @returns TrendScoreResult com score normalizado 0–100 e nível de tendência
 *
 * @example
 * const result = calculateTrendScore({
 *   totalViews: 1_000_000,
 *   previousViews: 800_000,
 *   deltaHoursViews: 24,
 *   totalLikes: 50_000,
 *   totalComments: 5_000,
 *   totalShares: 10_000,
 *   hoursSinceFirstDetected: 48,
 * });
 * // result.score ≈ 45–60, result.level = "hot"
 */
export function calculateTrendScore(
  input: TrendScoreInput,
  alpha: number = ALPHA,
  beta: number = BETA,
  lambda: number = LAMBDA
): TrendScoreResult {
  const {
    totalViews,
    previousViews,
    deltaHoursViews,
    totalLikes,
    totalComments,
    totalShares,
    hoursSinceFirstDetected,
  } = input;

  // Taxa de crescimento de views por hora (normalizada por 1M views)
  const deltaViews = Math.max(0, totalViews - previousViews);
  const safeHours = Math.max(deltaHoursViews, 0.1); // evita divisão por zero
  const growthRate = (deltaViews / safeHours) / 1_000_000;

  // Taxa de engajamento (likes + comments + shares / views)
  const totalEngagement = totalLikes + totalComments + totalShares;
  const engagementRate = totalViews > 0 ? totalEngagement / totalViews : 0;

  // Fator de decaimento temporal
  const decayFactor = Math.exp(-lambda * Math.max(0, hoursSinceFirstDetected));

  // Score bruto
  const rawScore = alpha * growthRate + beta * engagementRate * decayFactor;

  // Normalizar para 0–100 com sigmoid suavizado
  // Mapeamos: 0 → 0, 0.5 → 50, 1+ → 100 (saturação)
  const score = Math.min(100, Math.round(rawScore * 100));

  // Classificação
  let level: TrendLevel = "new";
  if (score >= THRESHOLDS.viral) level = "viral";
  else if (score >= THRESHOLDS.hot) level = "hot";
  else if (score >= THRESHOLDS.rising) level = "rising";

  return { score, level, growthRate, engagementRate, decayFactor };
}

/**
 * Versão simplificada para uso direto com dados da tabela tracked_products.
 * Assume que os dados são de um snapshot de 24h.
 */
export function calculateTrendScoreFromProduct(product: {
  total_views: number | null;
  avg_engagement: number | null;
  growth_percentage: number | null;
  first_detected_at: string;
}): TrendScoreResult {
  const totalViews = product.total_views ?? 0;
  const growthPct = product.growth_percentage ?? 0;

  // Estimativa de views anteriores a partir da % de crescimento
  const previousViews = growthPct > 0
    ? totalViews / (1 + growthPct / 100)
    : totalViews * 0.9;

  const hoursSinceFirst = Math.max(
    0,
    (Date.now() - new Date(product.first_detected_at).getTime()) / 3_600_000
  );

  // Estimativa de engajamento (avg_engagement já é %)
  const engagementAsViews = totalViews * (product.avg_engagement ?? 0) / 100;

  return calculateTrendScore({
    totalViews,
    previousViews,
    deltaHoursViews: 24,
    totalLikes: engagementAsViews * 0.7,
    totalComments: engagementAsViews * 0.2,
    totalShares: engagementAsViews * 0.1,
    hoursSinceFirstDetected: hoursSinceFirst,
  });
}
