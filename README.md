# Simulateur de combats de flottes pour Sheril

Page en ligne : **https://gillou1664.github.io/sheril-combat/**

Simulateur de combat flotte contre flotte pour le jeu par e-mail [Sheril](https://sheril.pbem-france.net). Le moteur reprend celui du jeu, `Combat.combatFlotteFlotte` du code Java public [ydomenjoud/sheril-old-java](https://github.com/ydomenjoud/sheril-old-java). Il reprend :

- le placement en 3D ;
- l'initiative ;
- le choix d'une cible par vaisseau ;
- les déplacements et la fuite selon la stratégie ;
- les chances de toucher selon la taille et la distance ;
- les boucliers, absorbeurs et dégâts point par point sur les composants ;
- le moral, l'expérience et les héros.

## Utilisation

1. Chargez vos fichiers avec « 📂 Charger des fichiers » : `rapport.xml` de vos tours, `data.xml` des statistiques (plans publics), `combat.htm`.
2. Composez les deux flottes dans l'onglet **Flottes**. Vous pouvez importer une de vos flottes ou un combat réel de votre rapport. Chaque ligne affiche son coût en centaures, minerai et PdC, et le bouton « Mettre à coût égal » ajuste une flotte sur le coût de l'autre.
3. Dans l'onglet **Résultats**, lancez :
   - un combat animé, avec ses tableaux tour par tour ;
   - des statistiques sur des centaines de combats, comparées au combat réel s'il a été importé ;
   - la comparaison de plusieurs scénarios.
4. Créez vos propres plans dans l'onglet **Plans**.

**Confidentialité.** Rien n'est envoyé nulle part. Les fichiers chargés, les plans et les scénarios restent dans votre navigateur (`localStorage`). « ⬇ Exporter » les sauvegarde dans un fichier JSON, que vous pouvez recharger sur un autre ordinateur.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | la page |
| `moteur-combat.js` | le moteur de combat, sans dépendance, utilisable aussi sous Node |
| `catalogue.js` | composants et plans standard, générés depuis le code Java du jeu |
| `donnees.js` | lecture des fichiers du jeu et sauvegarde |
| `interface.js` | l'interface |
| `equilibre/` | banc d'équilibre du moteur, en ligne de commande (Node, sans dépendance) |
| `rapport-equilibre-combat.pdf` | rapport de synthèse sur l'équilibre du combat entre les tailles de coque |

Une seule flotte affronte une autre : l'enchaînement de plusieurs combats sur une même case n'est pas simulé.

## Banc d'équilibre et rapport

Le moteur (version 3.x) rend toutes les règles du combat de flottes paramétrables, dans `config.reglesMoteur`. Les valeurs par défaut sont celles du jeu actuel. Il ajoute aussi des variantes :

- le reciblage, première version de la PR #106 ;
- le tir continu, PR #106 du 18 novembre (`tirContinu`, `ciblesVivantes`, `enrayement`) ;
- le débordement ;
- des leviers selon la taille (toucher, résistance, dégâts, vitesse, coût).

Le banc `equilibre/equilibre.js` fait combattre des flottes à budget égal sous plusieurs variantes de ces règles, et mesure qui garde le plus de valeur. Le mode d'emploi est dans `equilibre/README.md`, et les scénarios du rapport sont dans `equilibre/scenarios/`.

```
node equilibre/equilibre.js --aide
node equilibre/equilibre.js equilibre/scenarios/conditions-developpeur.json --sans-actuel
node equilibre/equilibre.js equilibre/scenarios/meilleur-equipement.json --json res.json
node equilibre/meilleur-equipement.js res.json --variante actuel
```

Le rapport `rapport-equilibre-combat.pdf` donne les résultats. Ses commandes citent `combat/equilibre/…`, qui correspond ici à `equilibre/…`.
