// Moteur de combat flotte contre flotte de Sheril, repris de Combat.combatFlotteFlotte
// (sheril-old-java : Combat.java, Vaisseau.java, PlanDeVaisseau.java, Arme.java, Position3D.java, Leader.java).
// Sans DOM : utilisable dans la page et sous Node (require).
(function (racine) {
  'use strict';
  var VERSION = '1.4';

  // ---------------------------------------------------------------- hasard
  // Générateur à graine (mulberry32). Les tirages suivent l'ordre du Java (Univers.getInt / getInd / getTest).
  function creerHasard(graine) {
    var a = (graine >>> 0) || 1;
    function suivant() {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      getInt: function (n) { return n <= 1 ? (n === 1 ? (suivant(), 0) : 0) : Math.floor(suivant() * n); },
      getInd: function () { return suivant() < 0.5 ? 1 : -1; },
      getTest: function (c) { return Math.floor(suivant() * 100) < c; },
    };
  }

  var trunc = Math.trunc;

  // ---------------------------------------------------------------- plans
  // Compile un plan { nom, composants: [{code, nb}] } avec le catalogue (combat/catalogue.js).
  // Les composants sont dépliés un par unité et triés comme PlanDeVaisseau.classementComposants.
  function compilerPlan(def, catalogue) {
    var C = catalogue.composants, K = catalogue.constantes;
    var liste = [], inconnus = [];
    (def.composants || []).forEach(function (c) {
      var comp = C[c.code];
      if (!comp) { inconnus.push(c.code); return; }
      for (var i = 0; i < (c.nb | 0); i++) liste.push(comp);
    });
    // classementComposants : moteurs, armes par vitesse 10 → 0, boucliers, le reste
    var reste = liste.slice(), tri = [];
    function prendre(pred) {
      for (var i = 0; i < reste.length; i++) if (reste[i] && pred(reste[i])) { tri.push(reste[i]); reste[i] = null; }
    }
    prendre(function (c) { return c.type === 'moteur'; });
    for (var v = 10; v >= 0; v--) prendre(function (c) { return c.type === 'arme' && c.arme.vitesse === v; });
    prendre(function (c) { return c.caracs && c.caracs.bouclier; });
    prendre(function () { return true; });

    var nbCases = 0;
    tri.forEach(function (c) { nbCases += c.cases; });
    var taille = 0;
    for (var t = 0; t < 10; t++)
      if (K.TAILLE_VAISSEAUX[t][0] <= nbCases && K.TAILLE_VAISSEAUX[t][1] >= nbCases) { taille = t; break; }

    var p = {
      nom: def.nom, origine: def.origine, composants: tri, nbCases: nbCases, taille: taille,
      bonusVitesse: K.TAILLE_VAISSEAUX[taille][2], inconnus: inconnus,
    };
    var tous = tri.map(function () { return true; });
    p.stats = statsComposants(p, tous);
    p.prix = 0; p.minerai = 0;
    tri.forEach(function (c) { p.prix += c.prix; p.minerai += c.minerai; });
    p.prix = Math.round(p.prix * 100) / 100;
    p.pdc = Math.max(1, trunc(nbCases / 2));
    var types = {};
    tri.forEach(function (c) { if (c.caracs && c.caracs.bouclier) types[c.code] = 1; });
    p.typesBoucliers = Object.keys(types).length;
    return p;
  }

  // Caractéristiques d'un plan selon les composants encore utilisables (valide[i]).
  function statsComposants(plan, valide) {
    var r = { as: 0, ap: 0, vitesse: 0, propulsion: 0, absorption: 0, boucliers: 0, vitesseArmes: 0,
      bombardier: false, chasseur: false, transporteur: false, armesSpatiales: 0 };
    var cargo = 0;
    plan.composants.forEach(function (c, i) {
      if (!valide[i]) return;
      if (c.type === 'arme') {
        r.as += c.arme.degatCoque + c.arme.degatBouclier;
        r.ap += c.arme.degatSol;
        r.vitesseArmes += c.arme.vitesse;
        if (c.typeArme === 'CP' || c.typeArme === 'M') r.bombardier = true;
        if (c.typeArme === 'CS' || c.typeArme === 'M') { r.chasseur = true; r.armesSpatiales++; }
      }
      if (c.caracs) {
        if (c.caracs.propulsion > r.propulsion) r.propulsion = c.caracs.propulsion;
        if (c.caracs.absorption > r.absorption) r.absorption = c.caracs.absorption;
        if (c.caracs.bouclier) r.boucliers++;
        if (c.caracs.cargo) cargo += c.caracs.cargo;
      }
    });
    r.transporteur = cargo > 0;
    r.vitesse = r.propulsion === 0 ? 0 : r.propulsion + plan.bonusVitesse;   // PlanDeVaisseau.getCapaciteMouvement
    r.puissance = r.as + trunc(r.ap / 2);                                      // PlanDeVaisseau.getPuissance
    return r;
  }

  // ---------------------------------------------------------------- héros
  // Leader.get*Modifie : X + (niveau(maîtrise X) × 50 × X) / 100 ; une compétence possédée vaut au moins 1.
  var COMP = { VITESSE: 0, ATTAQUE: 1, DEFENSE: 2, MORAL: 3, INSPIRATION: 5, SAVOIR: 12 };
  function preparerHeros(h) {
    if (!h) return { present: false, att: 0, def: 0, mor: 0, vit: 0, race: -1, savoir: 0, inspiration: 0 };
    var comp = h.competences || {};
    function niv(c) { var v = comp[c]; if (v === undefined || v === null || v === '') return 0; v = +v; return v === 0 ? 1 : v; }
    function mod(x, c) { x = +x || 0; return x + trunc((niv(c) * 50 * x) / 100); }
    return {
      present: true,
      att: mod(h.att, COMP.ATTAQUE), def: mod(h.def, COMP.DEFENSE),
      mor: mod(h.mor, COMP.MORAL), vit: mod(h.vit, COMP.VITESSE),
      race: (h.race === undefined || h.race === null || h.race === '') ? -1 : +h.race,
      savoir: niv(COMP.SAVOIR), inspiration: niv(COMP.INSPIRATION),
    };
  }

  // ---------------------------------------------------------------- niveaux
  function niveauExperience(e) {
    var B = 2000;
    if (e < B * 2) return 0; if (e < B * 10) return 1; if (e < B * 20) return 2; if (e < B * 50) return 3; return 4;
  }
  function niveauMoral(m) {
    var B = 1000;
    for (var i = 1; i <= 10; i++) if (m < i * B) return i - 1;
    if (m < 15 * B) return 10;
    return 11;
  }
  function niveauPuissance(p) {
    var s = [0, 1, 2, 4, 8, 20, 40, 80, 200, 400, 720];
    for (var i = 0; i < s.length - 1; i++) if (p < s[i + 1] * 25) return i;
    return 10;
  }

  // ---------------------------------------------------------------- vaisseau
  function creerVaisseau(id, camp, plan, opt) {
    var n = plan.composants.length;
    var v = {
      id: id, camp: camp, plan: plan, type: plan.nom,
      experience: opt.experience != null ? +opt.experience : 0,
      moral: opt.moral != null ? +opt.moral : 4500,
      race: opt.race != null && opt.race !== '' ? +opt.race : 0,
      dommages: new Array(n).fill(0),
      valides: [],            // listeComposantsValides (indices, ordre croissant)
      armes: [],              // listeArmesValides
      boucliers: null,        // usure des boucliers (transient, jamais remise à zéro)
      absorbeur: 0, combativite: 0, detruit: false, dommagesEffectues: 0,
    };
    for (var i = 0; i < n; i++) v.valides.push(i);
    // Dégâts de départ éventuels : points répartis sur les composants, dans l'ordre, sans en détruire
    // la totalité (le rapport ne dit pas lesquels). Utilisé seulement si opt.dommages > 0.
    if (opt.dommages > 0) {
      var reste = +opt.dommages;
      for (var k = n - 1; k >= 0 && reste > 0; k--) {
        var c = plan.composants[k];
        var d = Math.min(reste, c.cases);
        v.dommages[k] = d; reste -= d;
        if (d === c.cases) v.valides.splice(v.valides.indexOf(k), 1);
      }
    }
    return v;
  }
  function estValide(v, i) { return v.dommages[i] < v.plan.composants[i].cases; }
  function statsVaisseau(v) {
    var val = v.plan.composants.map(function (c, i) { return estValide(v, i); });
    return statsComposants(v.plan, val);
  }
  function puissanceVaisseau(v) { return statsVaisseau(v).puissance; }
  function pointsDeDommage(v) { var s = 0; for (var i = 0; i < v.dommages.length; i++) s += v.dommages[i]; return s; }

  // Vaisseau.preparerAuCombat(true)
  function preparer(v) {
    v.armes = [];
    for (var i = 0; i < v.plan.composants.length; i++) {
      var c = v.plan.composants[i];
      if (estValide(v, i) && c.type === 'arme' && (c.typeArme === 'CS' || c.typeArme === 'M')) v.armes.push(i);
    }
    v.dommagesEffectues = 0;
    v.detruit = false;
    v.st = statsVaisseau(v);   // composants valides au début du tour : ciblage, fuite, tempo, mouvement
    if (v.boucliers === null) {
      var nb = 0;
      for (var j = 0; j < v.plan.composants.length; j++) {
        var cj = v.plan.composants[j];
        if (estValide(v, j) && cj.caracs && cj.caracs.bouclier) nb++;
      }
      v.boucliers = new Array(nb).fill(0);
    }
  }

  // Vaisseau.getNumeroBouclierValide
  function bouclierValide(v) {
    if (v.boucliers.length === 0) return -1;
    var compteur = 0;
    for (var i = 0; i < v.plan.composants.length; i++) {
      var c = v.plan.composants[i];
      if (c.caracs && c.caracs.bouclier && estValide(v, i)) {
        if (v.boucliers[compteur] < c.caracs.bouclier) return compteur;
        compteur++;
      }
    }
    return -1;
  }

  function augmenterMoral(v, H) { v.moral += H.getInt(10); }
  function diminuerMoral(v, H) { v.moral = Math.max(0, v.moral - H.getInt(10)); }
  function augmenterExperience(v, mod, H) {
    v.experience += mod * trunc(H.getInt(2000) / Math.max(1, v.plan.composants.length));
  }

  // Vaisseau.ajouterDommage / ajouterDommageAuHasard
  function ajouterDommagesAuHasard(v, nb, H) {
    for (var i = 0; i < nb; i++) {
      if (v.valides.length === 0) return false;
      var num = v.valides[H.getInt(v.valides.length)];
      v.dommages[num]++;
      var c = v.plan.composants[num];
      if (v.dommages[num] === c.cases) {
        v.valides.splice(v.valides.indexOf(num), 1);
        var ia = v.armes.indexOf(num);
        if (ia >= 0) v.armes.splice(ia, 1);
        if (c.type === 'moteur' && H.getTest(1)) v.detruit = true;   // CHANCE_EXPLOSION_MOTEUR
      }
      if (v.valides.length === 0) return false;
    }
    return true;
  }

  function chanceDeToucher(arme, tailleCible, distance) {
    var portee = arme.arme.portee;
    if (distance >= portee) return 0;
    return trunc((arme.toucher[tailleCible] * (100 - trunc((90 * distance) / portee))) / 100);
  }

  // Vaisseau.reussiteTir
  function reussiteTir(chance, v, cible, h1, h2, H) {
    var test = chance + niveauExperience(v.experience) + h1.att;
    if (h1.race === v.race) test += 1 + h1.inspiration;
    test -= niveauExperience(cible.experience) + h2.def;
    if (h2.race === cible.race) test -= 1 + h2.inspiration;
    return H.getTest(Math.max(1, test));
  }

  // Vaisseau.tir + effectuerDommages
  function tir(v, cible, distance, h1, h2, H, NB_CIBLES, journal) {
    // initialiserAbsorbeur : meilleure absorption parmi les composants valides de la cible
    var abs = 0;
    for (var k = 0; k < cible.valides.length; k++) {
      var cc = cible.plan.composants[cible.valides[k]];
      if (cc.caracs && cc.caracs.absorption > abs) abs = cc.caracs.absorption;
    }
    cible.absorbeur = abs;
    var compteur = 0;
    while (compteur < v.armes.length && compteur <= NB_CIBLES[v.plan.taille] && !cible.detruit) {
      var a = v.armes[compteur];
      var arme = v.plan.composants[a];
      var chance = chanceDeToucher(arme, cible.plan.taille, distance);
      if (chance === 0) { compteur++; continue; }
      var res = 'rate', degats = 0;
      if (reussiteTir(chance, v, cible, h1, h2, H)) {
        var b = bouclierValide(cible);
        if (b !== -1) {
          cible.boucliers[b] += arme.arme.degatBouclier;
          augmenterMoral(v, H); diminuerMoral(cible, H);
          res = 'bouclier';
        } else {
          var dc = arme.arme.degatCoque;
          if (dc > cible.absorbeur) { degats = dc - cible.absorbeur; cible.absorbeur = 0; }
          else { cible.absorbeur -= dc; degats = 0; }
          if (degats > 0) {
            augmenterMoral(v, H); diminuerMoral(cible, H);
            if (!ajouterDommagesAuHasard(cible, degats, H)) cible.detruit = true;
            v.dommagesEffectues += degats;
            res = 'coque';
          } else { diminuerMoral(v, H); res = 'absorbe'; }
          augmenterExperience(v, 1 + h1.savoir, H);
          augmenterExperience(cible, 1 + h2.savoir, H);
        }
      }
      v.armes.splice(compteur, 1);
      if (journal) journal.push(res, degats);
    }
  }

  // ---------------------------------------------------------------- flottes
  function puissanceFlotte(f) { var s = 0; f.forEach(function (v) { s += puissanceVaisseau(v); }); return s; }
  function puissanceTour(f) { var s = 0; f.forEach(function (v) { s += v.st.puissance; }); return s; }

  function listeDeType(f, type) {
    var r = [];
    f.forEach(function (v) {
      if (v.detruit) return;
      if (type === 0) r.push(v);
      else {
        var s = v.st;
        if ((type === 3 && s.transporteur) || (type === 2 && s.bombardier) || (type === 1 && s.chasseur)) r.push(v);
      }
    });
    return r;
  }

  // Combat.determinationCible (numTir = 0)
  function determinationCible(f1, s1, f2, H) {
    f1.forEach(function (v) {
      var choix1 = listeDeType(f2, s1.typeCible);
      var o = s1.cibles && s1.cibles[v.type];
      var choix2 = null, j;
      function filtre(depart, j) {
        var t = o ? o[j] - 1 : 10 - j - 1;
        return depart.filter(function (c) { return c.plan.taille === t; });
      }
      while (choix2 === null)
        for (j = 0; j < 10; j++) {
          if (H.getTest(50)) choix2 = filtre(choix1, j);
          if (choix2 !== null && choix2.length > 0) break;
        }
      var tours = 0;
      while (choix2.length === 0 && tours < 5) {
        choix1 = f2.slice();
        for (j = 0; j < 10; j++) {
          if (H.getTest(50)) choix2 = filtre(choix1, j);
          if (choix2 !== null && choix2.length > 0) break;
        }
        tours++;
      }
      if (choix2.length === 0) v.cible = null;
      else {
        var min = Infinity, best = null;
        for (var k = 0; k < choix2.length; k++) {
          var d = distance(v.pos, choix2[k].pos);
          if (d < min) { min = d; best = choix2[k]; }
        }
        v.cible = best;
      }
    });
  }

  function distance(a, b) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
  }
  function deplacementLineaire(dep, arr, x) {
    if (dep === arr) return arr;
    var diff = arr - dep;
    var pas = Math.min(Math.max(x, 0), Math.abs(diff));
    return dep + Math.sign(diff) * pas;
  }
  function positionAtteinte(dep, arr, x) {
    if (!arr) return dep;
    return [deplacementLineaire(dep[0], arr[0], x), deplacementLineaire(dep[1], arr[1], x), deplacementLineaire(dep[2], arr[2], x)];
  }
  function auHasard(dep, mod, H) {
    var m = Math.max(1, 6 - mod);
    var x = dep[0] + H.getInd() * H.getInt(m);
    var y = dep[1] + H.getInd() * H.getInt(m);
    var z = (dep[2] || 0) + H.getInd() * H.getInt(10);
    return [x, y, z];
  }

  // Combat.positionnement
  function positionnement(f, s, att, h, H, opts) {
    var miroirs = {};
    f.forEach(function (v) {
      var p = s.positions && s.positions[v.type];
      var inter;
      if (!p) {
        inter = [H.getInt(30), att ? H.getInt(10) : H.getInt(10) + 20, 0];
      } else {
        inter = [+p[0] || 0, +p[1] || 0, 0];
        if (!att) {
          // Le Java modifie le tableau de la stratégie en place : un vaisseau sur deux du même type
          // retrouve la position non retournée (option bugMiroir, active par défaut).
          var retourne = true;
          if (opts.bugMiroir) { miroirs[v.type] = !miroirs[v.type]; retourne = miroirs[v.type]; }
          if (retourne) inter = [30 - inter[0], 20 - inter[1], 0];
        }
      }
      v.pos = auHasard(inter, h.savoir, H);
    });
  }

  // Combat.determinationTempo : tableau trié par tempo croissant
  function determinationTempo(f, h, H) {
    var pris = {}, liste = [];
    f.forEach(function (v) {
      var hm = h.vit * H.getInt(100);
      var s = v.st;
      var tempoV = s.vitesse * 100 + H.getInt(100) * niveauExperience(v.experience) +
        trunc((s.vitesseArmes * 100) / (v.armes.length + 1));
      var t = hm + tempoV + H.getInt(500);
      while (pris[t]) t++;
      pris[t] = 1;
      liste.push({ t: t, v: v });
    });
    liste.sort(function (a, b) { return a.t - b.t; });
    liste.forEach(function (e) { e.v.tempo = e.t; });
    return liste;
  }

  // Combat.fuiteTactique
  function fuiteTactique(f1, f2, s) {
    var a = s.agressivite;
    if (a === 1) return true;
    var p1 = puissanceTour(f1), p2 = puissanceTour(f2);
    if (a === 2 && p1 < trunc(p2 / 2)) return true;
    if (a === 3 && p1 < trunc(p2 / 4)) return true;
    if (a === 4 && p1 < trunc(p2 / 8)) return true;
    if (a === 0) {
      var n = 0;
      if (s.typeCible === 3) { f2.forEach(function (v) { if (v.st.transporteur) n++; }); if (!n) return true; }
      if (s.typeCible === 2) { f2.forEach(function (v) { if (v.st.bombardier) n++; }); if (!n) return true; }
      if (s.typeCible === 1) { f2.forEach(function (v) { if (v.st.chasseur) n++; }); if (!n) return true; }
    }
    return false;
  }

  function mouvementVaisseau(v, fuite, att, H) {
    if (fuite || v.combativite <= 0 || v.armes.length === 0) {
      var pf = [H.getInd() * H.getInt(100), att ? -1000 : 1020, 0];
      pf[2] = H.getInd() * H.getInt(100);
      v.pos = positionAtteinte(v.pos, pf, Math.max(0, v.st.vitesse - 2));
      v.fuit = true;
    } else {
      v.pos = positionAtteinte(v.pos, v.cible ? v.cible.pos : null, v.st.vitesse);
      v.fuit = false;
    }
  }

  // Résumé par type (Flotte.listeVaisseauxParTypePourCombat) : [nombre, points de dommage, dommages infligés]
  function parType(f) {
    var r = {};
    f.forEach(function (v) {
      var e = r[v.type] || (r[v.type] = [0, 0, 0]);
      e[0]++; e[1] += pointsDeDommage(v); e[2] += v.dommagesEffectues;
    });
    return r;
  }

  // ---------------------------------------------------------------- combat
  // config : { camps: [campAttaquant, campDefenseur], options }
  // camp : { nom, vaisseaux: [{ plan (compilé), nombre, experience, moral, race, dommages }], heros, strategie }
  // strategie : { agressivite (0-5, 3 par défaut), typeCible (0-3), cibles: {type: [10 tailles 1-10]}, positions: {type: [x, y]} }
  function combattre(config, graine, options) {
    options = options || {};
    var H = creerHasard(graine == null ? (Math.random() * 4294967296) >>> 0 : graine);
    var NB_CIBLES = [0, 3, 7, 15, 31, 63, 127, 255, 511, 2000];
    var opts = { bugMiroir: config.bugMiroir !== false };
    var trace = options.trace ? { tours: [], positionsInitiales: null } : null;
    var maxTours = options.maxTours || 200;

    var flottes = [], heros = [], strats = [], initial = [];
    config.camps.forEach(function (camp, ic) {
      var f = [], id = 0;
      (camp.vaisseaux || []).forEach(function (l) {
        for (var i = 0; i < (l.nombre | 0); i++) f.push(creerVaisseau(id++, ic, l.plan, l));
      });
      flottes.push(f);
      heros.push(preparerHeros(camp.heros));
      var s = camp.strategie || {};
      strats.push({
        agressivite: s.agressivite == null ? 3 : +s.agressivite,
        typeCible: s.typeCible == null ? 0 : +s.typeCible,
        cibles: s.cibles || null, positions: s.positions || null,
      });
    });
    var f1 = flottes[0], f2 = flottes[1], h1 = heros[0], h2 = heros[1];

    // initialisation
    f1.forEach(function (v) { v.combativite = 5 + niveauMoral(v.moral) + h1.mor; });
    f2.forEach(function (v) { v.combativite = 5 + niveauMoral(v.moral) + h2.mor; });
    var P1 = puissanceFlotte(f1), P2 = puissanceFlotte(f2);
    var garde1 = P1 >= P2 * 5, garde2 = P2 >= P1 * 5;
    var depart = [parType(f1), parType(f2)];
    var nbDepart = [f1.length, f2.length];
    var nbDommages = [0, 0];
    var tables = [];
    positionnement(f1, strats[0], true, h1, H, opts);
    positionnement(f2, strats[1], false, h2, H, opts);
    if (trace) trace.vaisseaux = [f1, f2].map(function (f) {
      return f.map(function (v) { return { id: v.id, type: v.type, taille: v.plan.taille, pos: v.pos.slice() }; });
    });

    var fin = false, numTour = 0, vainqueur = [false, false];
    while (!fin) {
      var mem = [parType(f1), parType(f2)];
      f1.forEach(preparer); f2.forEach(preparer);
      var ht1 = determinationTempo(f1, h1, H), ht2 = determinationTempo(f2, h2, H);
      determinationCible(f1, strats[0], f2, H);
      determinationCible(f2, strats[1], f1, H);
      var tTour = trace ? { avant: [f1, f2].map(function (f) { return f.map(function (v) { return [v.id, v.pos[0], v.pos[1], v.pos[2]]; }); }), tirs: [] } : null;

      // mouvement : tempo croissant, le camp 1 d'abord si sa clé est strictement plus petite
      var fuite1 = fuiteTactique(f1, f2, strats[0]), fuite2 = fuiteTactique(f2, f1, strats[1]);
      var c1 = 0, c2 = 0;
      while (c1 < ht1.length || c2 < ht2.length) {
        var premier = false;
        if (c2 === ht2.length) premier = true;
        else if (c1 !== ht1.length && ht1[c1].t < ht2[c2].t) premier = true;
        if (premier) mouvementVaisseau(ht1[c1++].v, fuite1, true, H);
        else mouvementVaisseau(ht2[c2++].v, fuite2, false, H);
      }
      if (tTour) tTour.apres = [f1, f2].map(function (f) { return f.map(function (v) { return [v.id, v.pos[0], v.pos[1], v.pos[2], v.fuit ? 1 : 0]; }); });

      // tirs : tempo décroissant, le camp 1 d'abord si sa clé est strictement plus grande
      var avant = [dommagesTotaux(f1), dommagesTotaux(f2)];
      c1 = ht1.length - 1; c2 = ht2.length - 1;
      while (c1 > -1 || c2 > -1) {
        var p1 = false;
        if (c2 === -1) p1 = true;
        else if (c1 !== -1 && ht1[c1].t > ht2[c2].t) p1 = true;
        var v, hA, hD;
        if (p1) { v = ht1[c1--].v; hA = h1; hD = h2; } else { v = ht2[c2--].v; hA = h2; hD = h1; }
        if (v.combativite > 0 && !v.detruit && v.cible && !v.cible.detruit) {
          var d = distance(v.pos, v.cible.pos);
          var j = tTour ? [] : null;
          tir(v, v.cible, d, hA, hD, H, NB_CIBLES, j);
          if (tTour && j.length) tTour.tirs.push([v.camp, v.id, v.cible.id, d, j, v.cible.detruit ? 1 : 0]);
        }
      }
      nbDommages[0] += dommagesTotaux(f1) - avant[0];
      nbDommages[1] += dommagesTotaux(f2) - avant[1];
      if (tTour) tTour.detruits = [f1, f2].map(function (f) { return f.filter(function (v) { return v.detruit; }).map(function (v) { return v.id; }); });
      f1 = f1.filter(function (v) { return !v.detruit; });
      f2 = f2.filter(function (v) { return !v.detruit; });
      f1.forEach(function (v) { v.combativite--; });
      f2.forEach(function (v) { v.combativite--; });
      var inter = [parType(f1), parType(f2)];
      tables.push([tableTour(depart[0], mem[0], inter[0], config.camps[0]), tableTour(depart[1], mem[1], inter[1], config.camps[1])]);
      if (tTour) trace.tours.push(tTour);
      if (f1.length === 0) vainqueur[1] = true;
      if (f2.length === 0) vainqueur[0] = true;
      var combatif1 = f1.some(function (v) { return v.combativite > 0; });
      var combatif2 = f2.some(function (v) { return v.combativite > 0; });
      if (!combatif1 && !combatif2) fin = true;
      if (vainqueur[0] || vainqueur[1]) fin = true;
      numTour++;
      if (numTour >= maxTours) fin = true;
    }

    var survivants = [parType(f1), parType(f2)];
    var pertes = [{}, {}];
    [0, 1].forEach(function (c) {
      Object.keys(depart[c]).forEach(function (t) {
        pertes[c][t] = depart[c][t][0] - (survivants[c][t] ? survivants[c][t][0] : 0);
      });
    });
    var res = {
      graine: graine, tours: numTour,
      vainqueur: vainqueur[0] ? 0 : vainqueur[1] ? 1 : -1,
      puissanceDepart: [P1, P2],
      puissanceFin: [puissanceFlotte(f1), puissanceFlotte(f2)],
      gardeDirective: [garde1 && !vainqueur[1], garde2 && !vainqueur[0]],
      nbDepart: nbDepart, nbFin: [f1.length, f2.length],
      depart: depart, survivants: survivants, pertes: pertes,
      dommagesEncaisses: nbDommages,
      debris: nbDommages[0] + nbDommages[1] > 200,
      tables: tables,
    };
    if (trace) res.trace = trace;
    return res;
  }

  function dommagesTotaux(f) { var s = 0; f.forEach(function (v) { s += pointsDeDommage(v); }); return s; }

  // Une ligne par type, comme le rapport du jeu (Combat.ecrireDetailCombatVaisseaux) :
  // nombre, variation, dommages encaissés (destructions comptées au nombre de cases), variation, dommages infligés.
  function tableTour(depart, avant, apres, camp) {
    var cases = {};
    (camp.vaisseaux || []).forEach(function (l) { cases[l.plan.nom] = l.plan.nbCases; });
    return Object.keys(depart).map(function (t) {
      var d = depart[t], m = avant[t] || [0, 0, 0], n = apres[t] || [0, 0, 0];
      var dom = n[1] + (d[0] - n[0]) * cases[t];
      var domA = m[1] + (d[0] - m[0]) * cases[t];
      return { type: t, nombre: n[0], variation: n[0] - m[0], encaisses: dom, variationEncaisses: dom - domA, infliges: n[2] };
    });
  }

  // ---------------------------------------------------------------- statistiques
  function quantile(tri, q) {
    if (!tri.length) return 0;
    var i = (tri.length - 1) * q, b = Math.floor(i), h = Math.ceil(i);
    return tri[b] + (tri[h] - tri[b]) * (i - b);
  }

  // Agrège une liste de résultats de combattre()
  function agreger(resultats) {
    var n = resultats.length;
    var a = { n: n, victoires: [0, 0], nuls: 0, garde: [0, 0], tours: {}, debris: 0, camps: [] };
    [0, 1].forEach(function (c) {
      var types = {};
      resultats.forEach(function (r) {
        Object.keys(r.depart[c]).forEach(function (t) {
          (types[t] = types[t] || { depart: r.depart[c][t][0], pertes: [] }).pertes.push(r.pertes[c][t]);
        });
      });
      var res = { types: {}, encaisses: [], puissanceFin: [], survivants: [] };
      Object.keys(types).forEach(function (t) {
        var l = types[t].pertes.slice().sort(function (x, y) { return x - y; });
        var s = 0; l.forEach(function (x) { s += x; });
        res.types[t] = { depart: types[t].depart, moyenne: s / l.length, q10: quantile(l, 0.1), q50: quantile(l, 0.5), q90: quantile(l, 0.9), toutPerdu: l.filter(function (x) { return x === types[t].depart; }).length / l.length };
      });
      resultats.forEach(function (r) { res.encaisses.push(r.dommagesEncaisses[c]); res.puissanceFin.push(r.puissanceFin[c]); res.survivants.push(r.nbFin[c]); });
      ['encaisses', 'puissanceFin', 'survivants'].forEach(function (k) {
        var l = res[k].slice().sort(function (x, y) { return x - y; }), s = 0;
        l.forEach(function (x) { s += x; });
        res[k] = { moyenne: n ? s / n : 0, q10: quantile(l, 0.1), q50: quantile(l, 0.5), q90: quantile(l, 0.9) };
      });
      a.camps.push(res);
    });
    resultats.forEach(function (r) {
      if (r.vainqueur === -1) a.nuls++; else a.victoires[r.vainqueur]++;
      if (r.gardeDirective[0]) a.garde[0]++;
      if (r.gardeDirective[1]) a.garde[1]++;
      a.tours[r.tours] = (a.tours[r.tours] || 0) + 1;
      if (r.debris) a.debris++;
    });
    return a;
  }

  var API = {
    VERSION: VERSION, creerHasard: creerHasard, compilerPlan: compilerPlan, statsComposants: statsComposants,
    preparerHeros: preparerHeros, niveauExperience: niveauExperience, niveauMoral: niveauMoral,
    niveauPuissance: niveauPuissance, chanceDeToucher: chanceDeToucher, combattre: combattre, agreger: agreger,
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.MoteurCombat = API;
})(this);
