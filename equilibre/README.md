# Banc d'équilibre du moteur de combat

Outil en ligne de commande pour tester des modifications des règles de combat (flotte contre flotte).
Il fait combattre des flottes **à budget égal**, sous une ou plusieurs **variantes** des règles, et mesure qui garde le plus de valeur.

Il utilise le même moteur que la page (`moteur-combat.js`, à partir de la 3.0). Les règles par défaut sont celles du jeu actuel.

```
node equilibre/equilibre.js --aide
node equilibre/equilibre.js equilibre/scenarios/t3-t6.json
node equilibre/equilibre.js equilibre/scenarios/tailles.json --variante "res:resistanceTaille=[1,1,1,1,1.2,1.4,1.6,1.8,2,2]"
node equilibre/equilibre.js --tournoi T2,T3,T4,T6 --budget 20000 --variante "deb:debordement=true"
```

Les calculs sont répartis sur tous les cœurs sauf un (`--coeurs N` pour changer).

## Ce qu'on mesure

Pour chaque **variante × duel × budget**, `n` combats (moitié avec A en attaquant, moitié avec B). Les mêmes graines sont rejouées pour chaque variante : les écarts entre variantes viennent des règles, pas du hasard.

| Colonne | Sens |
|---|---|
| Nb A/B | vaisseaux de chaque camp pour ce budget |
| Vict. A / B / Nuls | un camp gagne s'il reste seul ; « nul » = les deux survivent (combativité épuisée) |
| Reste A / B | valeur des survivants (ressource égalisée), en % de ce que le camp a dépensé, collisions comprises |
| **Avantage A** | Reste A − Reste B, en points : **0 = équilibre**, +100 = A intact et B anéanti |
| ±IC95 | marge d'erreur statistique de l'avantage (augmenter `-n` si elle est grande) |
| Échange | valeur adverse détruite / valeur propre perdue (> 1 : A y gagne) |
| Rounds | rounds de combat (sur tous les tours de jeu) |

Le **bilan** donne pour chaque variante :

- **Déséquilibre** : moyenne des |avantage| sur tous les points. C'est le chiffre à faire baisser.
- **Avantage des petits** : sur les duels entre deux plans de tailles différentes, l'avantage moyen du camp aux plus petits vaisseaux (positif = les petits sont favorisés).
- En tournoi, le **score** de chaque taille : son avantage moyen contre toutes les autres. Équilibré = tous les scores proches de 0.

Un vaisseau endommagé compte pour toute sa valeur. Avec `--tours N`, les survivants (dégâts, moral, expérience) recombattent au tour de jeu suivant, après les collisions de fin de tour ; on s'arrête dès qu'un camp est anéanti.

## Règles modifiables

`--regles` les liste avec leur valeur par défaut. Les tableaux « …Taille » ont 10 valeurs, de T1 à T10 ; `cle.T6=valeur` n'en change qu'une.

| Règle | Défaut (jeu) | Effet |
|---|---|---|
| `reciblage` | false | salves supplémentaires sur de nouvelles cibles (boucle désactivée de `Combat.java`) |
| `debordement` | false | *hypothèse* : cible détruite, le vaisseau continue aussitôt sur une autre avec ses armes restantes |
| `tirContinu` | false | tir continu de la PR #106 (18 novembre) : à son tempo, le vaisseau tire sur sa cible puis en désigne de nouvelles tant qu'il lui reste des armes, même hors de portée ; 4 recherches vides au plus |
| `ciblesVivantes` | false | PR #106 : la liste de secours du choix de cible écarte les épaves |
| `enrayement` | 0 | PR #106 : si > 0, chaque tir s'enraye avec (valeur − niveau de l'arme) % ; la PR met 20 (16 % pour une arme V) |
| `ciblage` | `"proche"` | *hypothèse* : `"hasard"` (au hasard dans la taille choisie) ou `"moinsVisee"` (la moins visée par sa flotte) |
| `nbCibles` | `[0,3,7,…,2000]` | cibles par round selon la taille du tireur (limite du reciblage et du débordement) |
| `toucherTaille` | 1 partout | *hypothèse* : multiplicateur de la chance de toucher, selon la taille de la **cible** |
| `resistanceTaille` | 1 partout | *hypothèse* : diviseur des dégâts de coque reçus, selon la taille de la **cible** |
| `degatsTaille` | 1 partout | *hypothèse* : multiplicateur des dégâts de coque infligés, selon la taille du **tireur** |
| `absorptionTaille` | 0 partout | *hypothèse* : absorption ajoutée, selon la taille de la cible |
| `combativiteBase` | 5 | combativité = base + niveau de moral + moral du héros |
| `collisionBase`, `collisionPas`, `collisionAlea`, `collisionMilitaire`, `collisionFacteur` | 45, 5, 5, 2, 1 | force des collisions = ⌈n / (base + pas × aléa(alea))⌉ − militaire × maîtrise, × facteur |
| `collisionsReelles`, `fiabilite`, `defenseurZone`, `bugMiroir` | | règles du futur moteur (PR #106), comme dans la page |
| `vitesseTaille` | `[9,8,7,…,0]` | (outil) bonus de vitesse de la coque, par taille |
| `coutTaille` | 1 partout | (outil) multiplicateur du coût par taille : simule une coque moins chère pour les gros |
| `collisions` | true | (outil) collisions de fin de tour de jeu |

Les dégâts fractionnaires (ex. 2 / 1,5) sont arrondis au hasard (1 ou 2, en proportion).

## Fichier de scénario

```json
{
 "ressource": "prix",                 // prix (centaures), pdc, minerai ou cases
 "budgets": [5000, 30000],             // budget de chaque camp ; un point par valeur ; "x20" = 20 fois le vaisseau le plus cher des deux flottes (ce camp en aligne 20, l'autre autant que le budget le permet, arrondi vers le bas : comme le banc du développeur)
 "n": 100,                             // combats par point
 "toursJeu": 1,
 "attaquant": "alterne",               // alterne, A ou B
 "importerPlans": "../plans-perso.json",   // export de la page (facultatif)
 "plans": {
  "T3": "moteurI + 16 plasmaV",
  "Fregate": "standard:Fregate standard",
  "MonPlan": "import:Nom du plan dans l'export",
  "Gros": "auto:T6:plasmaV:7",        // coque T6 pleine, réacteur le moins cher pour une vitesse ≥ 7
  "Autre": { "composants": [{ "code": "moteurI", "nb": 1 }, { "code": "laserV", "nb": 30 }] }
 },
 "flottes": {
  "essaim": { "composition": { "T3": 1 } },
  "mixte": {
   "composition": { "T3": 0.5, "Gros": 0.5 },        // parts du budget
   "strategie": { "agressivite": 3, "typeCible": 0, "cibles": { "T3": [6, 5, 4, 3, 2, 1, 7, 8, 9, 10] } },
   "militaire": 1, "moral": 4500, "experience": 0,
   "heros": { "att": 2, "def": 1, "mor": 1, "vit": 1 }
  },
  "fixe": { "composition": [{ "plan": "Fregate", "nombre": 20 }] }   // nombre imposé
 },
 "duels": [["essaim", "mixte"]],       // ou "tous" ; un nom de plan seul = flotte 100 % de ce plan
 "tournoi": { "tailles": ["T2", "T3", "T6"], "arme": "plasmaV", "vitesse": 7 },   // facultatif
 "regles": { },                        // règles communes à toutes les variantes
 "variantes": {                        // « actuel » (règles du jeu) est ajoutée d'office (--sans-actuel)
  "debordement": { "debordement": true },
  "resistance": { "resistanceTaille": [1, 1, 1, 1.2, 1.4, 1.6, 1.8, 2, 2, 2] }
 }
}
```

(Les commentaires `//` ci-dessus ne sont pas permis dans le vrai fichier JSON.)

La stratégie suit le format du moteur : `agressivite` 0 à 5, `typeCible` 0 à 3, `cibles` = ordre des tailles visées (1 à 10) par type de vaisseau, `positions` = `[x, y]` par type.

Exemples prêts : `scenarios/t3-t6.json` (l'étude du 16 novembre), `scenarios/tailles.json` (tournoi T2 à T8), `scenarios/flottes-mixtes.json` (plans standard, flottes mélangées, stratégie), `scenarios/meilleur-equipement.json` (toutes les combinaisons d'armes et de protections, à analyser avec `meilleur-equipement.js`), `scenarios/conditions-developpeur.json` (les conditions du banc `bench-combat` du développeur, avec 5 moteurs ; à lancer avec `--sans-actuel`).

## Sorties

- `--json fichier.json` : paramètres, plans, variantes, tous les points et le bilan ;
- `--csv fichier.csv` : une ligne par point (séparateur `;`, virgule décimale : s'ouvre directement dans Excel) ;
- `--plans` : affiche les plans compilés (taille, cases, vitesse, puissance, coûts) et s'arrête ;
- `--detail` : ajoute les pertes au combat et en collisions.

## Limites

- Combat de flottes seulement (pas de planètes, ni de mines).
- Une seule flotte par camp et par case ; pas d'enchaînement de plusieurs combats dans le même tour.
- L'usure des boucliers repart de zéro à chaque tour de jeu, comme dans le jeu (donnée non sauvegardée).
