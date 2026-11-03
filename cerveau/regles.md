---
title: Règles produit
date: 2026-11-03
tags: [rythme, regles]
---

# Règles produit

Les règles que toute évolution doit respecter. Si une demande les contredit, la demande gagne, et la règle est mise à jour ici.

## Données
- **Une case vide n'est pas un 0** : une valeur non renseignée est nulle et n'entre dans aucun calcul.
- **100 % local** : `localStorage` du téléphone, rien n'est envoyé ailleurs (seule exception choisie : le Gist GitHub privé pour les pas).
- **Supprimer = double confirmation** dans une fenêtre de l'app.

## Analyse physique
- L'âge physiologique et l'analyse se calculent **uniquement sur les max renseignés**. Jamais sur les pas, la régularité ou le poids.
- Comparaison **avec les hommes de mon âge** (rang dans la population), pas avec des normes de laboratoire. 12 tractions d'affilée, c'est très bien, et l'app doit le dire.

## Pointage
- Visible seulement **du lundi au vendredi, pendant les créneaux** : 7:00–8:00, 12:00–12:30, 13:00–13:30, 16:45–17:45.
- Rien les week-ends et les jours de congé. Fenêtre pop-up et bandeau cliquable pendant les créneaux.

## Style
- **Verre liquide** (v4, 03/11) : panneaux translucides flous sur un fond à halos de couleur, coins très ronds, barre d'onglets flottante, police système (SF Pro sur iPhone).
- **Six ambiances** au choix dans Réglages : claires Lilas, Aube, Lagon, Brume ; sombres Minuit, Forêt. En mode Auto, l'ambiance claire le jour et la sombre le soir, selon l'iPhone.
- Chaque ambiance a trois couleurs d'anneaux (Bouger, Séances, Boulot) et une couleur profonde pour les cartes de résumé et les boutons.
- Accessibilité : texte de base 16 px, rien sous 12 px, contrastes AA, cibles tactiles de 44 px minimum.
- Mouvement façon Apple (v4.1) : ressorts courts, entrées de cartes échelonnées, anneaux et barres qui se remplissent, chiffres qui défilent, pastille d'onglet qui glisse, feuilles qui montent. Toujours moins d'une seconde, jamais d'écran de démarrage ni de confettis, et tout s'arrête si l'iPhone demande de réduire les animations.
- Icônes au trait, pas d'emojis. Pas de bulles flottantes. Pas de jeu.
- **Textes courts.**
- Comportement d'app native : pas de zoom, pas de rebond, pas de barre de défilement, portrait uniquement.

## Contenu
- Programmes de sport prédéfinis et modifiables, pas de saisie série par série.
- Les pas comptent pour une part de l'objectif sport du jour (30 % par défaut).

Related: [Vision](vision.md) · [Décisions](decisions/README.md)

Up: [Accueil](README.md)
