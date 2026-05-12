## Problème

Sur la timeline horizontale actuelle (`src/pages/Aujourdhui.tsx`), les labels des items proches dans le temps (12h Dîner / 13h IFT-2008 / 15h30 Souper) se chevauchent, et le label "Maintenant · 15h15" passe par-dessus les marqueurs voisins. Le format horizontal sur 7h→20h compresse trop d'information sur une seule ligne.

## Solution retenue : timeline verticale segmentée

Remplacer la barre horizontale par une **liste verticale chronologique** avec un rail à gauche, un marqueur par item, et le label/heure à droite. C'est le pattern naturel pour 5+ items horaires sur mobile (390px) — aucun chevauchement possible, lecture immédiate.

### Layout cible

```text
│
●  7h00     Déjeuner                    ✓ terminé
│
●  12h00    Dîner                       dans 2h30
│
◆  13h00    IFT-2008                    cours
│
┃ ← MAINTENANT · 15h15  (barre coral pleine sur le segment courant)
│
●  15h30    Souper                      ce soir
│
◆  18h00    Examen IFT-2008             événement
│
```

### Spécifications visuelles

- Container : `bg-white rounded-xl px-5 py-5 shadow-card`
- Rail vertical : `absolute left-[22px] top-0 bottom-0 w-[2px] bg-[#E8E8E4]`
- Segment "passé" (au-dessus du now indicator) : overlay `bg-[#E07A5F]/40` sur le rail
- Items : `flex items-start gap-4 py-3` — marqueur 14px à gauche aligné sur le rail
  - Repas terminé : cercle sage `#A8C5BC` + check blanc
  - Repas à venir : cercle blanc bordure slate 2px
  - Événement : losange coral `#E07A5F` 12px (rotate-45)
- Colonne texte (droite du marqueur) :
  - Heure `text-[11px] uppercase tracking-wide text-[#2A2D35]/50 font-semibold`
  - Label `text-[14px] font-semibold text-[#2A2D35]` (ligne suivante)
  - Statut secondaire `text-[12px] text-[#2A2D35]/60` (optionnel, à droite via `ml-auto`)
- Items passés (sauf done explicite) : `opacity-60`

### Indicateur "Maintenant"

Inséré comme une **rangée à part entière** entre les deux items qui encadrent `nowHour` :
- Petite barre horizontale coral pleine `h-[2px] bg-[#E07A5F]` qui traverse depuis le rail
- Pastille coral `w-3 h-3 rounded-full bg-[#E07A5F] ring-4 ring-[#E07A5F]/20` sur le rail
- Label `MAINTENANT · 15h15` en `text-[11px] font-bold text-[#E07A5F] uppercase tracking-wide`
- Si `nowHour < TL_START` → indicateur tout en haut, label "Bientôt"
- Si `nowHour > TL_END` → indicateur tout en bas, label "Journée terminée"

### Légende

Conservée telle quelle sous la timeline, avec border-top.

## Fichier modifié

- `src/pages/Aujourdhui.tsx` uniquement — remplace le bloc `<div className="relative h-[110px]">...</div>` par la nouvelle structure verticale. Aucun changement aux données `TIMELINE`, ni aux MealCards, ni au reste de la page.

## Hors scope

- Pas de changement à `MealCard`, `RecipeSheet`, `SwapSheet`
- Pas de changement aux données mock
- Pas de changement à la page Semaine ni ailleurs

## Critères de succès

1. Aucun chevauchement de texte, peu importe les heures des items
2. Les 5 items restent visibles sans scroll interne
3. L'indicateur "Maintenant" reste lisible et bien positionné chronologiquement
4. Distinction visuelle repas (cercle) vs événement (losange) conservée
5. Build passe
