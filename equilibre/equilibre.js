#!/usr/bin/env node
// Banc d'équilibre du moteur de combat de Sheril (flotte contre flotte).
// Joue des duels de flottes à budget égal, sous une ou plusieurs variantes des règles du moteur,
// et mesure qui garde le plus de valeur. Voir equilibre/README.md.
//
//   node equilibre/equilibre.js [scenario.json] [options]
//   node equilibre/equilibre.js --aide
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const DOSSIER_COMBAT = path.resolve(__dirname, '..');
const C = require(path.join(DOSSIER_COMBAT, 'catalogue.js'));
const M = require(path.join(DOSSIER_COMBAT, 'moteur-combat.js'));
const NOMS_TAILLES = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'];

// Paramètres propres à l'outil (pas au moteur) : ils changent les plans ou leur coût
const PARAMS_OUTIL = {
  vitesseTaille: { defaut: C.constantes.TAILLE_VAISSEAUX.map(t => t[2]), aide: 'bonus de vitesse de la coque, par taille (jeu : 9 à 0)' },
  coutTaille: { defaut: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], aide: 'multiplicateur du coût (ressource égalisée), par taille' },
  collisions: { defaut: true, aide: 'collisions internes de fin de tour de jeu' },
};
const AIDE_REGLES = {
  reciblage: 'tirs multiples : salves supplémentaires sur de nouvelles cibles (boucle désactivée du Java)',
  fiabilite: 'les armes s\'enrayent selon leur fiabilité (simulateur du développeur)',
  defenseurZone: 'positions du défenseur retournées en 30 − y (PR #106)',
  bugMiroir: 'un vaisseau sur deux du défenseur garde la position non retournée (bug du Java)',
  collisionsReelles: 'la réserve des collisions ne baisse que des dégâts réellement subis (PR #106)',
  nbCibles: 'cibles par round selon la taille du tireur (limite des tirs multiples et du débordement)',
  combativiteBase: 'combativité de départ = base + niveau de moral + moral du héros',
  ciblage: '\'proche\' (jeu), \'hasard\', \'moinsVisee\' (la moins visée par sa flotte)',
  debordement: 'cible détruite : le vaisseau continue aussitôt sur une autre dans la même salve',
  tirContinu: 'tir continu de la PR #106 : le vaisseau enchaîne de nouvelles cibles tant qu\'il lui reste des armes',
  ciblesVivantes: 'PR #106 : les épaves ne sont plus choisies comme cibles de secours',
  enrayement: 'PR #106 : si > 0, chaque tir s\'enraye avec (valeur − niveau de l\'arme) % (PR : 20)',
  toucherTaille: 'multiplicateur de la chance de toucher, selon la taille de la cible',
  absorptionTaille: 'absorption de coque ajoutée, selon la taille de la cible',
  resistanceTaille: 'diviseur des dégâts de coque reçus, selon la taille de la cible',
  degatsTaille: 'multiplicateur des dégâts de coque infligés, selon la taille du tireur',
  collisionBase: 'collisions : force = ⌈n / (base + pas × aléa(alea))⌉ − militaire × maîtrise',
  collisionPas: '', collisionAlea: '', collisionMilitaire: '',
  collisionFacteur: 'multiplicateur de la force des collisions',
};

const AIDE = `Banc d'équilibre du moteur de combat (moteur ${M.VERSION})

Usage : node equilibre/equilibre.js [scenario.json] [options]

Flottes et duels (en plus du scénario, ou à sa place) :
  --plan NOM=DEF          plan : "moteurI + 16 plasmaV", "standard:Fregate standard", "auto:T5[:arme[:vitesse]]"
  --duel A/B              duel entre deux flottes (ou plans) ; répétable
  --tournoi T2,T3,T6      tous contre tous entre plans générés par taille (voir --arme, --vitesse)
  --arme plasmaV          arme des plans générés (défaut plasmaV)
  --vitesse 7             vitesse minimale des plans générés (défaut 7)
  --budget 2000,20000     budgets par camp (ressource égalisée), un point par valeur
  --ressource prix        prix (centaures), pdc, minerai ou cases

Règles :
  --set cle=valeur        change une règle pour toutes les variantes (ex. reciblage=true, toucherTaille.T3=0.8)
  --variante "nom:cle=v;cle2=v"   ajoute une variante comparée à « actuel » ; répétable
  --sans-actuel           ne joue pas la variante « actuel » (règles du jeu)
  --regles                liste les règles et leurs valeurs par défaut

Simulation :
  -n 100                  combats par point (moitié A attaquant, moitié B attaquant)
  --tours 1               tours de jeu enchaînés (survivants endommagés + collisions entre chaque)
  --attaquant alterne     alterne, A ou B
  --graine 1000           graine de départ (les mêmes graines sont rejouées pour chaque variante)
  --coeurs N              processus de calcul (défaut : cœurs − 1)

Sorties :
  --json fichier.json     tous les résultats
  --csv fichier.csv       une ligne par point
  --plans                 affiche les plans compilés et s'arrête
  --detail                affiche aussi les pertes au combat et en collisions
`;

// ================================================================ lecture des arguments
function lireArguments(argv) {
  const a = { sets: [], variantes: [], duels: [], plans: [], fichier: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i], suivant = () => { if (i + 1 >= argv.length) throw new Error(x + ' : valeur manquante'); return argv[++i]; };
    switch (x) {
      case '--aide': case '-h': case '--help': a.aide = true; break;
      case '--regles': a.listeRegles = true; break;
      case '--plans': a.voirPlans = true; break;
      case '--detail': a.detail = true; break;
      case '--sans-actuel': a.sansActuel = true; break;
      case '-n': a.n = +suivant(); break;
      case '--tours': a.toursJeu = +suivant(); break;
      case '--attaquant': a.attaquant = suivant(); break;
      case '--graine': a.graine = +suivant(); break;
      case '--coeurs': a.coeurs = +suivant(); break;
      case '--budget': a.budgets = suivant().split(',').map(x => /^x\d+$/i.test(x.trim()) ? x.trim().toLowerCase() : Number(x)); break;
      case '--ressource': a.ressource = suivant(); break;
      case '--set': a.sets.push(suivant()); break;
      case '--variante': a.variantes.push(suivant()); break;
      case '--duel': a.duels.push(suivant()); break;
      case '--plan': a.plans.push(suivant()); break;
      case '--tournoi': a.tournoi = suivant().split(','); break;
      case '--arme': a.arme = suivant(); break;
      case '--vitesse': a.vitesse = +suivant(); break;
      case '--json': a.json = suivant(); break;
      case '--csv': a.csv = suivant(); break;
      default:
        if (x.startsWith('-')) throw new Error('option inconnue : ' + x);
        if (a.fichier) throw new Error('un seul fichier de scénario');
        a.fichier = x;
    }
  }
  return a;
}

function valeur(s) {
  s = s.trim();
  try { return JSON.parse(s); } catch (e) { }
  if (/^[\d.,\s-]+$/.test(s) && s.includes(',')) return s.split(',').map(Number);
  return s;
}
// "cle=valeur" ou "cle.T3=valeur" / "cle.2=valeur" (un élément d'un tableau par taille)
function appliquerReglage(regles, txt) {
  const i = txt.indexOf('=');
  if (i < 0) throw new Error('réglage sans « = » : ' + txt);
  let cle = txt.slice(0, i).trim(), v = valeur(txt.slice(i + 1));
  const m = cle.match(/^(\w+)\.(T?\d+)$/);
  if (m) {
    cle = m[1];
    const idx = m[2][0] === 'T' ? +m[2].slice(1) - 1 : +m[2];
    const base = regles[cle] !== undefined ? regles[cle] : defautRegle(cle);
    if (!Array.isArray(base)) throw new Error(cle + ' n\'est pas un tableau par taille');
    const t = base.slice(); t[idx] = v; v = t;
  }
  defautRegle(cle);   // contrôle du nom
  regles[cle] = v;
}
function defautRegle(cle) {
  if (cle in M.REGLES_DEFAUT) return M.REGLES_DEFAUT[cle];
  if (cle in PARAMS_OUTIL) return PARAMS_OUTIL[cle].defaut;
  throw new Error('règle inconnue : ' + cle + ' (voir --regles)');
}
// sépare les règles du moteur de celles de l'outil
function separerRegles(r) {
  const moteur = {}, outil = {};
  Object.keys(PARAMS_OUTIL).forEach(k => { outil[k] = PARAMS_OUTIL[k].defaut; });
  Object.keys(r || {}).forEach(k => {
    if (k in PARAMS_OUTIL) outil[k] = r[k];
    else { defautRegle(k); moteur[k] = r[k]; }
  });
  M.regles(moteur);   // contrôle
  return { moteur, outil };
}

// ================================================================ plans
// "moteurI + 16 plasmaV", "1 moteurI, 16x plasmaV", "plasmaV:16"
function lirePlanTexte(txt) {
  const composants = [];
  txt.split(/[+,]/).map(s => s.trim()).filter(Boolean).forEach(tok => {
    let m = tok.match(/^(\d+)\s*[x*×]?\s*([A-Za-z]\w*)$/), code, nb;
    if (m) { nb = +m[1]; code = m[2]; }
    else if ((m = tok.match(/^([A-Za-z]\w*)\s*[x*×:]\s*(\d+)$/))) { code = m[1]; nb = +m[2]; }
    else if (/^[A-Za-z]\w*$/.test(tok)) { code = tok; nb = 1; }
    else throw new Error('composant illisible : « ' + tok + ' »');
    if (!C.composants[code]) throw new Error('composant inconnu : ' + code);
    composants.push({ code, nb });
  });
  return composants;
}
// plan généré : coque de taille T au maximum de cases, le réacteur le moins cher qui atteint la vitesse, le reste en armes
function planAuto(taille, arme, vitesseMin) {
  const t = NOMS_TAILLES.indexOf(taille.toUpperCase());
  if (t < 0) throw new Error('taille inconnue : ' + taille);
  arme = arme || 'plasmaV'; vitesseMin = vitesseMin == null ? 7 : vitesseMin;
  if (!C.composants[arme] || C.composants[arme].type !== 'arme') throw new Error('arme inconnue : ' + arme);
  const T = C.constantes.TAILLE_VAISSEAUX[t], cases = Math.min(T[1], 2049), bonus = T[2];
  const moteurs = Object.values(C.composants).filter(c => c.type === 'moteur').sort((x, y) => x.prix - y.prix);
  let mot = moteurs.find(c => c.caracs.propulsion + bonus >= vitesseMin && c.cases < cases);
  if (!mot) mot = moteurs.filter(c => c.cases < cases).pop();
  const nbArmes = Math.floor((cases - mot.cases) / C.composants[arme].cases);
  return [{ code: mot.code, nb: 1 }, { code: arme, nb: nbArmes }];
}
function definirPlan(nom, def, importes) {
  if (def && typeof def === 'object') {
    if (!Array.isArray(def.composants)) throw new Error('plan ' + nom + ' : composants manquants');
    return { nom, composants: def.composants.map(c => ({ code: c.code, nb: +c.nb })) };
  }
  if (typeof def !== 'string') throw new Error('plan ' + nom + ' : définition illisible');
  let m;
  if ((m = def.match(/^standard:(.+)$/))) {
    const p = C.plans.find(x => x.nom === m[1].trim());
    if (!p) throw new Error('plan standard inconnu : ' + m[1]);
    return { nom, composants: p.composants };
  }
  if ((m = def.match(/^import:(.+)$/))) {
    const p = importes[m[1].trim()];
    if (!p) throw new Error('plan importé inconnu : ' + m[1]);
    return { nom, composants: p.composants };
  }
  if ((m = def.match(/^auto:(T\d+)(?::(\w+))?(?::(\d+))?$/i))) return { nom, composants: planAuto(m[1], m[2], m[3] == null ? null : +m[3]) };
  return { nom, composants: lirePlanTexte(def) };
}
function catalogueVariante(outil) {
  const K = Object.assign({}, C.constantes);
  K.TAILLE_VAISSEAUX = C.constantes.TAILLE_VAISSEAUX.map((t, i) => [t[0], t[1], outil.vitesseTaille[i]]);
  return { composants: C.composants, constantes: K };
}
function cout(plan, ressource, outil) {
  const base = ressource === 'cases' ? plan.nbCases : plan[ressource];
  if (base === undefined) throw new Error('ressource inconnue : ' + ressource);
  return base * outil.coutTaille[plan.taille];
}

// ================================================================ scénario
function chargerScenario(a) {
  let s = {};
  if (a.fichier) {
    s = JSON.parse(fs.readFileSync(a.fichier, 'utf8'));
    s._dossier = path.dirname(path.resolve(a.fichier));
  } else s._dossier = process.cwd();
  s.plans = Object.assign({}, s.plans || {});
  s.flottes = Object.assign({}, s.flottes || {});
  s.variantes = Object.assign({}, s.variantes || {});
  s.regles = Object.assign({}, s.regles || {});
  let duels = s.duels || [];
  // plans importés d'un export de la page (plans-perso.json)
  const importes = {};
  [].concat(s.importerPlans || []).forEach(f => {
    const j = JSON.parse(fs.readFileSync(path.resolve(s._dossier, f), 'utf8'));
    const pl = j.plans || {};
    (Array.isArray(pl) ? pl : Object.values(pl)).forEach(p => { importes[p.nom] = p; });
  });
  a.plans.forEach(t => { const i = t.indexOf('='); if (i < 0) throw new Error('--plan NOM=DEF'); s.plans[t.slice(0, i).trim()] = t.slice(i + 1).trim(); });
  if (a.tournoi || s.tournoi) {
    const tr = a.tournoi ? { tailles: a.tournoi, arme: a.arme, vitesse: a.vitesse } : s.tournoi;
    const tailles = tr.tailles.map(x => x.toUpperCase());
    tailles.forEach(t => { if (!s.plans[t]) s.plans[t] = { composants: planAuto(t, tr.arme || a.arme, tr.vitesse != null ? tr.vitesse : a.vitesse) }; });
    for (let i = 0; i < tailles.length; i++) for (let j = i + 1; j < tailles.length; j++) duels.push([tailles[i], tailles[j]]);
    s._tournoi = tailles;
  }
  if (a.duels.length) duels = duels.concat(a.duels.map(d => d.split('/').map(x => x.trim())));
  if (duels === 'tous') { const n = Object.keys(s.flottes); duels = []; for (let i = 0; i < n.length; i++) for (let j = i + 1; j < n.length; j++) duels.push([n[i], n[j]]); }
  duels = duels.map(d => Array.isArray(d) ? d : String(d).split('/').map(x => x.trim()));
  if (!duels.length) throw new Error('aucun duel : donner un scénario, --duel A/B ou --tournoi (voir --aide)');
  // une flotte non déclarée = 100 % du plan du même nom
  duels.forEach(d => d.forEach(nom => {
    if (!s.flottes[nom]) { if (!s.plans[nom]) throw new Error('flotte ou plan inconnu : ' + nom); s.flottes[nom] = { composition: { [nom]: 1 } }; }
  }));
  // plans définis et contrôlés
  const plans = {};
  Object.keys(s.plans).forEach(n => { plans[n] = definirPlan(n, s.plans[n], importes); });
  const flottes = {};
  Object.keys(s.flottes).forEach(n => {
    const f = s.flottes[n];
    let comp = f.composition || f;
    if (!Array.isArray(comp)) comp = Object.keys(comp).map(p => typeof comp[p] === 'object' ? Object.assign({ plan: p }, comp[p]) : { plan: p, part: +comp[p] });
    comp.forEach(l => { if (!plans[l.plan]) throw new Error('flotte ' + n + ' : plan inconnu ' + l.plan); });
    flottes[n] = { nom: n, composition: comp, strategie: f.strategie || {}, heros: f.heros || null, militaire: +f.militaire || 0,
      moral: f.moral != null ? +f.moral : 4500, experience: +f.experience || 0 };
  });
  // règles et variantes
  const base = Object.assign({}, s.regles);
  a.sets.forEach(t => appliquerReglage(base, t));
  const variantes = [];
  if (!a.sansActuel && !s.variantes.actuel) variantes.push({ nom: Object.keys(base).length ? 'base' : 'actuel', regles: Object.assign({}, base) });
  Object.keys(s.variantes).forEach(n => variantes.push({ nom: n, regles: Object.assign({}, base, s.variantes[n]) }));
  a.variantes.forEach(t => {
    const i = t.indexOf(':'), nom = i < 0 ? t : t.slice(0, i), r = Object.assign({}, base);
    if (i >= 0) t.slice(i + 1).split(';').map(x => x.trim()).filter(Boolean).forEach(x => appliquerReglage(r, x));
    variantes.push({ nom, regles: r });
  });
  if (!variantes.length) throw new Error('aucune variante à jouer');
  variantes.forEach(v => { v.separees = separerRegles(v.regles); });
  return {
    plans, flottes, duels, variantes, tournoi: s._tournoi || null,
    ressource: a.ressource || s.ressource || 'prix',
    budgets: a.budgets || s.budgets || [20000],
    n: a.n || s.n || 100, toursJeu: a.toursJeu || s.toursJeu || 1,
    attaquant: a.attaquant || s.attaquant || 'alterne', graine: a.graine != null ? a.graine : (s.graine != null ? s.graine : 1000),
  };
}

// Plans compilés et nombre de vaisseaux d'une flotte pour un budget, sous une variante
function preparerVariante(sc, v) {
  const cat = catalogueVariante(v.separees.outil), plans = {};
  Object.keys(sc.plans).forEach(n => { plans[n] = M.compilerPlan(sc.plans[n], cat); });
  return plans;
}
function lignesFlotte(sc, f, plans, budget, outil, plancher) {
  const parts = f.composition.filter(l => l.nombre == null);
  const totalParts = parts.reduce((s, l) => s + (l.part || 0), 0) || 1;
  return f.composition.map(l => {
    const p = plans[l.plan], c = cout(p, sc.ressource, outil);
    const nombre = l.nombre != null ? +l.nombre : Math.max(1, (plancher ? Math.floor : Math.round)((budget * (l.part || 0) / totalParts) / c + (plancher ? 1e-9 : 0)));
    return { plan: p, nombre, cout: c };
  });
}

// ================================================================ un combat (sur un ou plusieurs tours de jeu)
function jouer(sc, plans, outil, moteur, duel, budget, k) {
  const fA = sc.flottes[duel[0]], fB = sc.flottes[duel[1]];
  // budget « xN » (comme le banc du développeur) : N fois le coût du vaisseau le plus cher des deux flottes ;
  // ce camp aligne N vaisseaux, l'autre autant que le même budget le permet (arrondi vers le bas)
  let plancher = false;
  if (typeof budget === 'string') {
    const cmax = Math.max(...[fA, fB].flatMap(f => f.composition.map(l => cout(plans[l.plan], sc.ressource, outil))));
    budget = +budget.slice(1) * cmax; plancher = true;
  }
  const lA = lignesFlotte(sc, fA, plans, budget, outil, plancher), lB = lignesFlotte(sc, fB, plans, budget, outil, plancher);
  const aAttaque = sc.attaquant === 'A' ? true : sc.attaquant === 'B' ? false : k % 2 === 0;
  const graine = sc.graine + k;
  const coutPlan = {};
  [lA, lB].forEach(l => l.forEach(x => { coutPlan[x.plan.nom] = x.cout; }));
  const depense = [lA, lB].map(l => l.reduce((s, x) => s + x.nombre * x.cout, 0));
  const nbDepart = [lA, lB].map(l => l.reduce((s, x) => s + x.nombre, 0));
  const flottes = [fA, fB];
  // état courant : lignes de camp (au premier tour), puis vaisseaux un par un
  let camps = [lA, lB].map((l, i) => l.map(x => ({ plan: x.plan, nombre: x.nombre, moral: flottes[i].moral, experience: flottes[i].experience })));
  let puissanceDepart = null;
  const r = { victoire: -1, tours: 0, rounds: 0, perdusCombat: [0, 0], perdusCollisions: [0, 0] };
  let restant = nbDepart.slice(), survivants = null;
  for (let t = 0; t < sc.toursJeu; t++) {
    const ordre = aAttaque ? [0, 1] : [1, 0];
    const config = { reglesMoteur: moteur, collisions: false, camps: ordre.map(i => ({ nom: flottes[i].nom, vaisseaux: camps[i], heros: flottes[i].heros, strategie: flottes[i].strategie, militaire: flottes[i].militaire })) };
    const res = M.combattre(config, (graine * 7919 + t * 104729) >>> 0, { etatFinal: true });
    if (puissanceDepart === null) puissanceDepart = ordre.map((_, j) => res.puissanceDepart[ordre.indexOf(j)]);
    r.tours++; r.rounds += res.tours;
    survivants = [res.flottesFin[ordre.indexOf(0)], res.flottesFin[ordre.indexOf(1)]];
    for (let i = 0; i < 2; i++) { r.perdusCombat[i] += restant[i] - survivants[i].length; restant[i] = survivants[i].length; }
    if (outil.collisions) {
      for (let i = 0; i < 2; i++) {
        if (!survivants[i].length) continue;
        M.collisionsInternesFlotte(survivants[i], flottes[i].militaire, res.hasard, moteur.collisionsReelles, M.regles(moteur));
        survivants[i] = survivants[i].filter(v => !v.detruit);
        r.perdusCollisions[i] += restant[i] - survivants[i].length; restant[i] = survivants[i].length;
      }
    }
    if (!survivants[0].length || !survivants[1].length) break;
    camps = survivants.map(f => f.map(v => ({ plan: v.plan, nombre: 1, dommagesComposants: v.dommages, moral: v.moral, experience: v.experience, race: v.race })));
  }
  if (restant[0] > 0 && restant[1] === 0) r.victoire = 0;
  else if (restant[1] > 0 && restant[0] === 0) r.victoire = 1;
  r.valeur = [0, 1].map(i => survivants[i].reduce((s, v) => s + coutPlan[v.plan.nom], 0) / depense[i]);
  r.puissance = [0, 1].map(i => survivants[i].reduce((s, v) => s + M.puissanceVaisseau(v), 0) / (puissanceDepart[i] || 1));
  r.depense = depense; r.nbDepart = nbDepart; r.nbFin = restant;
  return r;
}

// ================================================================ calcul (processus de calcul)
function listeTravaux(sc) {
  const t = [];
  sc.variantes.forEach((v, iv) => sc.duels.forEach((d, id) => sc.budgets.forEach((b, ib) => {
    for (let k = 0; k < sc.n; k++) t.push([iv, id, ib, k]);
  })));
  return t;
}
function calculer(sc, travaux) {
  const prep = sc.variantes.map(v => preparerVariante(sc, v));
  return travaux.map(([iv, id, ib, k]) => {
    const v = sc.variantes[iv];
    const r = jouer(sc, prep[iv], v.separees.outil, v.separees.moteur, sc.duels[id], sc.budgets[ib], k);
    return [iv, id, ib, r];
  });
}
// Cumul par point (variante × duel × budget) au fil des combats : la mémoire ne dépend pas du nombre de combats.
const CUMULS = {
  vA: r => r.victoire === 0 ? 1 : 0, vB: r => r.victoire === 1 ? 1 : 0, nul: r => r.victoire === -1 ? 1 : 0,
  valA: r => r.valeur[0], valB: r => r.valeur[1], puA: r => r.puissance[0], puB: r => r.puissance[1],
  av: r => 100 * (r.valeur[0] - r.valeur[1]), av2: r => (100 * (r.valeur[0] - r.valeur[1])) ** 2,
  combatA: r => r.perdusCombat[0], combatB: r => r.perdusCombat[1], collA: r => r.perdusCollisions[0], collB: r => r.perdusCollisions[1],
  rounds: r => r.rounds, tours: r => r.tours,
};
function cumuler(acc, iv, id, ib, r) {
  const cle = iv + '|' + id + '|' + ib;
  const a = acc[cle] || (acc[cle] = { iv, id, ib, n: 0, nbDepart: r.nbDepart, depense: r.depense, s: {} });
  a.n++;
  for (const k in CUMULS) a.s[k] = (a.s[k] || 0) + CUMULS[k](r);
}
function fusionner(parts) {
  const acc = {};
  parts.forEach(p => Object.keys(p).forEach(cle => {
    const b = p[cle], a = acc[cle];
    if (!a) { acc[cle] = b; return; }
    a.n += b.n;
    for (const k in b.s) a.s[k] += b.s[k];
  }));
  return acc;
}
if (!isMainThread) {
  const { sc, travaux } = workerData;
  const acc = {}, paquet = 20;
  for (let i = 0; i < travaux.length; i += paquet) {
    calculer(sc, travaux.slice(i, i + paquet)).forEach(([iv, id, ib, r]) => cumuler(acc, iv, id, ib, r));
    parentPort.postMessage({ progression: Math.min(paquet, travaux.length - i) });
  }
  parentPort.postMessage({ resultats: acc });
}

function lancer(sc, coeurs) {
  const travaux = listeTravaux(sc);
  const n = Math.max(1, Math.min(coeurs, travaux.length));
  const lots = Array.from({ length: n }, () => []);
  travaux.forEach((t, i) => lots[i % n].push(t));
  let fait = 0, dernier = 0;
  const t0 = Date.now();
  const scPur = JSON.parse(JSON.stringify(sc));
  return Promise.all(lots.map(lot => new Promise((ok, ko) => {
    const w = new Worker(__filename, { workerData: { sc: scPur, travaux: lot } });
    w.on('message', m => {
      if (m.progression) {
        fait += m.progression;
        const now = Date.now();
        if (now - dernier > 1000 && process.stderr.isTTY) {
          dernier = now;
          const reste = (now - t0) / fait * (travaux.length - fait) / 1000;
          process.stderr.write(`\r${fait}/${travaux.length} combats, reste ~${Math.ceil(reste)} s   `);
        }
      } else if (m.resultats) ok(m.resultats);
    });
    w.on('error', ko);
    w.on('exit', c => { if (c !== 0) ko(new Error('processus de calcul arrêté (code ' + c + ')')); });
  }))).then(parts => {
    if (process.stderr.isTTY) process.stderr.write('\r' + ' '.repeat(60) + '\r');
    return { resultats: fusionner(parts), duree: Date.now() - t0, nb: travaux.length };
  });
}

// ================================================================ agrégation et bilan
function moyenne(l) { return l.reduce((s, x) => s + x, 0) / (l.length || 1); }
// acc : cumuls par point (voir cumuler), fusionnés depuis les processus de calcul
function agreger(sc, acc) {
  return Object.values(acc).sort((a, b) => a.iv - b.iv || a.id - b.id || a.ib - b.ib).map(p => {
    const n = p.n, m = k => p.s[k] / n;
    const variance = n > 1 ? Math.max(0, (p.s.av2 - p.s.av * p.s.av / n) / (n - 1)) : 0;
    return {
      variante: sc.variantes[p.iv].nom, A: sc.duels[p.id][0], B: sc.duels[p.id][1], budget: sc.budgets[p.ib], n,
      nbA: p.nbDepart[0], nbB: p.nbDepart[1], depenseA: p.depense[0], depenseB: p.depense[1],
      victoiresA: m('vA'), victoiresB: m('vB'), nuls: m('nul'),
      valeurA: m('valA'), valeurB: m('valB'),
      puissanceA: m('puA'), puissanceB: m('puB'),
      avantageA: m('av'), ic95: 1.96 * Math.sqrt(variance) / Math.sqrt(n),
      // rendement : valeur adverse détruite / valeur propre perdue (> 1 : A échange à son avantage)
      echangeA: ((1 - m('valB')) * p.depense[1]) / Math.max(1e-9, (1 - m('valA')) * p.depense[0]),
      perdusCombatA: m('combatA'), perdusCombatB: m('combatB'),
      perdusCollisionsA: m('collA'), perdusCollisionsB: m('collB'),
      rounds: m('rounds'), toursJeu: m('tours'),
    };
  });
}
// par variante : déséquilibre moyen ; en tournoi, score de chaque taille et avantage moyen du plus petit
function bilan(sc, points, plansParVariante) {
  return sc.variantes.map((v, iv) => {
    const pts = points.filter(p => p.variante === v.nom);
    const b = { variante: v.nom, desequilibre: moyenne(pts.map(p => Math.abs(p.avantageA))), avantageMoyenA: moyenne(pts.map(p => p.avantageA)) };
    const plans = plansParVariante[iv];
    // orientation petit / gros : quand A et B sont faits d'un seul plan de tailles différentes
    const orient = pts.map(p => {
      const ta = tailleFlotte(sc, p.A, plans), tb = tailleFlotte(sc, p.B, plans);
      if (ta == null || tb == null || ta === tb) return null;
      return ta < tb ? p.avantageA : -p.avantageA;
    }).filter(x => x !== null);
    if (orient.length) b.avantagePetits = moyenne(orient);
    if (sc.tournoi) {
      b.scores = {};
      sc.tournoi.forEach(t => {
        const l = [];
        pts.forEach(p => { if (p.A === t) l.push(p.avantageA); else if (p.B === t) l.push(-p.avantageA); });
        b.scores[t] = moyenne(l);
      });
    }
    return b;
  });
}
function tailleFlotte(sc, nom, plans) {
  const tailles = new Set(sc.flottes[nom].composition.map(l => plans[l.plan].taille));
  return tailles.size === 1 ? [...tailles][0] : null;
}

// ================================================================ affichage
const nf = (x, d = 0) => x.toFixed(d).replace('.', ',');
const sg = (x, d = 0) => (x > 0 ? '+' : '') + nf(x, d);
const pc = x => nf(100 * x) + ' %';
function tableau(entetes, lignes) {
  const larg = entetes.map((e, i) => Math.max(e.length, ...lignes.map(l => String(l[i]).length)));
  const fmt = l => l.map((c, i) => i < 2 ? String(c).padEnd(larg[i]) : String(c).padStart(larg[i])).join('  ');
  return [fmt(entetes), larg.map(w => '─'.repeat(w)).join('  '), ...lignes.map(fmt)].join('\n');
}
function afficherPlans(sc) {
  sc.variantes.forEach((v, iv) => {
    const plans = preparerVariante(sc, v);
    console.log(`\nPlans (variante ${v.nom}) :`);
    console.log(tableau(['Plan', 'Composants', 'Taille', 'Cases', 'Vitesse', 'Puissance', 'Prix', 'PdC', 'Minerai', 'Coût'],
      Object.values(plans).map(p => {
        const comp = {};
        p.composants.forEach(c => { comp[c.code] = (comp[c.code] || 0) + 1; });
        return [p.nom, Object.keys(comp).map(k => comp[k] + ' ' + k).join(' + '), NOMS_TAILLES[p.taille], p.nbCases, p.stats.vitesse, p.stats.puissance,
          nf(p.prix), p.pdc, p.minerai, nf(cout(p, sc.ressource, v.separees.outil), 1)];
      })));
  });
}
function regleDiff(v) {
  const r = v.regles, l = [];
  Object.keys(r).forEach(k => {
    const d = defautRegle(k);
    if (JSON.stringify(d) !== JSON.stringify(r[k])) l.push(k + '=' + JSON.stringify(r[k]));
  });
  return l.length ? l.join(', ') : 'règles du jeu';
}
function afficher(sc, points, bilans, a, duree, nb) {
  console.log(`Moteur ${M.VERSION} · ${sc.n} combats par point · ${sc.toursJeu} tour(s) de jeu · budget en ${sc.ressource} · attaquant ${sc.attaquant} · ${nb} combats en ${(duree / 1000).toFixed(1)} s`);
  sc.variantes.forEach(v => {
    console.log(`\n═══ Variante « ${v.nom} » : ${regleDiff(v)}`);
    const pts = points.filter(p => p.variante === v.nom);
    const ent = ['A', 'B', 'Budget', 'Nb A/B', 'Vict. A', 'Vict. B', 'Nuls', 'Reste A', 'Reste B', 'Avantage A', '±IC95', 'Échange', 'Rounds'];
    if (a.detail) ent.push('Perdus combat A/B', 'Collisions A/B');
    console.log(tableau(ent, pts.map(p => {
      const l = [p.A, p.B, (typeof p.budget === "string" ? p.budget : nf(p.budget)), p.nbA + '/' + p.nbB, pc(p.victoiresA), pc(p.victoiresB), pc(p.nuls), pc(p.valeurA), pc(p.valeurB),
        sg(p.avantageA, 1), nf(p.ic95, 1), p.echangeA > 99 ? '>99' : nf(p.echangeA, 2), nf(p.rounds, 1)];
      if (a.detail) l.push(nf(p.perdusCombatA, 1) + '/' + nf(p.perdusCombatB, 1), nf(p.perdusCollisionsA, 1) + '/' + nf(p.perdusCollisionsB, 1));
      return l;
    })));
  });
  console.log('\n═══ Bilan');
  const ent = ['Variante', 'Règles', 'Déséquilibre', 'Avantage A moyen'];
  const avecPetits = bilans.some(b => b.avantagePetits != null);
  if (avecPetits) ent.push('Avantage des petits');
  if (sc.tournoi) sc.tournoi.forEach(t => ent.push('Score ' + t));
  console.log(tableau(ent, bilans.map((b, i) => {
    const l = [b.variante, regleDiff(sc.variantes[i]), nf(b.desequilibre, 1), sg(b.avantageMoyenA, 1)];
    if (avecPetits) l.push(b.avantagePetits != null ? sg(b.avantagePetits, 1) : '');
    if (sc.tournoi) sc.tournoi.forEach(t => l.push(sg(b.scores[t], 1)));
    return l;
  })));
  console.log(`
Lecture : « Reste » = valeur (ressource égalisée) des vaisseaux survivants, en % de la dépense du camp, collisions comprises.
« Avantage A » = reste A − reste B, en points : 0 = équilibre, +100 = A intact et B anéanti. ±IC95 : marge d'erreur statistique.
« Échange » = valeur adverse détruite / valeur propre perdue (> 1 : A y gagne). « Déséquilibre » = moyenne des |avantage| (0 = équilibré).
« Avantage des petits » : avantage moyen du camp aux vaisseaux les plus petits, sur les duels entre plans de tailles différentes.`);
}
function ecrireCsv(fichier, points) {
  const cols = Object.keys(points[0]);
  const l = [cols.join(';')].concat(points.map(p => cols.map(c => typeof p[c] === 'number' ? String(+p[c].toFixed(4)).replace('.', ',') : p[c]).join(';')));
  fs.writeFileSync(fichier, '﻿' + l.join('\n'), 'utf8');
}

// ================================================================ programme principal
if (isMainThread) {
  let a;
  try { a = lireArguments(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exit(2); }
  if (a.aide || process.argv.length <= 2) { console.log(AIDE); process.exit(0); }
  if (a.listeRegles) {
    console.log('Règles du moteur (--set / --variante) :');
    Object.keys(M.REGLES_DEFAUT).forEach(k => console.log(`  ${k.padEnd(18)} ${JSON.stringify(M.REGLES_DEFAUT[k]).padEnd(42)} ${AIDE_REGLES[k] || ''}`));
    console.log('Règles de l\'outil :');
    Object.keys(PARAMS_OUTIL).forEach(k => console.log(`  ${k.padEnd(18)} ${JSON.stringify(PARAMS_OUTIL[k].defaut).padEnd(42)} ${PARAMS_OUTIL[k].aide}`));
    console.log('\nTableaux par taille : 10 valeurs, de T1 à T10 ; un seul élément : cle.T6=valeur.');
    process.exit(0);
  }
  let sc;
  try { sc = chargerScenario(a); } catch (e) { console.error('Erreur : ' + e.message); process.exit(2); }
  if (a.voirPlans) { afficherPlans(sc); process.exit(0); }
  const coeurs = a.coeurs || Math.max(1, os.cpus().length - 1);
  lancer(sc, coeurs).then(({ resultats, duree, nb }) => {
    const points = agreger(sc, resultats);
    const plansV = sc.variantes.map(v => preparerVariante(sc, v));
    const bilans = bilan(sc, points, plansV);
    afficher(sc, points, bilans, a, duree, nb);
    if (a.json) fs.writeFileSync(a.json, JSON.stringify({ moteur: M.VERSION, date: new Date().toISOString(), parametres: { n: sc.n, toursJeu: sc.toursJeu, ressource: sc.ressource, budgets: sc.budgets, attaquant: sc.attaquant, graine: sc.graine },
      plans: sc.plans, flottes: sc.flottes, variantes: sc.variantes.map(v => ({ nom: v.nom, regles: v.regles })), points, bilans }, null, 1));
    if (a.csv) ecrireCsv(a.csv, points);
  }).catch(e => { console.error('Erreur : ' + (e.stack || e.message)); process.exit(1); });
}
