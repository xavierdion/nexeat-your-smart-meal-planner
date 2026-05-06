## Objectif

Transformer la section « Ta journée » de /aujourd-hui : au lieu d'une échelle horaire 7h–20h où les blocs sont dimensionnés selon leur durée (et où les repas courts deviennent illisibles), afficher une **séquence simple des prochains événements** — un aperçu de ce qui s'en vient, pas un planning complet.

## Nouvelle section « À venir »

Carte blanche, même style que l'actuelle, contenant :

- **En-tête** : « À venir » (gauche, uppercase 12px) + petite mention « Prochaines heures » (droite, 11px gris)
- **Liste horizontale scrollable** des 4–5 prochains événements à partir de l'heure actuelle (mock : ~9h30), chacun affiché comme une **pastille de taille égale** (largeur fixe ~96px), peu importe la durée réelle.

Chaque pastille contient :
- Heure en haut (ex. « 12h »)
- Icône (repas ou cours)
- Label court (ex. « Diner », « IFT-2008 »)
- Style visuel distinct : repas en vert sage (#A8C5BC/60), cours en corail clair (#FEF0ED + bordure)

Entre chaque pastille, un petit séparateur (chevron `›` ou trait fin) pour suggérer la séquence temporelle sans imposer une échelle.

La **première pastille** est marquée comme « Maintenant » ou « Prochain » avec une bordure corail #E07A5F pour attirer l'œil.

## Données affichées (mock, à partir de ~9h30)

1. Diner — 12h — repas
2. IFT-2008 — 13h — cours
3. Souper — 15h30 — repas
4. Examen IFT-2008 — 18h — cours

Le déjeuner de 7h est déjà passé → exclu de la liste.

## Suppressions

- Markers d'heures (7h, 10h, 13h, 16h, 19h)
- Track avec gridlines
- Indicateur "Maintenant" en barre verticale
- Légende sous le track (Repas / Cours / Maintenant) — devient inutile car les pastilles parlent d'elles-mêmes

## Conserve

- Le reste de la page intact (header, banner contexte, cartes repas, notice, CTA)
- Les constantes `MEALS`, `MealIcon`, `SCORE_STYLES`

## Détails techniques

Fichier modifié : `src/pages/Aujourdhui.tsx`

- Supprimer `TIMELINE_START`, `TIMELINE_END`, `TIMELINE_HOURS`, `pct()`, `BLOCKS`, `TimelineBlock`
- Nouveau tableau `UPCOMING` : `{ time: string, label: string, kind: "meal"|"class", icon?: MealType }[]`
- Container : `flex gap-2 overflow-x-auto -mx-4 px-4 pb-1` pour scroll horizontal débordant proprement
- Pastille : `w-[96px] shrink-0 rounded-xl px-3 py-3 flex flex-col items-center gap-1`
- Première pastille : `ring-2 ring-[#E07A5F]` + petit label « Prochain » au-dessus
