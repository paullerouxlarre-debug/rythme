---
title: Déploiement
date: 2026-10-30
tags: [rythme, technique]
---

# Déploiement

## Deux copies de l'app
- **iPhone** : GitHub Pages, branche `main`, racine → https://paullerouxlarre-debug.github.io/rythme/
- **Claude** : artifact https://claude.ai/artifact/4iBXQsjwh3WEh65srsbktf (capacité `downloads`).

## Étapes
1. `python3 src/build.py` → `index.html` (PWA) et `dist/rythme.html` (artifact).
2. Commit + push sur `main` ; GitHub Pages republie en 1 à 10 minutes (parfois plus quand GitHub est lent).
3. Publier `dist/rythme.html` sur l'artifact.

## Mise à jour sur l'iPhone
Service worker *network-first* : la nouvelle version se charge dès que le réseau répond, l'app se recharge seule. Bouton « Mettre à jour » dans le profil en secours.

Related: [Journal des versions](../journal.md) · [Décision mises à jour](../decisions/2026-10-29-network-first.md)

Up: [Technique](README.md)
