---
title: Contraintes iOS
date: 2026-10-30
tags: [rythme, technique, ios]
---

# Contraintes iOS

| Impossible pour une web app | Contournement choisi |
|---|---|
| Vraies notifications push sans serveur | Rappels dans le Calendrier via fichier `.ics` ; fenêtre pop-up dans l'app pendant les créneaux |
| Lire le presse-papiers automatiquement | Synchro des pas par Gist GitHub (raccourci iPhone automatisé) |
| Bloquer l'orientation | Écran « Tourne ton téléphone » en paysage |
| Accès direct à l'app Santé | Raccourci iPhone ou import `export.xml` |

Testé sur iPhone 15, Safari, app ajoutée à l'écran d'accueil.

## Dynamic Island (iPhone 15 Pro)
- Barre d'état classique (`default`) : l'heure reste noire et lisible, iOS gère l'encoche. Le haut de page se fond dans la couleur de l'ambiance, que la balise `theme-color` donne aussi à la barre : pas de bande visible.
- Essayé puis abandonné le 03/11 : `black-translucent` (heure blanche peu lisible sur les ambiances claires). Ce réglage n'est lu par iOS qu'à l'installation de l'app sur l'écran d'accueil.
- La couleur de la barre d'état suit l'ambiance choisie (fond de l'ambiance) et s'assombrit quand une fenêtre de l'app est ouverte (`syncBar`).
- En bas : fondu sous la barre d'onglets flottante, marge `env(safe-area-inset-bottom)` (34 px).

Related: [Ma journée](../modules/ma-journee.md) · [Décision pas](../decisions/2026-10-30-pas-gist.md)

Up: [Technique](README.md)
