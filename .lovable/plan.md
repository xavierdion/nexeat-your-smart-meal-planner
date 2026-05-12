# Migration des couleurs hardcodées vers tokens sémantiques

## Phase 0 — Vérification (déjà faite)

`src/index.css` confirme que les tokens HSL correspondent **exactement** aux hex de la palette canonique :

| Token | HSL | Hex équivalent |
|---|---|---|
| `--background` | 60 14% 95% | #F5F5F0 ✓ |
| `--foreground` | 222 11% 18% | #2A2D35 ✓ |
| `--primary` | 199 17% 37% | #4A6670 ✓ |
| `--secondary` | 165 24% 72% | #A8C5BC ✓ |
| `--accent` | 14 67% 63% | #E07A5F ✓ |
| `--border` | 56 11% 90% | #E8E8E4 ✓ |

Les variables sont au format HSL brut (sans `hsl()`), donc les opacités Tailwind (`/50`, `/70`…) fonctionneront nativement. Migration sûre visuellement.

## Phase 1 — Audit complet (avant édition)

Lancer un grep exhaustif pour inventorier tous les usages, y compris les variantes oubliées dans le prompt original :

```
rg -n "(text|bg|border|ring|from|to|via|fill|stroke|placeholder:text|divide|outline|shadow)-\[#(2A2D35|4A6670|E07A5F|A8C5BC|E8E8E4|F5F5F0)" src/
```

Et aussi les hex inline en `style={{...}}` :

```
rg -n "#(2A2D35|4A6670|E07A5F|A8C5BC|E8E8E4|F5F5F0)" src/ -g '!index.css'
```

## Phase 2 — Mapping appliqué

Mapping étendu (couvre les cas oubliés du prompt initial) :

```
text-[#2A2D35]       → text-foreground
text-[#2A2D35]/NN    → text-foreground/NN
bg-[#2A2D35]         → bg-foreground
text-[#4A6670]       → text-primary
text-[#4A6670]/NN    → text-primary/NN
bg-[#4A6670]         → bg-primary
border-[#4A6670]     → border-primary
ring-[#4A6670]       → ring-primary
text-[#E07A5F]       → text-accent
bg-[#E07A5F]         → bg-accent
border-[#E07A5F]     → border-accent
ring-[#E07A5F]       → ring-accent
text-[#A8C5BC]       → text-secondary
bg-[#A8C5BC]         → bg-secondary
border-[#A8C5BC]     → border-secondary
border-[#E8E8E4]     → border-border
bg-[#E8E8E4]         → bg-muted (équivalent visuel à confirmer cas par cas — fallback : laisser le hex)
bg-[#F5F5F0]         → bg-background
```

**Inline `style={{ color: "#..." }}`** : laissés tels quels (hors scope CSS classes), sauf si trivialement remplaçables par une className.

**Cas spécial `bg-[#E8E8E4]`** : `--muted` vaut `60 10% 90%` (proche mais pas identique à `#E8E8E4` qui est `56 11% 90%`). Conservera `border-border` pour bordures (exact), mais pour `bg-[#E8E8E4]` (ex. timeline rail), garder le hex pour préserver le diff visuel zéro. À retraiter dans un futur prompt si on aligne `--muted`.

## Phase 3 — Pilote sur 1 fichier

Migrer **`src/pages/Profil.tsx`** en premier (plus simple, déjà partiellement tokenisé).
Vérifier visuellement via screenshot avant/après. Valider, puis dérouler.

## Phase 4 — Migration en lot

Ordre :
1. `src/pages/Aujourdhui.tsx`
2. `src/pages/Semaine.tsx`
3. `src/pages/Epicerie.tsx`
4. `src/pages/Onboarding.tsx`, `OnboardingStep2.tsx`, `OnboardingStep3.tsx`
5. `src/components/MealCard.tsx`, `AppShell.tsx`, `RecipeSheet.tsx`, `SwapSheet.tsx`
6. Balayer `src/components/ui/pill.tsx`, `editorial-section.tsx`, `ProactiveContextBlock.tsx`, `ScoreTooltip.tsx` au passage si touchés.

## Phase 5 — Vérification finale

```
rg "(text|bg|border|ring|from|to|via|fill|stroke)-\[#(2A2D35|4A6670|E07A5F|A8C5BC|F5F5F0)\b" src/
```
→ doit retourner **0 ligne** (sauf `#E8E8E4` en `bg-` exception documentée).

Build auto Lovable doit passer. QA visuelle rapide sur les 4 onglets principaux.

## Hors scope (non touché)

- Hex hors palette : `#FEF0ED`, `#F0F4F3`, `#FAFAF7`, `#1a1a1a`, `#E8F0EE`, `#E8E2D8`, `#D4C9B8`, etc.
- `text-[hsl(var(--sage))]` déjà sémantique → laissé tel quel.
- Styles inline `style={{ background: ... }}` du `PhotoPlaceholder`.
- Aucune modification de spacing, hiérarchie, logique, ou structure JSX.
