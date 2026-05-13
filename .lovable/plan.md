## Plan — Conformité ODNQ dans Profil.tsx

Deux modifications ciblées dans `src/pages/Profil.tsx` uniquement.

### 1. Reformuler `SCORE_LINES` (haut du fichier)

Remplacer les textes prescriptifs des scores D et E par des descriptifs neutres. A, B, C inchangés.

```ts
const SCORE_LINES: { score: "a" | "b" | "c" | "d" | "e"; label: string; text: string }[] = [
  { score: "a", label: "A", text: "Recette très équilibrée" },
  { score: "b", label: "B", text: "Recette bien équilibrée" },
  { score: "c", label: "C", text: "Équilibre moyen" },
  { score: "d", label: "D", text: "Choix occasionnel" },
  { score: "e", label: "E", text: "Recette plaisir" },
];
```

### 2. Ajouter une mention légale dans la section "Comprendre le score"

Juste après le `<p>` existant ("Indice agrégé à partir des ingrédients via Open Food Facts."), ajouter un second paragraphe à l'intérieur de la même `<section>` :

```tsx
<p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--text-subtle))]">
  Indice descriptif basé sur Open Food Facts. NexEat n'est pas un service de nutrition et ne remplace pas un avis professionnel.
</p>
```

### Hors scope (verrouillé)

- Aucun autre fichier
- Aucune autre section de `Profil.tsx`
- `Pill`, structure de `SCORE_LINES`, tokens CSS : intacts
