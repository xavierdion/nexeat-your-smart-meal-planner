## Changement

Dans `src/pages/Semaine.tsx` (ligne 124), remplacer le dégradé du header par une couleur de fond unie.

**Avant :**
```
bg-gradient-to-b from-[#4A6670] to-[#A8C5BC]
```

**Après :**
```
bg-[#4A6670]
```

## Choix de couleur

J'utilise le **Slate #4A6670** (couleur de départ actuelle du dégradé) car :
- C'est la couleur primaire de la marque
- Elle assure un bon contraste avec le texte blanc du titre, les pilules de jours et le sous-titre "17-23 mai"
- Aucun ajustement de typographie nécessaire

Si tu préfères le Sage #A8C5BC à la place, dis-le moi avant l'implémentation — il faudra alors vérifier la lisibilité du texte blanc.

## Hors scope

Aucune autre modification : les pilules de jours, les cartes repas, le CTA collant et toutes les autres pages restent inchangés.
