---
title: Architecture
date: 2026-10-30
tags: [rythme, technique]
---

# Architecture

## Une seule page HTML
L'app est **un fichier HTML** (CSS + JS) servi comme PWA. Les sources sont découpées dans `src/` puis assemblées par `src/build.py`.

| Fichier | Rôle |
|---|---|
| `b0.html` | Squelette HTML et tout le CSS |
| `c1.js` | État `ui`, couleurs, `migrate()` des données, numéro de version |
| `c2.js` | Dates, import Excel des heures, congés, créneaux de pointage |
| `c3.js` | Icônes, emblème, Progrès, boucle `gLive` (mise à jour chaque minute) |
| `c4.js` / `c4b.js` | Ma journée, carte Boulot, pas, synchro Gist, fenêtre de pointage |
| `c5.js` / `c5b.js` | Tendance : placements, fiches de paie |
| `c6.js` | Muscle (séances, programmes), Nutrition, poids |
| `c6b.js` | Comportement natif, gestes, défilement, partage |
| `c6c.js` | Max, analyse, âge physiologique, padel |
| `c7.js` | Tous les gestionnaires d'actions (`data-act`) |

## Conventions
- Délégation d'événements via `data-act` / `data-id` ; `render()` réécrit `#main`.
- Fenêtres : `showModal(html)` / `closeConfirm()` (pas d'`alert` natif, interdit dans l'artifact).
- `build.py` injecte le manifeste PWA, le service worker et la date de version.

Related: [Données](donnees.md) · [Déploiement](deploiement.md)

Up: [Technique](README.md)
