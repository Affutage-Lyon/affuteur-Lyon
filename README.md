# affuteur-Lyon

Site vitrine de **Ken Aiguise**, service d'affûtage de couteaux de précision basé à Lyon (74 Rue d'Ypres, 69004).

**URL :** https://affutage-lyon.github.io/affuteur-Lyon/

---

## Stack technique

- HTML5, CSS3, JavaScript ES6 (vanilla — aucun framework, aucun build)
- Hébergement : GitHub Pages (branche `main`)
- Formulaire contact : [Formspree](https://formspree.io) (`f/xvzvjqve`)
- Analytics visiteurs : Discord webhook

---

## Structure des fichiers

| Fichier | Rôle | Lignes |
|---|---|---|
| `index.html` | Structure HTML, métadonnées SEO, sections de la page | 300 |
| `app.js` | Logique JS : navigation, animations, galerie, accordéon, tracking | 244 |
| `style.css` | Système de design, responsive, animations CSS | 617 |
| `img/logo.svg` | Logo vectoriel de la marque | — |
| `img/knife_1.webp` | Photo couteau avant affûtage | 526 KB |
| `img/knife_2.webp` | Photo couteau après affûtage | 1.1 MB |
| `img/atelier.webp` | Intérieur de l'atelier | 60 KB |
| `img/geste.webp` | Démonstration du geste technique | 59 KB |
| `img/lame.webp` | Détail de lame | 24 KB |
| `videos/demo.mp4` | Vidéo démo de l'atelier | 4.8 MB |

---

## Architecture JavaScript (app.js)

| Module | Lignes | Description |
|---|---|---|
| Navigation active (scroll spy) | 1–25 | Met en surbrillance le lien nav correspondant à la section visible |
| Animation shimmer du titre | 27–39 | Gradient lumineux animé sur `"KEN AIGUISE"` via `--glint-pos` |
| Menu burger mobile | 41–65 | Toggle du menu, fermeture automatique au clic sur un lien |
| Particules d'eau | 68–87 | Génère des gouttes flottantes toutes les 80 ms avec `requestAnimationFrame` |
| Animation couteau SVG | 89–109 | Au scroll (seuil 80 %), la lame passe de "cassée" à "réparée" (changement de `d` + couleur) |
| Galerie cartes (mouse + touch) | 111–183 | Expansion au survol/clic, swipe tactile (seuil 50 px), navigation par points |
| Accordéon FAQ | 185–198 | Ouverture/fermeture d'items, une seule section active à la fois |
| Discord webhook | 202–242 | Collecte IP/géolocalisation via `ipapi.co` et envoie un embed Discord |

---

## Sections de la page (index.html)

1. **Header** — Titre animé, couteau SVG réparable au scroll, particules, bouton Instagram
2. **Galerie** (`#galerie`) — Carrousel avant/après + vidéo, navigation dots
3. **Expertise** (`#expertise-pro`) — FAQ accordéon (rentabilité, sécurité HACCP, éco-livraison)
4. **Tarifs** (`#tarifs`) — Tableau style menu de restaurant, 7 €–14 € / outil
5. **Application Mobile** (`#application`) — Annonce beta privée, 3 cartes fonctionnalités
6. **Contact** (`#contact`) — Formulaire Formspree (type client, nom, adresse, email, message)
7. **Footer** — Adresse, copyright

---

## Système de design (style.css)

### Palette de couleurs
| Variable CSS | Valeur | Usage |
|---|---|---|
| `--fond` | `#1a1c1e` | Fond sombre principal |
| `--chene` | `#c2a382` | Couleur bois/chêne, accent branding |
| `--acier` | `#8e9aaf` | Gris acier, texte secondaire |
| `--neon-orange` | `#ffb44d` | Accents lumineux |
| `--bleu-metal` | `#4d94ff` | Accents bleutés |
| `--texte` | `#e0e1dd` | Texte principal (crème clair) |

### Typographie
- Police : **Cinzel** (serif, Google Fonts), poids 400 et 700
- Textes en majuscules (`text-transform: uppercase`) avec `letter-spacing`
- Taille adaptative via `clamp()` (ex. titre hero : `clamp(2.2rem, 5vw, 4rem)`)

### Breakpoints responsive
| Breakpoint | Comportement |
|---|---|
| `< 768px` | Colonne unique, burger menu actif |
| `768px – 1023px` | Burger menu actif, layouts flex |
| `≥ 1024px` | Nav complète, grilles 3 colonnes |

---

## SEO & Données structurées

Schéma JSON-LD `LocalBusiness` intégré dans `<head>` :
- **Adresse :** 74 Rue d'Ypres, 69004 Lyon
- **Téléphone :** +33635218784
- **Coordonnées GPS :** 45.7785, 4.8315
- **Horaires :** Lun–Ven 16h–19h / Mer–Sam 9h–18h
- **Fourchette de prix :** €–€€€€

---

## Services tiers

| Service | Usage | Configuration |
|---|---|---|
| Formspree | Réception des emails du formulaire contact | Endpoint `f/xvzvjqve` dans `<form action>` |
| Discord webhook | Tracking visiteurs (IP, géo, user-agent) | URL hardcodée dans `app.js` ligne 205 |
| ipapi.co | Résolution IP → géolocalisation | Appelé par le module Discord webhook |
| Google Fonts | Police Cinzel | Import CSS dans `<head>` |

---

## Déploiement

Aucun build requis. Déploiement direct via GitHub Pages depuis la branche `main`.

```bash
git push origin main   # déploie automatiquement
```

Pour développer localement, ouvrir `index.html` dans un navigateur ou utiliser un serveur statique :

```bash
npx serve .
# ou
python3 -m http.server 8080
```
