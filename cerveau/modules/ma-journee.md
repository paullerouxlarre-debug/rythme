---
title: Ma journée
date: 2026-11-03
tags: [rythme, module]
---

# Ma journée

L'onglet qui s'ouvre au lancement.

## Contenu
- **Bandeaux** en haut : pointage (pendant les créneaux) et actualisation des pas.
- **Carte du jour** : date, type de journée (boulot, repos, congé, voyage), trois anneaux : *Bouger* (minutes de sport + part des pas), *Semaine* (séances), *Boulot* (heures).
- **Planning** du jour et des 7 prochains jours.
- **Boulot** : voir [Pointage](#pointage).
- **Pas** : nombre du jour, synchro avec l'app Santé.

## Pointage
- 4 étapes : arrivée, départ déjeuner, retour, départ.
- Pendant un créneau d'un jour travaillé : fenêtre « Pointer maintenant · hh:mm » (une fois par étape) + bandeau + grand bouton.
- Hors créneau : petite carte avec les heures du jour et « Détails › » pour corriger.
- Week-end et congé : rien.
- **Journée complète** : un bouton (sur la carte du jour et dans « Corriger un autre jour ») enregistre 7:30–12:00 / 13:00–16:18, soit 7 h 48 pour 39 h par semaine.
- **Départ pour 7 h 48** : après l'arrivée, l'heure de départ à viser (pause d'1 h comptée si elle n'est pas encore pointée).

### Stats et historique
- Cette semaine : heures par jour, reste à faire sur 39 h.
- Solde d'heures depuis le premier jour complet, vs 7 h 48 par jour (week-end : tout compte en plus).
- Ce mois-ci : heures, jours complets, solde du mois.
- 4 dernières semaines : moyenne par jour, pause déjeuner moyenne, arrivée et départ moyens, plus longue journée, jours complets.
- Graphiques : heures par semaine (8), moyenne par jour de la semaine, heures par mois (6).
- Rappels optionnels dans le Calendrier iPhone via fichier `.ics` (voir [Contraintes iOS](../technique/contraintes-ios.md)).

## Pas
Import via un raccourci iPhone (presse-papiers), un export `export.xml` de Santé, ou synchro automatique par Gist GitHub. Les pas valent 30 % de l'objectif sport par défaut.

Related: [Planning](planning.md) · [Décision pointage](../decisions/2026-10-30-pointage-creneaux.md) · [Décision pas](../decisions/2026-10-30-pas-gist.md)

Up: [Modules](README.md)
