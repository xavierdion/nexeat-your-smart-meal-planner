# Guide photos NexEat — remplacer tous les placeholders

## 1. Où vont les fichiers

Crée le dossier : `src/assets/meals/`

Toutes les photos vont là. Format recommandé :
- **JPG** (pas PNG, plus léger)
- **Ratio 16:10** (c'est le format des cartes `MealCard` plein)
- **1200×750 px** minimum (rétine), ~150–250 Ko après compression
- Cadrage serré sur l'assiette, lumière naturelle, fond neutre crème/bois clair pour matcher la palette sage/cream
- Évite les filtres saturés — esthétique éditoriale, pas Instagram néon

Nommage : `kebab-case.jpg`, sans accents (ex. `bol-coreen-bibimbap.jpg`).

## 2. Liste complète des photos à fournir

**33 recettes uniques** au total. Une photo par recette.

### Déjeuners (10)
1. `smoothie-bowl-mangue-kefir-granola.jpg` — Smoothie bowl mangue-kéfir-granola
2. `pancakes-sarrasin-bleuets.jpg` — Pancakes sarrasin-bleuets-sirop d'érable
3. `acai-bowl-amandes-banane-coco.jpg` — Açaï bowl amandes-banane-noix de coco
4. `oeufs-benedictine-vege.jpg` — Œufs bénédictine végé sur muffin anglais
5. `french-toast-cannelle-compote.jpg` — French toast cannelle-compote de pommes
6. `crepes-sarrasin-compote.jpg` — Crêpes sarrasin-compote-sirop d'érable
7. `granola-yogourt-grec-fruits.jpg` — Granola maison-yogourt grec-fruits frais
8. `bol-acai-granola-banane.jpg` — Bol açaï-granola-banane
9. `tartines-avocat-oeuf-poche.jpg` — Tartines avocat-œuf poché
10. `yogourt-grec-fruits-miel.jpg` — Yogourt grec-fruits-miel
11. `smoothie-bowl-mangue-coco.jpg` — Smoothie bowl mangue-coco
12. `pain-dore-bleuets.jpg` — Pain doré aux bleuets
13. `gruau-pommes-cannelle-amandes.jpg` — Gruau pommes-cannelle-amandes

### Dîners (10)
14. `bol-coreen-bibimbap.jpg` — Bol coréen bibimbap végétarien
15. `soupe-thai-lentilles.jpg` — Soupe thaï aux lentilles (sert aussi pour les restes)
16. `ramen-vegetarien-miso.jpg` — Ramen végétarien bouillon miso
17. `dal-lentilles-corail.jpg` — Dal de lentilles corail (sert aussi pour les restes)
18. `buddha-bowl-quinoa-tahini.jpg` — Buddha bowl quinoa-légumes rôtis-tahini
19. `souvlaki-poulet-riz.jpg` — Souvlaki poulet-légumes grillés-riz
20. `riz-saute-tofu-gingembre.jpg` — Riz sauté tofu-légumes-gingembre
21. `salade-quinoa-pois-chiches-feta.jpg` — Salade quinoa-pois chiches-feta
22. `wrap-poulet-legumes-grilles.jpg` — Wrap poulet-légumes grillés
23. `buddha-bowl-patate-douce-kale.jpg` — Buddha bowl patate douce-kale
24. `soupe-miso-nouilles-edamames.jpg` — Soupe miso-nouilles-edamames
25. `tacos-poisson-chou-lime.jpg` — Tacos poisson-chou-lime
26. `bol-lentilles-carottes-moutarde.jpg` — Bol lentilles-carottes-vinaigrette moutarde

### Soupers (10)
27. `burrito-bowl-poulet-salsa.jpg` — Burrito bowl poulet-salsa-crème sure
28. `cari-pois-chiches-epinards.jpg` — Cari pois chiches-épinards-lait de coco
29. `bol-soba-tofu-tahini.jpg` — Bol soba-tofu-sauce tahini-concombre
30. `pizza-maison-legumes.jpg` — Pizza maison pâte mince-légumes-fromage
31. `soupe-lentilles-pain-seigle.jpg` — Soupe lentilles-légumes-pain de seigle
32. `pates-pesto-tomates-parmesan.jpg` — Pâtes pesto-tomates cerises-parmesan
33. `curry-lentilles-epinards-basmati.jpg` — Curry lentilles-épinards-riz basmati
34. `saumon-teriyaki-edamames.jpg` — Saumon teriyaki-edamames-riz
35. `chili-vegetarien-mais-haricots.jpg` — Chili végétarien-maïs-haricots
36. `poulet-roti-legumes-racines.jpg` — Poulet rôti-légumes racines
37. `risotto-champignons-thym.jpg` — Risotto champignons-thym
38. `pates-pesto-tomates.jpg` — Pâtes au pesto et tomates cerises

### Bonus écran Recettes (1 déjà couvert + 3 nouvelles)
39. `curry-pois-chiches-coco.jpg` — Curry de pois chiches au lait de coco
40. `salade-tiede-quinoa-patate-douce.jpg` — Salade tiède de quinoa et patate douce
41. `pates-pesto-basilic-noix.jpg` — Pâtes au pesto de basilic et noix

> Total : ~41 photos. Si tu veux aller plus vite pour le proto, **les 15 plus visibles** sont celles d'`Aujourd'hui` (3) et de la `Semaine` (21 cellules, mais beaucoup partagent la même recette → 12 uniques).

## 3. Comment les brancher dans le code

### Étape A — créer un fichier mapping unique

`src/assets/meals/index.ts` :

```ts
import bibimbap from "./bol-coreen-bibimbap.jpg";
import soupeThai from "./soupe-thai-lentilles.jpg";
// … un import par photo

export const MEAL_IMAGES: Record<string, string> = {
  "Bol coréen bibimbap végétarien": bibimbap,
  "Soupe thaï aux lentilles": soupeThai,
  // … clé = `name` exact tel qu'écrit dans les pages
};
```

La clé doit matcher **exactement** le champ `name` ou `title` utilisé dans `Semaine.tsx`, `Aujourdhui.tsx`, `Swap.tsx`, `TinderSwapSheet.tsx`, `Recettes.tsx`, `SwapSheet.tsx`, `RecipeSheet.tsx`.

### Étape B — passer `imageUrl` à `MealCard`

`MealCard` accepte déjà `imageUrl?: string` (cf. `src/components/MealCard.tsx` lignes 199 et 245). Si `imageUrl` est défini, le `PhotoPlaceholder` n'est plus rendu — donc aucune modif du composant.

Dans **`src/pages/Aujourdhui.tsx`** (autour de la ligne 227), au rendu :

```tsx
<MealCard
  ...
  imageUrl={MEAL_IMAGES[meal.name]}
/>
```

Dans **`src/pages/Semaine.tsx`** (autour de la ligne 387) :

```tsx
<MealCard
  ...
  imageUrl={MEAL_IMAGES[slot.name]}
/>
```

Dans **`src/pages/Swap.tsx`** : passer `MEAL_IMAGES[current.name]` à la carte tinder (remplace le `linear-gradient` placeholder).

Dans **`src/components/TinderSwapSheet.tsx`** et **`src/components/SwapSheet.tsx`** : pareil, remplacer le fond gradient par `<img src={MEAL_IMAGES[current.name]} />` dans le bloc de carte.

Dans **`src/pages/Recettes.tsx`** : `RecipeCard` utilise actuellement un `bg-secondary` plein. Remplacer par `<img src={MEAL_IMAGES[recipe.title]} />` dans le bloc `h-[120px]`.

Dans **`src/components/RecipeSheet.tsx`** : la prop `imageUrl` existe déjà (ligne 107) — il suffit de la passer depuis l'appelant.

### Étape C — fallback gracieux

Garder `PhotoPlaceholder` comme fallback automatique : il s'affiche déjà quand `imageUrl` est `undefined`. Donc tu peux livrer les photos par lots — celles qui manquent gardent le placeholder coloré.

## 4. Raccourci si tu n'as pas le temps

Si tu veux livrer la démo sans photographier 41 plats :
- prends **Unsplash** ou **Pexels** (libres de droits), recherche par nom du plat en anglais
- télécharge en 1200 px de large
- passe-les dans un compresseur (squoosh.app) en JPEG qualité 75
- dépose dans `src/assets/meals/` avec le nom exact ci-dessus

Aucune dépendance, aucune config Vite à ajouter — les imports JPG marchent out-of-the-box.

## 5. Done when

- Dossier `src/assets/meals/` rempli avec les 41 fichiers (ou un sous-ensemble)
- `src/assets/meals/index.ts` mappe chaque `name` au bon import
- Chaque page (`Aujourdhui`, `Semaine`, `Swap`, `Recettes`) passe `imageUrl={MEAL_IMAGES[name]}`
- Les `PhotoPlaceholder` ne s'affichent plus quand une photo existe
- Aucune photo manquante ne casse le rendu (fallback automatique)
