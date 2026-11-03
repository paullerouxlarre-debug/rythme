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
- Barre d'état `black-translucent` : l'app passe sous la Dynamic Island, le contenu est décalé de `env(safe-area-inset-top)` (59 px) et la barre d'onglets de `env(safe-area-inset-bottom)` (34 px).
- L'heure et la batterie restent blanches : une bande teintée (couleur profonde de l'ambiance) et floutée, au-dessus de tout, les garde lisibles.
- Testé en simulant 393 × 852 avec ces marges.

Related: [Ma journée](../modules/ma-journee.md) · [Décision pas](../decisions/2026-10-30-pas-gist.md)

Up: [Technique](README.md)
