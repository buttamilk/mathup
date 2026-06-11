/**
 * Final-year math exam topic dataset.
 * Covers the standard Abitur / A-level curriculum:
 * Analysis, Linear Algebra, Probability & Statistics, Geometry.
 *
 * type: "article" = theory/worked example  |  "video" = visual explanation
 */

export type TopicType = "article" | "video";

export interface MathTopic {
  id: string;
  title: string;
  type: TopicType;
  category: "Analysis" | "Linear Algebra" | "Probability" | "Geometry";
  popular?: boolean;   // shown in "Popular searches" chips
  gap?: boolean;       // shown in "Common knowledge gaps" chips
}

export const MATH_TOPICS: MathTopic[] = [
  // ── Analysis ──────────────────────────────────────────────────────────────
  { id: "a01", title: "Quadratic functions & equations",  type: "article", category: "Analysis",       popular: true },
  { id: "a02", title: "Polynomial functions",             type: "video",   category: "Analysis" },
  { id: "a03", title: "Exponential functions",            type: "article", category: "Analysis",       popular: true },
  { id: "a04", title: "Logarithmic functions",            type: "video",   category: "Analysis" },
  { id: "a05", title: "Differentiation rules",            type: "article", category: "Analysis" },
  { id: "a06", title: "Curve sketching",                  type: "video",   category: "Analysis",       gap: true },
  { id: "a07", title: "Tangent lines",                    type: "article", category: "Analysis",       popular: true },
  { id: "a08", title: "Optimization problems",            type: "video",   category: "Analysis",       gap: true },
  { id: "a09", title: "Definite integrals",               type: "article", category: "Analysis" },
  { id: "a10", title: "Area between curves",              type: "video",   category: "Analysis",       gap: true },
  { id: "a11", title: "Antiderivatives",                  type: "article", category: "Analysis" },
  { id: "a12", title: "Inflection points",                type: "video",   category: "Analysis" },
  { id: "a13", title: "Monotony & extrema",               type: "article", category: "Analysis",       gap: true },
  { id: "a14", title: "Rational functions",               type: "video",   category: "Analysis" },
  { id: "a15", title: "Newton's method",                  type: "article", category: "Analysis" },
  { id: "a16", title: "Implicit differentiation",         type: "video",   category: "Analysis" },

  // ── Linear Algebra ─────────────────────────────────────────────────────────
  { id: "l01", title: "Vectors & vector operations",      type: "article", category: "Linear Algebra", popular: true },
  { id: "l02", title: "Dot product & cross product",      type: "video",   category: "Linear Algebra" },
  { id: "l03", title: "Lines in 3D space",                type: "article", category: "Linear Algebra" },
  { id: "l04", title: "Planes in 3D space",               type: "video",   category: "Linear Algebra", gap: true },
  { id: "l05", title: "Distance: point to plane",         type: "article", category: "Linear Algebra", gap: true },
  { id: "l06", title: "Linear equation systems",          type: "video",   category: "Linear Algebra" },
  { id: "l07", title: "Gaussian elimination",             type: "article", category: "Linear Algebra" },
  { id: "l08", title: "Matrices & transformations",       type: "video",   category: "Linear Algebra" },
  { id: "l09", title: "Angles between vectors",           type: "article", category: "Linear Algebra" },
  { id: "l10", title: "Parametric equations",             type: "video",   category: "Linear Algebra", gap: true },

  // ── Probability & Statistics ───────────────────────────────────────────────
  { id: "p01", title: "Probability basics",               type: "article", category: "Probability" },
  { id: "p02", title: "Conditional probability",          type: "video",   category: "Probability",    popular: true },
  { id: "p03", title: "Probability trees",                type: "article", category: "Probability",    popular: true },
  { id: "p04", title: "Binomial distribution",            type: "video",   category: "Probability",    gap: true },
  { id: "p05", title: "Normal distribution",              type: "article", category: "Probability",    gap: true },
  { id: "p06", title: "Expected value & variance",        type: "video",   category: "Probability" },
  { id: "p07", title: "Hypothesis testing",               type: "article", category: "Probability",    gap: true },
  { id: "p08", title: "Bayes' theorem",                   type: "video",   category: "Probability" },
  { id: "p09", title: "Compound interest",                type: "article", category: "Probability",    popular: true },
  { id: "p10", title: "Combinatorics & permutations",     type: "video",   category: "Probability" },
  { id: "p11", title: "Correlation analysis",             type: "article", category: "Probability" },
  { id: "p12", title: "Confidence intervals",             type: "video",   category: "Probability",    gap: true },

  // ── Geometry ───────────────────────────────────────────────────────────────
  { id: "g01", title: "Trigonometry: sin, cos, tan",      type: "article", category: "Geometry",       popular: true },
  { id: "g02", title: "Sine & cosine rule",               type: "video",   category: "Geometry" },
  { id: "g03", title: "Circle geometry",                  type: "article", category: "Geometry" },
  { id: "g04", title: "Coordinate geometry",              type: "video",   category: "Geometry" },
  { id: "g05", title: "Congruence & similarity",          type: "article", category: "Geometry" },
  { id: "g06", title: "Pythagoras in 3D",                 type: "video",   category: "Geometry",       gap: true },
];

export const POPULAR  = MATH_TOPICS.filter((t) => t.popular);
export const GAP_TOPICS = MATH_TOPICS.filter((t) => t.gap);
