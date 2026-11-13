// Fichier généré : ne pas modifier à la main (voir combat/outils/generer-catalogue.js).
(function (racine) {
  var CATALOGUE = {
 "source": "Généré par combat/outils/generer-catalogue.js depuis le code Java du moteur (sheril-old-java).",
 "constantes": {
  "TAILLE_VAISSEAUX": [
   [
    1,
    3,
    9
   ],
   [
    4,
    9,
    8
   ],
   [
    10,
    17,
    7
   ],
   [
    18,
    33,
    6
   ],
   [
    34,
    65,
    5
   ],
   [
    66,
    129,
    4
   ],
   [
    130,
    257,
    3
   ],
   [
    258,
    512,
    2
   ],
   [
    513,
    1025,
    1
   ],
   [
    1026,
    1000000,
    0
   ]
  ],
  "NB_CIBLES": [
   0,
   3,
   7,
   15,
   31,
   63,
   127,
   255,
   511,
   2000
  ],
  "COMBAT_X_MAX": 30,
  "COMBAT_Y_MAX": 10,
  "COMBAT_Y_ESPACE": 10,
  "COMBAT_Y_FIN1": -1000,
  "BASE_NIVEAU_EXPERIENCE": 2000,
  "BASE_NIVEAU_MORAL": 1000,
  "BASE_NIVEAU_PUISSANCE": 25,
  "CHANCE_EXPLOSION_MOTEUR": 1,
  "MORAL_DEPART_EQUIPAGE": 4500,
  "NB_BOUCLIERS_MAX": 10,
  "TAILLE_MAXIMAL_VAISSEAU": 10,
  "NOMBRE_SALVE_BATTERIE": 50,
  "PUISSANCE_ATTAQUE_PLANETAIRE_MINIMALE": 50
 },
 "composants": {
  "laserI": {
   "code": "laserI",
   "base": "laser",
   "niv": 0,
   "minerai": 7,
   "prix": 6,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 10,
    "degatBouclier": 2,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 8
   },
   "toucher": [
    50,
    45,
    35,
    25,
    20,
    15,
    10,
    5,
    3,
    1
   ],
   "nom": "Laser de type I"
  },
  "laserII": {
   "code": "laserII",
   "base": "laser",
   "niv": 1,
   "minerai": 6,
   "prix": 7,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 11,
    "degatBouclier": 2,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 9
   },
   "toucher": [
    55,
    49,
    38,
    27,
    22,
    16,
    11,
    6,
    4,
    2
   ],
   "nom": "Laser de type II"
  },
  "laserIII": {
   "code": "laserIII",
   "base": "laser",
   "niv": 2,
   "minerai": 5,
   "prix": 8,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 12,
    "degatBouclier": 2,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 10
   },
   "toucher": [
    60,
    53,
    41,
    29,
    24,
    17,
    12,
    7,
    5,
    3
   ],
   "nom": "Laser de type III"
  },
  "laserIV": {
   "code": "laserIV",
   "base": "laser",
   "niv": 3,
   "minerai": 5,
   "prix": 9,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 12,
    "degatBouclier": 3,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 11
   },
   "toucher": [
    65,
    57,
    44,
    31,
    26,
    18,
    13,
    8,
    6,
    4
   ],
   "nom": "Laser de type IV"
  },
  "laserV": {
   "code": "laserV",
   "base": "laser",
   "niv": 4,
   "minerai": 5,
   "prix": 10,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 12,
    "degatBouclier": 3,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 12
   },
   "toucher": [
    70,
    61,
    47,
    33,
    28,
    19,
    14,
    9,
    7,
    5
   ],
   "nom": "Laser de type V"
  },
  "laserVI": {
   "code": "laserVI",
   "base": "laser",
   "niv": 5,
   "minerai": 4,
   "prix": 11,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 13,
    "degatBouclier": 3,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 13
   },
   "toucher": [
    75,
    65,
    50,
    35,
    30,
    20,
    15,
    10,
    8,
    6
   ],
   "nom": "Laser de type VI"
  },
  "laserVII": {
   "code": "laserVII",
   "base": "laser",
   "niv": 6,
   "minerai": 3,
   "prix": 12,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 14,
    "degatBouclier": 3,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 14
   },
   "toucher": [
    80,
    69,
    53,
    37,
    32,
    21,
    16,
    11,
    9,
    7
   ],
   "nom": "Laser de type VII"
  },
  "laserVIII": {
   "code": "laserVIII",
   "base": "laser",
   "niv": 7,
   "minerai": 3,
   "prix": 13,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 14,
    "degatBouclier": 4,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 15
   },
   "toucher": [
    85,
    73,
    56,
    39,
    34,
    22,
    17,
    12,
    10,
    8
   ],
   "nom": "Laser de type VIII"
  },
  "laserIX": {
   "code": "laserIX",
   "base": "laser",
   "niv": 8,
   "minerai": 3,
   "prix": 14,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 14,
    "degatBouclier": 4,
    "degatCoque": 3,
    "degatSol": 1,
    "portee": 16
   },
   "toucher": [
    90,
    77,
    59,
    41,
    36,
    23,
    18,
    13,
    11,
    9
   ],
   "nom": "Laser de type IX"
  },
  "laserX": {
   "code": "laserX",
   "base": "laser",
   "niv": 9,
   "minerai": 2,
   "prix": 15,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 15,
    "degatBouclier": 5,
    "degatCoque": 4,
    "degatSol": 1,
    "portee": 17
   },
   "toucher": [
    95,
    81,
    62,
    43,
    38,
    24,
    19,
    14,
    12,
    10
   ],
   "nom": "Laser de type X"
  },
  "plasmaI": {
   "code": "plasmaI",
   "base": "plasma",
   "niv": 0,
   "minerai": 7,
   "prix": 6,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 1,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 12
   },
   "toucher": [
    20,
    35,
    40,
    45,
    50,
    45,
    35,
    25,
    15,
    5
   ],
   "nom": "Canon à plasma de type I"
  },
  "plasmaII": {
   "code": "plasmaII",
   "base": "plasma",
   "niv": 1,
   "minerai": 6,
   "prix": 7,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 8,
    "degatBouclier": 1,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 13
   },
   "toucher": [
    22,
    38,
    44,
    49,
    55,
    49,
    38,
    27,
    16,
    6
   ],
   "nom": "Canon à plasma de type II"
  },
  "plasmaIII": {
   "code": "plasmaIII",
   "base": "plasma",
   "niv": 2,
   "minerai": 5,
   "prix": 8,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 9,
    "degatBouclier": 1,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 14
   },
   "toucher": [
    24,
    41,
    48,
    53,
    60,
    53,
    41,
    29,
    17,
    7
   ],
   "nom": "Canon à plasma de type III"
  },
  "plasmaIV": {
   "code": "plasmaIV",
   "base": "plasma",
   "niv": 3,
   "minerai": 5,
   "prix": 9,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 9,
    "degatBouclier": 2,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 15
   },
   "toucher": [
    26,
    44,
    52,
    57,
    65,
    57,
    44,
    31,
    18,
    8
   ],
   "nom": "Canon à plasma de type IV"
  },
  "plasmaV": {
   "code": "plasmaV",
   "base": "plasma",
   "niv": 4,
   "minerai": 5,
   "prix": 10,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 9,
    "degatBouclier": 2,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 16
   },
   "toucher": [
    28,
    47,
    56,
    61,
    70,
    61,
    47,
    33,
    19,
    9
   ],
   "nom": "Canon à plasma de type V"
  },
  "plasmaVI": {
   "code": "plasmaVI",
   "base": "plasma",
   "niv": 5,
   "minerai": 4,
   "prix": 11,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 10,
    "degatBouclier": 2,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 17
   },
   "toucher": [
    30,
    50,
    60,
    65,
    75,
    65,
    50,
    35,
    20,
    10
   ],
   "nom": "Canon à plasma de type VI"
  },
  "plasmaVII": {
   "code": "plasmaVII",
   "base": "plasma",
   "niv": 6,
   "minerai": 3,
   "prix": 12,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 11,
    "degatBouclier": 2,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 18
   },
   "toucher": [
    32,
    53,
    64,
    69,
    80,
    69,
    53,
    37,
    21,
    11
   ],
   "nom": "Canon à plasma de type VII"
  },
  "plasmaVIII": {
   "code": "plasmaVIII",
   "base": "plasma",
   "niv": 7,
   "minerai": 3,
   "prix": 13,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 11,
    "degatBouclier": 3,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 19
   },
   "toucher": [
    34,
    56,
    68,
    73,
    85,
    73,
    56,
    39,
    22,
    12
   ],
   "nom": "Canon à plasma de type VIII"
  },
  "plasmaIX": {
   "code": "plasmaIX",
   "base": "plasma",
   "niv": 8,
   "minerai": 3,
   "prix": 14,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 11,
    "degatBouclier": 3,
    "degatCoque": 3,
    "degatSol": 1,
    "portee": 20
   },
   "toucher": [
    36,
    59,
    72,
    77,
    90,
    77,
    59,
    41,
    23,
    13
   ],
   "nom": "Canon à plasma de type IX"
  },
  "plasmaX": {
   "code": "plasmaX",
   "base": "plasma",
   "niv": 9,
   "minerai": 2,
   "prix": 15,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 12,
    "degatBouclier": 4,
    "degatCoque": 4,
    "degatSol": 1,
    "portee": 21
   },
   "toucher": [
    38,
    62,
    76,
    81,
    95,
    81,
    62,
    43,
    24,
    14
   ],
   "nom": "Canon à plasma de type X"
  },
  "torpI": {
   "code": "torpI",
   "base": "torp",
   "niv": 0,
   "minerai": 7,
   "prix": 6,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 3,
    "degatBouclier": 1,
    "degatCoque": 2,
    "degatSol": 2,
    "portee": 20
   },
   "toucher": [
    1,
    2,
    3,
    10,
    15,
    20,
    30,
    40,
    45,
    50
   ],
   "nom": "Lance-torpille de type I"
  },
  "torpII": {
   "code": "torpII",
   "base": "torp",
   "niv": 1,
   "minerai": 6,
   "prix": 7,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 4,
    "degatBouclier": 1,
    "degatCoque": 2,
    "degatSol": 2,
    "portee": 21
   },
   "toucher": [
    2,
    3,
    4,
    11,
    16,
    22,
    33,
    44,
    49,
    55
   ],
   "nom": "Lance-torpille de type II"
  },
  "torpIII": {
   "code": "torpIII",
   "base": "torp",
   "niv": 2,
   "minerai": 5,
   "prix": 8,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 5,
    "degatBouclier": 1,
    "degatCoque": 2,
    "degatSol": 2,
    "portee": 22
   },
   "toucher": [
    3,
    4,
    5,
    12,
    17,
    24,
    36,
    48,
    53,
    60
   ],
   "nom": "Lance-torpille de type III"
  },
  "torpIV": {
   "code": "torpIV",
   "base": "torp",
   "niv": 3,
   "minerai": 5,
   "prix": 9,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 5,
    "degatBouclier": 2,
    "degatCoque": 2,
    "degatSol": 2,
    "portee": 23
   },
   "toucher": [
    4,
    5,
    6,
    13,
    18,
    26,
    39,
    52,
    57,
    65
   ],
   "nom": "Lance-torpille de type IV"
  },
  "torpV": {
   "code": "torpV",
   "base": "torp",
   "niv": 4,
   "minerai": 5,
   "prix": 10,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 5,
    "degatBouclier": 2,
    "degatCoque": 3,
    "degatSol": 2,
    "portee": 24
   },
   "toucher": [
    5,
    6,
    7,
    14,
    19,
    28,
    42,
    56,
    61,
    70
   ],
   "nom": "Lance-torpille de type V"
  },
  "torpVI": {
   "code": "torpVI",
   "base": "torp",
   "niv": 5,
   "minerai": 4,
   "prix": 11,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 6,
    "degatBouclier": 2,
    "degatCoque": 3,
    "degatSol": 2,
    "portee": 25
   },
   "toucher": [
    6,
    7,
    8,
    15,
    20,
    30,
    45,
    60,
    65,
    75
   ],
   "nom": "Lance-torpille de type VI"
  },
  "torpVII": {
   "code": "torpVII",
   "base": "torp",
   "niv": 6,
   "minerai": 3,
   "prix": 12,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 2,
    "degatCoque": 3,
    "degatSol": 2,
    "portee": 26
   },
   "toucher": [
    7,
    8,
    9,
    16,
    21,
    32,
    48,
    64,
    69,
    80
   ],
   "nom": "Lance-torpille de type VII"
  },
  "torpVIII": {
   "code": "torpVIII",
   "base": "torp",
   "niv": 7,
   "minerai": 3,
   "prix": 13,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 3,
    "degatCoque": 3,
    "degatSol": 2,
    "portee": 27
   },
   "toucher": [
    8,
    9,
    10,
    17,
    22,
    34,
    51,
    68,
    73,
    85
   ],
   "nom": "Lance-torpille de type VIII"
  },
  "torpIX": {
   "code": "torpIX",
   "base": "torp",
   "niv": 8,
   "minerai": 3,
   "prix": 14,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 3,
    "degatCoque": 4,
    "degatSol": 2,
    "portee": 28
   },
   "toucher": [
    9,
    10,
    11,
    18,
    23,
    36,
    54,
    72,
    77,
    90
   ],
   "nom": "Lance-torpille de type IX"
  },
  "torpX": {
   "code": "torpX",
   "base": "torp",
   "niv": 9,
   "minerai": 2,
   "prix": 15,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 8,
    "degatBouclier": 4,
    "degatCoque": 5,
    "degatSol": 2,
    "portee": 29
   },
   "toucher": [
    10,
    11,
    12,
    19,
    24,
    38,
    57,
    76,
    81,
    95
   ],
   "nom": "Lance-torpille de type X"
  },
  "missI": {
   "code": "missI",
   "base": "miss",
   "niv": 0,
   "minerai": 7,
   "prix": 6,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 5,
    "degatBouclier": 0,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 15
   },
   "toucher": [
    30,
    35,
    40,
    40,
    40,
    40,
    40,
    40,
    40,
    40
   ],
   "nom": "Missile de type I"
  },
  "missII": {
   "code": "missII",
   "base": "miss",
   "niv": 1,
   "minerai": 6,
   "prix": 7,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 6,
    "degatBouclier": 0,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 16
   },
   "toucher": [
    33,
    38,
    44,
    44,
    44,
    44,
    44,
    44,
    44,
    44
   ],
   "nom": "Missile de type II"
  },
  "missIII": {
   "code": "missIII",
   "base": "miss",
   "niv": 2,
   "minerai": 5,
   "prix": 8,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 0,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 17
   },
   "toucher": [
    36,
    41,
    48,
    48,
    48,
    48,
    48,
    48,
    48,
    48
   ],
   "nom": "Missile de type III"
  },
  "missIV": {
   "code": "missIV",
   "base": "miss",
   "niv": 3,
   "minerai": 5,
   "prix": 9,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 1,
    "degatCoque": 1,
    "degatSol": 1,
    "portee": 18
   },
   "toucher": [
    39,
    44,
    52,
    52,
    52,
    52,
    52,
    52,
    52,
    52
   ],
   "nom": "Missile de type IV"
  },
  "missV": {
   "code": "missV",
   "base": "miss",
   "niv": 4,
   "minerai": 5,
   "prix": 10,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 7,
    "degatBouclier": 1,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 19
   },
   "toucher": [
    42,
    47,
    56,
    56,
    56,
    56,
    56,
    56,
    56,
    56
   ],
   "nom": "Missile de type V"
  },
  "missVI": {
   "code": "missVI",
   "base": "miss",
   "niv": 5,
   "minerai": 4,
   "prix": 11,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 8,
    "degatBouclier": 1,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 20
   },
   "toucher": [
    45,
    50,
    60,
    60,
    60,
    60,
    60,
    60,
    60,
    60
   ],
   "nom": "Missile de type VI"
  },
  "missVII": {
   "code": "missVII",
   "base": "miss",
   "niv": 6,
   "minerai": 3,
   "prix": 12,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 9,
    "degatBouclier": 1,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 21
   },
   "toucher": [
    48,
    53,
    64,
    64,
    64,
    64,
    64,
    64,
    64,
    64
   ],
   "nom": "Missile de type VII"
  },
  "missVIII": {
   "code": "missVIII",
   "base": "miss",
   "niv": 7,
   "minerai": 3,
   "prix": 13,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 9,
    "degatBouclier": 2,
    "degatCoque": 2,
    "degatSol": 1,
    "portee": 22
   },
   "toucher": [
    51,
    56,
    68,
    68,
    68,
    68,
    68,
    68,
    68,
    68
   ],
   "nom": "Missile de type VIII"
  },
  "missIX": {
   "code": "missIX",
   "base": "miss",
   "niv": 8,
   "minerai": 3,
   "prix": 14,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 9,
    "degatBouclier": 2,
    "degatCoque": 3,
    "degatSol": 1,
    "portee": 23
   },
   "toucher": [
    54,
    59,
    72,
    72,
    72,
    72,
    72,
    72,
    72,
    72
   ],
   "nom": "Missile de type IX"
  },
  "missX": {
   "code": "missX",
   "base": "miss",
   "niv": 9,
   "minerai": 2,
   "prix": 15,
   "type": "arme",
   "cases": 1,
   "typeArme": "CS",
   "arme": {
    "vitesse": 10,
    "degatBouclier": 3,
    "degatCoque": 4,
    "degatSol": 1,
    "portee": 24
   },
   "toucher": [
    57,
    62,
    76,
    76,
    76,
    76,
    76,
    76,
    76,
    76
   ],
   "nom": "Missile de type X"
  },
  "absorbI": {
   "code": "absorbI",
   "base": "absorb",
   "niv": 0,
   "minerai": 30,
   "prix": 100,
   "type": "autre",
   "cases": 10,
   "caracs": {
    "absorption": 1
   },
   "nom": "Absorbeur de type I"
  },
  "absorbII": {
   "code": "absorbII",
   "base": "absorb",
   "niv": 1,
   "minerai": 30,
   "prix": 150,
   "type": "autre",
   "cases": 20,
   "caracs": {
    "absorption": 2
   },
   "nom": "Absorbeur de type II"
  },
  "absorbIII": {
   "code": "absorbIII",
   "base": "absorb",
   "niv": 2,
   "minerai": 30,
   "prix": 200,
   "type": "autre",
   "cases": 30,
   "caracs": {
    "absorption": 3
   },
   "nom": "Absorbeur de type III"
  },
  "absorbIV": {
   "code": "absorbIV",
   "base": "absorb",
   "niv": 3,
   "minerai": 30,
   "prix": 250,
   "type": "autre",
   "cases": 50,
   "caracs": {
    "absorption": 5
   },
   "nom": "Absorbeur de type IV"
  },
  "absorbV": {
   "code": "absorbV",
   "base": "absorb",
   "niv": 4,
   "minerai": 30,
   "prix": 300,
   "type": "autre",
   "cases": 70,
   "caracs": {
    "absorption": 7
   },
   "nom": "Absorbeur de type V"
  },
  "absorbVI": {
   "code": "absorbVI",
   "base": "absorb",
   "niv": 5,
   "minerai": 30,
   "prix": 350,
   "type": "autre",
   "cases": 100,
   "caracs": {
    "absorption": 9
   },
   "nom": "Absorbeur de type VI"
  },
  "absorbVII": {
   "code": "absorbVII",
   "base": "absorb",
   "niv": 6,
   "minerai": 30,
   "prix": 400,
   "type": "autre",
   "cases": 140,
   "caracs": {
    "absorption": 12
   },
   "nom": "Absorbeur de type VII"
  },
  "absorbVIII": {
   "code": "absorbVIII",
   "base": "absorb",
   "niv": 7,
   "minerai": 30,
   "prix": 450,
   "type": "autre",
   "cases": 180,
   "caracs": {
    "absorption": 15
   },
   "nom": "Absorbeur de type VIII"
  },
  "absorbIX": {
   "code": "absorbIX",
   "base": "absorb",
   "niv": 8,
   "minerai": 30,
   "prix": 500,
   "type": "autre",
   "cases": 230,
   "caracs": {
    "absorption": 19
   },
   "nom": "Absorbeur de type IX"
  },
  "absorbX": {
   "code": "absorbX",
   "base": "absorb",
   "niv": 9,
   "minerai": 30,
   "prix": 600,
   "type": "autre",
   "cases": 300,
   "caracs": {
    "absorption": 25
   },
   "nom": "Absorbeur de type X"
  },
  "balastI": {
   "code": "balastI",
   "base": "balast",
   "niv": 0,
   "minerai": 2,
   "prix": 5,
   "type": "autre",
   "cases": 10,
   "nom": "Balast de type I"
  },
  "balastII": {
   "code": "balastII",
   "base": "balast",
   "niv": 1,
   "minerai": 4,
   "prix": 10,
   "type": "autre",
   "cases": 40,
   "nom": "Balast de type II"
  },
  "balastIII": {
   "code": "balastIII",
   "base": "balast",
   "niv": 2,
   "minerai": 6,
   "prix": 20,
   "type": "autre",
   "cases": 100,
   "nom": "Balast de type III"
  },
  "balastIV": {
   "code": "balastIV",
   "base": "balast",
   "niv": 3,
   "minerai": 10,
   "prix": 40,
   "type": "autre",
   "cases": 250,
   "nom": "Balast de type IV"
  },
  "balastV": {
   "code": "balastV",
   "base": "balast",
   "niv": 4,
   "minerai": 20,
   "prix": 70,
   "type": "autre",
   "cases": 600,
   "nom": "Balast de type V"
  },
  "bombeI": {
   "code": "bombeI",
   "base": "bombe",
   "niv": 0,
   "minerai": 5,
   "prix": 7,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 5,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type I"
  },
  "bombeII": {
   "code": "bombeII",
   "base": "bombe",
   "niv": 1,
   "minerai": 5,
   "prix": 8,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 6,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type II"
  },
  "bombeIII": {
   "code": "bombeIII",
   "base": "bombe",
   "niv": 2,
   "minerai": 4,
   "prix": 9,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 7,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type III"
  },
  "bombeIV": {
   "code": "bombeIV",
   "base": "bombe",
   "niv": 3,
   "minerai": 4,
   "prix": 10,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 8,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type IV"
  },
  "bombeV": {
   "code": "bombeV",
   "base": "bombe",
   "niv": 4,
   "minerai": 3,
   "prix": 11,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 9,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type V"
  },
  "bombeVI": {
   "code": "bombeVI",
   "base": "bombe",
   "niv": 5,
   "minerai": 3,
   "prix": 12,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 10,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type VI"
  },
  "bombeVII": {
   "code": "bombeVII",
   "base": "bombe",
   "niv": 6,
   "minerai": 2,
   "prix": 13,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 11,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type VII"
  },
  "bombeVIII": {
   "code": "bombeVIII",
   "base": "bombe",
   "niv": 7,
   "minerai": 2,
   "prix": 14,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 12,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type VIII"
  },
  "bombeIX": {
   "code": "bombeIX",
   "base": "bombe",
   "niv": 8,
   "minerai": 2,
   "prix": 15,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 13,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type IX"
  },
  "bombeX": {
   "code": "bombeX",
   "base": "bombe",
   "niv": 9,
   "minerai": 1,
   "prix": 16,
   "type": "arme",
   "cases": 1,
   "typeArme": "CP",
   "arme": {
    "vitesse": 0,
    "degatBouclier": 0,
    "degatCoque": 0,
    "degatSol": 14,
    "portee": 0
   },
   "toucher": [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
   ],
   "nom": "Bombe de type X"
  },
  "moteurI": {
   "code": "moteurI",
   "base": "moteur",
   "niv": 0,
   "minerai": 1,
   "prix": 4,
   "type": "moteur",
   "cases": 1,
   "caracs": {
    "propulsion": 1
   },
   "nom": "Réacteur de type I"
  },
  "moteurII": {
   "code": "moteurII",
   "base": "moteur",
   "niv": 1,
   "minerai": 4,
   "prix": 8,
   "type": "moteur",
   "cases": 4,
   "caracs": {
    "propulsion": 2
   },
   "nom": "Réacteur de type II"
  },
  "moteurIII": {
   "code": "moteurIII",
   "base": "moteur",
   "niv": 2,
   "minerai": 8,
   "prix": 12,
   "type": "moteur",
   "cases": 8,
   "caracs": {
    "propulsion": 3
   },
   "nom": "Réacteur de type III"
  },
  "moteurIV": {
   "code": "moteurIV",
   "base": "moteur",
   "niv": 3,
   "minerai": 15,
   "prix": 16,
   "type": "moteur",
   "cases": 15,
   "caracs": {
    "propulsion": 4
   },
   "nom": "Réacteur de type IV"
  },
  "moteurV": {
   "code": "moteurV",
   "base": "moteur",
   "niv": 4,
   "minerai": 30,
   "prix": 30,
   "type": "moteur",
   "cases": 30,
   "caracs": {
    "propulsion": 5
   },
   "nom": "Réacteur de type V"
  },
  "moteurVI": {
   "code": "moteurVI",
   "base": "moteur",
   "niv": 5,
   "minerai": 60,
   "prix": 60,
   "type": "moteur",
   "cases": 60,
   "caracs": {
    "propulsion": 6
   },
   "nom": "Réacteur de type VI"
  },
  "moteurVII": {
   "code": "moteurVII",
   "base": "moteur",
   "niv": 6,
   "minerai": 120,
   "prix": 120,
   "type": "moteur",
   "cases": 120,
   "caracs": {
    "propulsion": 7
   },
   "nom": "Réacteur de type VII"
  },
  "moteurVIII": {
   "code": "moteurVIII",
   "base": "moteur",
   "niv": 7,
   "minerai": 250,
   "prix": 250,
   "type": "moteur",
   "cases": 250,
   "caracs": {
    "propulsion": 8
   },
   "nom": "Réacteur de type VIII"
  },
  "moteurIX": {
   "code": "moteurIX",
   "base": "moteur",
   "niv": 8,
   "minerai": 500,
   "prix": 500,
   "type": "moteur",
   "cases": 500,
   "caracs": {
    "propulsion": 9
   },
   "nom": "Réacteur de type IX"
  },
  "moteurX": {
   "code": "moteurX",
   "base": "moteur",
   "niv": 9,
   "minerai": 1000,
   "prix": 1000,
   "type": "moteur",
   "cases": 1000,
   "caracs": {
    "propulsion": 10
   },
   "nom": "Réacteur de type X"
  },
  "scanI": {
   "code": "scanI",
   "base": "scan",
   "niv": 0,
   "minerai": 5,
   "prix": 10,
   "type": "autre",
   "cases": 3,
   "caracs": {
    "scannerFlotte": 1,
    "scannerSysteme": 1
   },
   "nom": "Scanner de type I"
  },
  "scanII": {
   "code": "scanII",
   "base": "scan",
   "niv": 1,
   "minerai": 10,
   "prix": 15,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "scannerFlotte": 2,
    "scannerSysteme": 2
   },
   "nom": "Scanner de type II"
  },
  "scanIII": {
   "code": "scanIII",
   "base": "scan",
   "niv": 2,
   "minerai": 20,
   "prix": 15,
   "type": "autre",
   "cases": 7,
   "caracs": {
    "scannerFlotte": 3,
    "scannerSysteme": 3
   },
   "nom": "Scanner de type III"
  },
  "scanIV": {
   "code": "scanIV",
   "base": "scan",
   "niv": 3,
   "minerai": 25,
   "prix": 20,
   "type": "autre",
   "cases": 9,
   "caracs": {
    "scannerFlotte": 4,
    "scannerSysteme": 4
   },
   "nom": "Scanner de type IV"
  },
  "scanV": {
   "code": "scanV",
   "base": "scan",
   "niv": 4,
   "minerai": 30,
   "prix": 25,
   "type": "autre",
   "cases": 11,
   "caracs": {
    "scannerFlotte": 5,
    "scannerSysteme": 5
   },
   "nom": "Scanner de type V"
  },
  "scanVI": {
   "code": "scanVI",
   "base": "scan",
   "niv": 5,
   "minerai": 40,
   "prix": 35,
   "type": "autre",
   "cases": 14,
   "caracs": {
    "scannerFlotte": 6,
    "scannerSysteme": 6
   },
   "nom": "Scanner de type VI"
  },
  "scanVII": {
   "code": "scanVII",
   "base": "scan",
   "niv": 6,
   "minerai": 70,
   "prix": 80,
   "type": "autre",
   "cases": 17,
   "caracs": {
    "scannerFlotte": 7,
    "scannerSysteme": 7
   },
   "nom": "Scanner de type VII"
  },
  "scanVIII": {
   "code": "scanVIII",
   "base": "scan",
   "niv": 7,
   "minerai": 140,
   "prix": 160,
   "type": "autre",
   "cases": 21,
   "caracs": {
    "scannerFlotte": 8,
    "scannerSysteme": 8
   },
   "nom": "Scanner de type VIII"
  },
  "scanIX": {
   "code": "scanIX",
   "base": "scan",
   "niv": 8,
   "minerai": 320,
   "prix": 300,
   "type": "autre",
   "cases": 26,
   "caracs": {
    "scannerFlotte": 9,
    "scannerSysteme": 9
   },
   "nom": "Scanner de type IX"
  },
  "scanX": {
   "code": "scanX",
   "base": "scan",
   "niv": 9,
   "minerai": 600,
   "prix": 700,
   "type": "autre",
   "cases": 32,
   "caracs": {
    "scannerFlotte": 10,
    "scannerSysteme": 10
   },
   "nom": "Scanner de type X"
  },
  "bouclierI": {
   "code": "bouclierI",
   "base": "bouclier",
   "niv": 0,
   "minerai": 10,
   "prix": 10,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "bouclier": 2
   },
   "nom": "Bouclier de type I"
  },
  "bouclierII": {
   "code": "bouclierII",
   "base": "bouclier",
   "niv": 1,
   "minerai": 10,
   "prix": 20,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "bouclier": 4
   },
   "nom": "Bouclier de type II"
  },
  "bouclierIII": {
   "code": "bouclierIII",
   "base": "bouclier",
   "niv": 2,
   "minerai": 15,
   "prix": 30,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "bouclier": 6
   },
   "nom": "Bouclier de type III"
  },
  "bouclierIV": {
   "code": "bouclierIV",
   "base": "bouclier",
   "niv": 3,
   "minerai": 20,
   "prix": 40,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "bouclier": 8
   },
   "nom": "Bouclier de type IV"
  },
  "bouclierV": {
   "code": "bouclierV",
   "base": "bouclier",
   "niv": 4,
   "minerai": 25,
   "prix": 50,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "bouclier": 10
   },
   "nom": "Bouclier de type V"
  },
  "bouclierVI": {
   "code": "bouclierVI",
   "base": "bouclier",
   "niv": 5,
   "minerai": 30,
   "prix": 60,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "bouclier": 14
   },
   "nom": "Bouclier de type VI"
  },
  "bouclierVII": {
   "code": "bouclierVII",
   "base": "bouclier",
   "niv": 6,
   "minerai": 35,
   "prix": 70,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "bouclier": 16
   },
   "nom": "Bouclier de type VII"
  },
  "bouclierVIII": {
   "code": "bouclierVIII",
   "base": "bouclier",
   "niv": 7,
   "minerai": 40,
   "prix": 80,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "bouclier": 20
   },
   "nom": "Bouclier de type VIII"
  },
  "bouclierIX": {
   "code": "bouclierIX",
   "base": "bouclier",
   "niv": 8,
   "minerai": 45,
   "prix": 90,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "bouclier": 26
   },
   "nom": "Bouclier de type IX"
  },
  "bouclierX": {
   "code": "bouclierX",
   "base": "bouclier",
   "niv": 9,
   "minerai": 50,
   "prix": 100,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "bouclier": 40
   },
   "nom": "Bouclier de type X"
  },
  "lmineI": {
   "code": "lmineI",
   "base": "lmine",
   "niv": 0,
   "minerai": 10,
   "prix": 10,
   "type": "autre",
   "cases": 1,
   "caracs": {
    "mines": 20
   },
   "nom": "Lanceur de mines AM de type I"
  },
  "lmineII": {
   "code": "lmineII",
   "base": "lmine",
   "niv": 1,
   "minerai": 15,
   "prix": 20,
   "type": "autre",
   "cases": 2,
   "caracs": {
    "mines": 40
   },
   "nom": "Lanceur de mines AM de type II"
  },
  "lmineIII": {
   "code": "lmineIII",
   "base": "lmine",
   "niv": 2,
   "minerai": 20,
   "prix": 30,
   "type": "autre",
   "cases": 3,
   "caracs": {
    "mines": 80
   },
   "nom": "Lanceur de mines AM de type III"
  },
  "lmineIV": {
   "code": "lmineIV",
   "base": "lmine",
   "niv": 3,
   "minerai": 25,
   "prix": 40,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "mines": 160
   },
   "nom": "Lanceur de mines AM de type IV"
  },
  "lmineV": {
   "code": "lmineV",
   "base": "lmine",
   "niv": 4,
   "minerai": 30,
   "prix": 50,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "mines": 320
   },
   "nom": "Lanceur de mines AM de type V"
  },
  "lmineVI": {
   "code": "lmineVI",
   "base": "lmine",
   "niv": 5,
   "minerai": 35,
   "prix": 55,
   "type": "autre",
   "cases": 6,
   "caracs": {
    "mines": 640
   },
   "nom": "Lanceur de mines AM de type VI"
  },
  "lmineVII": {
   "code": "lmineVII",
   "base": "lmine",
   "niv": 6,
   "minerai": 40,
   "prix": 60,
   "type": "autre",
   "cases": 7,
   "caracs": {
    "mines": 1280
   },
   "nom": "Lanceur de mines AM de type VII"
  },
  "lmineVIII": {
   "code": "lmineVIII",
   "base": "lmine",
   "niv": 7,
   "minerai": 45,
   "prix": 70,
   "type": "autre",
   "cases": 8,
   "caracs": {
    "mines": 2560
   },
   "nom": "Lanceur de mines AM de type VIII"
  },
  "lmineIX": {
   "code": "lmineIX",
   "base": "lmine",
   "niv": 8,
   "minerai": 50,
   "prix": 80,
   "type": "autre",
   "cases": 9,
   "caracs": {
    "mines": 5120
   },
   "nom": "Lanceur de mines AM de type IX"
  },
  "lmineX": {
   "code": "lmineX",
   "base": "lmine",
   "niv": 9,
   "minerai": 55,
   "prix": 85,
   "type": "autre",
   "cases": 10,
   "caracs": {
    "mines": 10240
   },
   "nom": "Lanceur de mines AM de type X"
  },
  "dmineI": {
   "code": "dmineI",
   "base": "dmine",
   "niv": 0,
   "minerai": 5,
   "prix": 10,
   "type": "autre",
   "cases": 1,
   "caracs": {
    "detectionMines": 10
   },
   "nom": "Détecteur de mines de type I"
  },
  "dmineII": {
   "code": "dmineII",
   "base": "dmine",
   "niv": 1,
   "minerai": 10,
   "prix": 20,
   "type": "autre",
   "cases": 2,
   "caracs": {
    "detectionMines": 20
   },
   "nom": "Détecteur de mines de type II"
  },
  "dmineIII": {
   "code": "dmineIII",
   "base": "dmine",
   "niv": 2,
   "minerai": 15,
   "prix": 30,
   "type": "autre",
   "cases": 3,
   "caracs": {
    "detectionMines": 30
   },
   "nom": "Détecteur de mines de type III"
  },
  "dmineIV": {
   "code": "dmineIV",
   "base": "dmine",
   "niv": 3,
   "minerai": 20,
   "prix": 40,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "detectionMines": 40
   },
   "nom": "Détecteur de mines de type IV"
  },
  "dmineV": {
   "code": "dmineV",
   "base": "dmine",
   "niv": 4,
   "minerai": 25,
   "prix": 50,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "detectionMines": 50
   },
   "nom": "Détecteur de mines de type V"
  },
  "dmineVI": {
   "code": "dmineVI",
   "base": "dmine",
   "niv": 5,
   "minerai": 30,
   "prix": 60,
   "type": "autre",
   "cases": 6,
   "caracs": {
    "detectionMines": 60
   },
   "nom": "Détecteur de mines de type VI"
  },
  "dmineVII": {
   "code": "dmineVII",
   "base": "dmine",
   "niv": 6,
   "minerai": 35,
   "prix": 70,
   "type": "autre",
   "cases": 7,
   "caracs": {
    "detectionMines": 70
   },
   "nom": "Détecteur de mines de type VII"
  },
  "dmineVIII": {
   "code": "dmineVIII",
   "base": "dmine",
   "niv": 7,
   "minerai": 40,
   "prix": 80,
   "type": "autre",
   "cases": 8,
   "caracs": {
    "detectionMines": 80
   },
   "nom": "Détecteur de mines de type VIII"
  },
  "dmineIX": {
   "code": "dmineIX",
   "base": "dmine",
   "niv": 8,
   "minerai": 45,
   "prix": 90,
   "type": "autre",
   "cases": 9,
   "caracs": {
    "detectionMines": 90
   },
   "nom": "Détecteur de mines de type IX"
  },
  "dmineX": {
   "code": "dmineX",
   "base": "dmine",
   "niv": 9,
   "minerai": 50,
   "prix": 100,
   "type": "autre",
   "cases": 10,
   "caracs": {
    "detectionMines": 100
   },
   "nom": "Détecteur de mines de type X"
  },
  "mconstruI": {
   "code": "mconstruI",
   "base": "mconstru",
   "niv": 0,
   "minerai": 20,
   "prix": 50,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "navireUsine": 2
   },
   "nom": "Module de construction de type I"
  },
  "mconstruII": {
   "code": "mconstruII",
   "base": "mconstru",
   "niv": 1,
   "minerai": 40,
   "prix": 100,
   "type": "autre",
   "cases": 8,
   "caracs": {
    "navireUsine": 4
   },
   "nom": "Module de construction de type II"
  },
  "mconstruIII": {
   "code": "mconstruIII",
   "base": "mconstru",
   "niv": 2,
   "minerai": 70,
   "prix": 150,
   "type": "autre",
   "cases": 12,
   "caracs": {
    "navireUsine": 8
   },
   "nom": "Module de construction de type III"
  },
  "mconstruIV": {
   "code": "mconstruIV",
   "base": "mconstru",
   "niv": 3,
   "minerai": 150,
   "prix": 200,
   "type": "autre",
   "cases": 16,
   "caracs": {
    "navireUsine": 16
   },
   "nom": "Module de construction de type IV"
  },
  "mconstruV": {
   "code": "mconstruV",
   "base": "mconstru",
   "niv": 4,
   "minerai": 240,
   "prix": 1000,
   "type": "autre",
   "cases": 20,
   "caracs": {
    "navireUsine": 32
   },
   "nom": "Module de construction de type V"
  },
  "mconstruVI": {
   "code": "mconstruVI",
   "base": "mconstru",
   "niv": 5,
   "minerai": 400,
   "prix": 2000,
   "type": "autre",
   "cases": 30,
   "caracs": {
    "navireUsine": 64
   },
   "nom": "Module de construction de type VI"
  },
  "mconstruVII": {
   "code": "mconstruVII",
   "base": "mconstru",
   "niv": 6,
   "minerai": 700,
   "prix": 5000,
   "type": "autre",
   "cases": 40,
   "caracs": {
    "navireUsine": 128
   },
   "nom": "Module de construction de type VII"
  },
  "bscanI": {
   "code": "bscanI",
   "base": "bscan",
   "niv": 0,
   "minerai": 5,
   "prix": 10,
   "type": "autre",
   "cases": 3,
   "caracs": {
    "brouillage": 10
   },
   "nom": "Brouilleur radar de type I"
  },
  "bscanII": {
   "code": "bscanII",
   "base": "bscan",
   "niv": 1,
   "minerai": 10,
   "prix": 20,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "brouillage": 20
   },
   "nom": "Brouilleur radar de type II"
  },
  "bscanIII": {
   "code": "bscanIII",
   "base": "bscan",
   "niv": 2,
   "minerai": 15,
   "prix": 30,
   "type": "autre",
   "cases": 7,
   "caracs": {
    "brouillage": 30
   },
   "nom": "Brouilleur radar de type III"
  },
  "bscanIV": {
   "code": "bscanIV",
   "base": "bscan",
   "niv": 3,
   "minerai": 20,
   "prix": 40,
   "type": "autre",
   "cases": 9,
   "caracs": {
    "brouillage": 40
   },
   "nom": "Brouilleur radar de type IV"
  },
  "bscanV": {
   "code": "bscanV",
   "base": "bscan",
   "niv": 4,
   "minerai": 25,
   "prix": 50,
   "type": "autre",
   "cases": 11,
   "caracs": {
    "brouillage": 50
   },
   "nom": "Brouilleur radar de type V"
  },
  "bscanVI": {
   "code": "bscanVI",
   "base": "bscan",
   "niv": 5,
   "minerai": 30,
   "prix": 60,
   "type": "autre",
   "cases": 14,
   "caracs": {
    "brouillage": 58
   },
   "nom": "Brouilleur radar de type VI"
  },
  "bscanVII": {
   "code": "bscanVII",
   "base": "bscan",
   "niv": 6,
   "minerai": 35,
   "prix": 70,
   "type": "autre",
   "cases": 17,
   "caracs": {
    "brouillage": 65
   },
   "nom": "Brouilleur radar de type VII"
  },
  "bscanVIII": {
   "code": "bscanVIII",
   "base": "bscan",
   "niv": 7,
   "minerai": 40,
   "prix": 100,
   "type": "autre",
   "cases": 21,
   "caracs": {
    "brouillage": 70
   },
   "nom": "Brouilleur radar de type VIII"
  },
  "bscanIX": {
   "code": "bscanIX",
   "base": "bscan",
   "niv": 8,
   "minerai": 45,
   "prix": 200,
   "type": "autre",
   "cases": 26,
   "caracs": {
    "brouillage": 75
   },
   "nom": "Brouilleur radar de type IX"
  },
  "bscanX": {
   "code": "bscanX",
   "base": "bscan",
   "niv": 9,
   "minerai": 50,
   "prix": 500,
   "type": "autre",
   "cases": 32,
   "caracs": {
    "brouillage": 85
   },
   "nom": "Brouilleur radar de type X"
  },
  "tractI": {
   "code": "tractI",
   "base": "tract",
   "niv": 0,
   "minerai": 5,
   "prix": 10,
   "type": "autre",
   "cases": 1,
   "caracs": {
    "tracteur": 1
   },
   "nom": "Rayon tracteur"
  },
  "cargoI": {
   "code": "cargoI",
   "base": "cargo",
   "niv": 0,
   "minerai": 1,
   "prix": 5,
   "type": "autre",
   "cases": 1,
   "nom": "Soute (obsolète) de type I"
  },
  "cargoII": {
   "code": "cargoII",
   "base": "cargo",
   "niv": 1,
   "minerai": 2,
   "prix": 10,
   "type": "autre",
   "cases": 2,
   "nom": "Soute (obsolète) de type II"
  },
  "cargoIII": {
   "code": "cargoIII",
   "base": "cargo",
   "niv": 2,
   "minerai": 3,
   "prix": 20,
   "type": "autre",
   "cases": 3,
   "nom": "Soute (obsolète) de type III"
  },
  "cargoIV": {
   "code": "cargoIV",
   "base": "cargo",
   "niv": 3,
   "minerai": 4,
   "prix": 40,
   "type": "autre",
   "cases": 4,
   "nom": "Soute (obsolète) de type IV"
  },
  "cargoV": {
   "code": "cargoV",
   "base": "cargo",
   "niv": 4,
   "minerai": 5,
   "prix": 50,
   "type": "autre",
   "cases": 5,
   "nom": "Soute (obsolète) de type V"
  },
  "cargoVI": {
   "code": "cargoVI",
   "base": "cargo",
   "niv": 5,
   "minerai": 7,
   "prix": 60,
   "type": "autre",
   "cases": 6,
   "nom": "Soute (obsolète) de type VI"
  },
  "cargoVII": {
   "code": "cargoVII",
   "base": "cargo",
   "niv": 6,
   "minerai": 9,
   "prix": 70,
   "type": "autre",
   "cases": 7,
   "nom": "Soute (obsolète) de type VII"
  },
  "cargoVIII": {
   "code": "cargoVIII",
   "base": "cargo",
   "niv": 7,
   "minerai": 12,
   "prix": 80,
   "type": "autre",
   "cases": 8,
   "nom": "Soute (obsolète) de type VIII"
  },
  "cargoIX": {
   "code": "cargoIX",
   "base": "cargo",
   "niv": 8,
   "minerai": 15,
   "prix": 90,
   "type": "autre",
   "cases": 9,
   "nom": "Soute (obsolète) de type IX"
  },
  "cargoX": {
   "code": "cargoX",
   "base": "cargo",
   "niv": 9,
   "minerai": 20,
   "prix": 100,
   "type": "autre",
   "cases": 10,
   "nom": "Soute (obsolète) de type X"
  },
  "villeI": {
   "code": "villeI",
   "base": "ville",
   "niv": 0,
   "minerai": 5,
   "prix": 10,
   "type": "autre",
   "cases": 20,
   "caracs": {
    "villeSpatiale": 2000
   },
   "nom": "Ville spatiale de type I"
  },
  "villeII": {
   "code": "villeII",
   "base": "ville",
   "niv": 1,
   "minerai": 10,
   "prix": 20,
   "type": "autre",
   "cases": 30,
   "caracs": {
    "villeSpatiale": 3500
   },
   "nom": "Ville spatiale de type II"
  },
  "villeIII": {
   "code": "villeIII",
   "base": "ville",
   "niv": 2,
   "minerai": 15,
   "prix": 30,
   "type": "autre",
   "cases": 40,
   "caracs": {
    "villeSpatiale": 4800
   },
   "nom": "Ville spatiale de type III"
  },
  "villeIV": {
   "code": "villeIV",
   "base": "ville",
   "niv": 3,
   "minerai": 20,
   "prix": 40,
   "type": "autre",
   "cases": 60,
   "caracs": {
    "villeSpatiale": 6000
   },
   "nom": "Ville spatiale de type IV"
  },
  "villeV": {
   "code": "villeV",
   "base": "ville",
   "niv": 4,
   "minerai": 25,
   "prix": 50,
   "type": "autre",
   "cases": 80,
   "caracs": {
    "villeSpatiale": 7200
   },
   "nom": "Ville spatiale de type V"
  },
  "villeVI": {
   "code": "villeVI",
   "base": "ville",
   "niv": 5,
   "minerai": 30,
   "prix": 60,
   "type": "autre",
   "cases": 100,
   "caracs": {
    "villeSpatiale": 8300
   },
   "nom": "Ville spatiale de type VI"
  },
  "villeVII": {
   "code": "villeVII",
   "base": "ville",
   "niv": 6,
   "minerai": 35,
   "prix": 70,
   "type": "autre",
   "cases": 150,
   "caracs": {
    "villeSpatiale": 9400
   },
   "nom": "Ville spatiale de type VII"
  },
  "robocoI": {
   "code": "robocoI",
   "base": "roboco",
   "niv": 0,
   "minerai": 10,
   "prix": 50,
   "type": "autre",
   "cases": 12,
   "caracs": {
    "colonisateur": 1
   },
   "nom": "Robot colonisateur"
  },
  "draminI": {
   "code": "draminI",
   "base": "dramin",
   "niv": 0,
   "minerai": 1,
   "prix": 10,
   "type": "autre",
   "cases": 1,
   "caracs": {
    "dragueur": 1
   },
   "nom": "Dragueur de mines de type I"
  },
  "draminII": {
   "code": "draminII",
   "base": "dramin",
   "niv": 1,
   "minerai": 2,
   "prix": 15,
   "type": "autre",
   "cases": 2,
   "caracs": {
    "dragueur": 2
   },
   "nom": "Dragueur de mines de type II"
  },
  "draminIII": {
   "code": "draminIII",
   "base": "dramin",
   "niv": 2,
   "minerai": 2,
   "prix": 20,
   "type": "autre",
   "cases": 3,
   "caracs": {
    "dragueur": 4
   },
   "nom": "Dragueur de mines de type III"
  },
  "draminIV": {
   "code": "draminIV",
   "base": "dramin",
   "niv": 3,
   "minerai": 3,
   "prix": 30,
   "type": "autre",
   "cases": 4,
   "caracs": {
    "dragueur": 8
   },
   "nom": "Dragueur de mines de type IV"
  },
  "draminV": {
   "code": "draminV",
   "base": "dramin",
   "niv": 4,
   "minerai": 4,
   "prix": 40,
   "type": "autre",
   "cases": 5,
   "caracs": {
    "dragueur": 16
   },
   "nom": "Dragueur de mines de type V"
  },
  "draminVI": {
   "code": "draminVI",
   "base": "dramin",
   "niv": 5,
   "minerai": 5,
   "prix": 50,
   "type": "autre",
   "cases": 6,
   "caracs": {
    "dragueur": 40
   },
   "nom": "Dragueur de mines de type VI"
  },
  "draminVII": {
   "code": "draminVII",
   "base": "dramin",
   "niv": 6,
   "minerai": 6,
   "prix": 60,
   "type": "autre",
   "cases": 7,
   "caracs": {
    "dragueur": 80
   },
   "nom": "Dragueur de mines de type VII"
  },
  "draminVIII": {
   "code": "draminVIII",
   "base": "dramin",
   "niv": 7,
   "minerai": 7,
   "prix": 70,
   "type": "autre",
   "cases": 8,
   "caracs": {
    "dragueur": 160
   },
   "nom": "Dragueur de mines de type VIII"
  },
  "draminIX": {
   "code": "draminIX",
   "base": "dramin",
   "niv": 8,
   "minerai": 8,
   "prix": 80,
   "type": "autre",
   "cases": 9,
   "caracs": {
    "dragueur": 320
   },
   "nom": "Dragueur de mines de type IX"
  },
  "draminX": {
   "code": "draminX",
   "base": "dramin",
   "niv": 9,
   "minerai": 10,
   "prix": 100,
   "type": "autre",
   "cases": 10,
   "caracs": {
    "dragueur": 650
   },
   "nom": "Dragueur de mines de type X"
  }
 },
 "batiments": {
  "recylageI": {
   "code": "recylageI",
   "base": "recylage",
   "niv": 0,
   "minerai": 5,
   "prix": 100,
   "structure": 20,
   "pdc": 5,
   "nom": "Unité de recyclage"
  },
  "mineI": {
   "code": "mineI",
   "base": "mine",
   "niv": 0,
   "minerai": 1,
   "prix": 10,
   "structure": 20,
   "pdc": 1,
   "sansPopulation": true,
   "nom": "Mine"
  },
  "chantierI": {
   "code": "chantierI",
   "base": "chantier",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 200,
   "pdc": 10,
   "sansPopulation": true,
   "nom": "Chantier naval"
  },
  "retraiteI": {
   "code": "retraiteI",
   "base": "retraite",
   "niv": 0,
   "minerai": 10,
   "prix": 50,
   "structure": 50,
   "pdc": 10,
   "nom": "Usine de retraitement"
  },
  "optpI": {
   "code": "optpI",
   "base": "optp",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type I"
  },
  "optpII": {
   "code": "optpII",
   "base": "optp",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type II"
  },
  "optpIII": {
   "code": "optpIII",
   "base": "optp",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type III"
  },
  "optpIV": {
   "code": "optpIV",
   "base": "optp",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type IV"
  },
  "optpV": {
   "code": "optpV",
   "base": "optp",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type V"
  },
  "optpVI": {
   "code": "optpVI",
   "base": "optp",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type VI"
  },
  "optpVII": {
   "code": "optpVII",
   "base": "optp",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type VII"
  },
  "optpVIII": {
   "code": "optpVIII",
   "base": "optp",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type VIII"
  },
  "optpIX": {
   "code": "optpIX",
   "base": "optp",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type IX"
  },
  "optpX": {
   "code": "optpX",
   "base": "optp",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 50,
   "pdc": 5,
   "nom": "Usine d'optimisation planétaire de type X"
  },
  "repareI": {
   "code": "repareI",
   "base": "repare",
   "niv": 0,
   "minerai": 20,
   "prix": 200,
   "structure": 100,
   "pdc": 20,
   "nom": "Centre de réparation spatial de type I"
  },
  "repareII": {
   "code": "repareII",
   "base": "repare",
   "niv": 1,
   "minerai": 30,
   "prix": 400,
   "structure": 100,
   "pdc": 30,
   "nom": "Centre de réparation spatial de type II"
  },
  "repareIII": {
   "code": "repareIII",
   "base": "repare",
   "niv": 2,
   "minerai": 40,
   "prix": 800,
   "structure": 100,
   "pdc": 40,
   "nom": "Centre de réparation spatial de type III"
  },
  "repareIV": {
   "code": "repareIV",
   "base": "repare",
   "niv": 3,
   "minerai": 50,
   "prix": 1600,
   "structure": 100,
   "pdc": 50,
   "nom": "Centre de réparation spatial de type IV"
  },
  "repareV": {
   "code": "repareV",
   "base": "repare",
   "niv": 4,
   "minerai": 60,
   "prix": 3200,
   "structure": 100,
   "pdc": 60,
   "nom": "Centre de réparation spatial de type V"
  },
  "boucplaI": {
   "code": "boucplaI",
   "base": "boucpla",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 10,
   "bouclier": 1,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type I"
  },
  "boucplaII": {
   "code": "boucplaII",
   "base": "boucpla",
   "niv": 1,
   "minerai": 15,
   "prix": 150,
   "structure": 400,
   "pdc": 15,
   "bouclier": 2,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type II"
  },
  "boucplaIII": {
   "code": "boucplaIII",
   "base": "boucpla",
   "niv": 2,
   "minerai": 20,
   "prix": 200,
   "structure": 1350,
   "pdc": 20,
   "bouclier": 3,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type III"
  },
  "boucplaIV": {
   "code": "boucplaIV",
   "base": "boucpla",
   "niv": 3,
   "minerai": 25,
   "prix": 250,
   "structure": 3200,
   "pdc": 25,
   "bouclier": 4,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type IV"
  },
  "boucplaV": {
   "code": "boucplaV",
   "base": "boucpla",
   "niv": 4,
   "minerai": 30,
   "prix": 300,
   "structure": 6250,
   "pdc": 30,
   "bouclier": 5,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type V"
  },
  "boucplaVI": {
   "code": "boucplaVI",
   "base": "boucpla",
   "niv": 5,
   "minerai": 35,
   "prix": 350,
   "structure": 10800,
   "pdc": 35,
   "bouclier": 6,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type VI"
  },
  "boucplaVII": {
   "code": "boucplaVII",
   "base": "boucpla",
   "niv": 6,
   "minerai": 40,
   "prix": 400,
   "structure": 17150,
   "pdc": 40,
   "bouclier": 7,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type VII"
  },
  "boucplaVIII": {
   "code": "boucplaVIII",
   "base": "boucpla",
   "niv": 7,
   "minerai": 45,
   "prix": 450,
   "structure": 25600,
   "pdc": 45,
   "bouclier": 8,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type VIII"
  },
  "boucplaIX": {
   "code": "boucplaIX",
   "base": "boucpla",
   "niv": 8,
   "minerai": 50,
   "prix": 500,
   "structure": 36450,
   "pdc": 50,
   "bouclier": 9,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type IX"
  },
  "boucplaX": {
   "code": "boucplaX",
   "base": "boucpla",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 50000,
   "pdc": 55,
   "bouclier": 10,
   "sansPopulation": true,
   "nom": "Bouclier planétaire de type X"
  },
  "radarI": {
   "code": "radarI",
   "base": "radar",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 10,
   "sansPopulation": true,
   "nom": "Radar de type I"
  },
  "radarII": {
   "code": "radarII",
   "base": "radar",
   "niv": 1,
   "minerai": 15,
   "prix": 150,
   "structure": 150,
   "pdc": 15,
   "sansPopulation": true,
   "nom": "Radar de type II"
  },
  "radarIII": {
   "code": "radarIII",
   "base": "radar",
   "niv": 2,
   "minerai": 20,
   "prix": 200,
   "structure": 200,
   "pdc": 20,
   "sansPopulation": true,
   "nom": "Radar de type III"
  },
  "radarIV": {
   "code": "radarIV",
   "base": "radar",
   "niv": 3,
   "minerai": 25,
   "prix": 250,
   "structure": 350,
   "pdc": 25,
   "sansPopulation": true,
   "nom": "Radar de type IV"
  },
  "radarV": {
   "code": "radarV",
   "base": "radar",
   "niv": 4,
   "minerai": 30,
   "prix": 300,
   "structure": 400,
   "pdc": 30,
   "sansPopulation": true,
   "nom": "Radar de type V"
  },
  "radarVI": {
   "code": "radarVI",
   "base": "radar",
   "niv": 5,
   "minerai": 35,
   "prix": 350,
   "structure": 450,
   "pdc": 35,
   "sansPopulation": true,
   "nom": "Radar de type VI"
  },
  "radarVII": {
   "code": "radarVII",
   "base": "radar",
   "niv": 6,
   "minerai": 40,
   "prix": 400,
   "structure": 500,
   "pdc": 40,
   "sansPopulation": true,
   "nom": "Radar de type VII"
  },
  "radarVIII": {
   "code": "radarVIII",
   "base": "radar",
   "niv": 7,
   "minerai": 45,
   "prix": 450,
   "structure": 550,
   "pdc": 45,
   "sansPopulation": true,
   "nom": "Radar de type VIII"
  },
  "radarIX": {
   "code": "radarIX",
   "base": "radar",
   "niv": 8,
   "minerai": 50,
   "prix": 500,
   "structure": 650,
   "pdc": 50,
   "sansPopulation": true,
   "nom": "Radar de type IX"
  },
  "radarX": {
   "code": "radarX",
   "base": "radar",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 700,
   "pdc": 55,
   "sansPopulation": true,
   "nom": "Radar de type X"
  },
  "extraI": {
   "code": "extraI",
   "base": "extra",
   "niv": 0,
   "minerai": 2,
   "prix": 50,
   "structure": 200,
   "pdc": 10,
   "nom": "Usine d'extraction avancée de type I"
  },
  "extraII": {
   "code": "extraII",
   "base": "extra",
   "niv": 1,
   "minerai": 4,
   "prix": 100,
   "structure": 200,
   "pdc": 15,
   "nom": "Usine d'extraction avancée de type II"
  },
  "extraIII": {
   "code": "extraIII",
   "base": "extra",
   "niv": 2,
   "minerai": 8,
   "prix": 150,
   "structure": 200,
   "pdc": 20,
   "nom": "Usine d'extraction avancée de type III"
  },
  "extraIV": {
   "code": "extraIV",
   "base": "extra",
   "niv": 3,
   "minerai": 15,
   "prix": 200,
   "structure": 200,
   "pdc": 25,
   "nom": "Usine d'extraction avancée de type IV"
  },
  "extraV": {
   "code": "extraV",
   "base": "extra",
   "niv": 4,
   "minerai": 30,
   "prix": 250,
   "structure": 200,
   "pdc": 30,
   "nom": "Usine d'extraction avancée de type V"
  },
  "agroI": {
   "code": "agroI",
   "base": "agro",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type I"
  },
  "agroII": {
   "code": "agroII",
   "base": "agro",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type II"
  },
  "agroIII": {
   "code": "agroIII",
   "base": "agro",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type III"
  },
  "agroIV": {
   "code": "agroIV",
   "base": "agro",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type IV"
  },
  "agroV": {
   "code": "agroV",
   "base": "agro",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type V"
  },
  "agroVI": {
   "code": "agroVI",
   "base": "agro",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type VI"
  },
  "agroVII": {
   "code": "agroVII",
   "base": "agro",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type VII"
  },
  "agroVIII": {
   "code": "agroVIII",
   "base": "agro",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type VIII"
  },
  "agroIX": {
   "code": "agroIX",
   "base": "agro",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type IX"
  },
  "agroX": {
   "code": "agroX",
   "base": "agro",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits alimentaires de type X"
  },
  "agricoleI": {
   "code": "agricoleI",
   "base": "agricole",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type I"
  },
  "agricoleII": {
   "code": "agricoleII",
   "base": "agricole",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type II"
  },
  "agricoleIII": {
   "code": "agricoleIII",
   "base": "agricole",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type III"
  },
  "agricoleIV": {
   "code": "agricoleIV",
   "base": "agricole",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type IV"
  },
  "agricoleV": {
   "code": "agricoleV",
   "base": "agricole",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type V"
  },
  "agricoleVI": {
   "code": "agricoleVI",
   "base": "agricole",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type VI"
  },
  "agricoleVII": {
   "code": "agricoleVII",
   "base": "agricole",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type VII"
  },
  "agricoleVIII": {
   "code": "agricoleVIII",
   "base": "agricole",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type VIII"
  },
  "agricoleIX": {
   "code": "agricoleIX",
   "base": "agricole",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type IX"
  },
  "agricoleX": {
   "code": "agricoleX",
   "base": "agricole",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Usine agricole de type X"
  },
  "modeI": {
   "code": "modeI",
   "base": "mode",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type I"
  },
  "modeII": {
   "code": "modeII",
   "base": "mode",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type II"
  },
  "modeIII": {
   "code": "modeIII",
   "base": "mode",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type III"
  },
  "modeIV": {
   "code": "modeIV",
   "base": "mode",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type IV"
  },
  "modeV": {
   "code": "modeV",
   "base": "mode",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type V"
  },
  "modeVI": {
   "code": "modeVI",
   "base": "mode",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type VI"
  },
  "modeVII": {
   "code": "modeVII",
   "base": "mode",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type VII"
  },
  "modeVIII": {
   "code": "modeVIII",
   "base": "mode",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type VIII"
  },
  "modeIX": {
   "code": "modeIX",
   "base": "mode",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type IX"
  },
  "modeX": {
   "code": "modeX",
   "base": "mode",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de produits de luxe de type X"
  },
  "culturelI": {
   "code": "culturelI",
   "base": "culturel",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type I"
  },
  "culturelII": {
   "code": "culturelII",
   "base": "culturel",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type II"
  },
  "culturelIII": {
   "code": "culturelIII",
   "base": "culturel",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type III"
  },
  "culturelIV": {
   "code": "culturelIV",
   "base": "culturel",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type IV"
  },
  "culturelV": {
   "code": "culturelV",
   "base": "culturel",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type V"
  },
  "culturelVI": {
   "code": "culturelVI",
   "base": "culturel",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type VI"
  },
  "culturelVII": {
   "code": "culturelVII",
   "base": "culturel",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type VII"
  },
  "culturelVIII": {
   "code": "culturelVIII",
   "base": "culturel",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type VIII"
  },
  "culturelIX": {
   "code": "culturelIX",
   "base": "culturel",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type IX"
  },
  "culturelX": {
   "code": "culturelX",
   "base": "culturel",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'holofilms et hololivres de type X"
  },
  "transfoI": {
   "code": "transfoI",
   "base": "transfo",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type I"
  },
  "transfoII": {
   "code": "transfoII",
   "base": "transfo",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type II"
  },
  "transfoIII": {
   "code": "transfoIII",
   "base": "transfo",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type III"
  },
  "transfoIV": {
   "code": "transfoIV",
   "base": "transfo",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type IV"
  },
  "transfoV": {
   "code": "transfoV",
   "base": "transfo",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type V"
  },
  "transfoVI": {
   "code": "transfoVI",
   "base": "transfo",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type VI"
  },
  "transfoVII": {
   "code": "transfoVII",
   "base": "transfo",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type VII"
  },
  "transfoVIII": {
   "code": "transfoVIII",
   "base": "transfo",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type VIII"
  },
  "transfoIX": {
   "code": "transfoIX",
   "base": "transfo",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type IX"
  },
  "transfoX": {
   "code": "transfoX",
   "base": "transfo",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de système de guidage de type X"
  },
  "pharmaI": {
   "code": "pharmaI",
   "base": "pharma",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type I"
  },
  "pharmaII": {
   "code": "pharmaII",
   "base": "pharma",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type II"
  },
  "pharmaIII": {
   "code": "pharmaIII",
   "base": "pharma",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type III"
  },
  "pharmaIV": {
   "code": "pharmaIV",
   "base": "pharma",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type IV"
  },
  "pharmaV": {
   "code": "pharmaV",
   "base": "pharma",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type V"
  },
  "pharmaVI": {
   "code": "pharmaVI",
   "base": "pharma",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type VI"
  },
  "pharmaVII": {
   "code": "pharmaVII",
   "base": "pharma",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type VII"
  },
  "pharmaVIII": {
   "code": "pharmaVIII",
   "base": "pharma",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type VIII"
  },
  "pharmaIX": {
   "code": "pharmaIX",
   "base": "pharma",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type IX"
  },
  "pharmaX": {
   "code": "pharmaX",
   "base": "pharma",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de médicaments de type X"
  },
  "infoI": {
   "code": "infoI",
   "base": "info",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type I"
  },
  "infoII": {
   "code": "infoII",
   "base": "info",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type II"
  },
  "infoIII": {
   "code": "infoIII",
   "base": "info",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type III"
  },
  "infoIV": {
   "code": "infoIV",
   "base": "info",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type IV"
  },
  "infoV": {
   "code": "infoV",
   "base": "info",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type V"
  },
  "infoVI": {
   "code": "infoVI",
   "base": "info",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type VI"
  },
  "infoVII": {
   "code": "infoVII",
   "base": "info",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type VII"
  },
  "infoVIII": {
   "code": "infoVIII",
   "base": "info",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type VIII"
  },
  "infoIX": {
   "code": "infoIX",
   "base": "info",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type IX"
  },
  "infoX": {
   "code": "infoX",
   "base": "info",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de logiciels de type X"
  },
  "robotI": {
   "code": "robotI",
   "base": "robot",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type I"
  },
  "robotII": {
   "code": "robotII",
   "base": "robot",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type II"
  },
  "robotIII": {
   "code": "robotIII",
   "base": "robot",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type III"
  },
  "robotIV": {
   "code": "robotIV",
   "base": "robot",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type IV"
  },
  "robotV": {
   "code": "robotV",
   "base": "robot",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type V"
  },
  "robotVI": {
   "code": "robotVI",
   "base": "robot",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type VI"
  },
  "robotVII": {
   "code": "robotVII",
   "base": "robot",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type VII"
  },
  "robotVIII": {
   "code": "robotVIII",
   "base": "robot",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type VIII"
  },
  "robotIX": {
   "code": "robotIX",
   "base": "robot",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type IX"
  },
  "robotX": {
   "code": "robotX",
   "base": "robot",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de robots de type X"
  },
  "technoI": {
   "code": "technoI",
   "base": "techno",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type I"
  },
  "technoII": {
   "code": "technoII",
   "base": "techno",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type II"
  },
  "technoIII": {
   "code": "technoIII",
   "base": "techno",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type III"
  },
  "technoIV": {
   "code": "technoIV",
   "base": "techno",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type IV"
  },
  "technoV": {
   "code": "technoV",
   "base": "techno",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type V"
  },
  "technoVI": {
   "code": "technoVI",
   "base": "techno",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type VI"
  },
  "technoVII": {
   "code": "technoVII",
   "base": "techno",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type VII"
  },
  "technoVIII": {
   "code": "technoVIII",
   "base": "techno",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type VIII"
  },
  "technoIX": {
   "code": "technoIX",
   "base": "techno",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type IX"
  },
  "technoX": {
   "code": "technoX",
   "base": "techno",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de composants électroniques de type X"
  },
  "armeI": {
   "code": "armeI",
   "base": "arme",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type I"
  },
  "armeII": {
   "code": "armeII",
   "base": "arme",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type II"
  },
  "armeIII": {
   "code": "armeIII",
   "base": "arme",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type III"
  },
  "armeIV": {
   "code": "armeIV",
   "base": "arme",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type IV"
  },
  "armeV": {
   "code": "armeV",
   "base": "arme",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type V"
  },
  "armeVI": {
   "code": "armeVI",
   "base": "arme",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type VI"
  },
  "armeVII": {
   "code": "armeVII",
   "base": "arme",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type VII"
  },
  "armeVIII": {
   "code": "armeVIII",
   "base": "arme",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type VIII"
  },
  "armeIX": {
   "code": "armeIX",
   "base": "arme",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type IX"
  },
  "armeX": {
   "code": "armeX",
   "base": "arme",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'armement et explosifs de type X"
  },
  "raffineI": {
   "code": "raffineI",
   "base": "raffine",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type I"
  },
  "raffineII": {
   "code": "raffineII",
   "base": "raffine",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type II"
  },
  "raffineIII": {
   "code": "raffineIII",
   "base": "raffine",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type III"
  },
  "raffineIV": {
   "code": "raffineIV",
   "base": "raffine",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type IV"
  },
  "raffineV": {
   "code": "raffineV",
   "base": "raffine",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type V"
  },
  "raffineVI": {
   "code": "raffineVI",
   "base": "raffine",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type VI"
  },
  "raffineVII": {
   "code": "raffineVII",
   "base": "raffine",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type VII"
  },
  "raffineVIII": {
   "code": "raffineVIII",
   "base": "raffine",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type VIII"
  },
  "raffineIX": {
   "code": "raffineIX",
   "base": "raffine",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type IX"
  },
  "raffineX": {
   "code": "raffineX",
   "base": "raffine",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station d'unité energétique de type X"
  },
  "lourdeI": {
   "code": "lourdeI",
   "base": "lourde",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type I"
  },
  "lourdeII": {
   "code": "lourdeII",
   "base": "lourde",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type II"
  },
  "lourdeIII": {
   "code": "lourdeIII",
   "base": "lourde",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type III"
  },
  "lourdeIV": {
   "code": "lourdeIV",
   "base": "lourde",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type IV"
  },
  "lourdeV": {
   "code": "lourdeV",
   "base": "lourde",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type V"
  },
  "lourdeVI": {
   "code": "lourdeVI",
   "base": "lourde",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type VI"
  },
  "lourdeVII": {
   "code": "lourdeVII",
   "base": "lourde",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type VII"
  },
  "lourdeVIII": {
   "code": "lourdeVIII",
   "base": "lourde",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type VIII"
  },
  "lourdeIX": {
   "code": "lourdeIX",
   "base": "lourde",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type IX"
  },
  "lourdeX": {
   "code": "lourdeX",
   "base": "lourde",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de pièce industrielle de type X"
  },
  "metauxI": {
   "code": "metauxI",
   "base": "metaux",
   "niv": 0,
   "minerai": 10,
   "prix": 100,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type I"
  },
  "metauxII": {
   "code": "metauxII",
   "base": "metaux",
   "niv": 1,
   "minerai": 19,
   "prix": 190,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type II"
  },
  "metauxIII": {
   "code": "metauxIII",
   "base": "metaux",
   "niv": 2,
   "minerai": 27,
   "prix": 270,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type III"
  },
  "metauxIV": {
   "code": "metauxIV",
   "base": "metaux",
   "niv": 3,
   "minerai": 34,
   "prix": 340,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type IV"
  },
  "metauxV": {
   "code": "metauxV",
   "base": "metaux",
   "niv": 4,
   "minerai": 40,
   "prix": 400,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type V"
  },
  "metauxVI": {
   "code": "metauxVI",
   "base": "metaux",
   "niv": 5,
   "minerai": 45,
   "prix": 450,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type VI"
  },
  "metauxVII": {
   "code": "metauxVII",
   "base": "metaux",
   "niv": 6,
   "minerai": 49,
   "prix": 490,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type VII"
  },
  "metauxVIII": {
   "code": "metauxVIII",
   "base": "metaux",
   "niv": 7,
   "minerai": 52,
   "prix": 520,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type VIII"
  },
  "metauxIX": {
   "code": "metauxIX",
   "base": "metaux",
   "niv": 8,
   "minerai": 54,
   "prix": 540,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type IX"
  },
  "metauxX": {
   "code": "metauxX",
   "base": "metaux",
   "niv": 9,
   "minerai": 55,
   "prix": 550,
   "structure": 100,
   "pdc": 5,
   "nom": "Station de métaux précieux de type X"
  },
  "battlaI": {
   "code": "battlaI",
   "base": "battla",
   "niv": 0,
   "minerai": 5,
   "prix": 80,
   "structure": 25,
   "pdc": 10,
   "arme": "laserI",
   "nom": "Batterie de lasers de type I"
  },
  "battlaII": {
   "code": "battlaII",
   "base": "battla",
   "niv": 1,
   "minerai": 5,
   "prix": 150,
   "structure": 50,
   "pdc": 10,
   "arme": "laserII",
   "nom": "Batterie de lasers de type II"
  },
  "battlaIII": {
   "code": "battlaIII",
   "base": "battla",
   "niv": 2,
   "minerai": 5,
   "prix": 200,
   "structure": 100,
   "pdc": 10,
   "arme": "laserIII",
   "nom": "Batterie de lasers de type III"
  },
  "battlaIV": {
   "code": "battlaIV",
   "base": "battla",
   "niv": 3,
   "minerai": 10,
   "prix": 250,
   "structure": 150,
   "pdc": 10,
   "arme": "laserIV",
   "nom": "Batterie de lasers de type IV"
  },
  "battlaV": {
   "code": "battlaV",
   "base": "battla",
   "niv": 4,
   "minerai": 15,
   "prix": 300,
   "structure": 200,
   "pdc": 10,
   "arme": "laserV",
   "nom": "Batterie de lasers de type V"
  },
  "battlaVI": {
   "code": "battlaVI",
   "base": "battla",
   "niv": 5,
   "minerai": 15,
   "prix": 350,
   "structure": 250,
   "pdc": 10,
   "arme": "laserVI",
   "nom": "Batterie de lasers de type VI"
  },
  "battlaVII": {
   "code": "battlaVII",
   "base": "battla",
   "niv": 6,
   "minerai": 15,
   "prix": 400,
   "structure": 300,
   "pdc": 10,
   "arme": "laserVII",
   "nom": "Batterie de lasers de type VII"
  },
  "battlaVIII": {
   "code": "battlaVIII",
   "base": "battla",
   "niv": 7,
   "minerai": 20,
   "prix": 450,
   "structure": 350,
   "pdc": 10,
   "arme": "laserVIII",
   "nom": "Batterie de lasers de type VIII"
  },
  "battlaIX": {
   "code": "battlaIX",
   "base": "battla",
   "niv": 8,
   "minerai": 25,
   "prix": 500,
   "structure": 400,
   "pdc": 10,
   "arme": "laserIX",
   "nom": "Batterie de lasers de type IX"
  },
  "battlaX": {
   "code": "battlaX",
   "base": "battla",
   "niv": 9,
   "minerai": 30,
   "prix": 550,
   "structure": 450,
   "pdc": 10,
   "arme": "laserX",
   "nom": "Batterie de lasers de type X"
  },
  "battplaI": {
   "code": "battplaI",
   "base": "battpla",
   "niv": 0,
   "minerai": 5,
   "prix": 80,
   "structure": 25,
   "pdc": 10,
   "arme": "plasmaI",
   "nom": "Batterie de plasmas de type I"
  },
  "battplaII": {
   "code": "battplaII",
   "base": "battpla",
   "niv": 1,
   "minerai": 5,
   "prix": 150,
   "structure": 50,
   "pdc": 10,
   "arme": "plasmaII",
   "nom": "Batterie de plasmas de type II"
  },
  "battplaIII": {
   "code": "battplaIII",
   "base": "battpla",
   "niv": 2,
   "minerai": 5,
   "prix": 200,
   "structure": 100,
   "pdc": 10,
   "arme": "plasmaIII",
   "nom": "Batterie de plasmas de type III"
  },
  "battplaIV": {
   "code": "battplaIV",
   "base": "battpla",
   "niv": 3,
   "minerai": 10,
   "prix": 250,
   "structure": 150,
   "pdc": 10,
   "arme": "plasmaIV",
   "nom": "Batterie de plasmas de type IV"
  },
  "battplaV": {
   "code": "battplaV",
   "base": "battpla",
   "niv": 4,
   "minerai": 15,
   "prix": 300,
   "structure": 200,
   "pdc": 10,
   "arme": "plasmaV",
   "nom": "Batterie de plasmas de type V"
  },
  "battplaVI": {
   "code": "battplaVI",
   "base": "battpla",
   "niv": 5,
   "minerai": 15,
   "prix": 350,
   "structure": 250,
   "pdc": 10,
   "arme": "plasmaVI",
   "nom": "Batterie de plasmas de type VI"
  },
  "battplaVII": {
   "code": "battplaVII",
   "base": "battpla",
   "niv": 6,
   "minerai": 15,
   "prix": 400,
   "structure": 300,
   "pdc": 10,
   "arme": "plasmaVII",
   "nom": "Batterie de plasmas de type VII"
  },
  "battplaVIII": {
   "code": "battplaVIII",
   "base": "battpla",
   "niv": 7,
   "minerai": 20,
   "prix": 450,
   "structure": 350,
   "pdc": 10,
   "arme": "plasmaVIII",
   "nom": "Batterie de plasmas de type VIII"
  },
  "battplaIX": {
   "code": "battplaIX",
   "base": "battpla",
   "niv": 8,
   "minerai": 25,
   "prix": 500,
   "structure": 400,
   "pdc": 10,
   "arme": "plasmaIX",
   "nom": "Batterie de plasmas de type IX"
  },
  "battplaX": {
   "code": "battplaX",
   "base": "battpla",
   "niv": 9,
   "minerai": 30,
   "prix": 550,
   "structure": 500,
   "pdc": 10,
   "arme": "plasmaX",
   "nom": "Batterie de plasmas de type X"
  },
  "rampemisI": {
   "code": "rampemisI",
   "base": "rampemis",
   "niv": 0,
   "minerai": 5,
   "prix": 80,
   "structure": 25,
   "pdc": 10,
   "arme": "missI",
   "nom": "Batterie de missiles de type I"
  },
  "rampemisII": {
   "code": "rampemisII",
   "base": "rampemis",
   "niv": 1,
   "minerai": 5,
   "prix": 150,
   "structure": 50,
   "pdc": 10,
   "arme": "missII",
   "nom": "Batterie de missiles de type II"
  },
  "rampemisIII": {
   "code": "rampemisIII",
   "base": "rampemis",
   "niv": 2,
   "minerai": 5,
   "prix": 200,
   "structure": 100,
   "pdc": 10,
   "arme": "missIII",
   "nom": "Batterie de missiles de type III"
  },
  "rampemisIV": {
   "code": "rampemisIV",
   "base": "rampemis",
   "niv": 3,
   "minerai": 10,
   "prix": 250,
   "structure": 150,
   "pdc": 10,
   "arme": "missIV",
   "nom": "Batterie de missiles de type IV"
  },
  "rampemisV": {
   "code": "rampemisV",
   "base": "rampemis",
   "niv": 4,
   "minerai": 15,
   "prix": 300,
   "structure": 200,
   "pdc": 10,
   "arme": "missV",
   "nom": "Batterie de missiles de type V"
  },
  "rampemisVI": {
   "code": "rampemisVI",
   "base": "rampemis",
   "niv": 5,
   "minerai": 15,
   "prix": 350,
   "structure": 250,
   "pdc": 10,
   "arme": "missVI",
   "nom": "Batterie de missiles de type VI"
  },
  "rampemisVII": {
   "code": "rampemisVII",
   "base": "rampemis",
   "niv": 6,
   "minerai": 15,
   "prix": 400,
   "structure": 300,
   "pdc": 10,
   "arme": "missVII",
   "nom": "Batterie de missiles de type VII"
  },
  "rampemisVIII": {
   "code": "rampemisVIII",
   "base": "rampemis",
   "niv": 7,
   "minerai": 20,
   "prix": 450,
   "structure": 350,
   "pdc": 10,
   "arme": "missVIII",
   "nom": "Batterie de missiles de type VIII"
  },
  "rampemisIX": {
   "code": "rampemisIX",
   "base": "rampemis",
   "niv": 8,
   "minerai": 25,
   "prix": 500,
   "structure": 400,
   "pdc": 10,
   "arme": "missIX",
   "nom": "Batterie de missiles de type IX"
  },
  "rampemisX": {
   "code": "rampemisX",
   "base": "rampemis",
   "niv": 9,
   "minerai": 30,
   "prix": 550,
   "structure": 500,
   "pdc": 10,
   "arme": "missX",
   "nom": "Batterie de missiles de type X"
  },
  "lancetorI": {
   "code": "lancetorI",
   "base": "lancetor",
   "niv": 0,
   "minerai": 5,
   "prix": 80,
   "structure": 25,
   "pdc": 10,
   "arme": "torpI",
   "nom": "Batterie de lance-torpilles de type I"
  },
  "lancetorII": {
   "code": "lancetorII",
   "base": "lancetor",
   "niv": 1,
   "minerai": 5,
   "prix": 150,
   "structure": 50,
   "pdc": 10,
   "arme": "torpII",
   "nom": "Batterie de lance-torpilles de type II"
  },
  "lancetorIII": {
   "code": "lancetorIII",
   "base": "lancetor",
   "niv": 2,
   "minerai": 5,
   "prix": 200,
   "structure": 100,
   "pdc": 10,
   "arme": "torpIII",
   "nom": "Batterie de lance-torpilles de type III"
  },
  "lancetorIV": {
   "code": "lancetorIV",
   "base": "lancetor",
   "niv": 3,
   "minerai": 10,
   "prix": 250,
   "structure": 150,
   "pdc": 10,
   "arme": "torpIV",
   "nom": "Batterie de lance-torpilles de type IV"
  },
  "lancetorV": {
   "code": "lancetorV",
   "base": "lancetor",
   "niv": 4,
   "minerai": 15,
   "prix": 300,
   "structure": 200,
   "pdc": 10,
   "arme": "torpV",
   "nom": "Batterie de lance-torpilles de type V"
  },
  "lancetorVI": {
   "code": "lancetorVI",
   "base": "lancetor",
   "niv": 5,
   "minerai": 15,
   "prix": 350,
   "structure": 250,
   "pdc": 10,
   "arme": "torpVI",
   "nom": "Batterie de lance-torpilles de type VI"
  },
  "lancetorVII": {
   "code": "lancetorVII",
   "base": "lancetor",
   "niv": 6,
   "minerai": 15,
   "prix": 400,
   "structure": 300,
   "pdc": 10,
   "arme": "torpVII",
   "nom": "Batterie de lance-torpilles de type VII"
  },
  "lancetorVIII": {
   "code": "lancetorVIII",
   "base": "lancetor",
   "niv": 7,
   "minerai": 20,
   "prix": 450,
   "structure": 350,
   "pdc": 10,
   "arme": "torpVIII",
   "nom": "Batterie de lance-torpilles de type VIII"
  },
  "lancetorIX": {
   "code": "lancetorIX",
   "base": "lancetor",
   "niv": 8,
   "minerai": 25,
   "prix": 500,
   "structure": 400,
   "pdc": 10,
   "arme": "torpIX",
   "nom": "Batterie de lance-torpilles de type IX"
  },
  "lancetorX": {
   "code": "lancetorX",
   "base": "lancetor",
   "niv": 9,
   "minerai": 30,
   "prix": 550,
   "structure": 500,
   "pdc": 10,
   "arme": "torpX",
   "nom": "Batterie de lance-torpilles de type X"
  }
 },
 "plans": [
  {
   "nom": "Bombardier standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bombeI",
     "nb": 4
    }
   ]
  },
  {
   "nom": "Grand Bombardier standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bombeI",
     "nb": 7
    }
   ]
  },
  {
   "nom": "Intercepteur standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "laserI",
     "nb": 1
    }
   ]
  },
  {
   "nom": "Chasseur standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "laserI",
     "nb": 4
    }
   ]
  },
  {
   "nom": "Torpilleur standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "torpI",
     "nb": 4
    }
   ]
  },
  {
   "nom": "Fregate standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierI",
     "nb": 5
    },
    {
     "code": "plasmaI",
     "nb": 10
    }
   ]
  },
  {
   "nom": "Destroyer standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierI",
     "nb": 5
    },
    {
     "code": "laserI",
     "nb": 10
    },
    {
     "code": "plasmaI",
     "nb": 10
    }
   ]
  },
  {
   "nom": "Croiseur standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierI",
     "nb": 10
    },
    {
     "code": "plasmaI",
     "nb": 10
    },
    {
     "code": "torpI",
     "nb": 10
    },
    {
     "code": "missI",
     "nb": 10
    }
   ]
  },
  {
   "nom": "Supercroiseur standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierI",
     "nb": 10
    },
    {
     "code": "bombeI",
     "nb": 10
    },
    {
     "code": "laserI",
     "nb": 20
    },
    {
     "code": "plasmaI",
     "nb": 20
    },
    {
     "code": "torpI",
     "nb": 20
    }
   ]
  },
  {
   "nom": "Colonisateur",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "robocoI",
     "nb": 1
    }
   ]
  },
  {
   "nom": "Eclaireur standard",
   "marque": "Corylis",
   "origine": "standard",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "scanI",
     "nb": 1
    }
   ]
  },
  {
   "nom": "Sidjin",
   "marque": "FreeTech",
   "origine": "racial",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "scanIV",
     "nb": 1
    },
    {
     "code": "bscanIV",
     "nb": 1
    }
   ]
  },
  {
   "nom": "Gardien",
   "marque": "Atatech",
   "origine": "racial",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierIII",
     "nb": 1
    },
    {
     "code": "plasmaIV",
     "nb": 12
    }
   ]
  },
  {
   "nom": "Bombardier Zwaia",
   "marque": "Zwatech",
   "origine": "racial",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierIII",
     "nb": 1
    },
    {
     "code": "bombeIV",
     "nb": 12
    }
   ]
  },
  {
   "nom": "Spiteur",
   "marque": "Yoktech",
   "origine": "racial",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierIII",
     "nb": 1
    },
    {
     "code": "missIV",
     "nb": 12
    }
   ]
  },
  {
   "nom": "Feinteur",
   "marque": "Fertech",
   "origine": "racial",
   "composants": [
    {
     "code": "moteurI",
     "nb": 1
    },
    {
     "code": "bouclierIII",
     "nb": 1
    },
    {
     "code": "laserIV",
     "nb": 12
    }
   ]
  }
 ]
};
  if (typeof module !== 'undefined' && module.exports) module.exports = CATALOGUE;
  else racine.CATALOGUE = CATALOGUE;
})(this);
