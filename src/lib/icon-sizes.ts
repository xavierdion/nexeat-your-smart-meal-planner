/**
 * NexEat — tailles d'icônes standardisées (Lucide).
 *
 * Échelle officielle :
 *   xs = 12  → metadata inline, score pills
 *   sm = 14  → chip icons, status pills, list metadata
 *   md = 18  → action buttons inline, list items
 *   lg = 22  → navigation, headers
 *   xl = 28  → hero icons
 *
 * strokeWidth :
 *   2     → défaut
 *   2.25  → actif / sélectionné
 *   2.5   → emphasis (rare, CTA)
 *
 * Toute valeur hors-grille doit être justifiée par un commentaire `// DOC:` au point d'usage.
 */
export const ICON = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
} as const;

export const STROKE = {
  default: 2,
  active: 2.25,
  emphasis: 2.5,
} as const;