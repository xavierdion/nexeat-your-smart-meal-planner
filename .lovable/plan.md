## Refonte "Prochainement" → Timeline horaire + retrait du banner Contexte

### Objectif
Remplacer la grille 2-cards "Maintenant / Ensuite" par une **barre temporelle horizontale** qui visualise le flow de la journée (repas + cours/événements) avec un indicateur "tu es ici" qui avance selon l'heure courante. Le banner `ProactiveContextBlock` devient redondant et est retiré.

### Fichier modifié
- `src/pages/Aujourdhui.tsx` uniquement

### 1. Retrait du banner Contexte calendrier
- Supprimer le bloc `<ProactiveContextBlock variant="banner" ...>` (mx-4 mt-4 mb-2)
- Supprimer l'import `ProactiveContextBlock`
- Le contexte "Examen IFT-2008 18h" sera désormais représenté comme un **point d'événement sur la timeline**, ce qui suffit visuellement

### 2. Nouvelle data : timeline du jour
Fusion des repas (`MEALS`) et événements calendrier dans un tableau unique trié par heure :

```ts
type TimelineKind = "meal" | "event";
interface TimelineItem {
  time: string;        // "7h", "12h", "13h", "15h30", "18h"
  hour: number;        // 7, 12, 13, 15.5, 18 (pour positionnement)
  label: string;       // "Déjeuner", "Dîner", "IFT-2008", "Souper", "Examen IFT-2008"
  kind: TimelineKind;
  done?: boolean;      // pour les repas terminés
}
```

Items hardcodés (cohérents avec MEALS et le banner actuel) :
- 7h — Déjeuner (meal, done)
- 12h — Dîner (meal)
- 13h — IFT-2008 (event)
- 15h30 — Souper (meal)
- 18h — Examen IFT-2008 (event, accent coral)

### 3. Composant timeline (inline dans Aujourdhui.tsx)

Layout dans `EditorialSection eyebrow="Ta journée"` :

```text
   7h        12h   13h    15h30        18h
   ●─────────●─────●──────●═══════════►◆
   Déjeuner  Dîner IFT    Souper       Examen
   ✓                ↑ tu es ici
```

Structure visuelle :
- Container : `bg-white rounded-xl px-4 py-5 shadow-card`
- **Rail** : `relative h-[2px] bg-[#E8E8E4] my-8` couvrant 7h→20h (range fixe)
- **Progress fill** : overlay coral de 7h jusqu'à `now`, `bg-[#E07A5F]/40`
- **Indicateur "now"** : pastille coral pleine + label "Maintenant · 14h32" positionné au pourcentage de l'heure courante
- **Points** : positionnés en `left: ${(hour-7)/(20-7)*100}%`
  - meal done : cercle `bg-[#A8C5BC]` 10px + check
  - meal upcoming : cercle `bg-white border-2 border-[#4A6670]` 10px
  - event : losange (rotate-45) `bg-[#E07A5F]` 10px
- **Labels** : au-dessus du point, time `text-eyebrow`, label `text-[12px] font-semibold` (truncate)
- **État done** : opacity-60 sur les items passés autres que "now"

### 4. Heure courante (mock-friendly)
```ts
const now = new Date();
const nowHour = now.getHours() + now.getMinutes() / 60;
const nowLabel = `${now.getHours()}h${String(now.getMinutes()).padStart(2,"0")}`;
```
Range timeline : 7h → 20h (13h fenêtre = 100% width).
Si `nowHour < 7` → indicateur à 0%, label "Bientôt". Si `> 20` → 100%, label "Journée terminée".

### 5. Eyebrow / titre de section
- Eyebrow change : "Prochainement" → **"Ta journée"**
- Garde `EditorialSection` avec même padding

### 6. Légende compacte (optionnelle, sous le rail)
Petite ligne : `● Repas   ◆ Événement` en `text-[11px] text-[#2A2D35]/50` pour clarifier les symboles.

### Hors scope
- Pas de modification de `MEALS`, `MealCard`, `RecipeSheet`
- Pas de touche au header éditorial, au "Locked notice", ni au CTA "Voir l'épicerie"
- `ProactiveContextBlock` n'est PAS supprimé du projet — Semaine.tsx pourrait l'utiliser plus tard ; on retire seulement l'import + l'usage dans Aujourdhui

### Critères de succès
1. Build passe
2. Le banner Contexte calendrier n'apparaît plus
3. Une barre temporelle horizontale montre les 5 moments-clés du jour avec un curseur "Maintenant" positionné selon l'heure réelle
4. Repas terminés visuellement distincts (sage + check), événements distincts des repas (losange coral)
5. Aucune régression sur les 3 MealCard ni sur RecipeSheet
