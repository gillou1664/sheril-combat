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
  "TAILLE_MAXIMAL_VAISSEAU": 10
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
