---
title: Mode d'emploi Claude
date: 2026-10-30
tags: [rythme, claude]
---

# Mode d'emploi Claude

## Formuler une demande
- Dis **quel onglet** et **ce qui gêne** ; une capture d'écran aide beaucoup.
- Si c'est une nouvelle règle (« ne jamais compter X »), dis-le : elle ira dans [Règles produit](regles.md).
- Tu peux renvoyer vers une note : « fais l'idée n°2 de [Idées](idees.md) ».

## Ce que Claude fait à chaque changement
1. Modifie les sources `src/`, reconstruit, teste sur un écran d'iPhone simulé.
2. Publie l'artifact Claude et pousse sur GitHub (voir [Déploiement](technique/deploiement.md)).
3. Met à jour ce coffre : [Journal](journal.md), la note du module touché, et une note dans [Décisions](decisions/README.md) si un choix a été fait.

## Ce que Claude ne peut pas faire
Lire ton coffre Obsidian s'il n'est que sur ton téléphone. La version de référence est celle du dépôt GitHub (`cerveau/`).

Related: [Règles produit](regles.md) · [Architecture](technique/architecture.md)

Up: [Accueil](README.md)
