## Approche

Un seul mapping centralisé `src/data/recipeImages.ts` qui mappe **nom de recette → import ES6**. Les pages (Semaine, Aujourdhui) lookent l'URL via `RECIPE_IMAGES[meal.name]` et la passent à `<MealCard imageUrl=... />`. Idem pour `RecipeSheet` (qui reçoit déjà `imageUrl` en prop) et `SwapSheet` (à modifier pour remplacer le carré `bg-[#F0F4F3] + ImageIcon`).

Si une recette n'a pas de photo dans le mapping → fallback sur le `PhotoPlaceholder` actuel (gradient + icône). Aucun crash, dégradation propre.

## Spécifications fichiers

- **Format** : JPG (pas PNG — photos, pas transparence)
- **Dimensions** : 800 × 600 px (ratio 4:3) — couvre les 3 usages :
  - MealCard full (358×224, ratio 16:10) → object-cover crop horizontal
  - RecipeSheet hero (390×280) → object-cover crop léger
  - MealCard compact (64×64) → object-cover crop carré
- **Poids cible** : 80–150 kb par fichier (qualité 75–80%)
- **Cadrage** : assiette/bol centré, vue plongeante 45–90°, lumière naturelle, fond neutre (bois clair, lin, marbre). Cohérent avec le ton chaleureux NexEat.
- **Emplacement** : `src/assets/recipes/{slug}.jpg`

## Liste des 31 photos à déposer

Une photo = une recette. Slug en kebab-case. Tu peux les sourcer sur Unsplash, Pexels, ou ta propre banque.

### Déjeuners (8)
| Slug | Recette |
|---|---|
| `smoothie-bowl-mangue.jpg` | Smoothie bowl mangue-kefir-granola |
| `pancakes-sarrasin-bleuets.jpg` | Pancakes sarrasin-bleuets-sirop d'érable |
| `acai-bowl-amandes.jpg` | Açaï bowl amandes-banane-noix de coco |
| `oeufs-benedictine-vege.jpg` | Œufs bénédictine végé sur muffin anglais |
| `french-toast-cannelle.jpg` | French toast cannelle-compote de pommes |
| `crepes-sarrasin-compote.jpg` | Crêpes sarrasin-compote-sirop d'érable |
| `granola-yogourt-grec.jpg` | Granola maison-yogourt grec-fruits frais |
| `tartines-avocat-oeuf.jpg` | Tartines avocat-œuf poché |
| `yogourt-grec-fruits-miel.jpg` | Yogourt grec-fruits-miel |

### Dîners (10)
| Slug | Recette |
|---|---|
| `bibimbap-vegetarien.jpg` | Bol coréen bibimbap végétarien *(★ hero RecipeSheet)* |
| `salade-thai-vermicelles.jpg` | Salade thaï vermicelles-poulet-arachides |
| `poke-bowl-thon-mangue.jpg` | Poke bowl thon-mangue-avocat |
| `ramen-vegetarien-miso.jpg` | Ramen végétarien bouillon miso |
| `wrap-falafel-tzatziki.jpg` | Wrap méditerranéen falafel-tzatziki |
| `buddha-bowl-quinoa.jpg` | Buddha bowl quinoa-légumes rôtis-tahini |
| `souvlaki-poulet-riz.jpg` | Souvlaki poulet-légumes grillés-riz |
| `riz-saute-tofu-gingembre.jpg` | Riz sauté tofu-légumes-sauce gingembre |
| `salade-quinoa-pois-chiches.jpg` | Salade quinoa-pois chiches-feta |
| `wrap-poulet-legumes.jpg` | Wrap poulet-légumes grillés |

### Soupers (12)
| Slug | Recette |
|---|---|
| `soupe-miso-edamames.jpg` | Soupe miso riz edamames |
| `burrito-bowl-poulet.jpg` | Burrito bowl poulet-salsa-crème sure |
| `cari-pois-chiches.jpg` | Cari pois chiches-épinards-lait de coco |
| `tacos-haricots-noirs.jpg` | Tacos haricots noirs-maïs-salsa verde |
| `bol-soba-tofu-tahini.jpg` | Bol soba-tofu-sauce tahini-concombre |
| `pizza-maison-legumes.jpg` | Pizza maison pâte mince-légumes-fromage |
| `soupe-lentilles-legumes.jpg` | Soupe lentilles-légumes-pain de seigle |
| `pates-pesto-tomates.jpg` | Pâtes pesto-tomates cerises-parmesan |
| `curry-lentilles-epinards.jpg` | Curry lentilles-épinards-riz basmati |
| `saumon-teriyaki-edamames.jpg` | Saumon teriyaki-edamames-riz |
| `bol-lentilles-carottes.jpg` | Bol lentilles-carottes-vinaigrette moutarde *(SwapSheet)* |

**Total : 31 photos.** Une fois déposées dans `src/assets/recipes/`, j'écris le mapping et branche les 4 surfaces.

## Implémentation côté code (étape 2, après dépôt des photos)

1. **Créer `src/data/recipeImages.ts`**
   ```ts
   import smoothieMangue from "@/assets/recipes/smoothie-bowl-mangue.jpg";
   // ... 30 autres imports
   
   export const RECIPE_IMAGES: Record<string, string> = {
     "Smoothie bowl mangue-kefir-granola": smoothieMangue,
     "Bol coréen bibimbap végétarien": bibimbap,
     // ...
   };
   
   export const getRecipeImage = (name: string): string | undefined =>
     RECIPE_IMAGES[name];
   ```

2. **`src/pages/Semaine.tsx`** — passer `imageUrl={getRecipeImage(meal.name)}` au `MealCard`. Le swap (cycleAlt) lit le nom de l'alternative courante → la photo suit automatiquement.

3. **`src/pages/Aujourdhui.tsx`** — idem, `imageUrl={getRecipeImage(meal.name)}` sur les 3 `MealCard compact`.

4. **`src/components/RecipeSheet.tsx`** — accepte déjà `imageUrl`, juste passer `imageUrl={getRecipeImage("Bol coréen bibimbap végétarien")}` depuis les pages qui l'ouvrent (actuellement hardcodé sur le bibimbap pour le proto).

5. **`src/components/SwapSheet.tsx`** — remplacer le bloc `<div className="w-20 h-20 ... ImageIcon />` (lignes 161-163) par `<img src={getRecipeImage(current.name)} className="w-20 h-20 rounded-[14px] object-cover" />` avec fallback gradient si absent.

## Étapes

1. Tu déposes les 31 fichiers dans `src/assets/recipes/` avec exactement les slugs ci-dessus.
2. Tu me dis "c'est fait" → je crée `recipeImages.ts` et branche les 4 fichiers.
3. Si certains slugs te manquent, pas grave — le fallback placeholder reste actif pour ces recettes.

## Note sur l'effort de sourcing

Si trouver 31 photos est trop lourd, alternative pragmatique : tu déposes les **10–12 plus visibles** d'abord (les 7 repas de la semaine courante + bibimbap + 2-3 alternatives), je branche, et on complète par vagues. Le fallback placeholder couvre élégamment les manquants.