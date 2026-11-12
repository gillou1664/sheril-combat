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

Une seule flotte affronte une autre : l'enchaînement de plusieurs combats sur une même case n'est pas simulé.
