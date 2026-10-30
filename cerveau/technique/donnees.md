---
title: Données
date: 2026-10-30
tags: [rythme, technique]
---

# Données

- Tout est dans `localStorage`, clé `rythme_v4`, sur le téléphone.
- `migrate()` ajoute les nouveaux champs sans casser les anciennes données (ex. `maxes`, `steps`, `progs`).
- Principaux blocs : `work.days` (pointage par jour), `events` (planning), `maxes` (+ historique), `steps`, `wlog` (poids), `pays` (fiches de paie), `proj` (placements), `progs` (programmes perso).
- **Sauvegarde** : export/import JSON depuis le profil. Effacer le site dans Safari efface les données.
- Seule sortie : le Gist GitHub privé des pas (lecture seule côté app).

Related: [Architecture](architecture.md) · [Règles produit](../regles.md)

Up: [Technique](README.md)
