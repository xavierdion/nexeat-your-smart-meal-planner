## Changements dans `src/pages/Semaine.tsx`

### 1. Supprimer la barre de progression
Retirer entièrement le bloc situé sous les day pills :

```tsx
{/* Progress bar — sous les day pills */}
<div className="px-4 mt-3 flex items-center gap-2">
  <div className="flex-1 h-[3px] rounded-full bg-secondary/30 overflow-hidden">
    <div className="h-full bg-primary rounded-full transition-all"
      style={{ width: `${progressPct}%` }} />
  </div>
  <span className="text-[11px] text-foreground/50 whitespace-nowrap">
    {confirmedMeals}/{TOTAL_MEALS}
  </span>
</div>
```

Les variables `TOTAL_MEALS`, `confirmedMeals`, `progressPct` deviennent inutilisées → les retirer également pour garder le fichier propre. `planAccepted` / `setPlanAccepted` restent utilisés par le CTA.

### 2. Recentrer le point orange du jour actuel
Dans le rendu d'un day pill, le point indicateur (today/completed) est actuellement rendu via `flex justify-center gap-0.5` ce qui le décale légèrement à gauche quand un seul point est présent. De plus, la mini-barre de progression interne `w-[28px] h-1` du pill (qui simule le temps de cuisson) ajoute un espace visuel non aligné.

Pour recentrer le point orange « aujourd'hui » sous le label :
- Remplacer le conteneur `<div className="flex justify-center gap-0.5 mt-1">` par un simple `<div className="mt-1 flex items-center justify-center">` avec une largeur explicite (`w-full`) afin que le point unique soit parfaitement centré sous le numéro.
- Garder le rendu conditionnel (today + completed) tel quel, mais sans `gap-0.5` quand il n'y a qu'un seul point visible.

Aucune autre modification : layout des pills, navigation, MealCards, CTA sticky et sheets restent identiques.
