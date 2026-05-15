Je vais corriger le problème dans `src/components/TinderSwapSheet.tsx`, car les boutons sélectionnés sont ceux du sheet de remplacement, pas ceux de la page `/semaine`.

Plan ciblé :

1. Garder le sheet au-dessus de la navigation
   - Remplacer le conteneur plein écran par une hauteur dynamique qui exclut la barre de navigation du bas.
   - Utiliser `height: calc(100dvh - 64px - env(safe-area-inset-bottom))` pour que le sheet s’arrête au-dessus du menu.

2. Remonter les boutons d’action
   - Remplacer `bottom-0 pb-8` par un positionnement basé sur `env(safe-area-inset-bottom)`.
   - Ajouter assez de marge interne en bas pour que les boutons X / ✓ soient toujours visibles sur un écran 390x652.

3. Ne pas toucher au reste
   - Aucun changement à `MealCard.tsx`, `RecipeSheet.tsx` ou au menu de navigation.
   - Aucun changement de logique du TinderSwapSheet, seulement le positionnement responsive.