# Ken Aiguise — Site vitrine

Site statique pour **Ken Aiguise**, affûteur de précision à Lyon 4.

**URL en production :** [affutage-lyon.github.io/affuteur-Lyon](https://affutage-lyon.github.io/affuteur-Lyon/)

## Structure

```
index.html          Page principale
style.css           CSS compilé (servi en prod — ne pas éditer à la main)
scss/               Sources SCSS
  main.scss         Point d'entrée
  abstracts/        Variables CSS, breakpoints, mixins
  base/             Reset, titres de sections
  layout/           Nav, footer, responsive
  components/       Boutons, animations
  sections/         Hero, bannière, galerie, tarifs, contact, app…
app.js              Interactions (nav, galerie, animations)
img/                Images WebP et logo SVG
img/galerie/        9 photos de la galerie (01.webp → 09.webp)
sitemap.xml         Plan du site (SEO)
robots.txt          Directives pour les moteurs de recherche
```

## Styles (SCSS)

Les styles se modifient dans `scss/`, puis on recompile :

```bash
npm install          # une seule fois
npm run build:css    # génère style.css
npm run watch:css    # recompile à chaque sauvegarde
```

**Important :** avant chaque push, lancer `npm run build:css` pour que GitHub Pages serve le bon `style.css`.

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
