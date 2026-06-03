# Ken Aiguise — Site vitrine

Site statique pour **Ken Aiguise**, affûteur de précision à Lyon 4.

**URL en production :** [affutage-lyon.github.io/affuteur-Lyon](https://affutage-lyon.github.io/affuteur-Lyon/)

## Structure

```
index.html      Page principale
style.css       Styles
app.js          Interactions (nav, galerie, animations)
img/            Images WebP et logo SVG
videos/         Vidéo de démonstration
sitemap.xml     Plan du site (SEO)
robots.txt      Directives pour les moteurs de recherche
```

## Développement local

Ouvrir `index.html` dans un navigateur, ou servir le dossier avec un serveur statique :

```bash
npx serve .
```

## Déploiement

Le dépôt est publié via **GitHub Pages** sur la branche `main`. Un push suffit :

```bash
git push origin main
```

## Dépôt Git

Ce dossier (`affuteur-Lyon/`) est la **racine du dépôt Git** (`Affutage-Lyon/affuteur-Lyon`).  
Le dossier parent `KenAiguise/` est un conteneur local Cursor — ne pas y initialiser un second dépôt Git.
