// Interface du simulateur de combats : plans, flottes, combat animé, statistiques.
(function () {
  'use strict';
  var CAT = window.CATALOGUE, M = window.MoteurCombat, D = window.DonneesCombat;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmt(x, d) { return (x == null || isNaN(x)) ? '–' : (+x).toLocaleString('fr-FR', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d == null ? 0 : d }); }
  function pct(x) { return fmt(100 * x, 0) + ' %'; }

  var reg = D.charger();
  var ORIGINES = { standard: 'standard', racial: 'racial', public: 'public', 'privé': 'privé', perso: 'perso', manque: 'à compléter' };
  var AGRESSIVITE = ['Pillage', 'Fuyard', 'Prudent', 'Normal', 'Combatif', 'Rage'];
  var CIBLES = ['Le plus proche', 'Chasseurs', 'Bombardiers', 'Cargos'];
  var COMPETENCES = [[0, 'Maîtrise de la vitesse'], [1, 'Maîtrise de l\'attaque'], [2, 'Maîtrise de la défense'], [3, 'Maîtrise du moral'], [5, 'Inspiration fanatique'], [12, 'Maîtrise du savoir']];
  var ROMAINS = ['', 'I', 'II', 'III', 'IV', 'V'];

  // ------------------------------------------------------------------ plans
  function tousLesPlans() {
    var r = {};
    CAT.plans.forEach(function (p) { r[p.nom] = { nom: p.nom, origine: p.origine, marque: p.marque, composants: p.composants }; });
    Object.keys(reg.plans).forEach(function (k) { r[k] = reg.plans[k]; });
    return r;
  }
  var cachePlans = {};
  function planCompile(nom) {
    var def = tousLesPlans()[nom];
    if (!def || !def.composants || !def.composants.length) return null;
    var cle = nom + '|' + JSON.stringify(def.composants);
    if (!cachePlans[cle]) cachePlans[cle] = M.compilerPlan(def, CAT);
    return cachePlans[cle];
  }
  function nomsPlansTries() {
    var tous = tousLesPlans();
    var ordre = { perso: 0, 'privé': 1, public: 2, standard: 3, racial: 4 };
    return Object.keys(tous).sort(function (a, b) {
      var oa = ordre[tous[a].origine] == null ? 9 : ordre[tous[a].origine], ob = ordre[tous[b].origine] == null ? 9 : ordre[tous[b].origine];
      return oa - ob || a.localeCompare(b, 'fr');
    });
  }

  // ------------------------------------------------------------------ état des flottes
  function campDefaut(nom, plan, nb) {
    return { nom: nom, lignes: [{ plan: plan, nombre: nb, moral: 4500, experience: 0, race: 0 }], heros: null,
      strategie: { agressivite: 3, typeCible: 0, positions: {}, cibles: {} } };
  }
  function etatDefaut() {
    return { camps: [campDefaut('Attaquant', 'Fregate standard', 5), campDefaut('Défenseur', 'Chasseur standard', 12)], n: 1000, graine: '' };
  }
  var etat = reg.brouillon && reg.brouillon.camps ? reg.brouillon : etatDefaut();
  function memoriser() { reg.brouillon = etat; D.sauver(reg); }

  // ------------------------------------------------------------------ messages
  function message(type, html, duree) {
    var d = document.createElement('div');
    d.className = 'msg ' + type; d.innerHTML = html;
    $('#messages').appendChild(d);
    setTimeout(function () { d.remove(); }, duree || 9000);
  }

  // ------------------------------------------------------------------ fichiers
  $('#btnFichiers').addEventListener('click', function () { $('#fichiers').click(); });
  $('#fichiers').addEventListener('change', function (e) {
    var fs = Array.prototype.slice.call(e.target.files);
    var total = { plans: 0, rencontres: 0, flottes: 0 };
    Promise.all(fs.map(function (f) {
      return f.text().then(function (t) {
        try {
          var lu = D.lireFichier(f.name, t);
          var r = D.integrer(reg, lu, f.name);
          total.plans += r.plans; total.rencontres += r.rencontres; total.flottes += r.flottes || 0;
          return f.name + ' : ' + (lu.type === 'rapport' ? 'rapport du tour ' + lu.tour + ', ' + r.flottes + ' flottes, ' : '') +
            r.plans + ' plans' + (r.combats ? ', ' + r.combats + ' combats de flottes' : '') + (r.attaquesPlanetes ? ', ' + r.attaquesPlanetes + ' attaques de planètes' : '') + (r.rencontres ? ', ' + r.rencontres + ' vaisseaux rencontrés à compléter' : '') + (r.scenarios ? ', ' + r.scenarios + ' scénarios' : '');
        } catch (err) { message('err', esc(f.name) + ' : ' + esc(err.message)); return null; }
      });
    })).then(function (lignes) {
      D.sauver(reg); cachePlans = {};
      lignes = lignes.filter(Boolean);
      if (lignes.length) message('ok', lignes.map(esc).join('<br>'));
      e.target.value = '';
      tout();
    });
  });
  $('#btnExporter').addEventListener('click', function () {
    var blob = new Blob([D.exporter(reg, false)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'plans-perso.json';
    document.body.appendChild(a); a.click(); a.remove();
    message('ok', 'Export téléchargé : <b>plans-perso.json</b>. Placez-le dans <code>combat/</code> du dépôt et committez-le pour l\'avoir sur l\'autre ordinateur.');
  });
  $('#btnTheme').addEventListener('click', function () {
    var r = document.documentElement, t = r.getAttribute('data-theme');
    var sombre = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    r.setAttribute('data-theme', sombre ? 'light' : 'dark');
    try { localStorage.setItem('sheril-combat:theme', sombre ? 'light' : 'dark'); } catch (e) { }
    dessiner();
  });
  try { var th = localStorage.getItem('sheril-combat:theme'); if (th) document.documentElement.setAttribute('data-theme', th); } catch (e) { }

  // ------------------------------------------------------------------ onglets
  $('#onglets').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    montrer(b.dataset.vue);
  });
  function montrer(v) {
    $$('#onglets button').forEach(function (x) { x.classList.toggle('actif', x.dataset.vue === v); });
    $$('.vue').forEach(function (x) { x.classList.toggle('active', x.id === 'vue-' + v); });
    try { localStorage.setItem('sheril-combat:onglet', v); } catch (e) { }
    if (v === 'resultats') { rendreReel(); var na = $('#nomA'), nd = $('#nomD'); if (na) { na.textContent = etat.camps[0].nom; nd.textContent = etat.camps[1].nom; } setTimeout(function () { redimensionner(); dessiner(); }, 0); }
  }

  // ------------------------------------------------------------------ vue Flottes
  function optionsPlans(choisi) {
    var tous = tousLesPlans(), groupes = {}, html = '';
    nomsPlansTries().forEach(function (n) { var o = tous[n].origine; (groupes[o] = groupes[o] || []).push(n); });
    Object.keys(groupes).forEach(function (o) {
      html += '<optgroup label="' + esc(ORIGINES[o] || o) + '">' + groupes[o].map(function (n) {
        return '<option' + (n === choisi ? ' selected' : '') + '>' + esc(n) + '</option>';
      }).join('') + '</optgroup>';
    });
    if (choisi && !tous[choisi]) html = '<option selected>' + esc(choisi) + ' (inconnu)</option>' + html;
    return html;
  }

  // Coût unitaire : celui du jeu (rapport.xml / data.xml, royalties comprises) s'il est connu, sinon calculé
  // depuis les composants (somme des prix, somme du minerai, PdC = max(1, cases / 2)).
  function coutPlan(nom) {
    var def = tousLesPlans()[nom], pl = planCompile(nom);
    if (def && def.cout && !isNaN(def.cout.centaures)) return { centaures: def.cout.centaures, minerai: def.cout.minerai, pdc: def.cout.pdc, jeu: true };
    if (!pl) return null;
    return { centaures: pl.prix, minerai: pl.minerai, pdc: pl.pdc, jeu: false };
  }
  function texteCout(c, k) {
    return fmt(c.centaures * k) + ' ¢ · ' + fmt(c.minerai * k) + ' minerai · ' + fmt(c.pdc * k) + ' PdC';
  }
  var cacheCollisions = {};
  function estimationCollisions(camp) {
    var vs = [];
    camp.lignes.forEach(function (l) { var p = planCompile(l.plan); if (p && +l.nombre > 0) vs.push({ plan: p, nombre: +l.nombre, dommages: +l.dommages || 0 }); });
    if (!vs.length) return null;
    var cle = (+camp.militaire || 0) + '|' + vs.map(function (v) { return v.plan.nom + ':' + v.plan.nbCases + ':' + v.nombre + ':' + v.dommages; }).join(',');
    if (!cacheCollisions[cle]) cacheCollisions[cle] = M.estimerCollisions({ vaisseaux: vs }, +camp.militaire || 0, 300, 4242);
    return cacheCollisions[cle];
  }
  function resumeCamp(i) {
    var camp = campPar(i), as = 0, ap = 0, p = 0, n = 0, prix = 0, minerai = 0, pdc = 0, maxCombat = 0, err = [];
    var h = M.preparerHeros(camp.heros);
    camp.lignes.forEach(function (l) {
      var pl = planCompile(l.plan);
      if (!pl) { err.push(l.plan); return; }
      var k = +l.nombre || 0;
      var co = coutPlan(l.plan);
      n += k; as += k * pl.stats.as; ap += k * pl.stats.ap; p += k * pl.stats.puissance;
      prix += k * co.centaures; minerai += k * co.minerai; pdc += k * co.pdc;
      maxCombat = Math.max(maxCombat, 5 + M.niveauMoral(+l.moral || 0) + h.mor);
    });
    return { n: n, as: as, ap: ap, puissance: p, prix: prix, minerai: minerai, pdc: pdc, combativite: maxCombat, erreurs: err, collisions: estimationCollisions(camp) };
  }
  function texteResume(r) {
    return '<span><b>' + fmt(r.n) + '</b> vaisseaux</span><span>puissance <b>' + fmt(r.puissance) + '</b></span><span>AS <b>' + fmt(r.as) + '</b> · AP <b>' + fmt(r.ap) + '</b></span>' +
      '<span>combativité max <b>' + r.combativite + '</b></span>' +
      (r.collisions ? '<span title="Collisions internes de fin de tour (Flotte.gererCollisionVaisseaux), sur la flotte intacte, sans combat. Force = ⌈vaisseaux / (45 à 65)⌉ − 2 × maîtrise militaire ; rien si elle est nulle.' +
        (r.collisions.moyenne ? ' Par type : ' + Object.keys(r.collisions.types).map(function (t) { return t + ' ' + fmt(r.collisions.types[t], 1); }).join(', ') : '') + '">collisions en fin de tour ' +
        (r.collisions.forceMax <= 0 || !r.collisions.dommagesMoyens ? '<b>aucune</b>' : r.collisions.moyenne < 0.05 ? '<b>dégâts sans perte</b> (' + fmt(r.collisions.dommagesMoyens, 1) + ' points en moyenne)' : '<b>' + fmt(r.collisions.moyenne, 1) + '</b> vaisseaux perdus (' + fmt(r.collisions.q10) + ' à ' + fmt(r.collisions.q90) + ')') + '</span>' : '') +
      '<span>coût <b>' + fmt(r.prix) + '</b> ¢ · <b>' + fmt(r.minerai) + '</b> minerai · <b>' + fmt(r.pdc) + '</b> PdC</span>' +
      (r.prix ? '<span title="Puissance (AS + AP/2) obtenue pour 100 centaures">puissance pour 100 ¢ <b>' + fmt(100 * r.puissance / r.prix, 1) + '</b></span>' : '');
  }
  function celluleCout(l) {
    var c = coutPlan(l.plan); if (!c) return '';
    var k = +l.nombre || 0;
    return '<span title="Coût unitaire : ' + texteCout(c, 1) + (c.jeu ? ' (coût du jeu, royalties comprises)' : ' (calculé depuis les composants)') + '">' +
      fmt(c.centaures * k) + ' ¢<br>' + fmt(c.minerai * k) + ' min · ' + fmt(c.pdc * k) + ' PdC</span>';
  }
  // Ajuste les nombres d'un camp pour que son coût (centaures, minerai ou PdC) égale celui de l'autre.
  function egaliser(cible, ressource) {
    var autre = resumeCamp(1 - cible), moi = resumeCamp(cible);
    if (!moi[ressource] || !autre[ressource]) return;
    var f = autre[ressource] / moi[ressource];
    etat.camps[cible].lignes.forEach(function (l) { if (+l.nombre > 0) l.nombre = Math.max(1, Math.round(l.nombre * f)); });
    var apres = resumeCamp(cible);
    var nomR = { prix: 'centaures', minerai: 'minerai', pdc: 'PdC' }[ressource];
    message('ok', esc(etat.camps[cible].nom) + ' ajusté : ' + fmt(apres[ressource]) + ' ' + nomR + ' contre ' + fmt(autre[ressource]) + ' (écart de ' + fmt(100 * (apres[ressource] / autre[ressource] - 1), 1) + ' % dû aux arrondis).', 6000);
  }

  function rendreFlottes() {
    var v = $('#vue-flottes');
    var scen = Object.keys(reg.scenarios).sort();
    var html = '<div class="card"><div class="ligne">' +
      '<b>Scénario</b><input id="scNom" placeholder="nom du scénario" value="' + esc(etat.nomScenario || '') + '">' +
      '<button class="sec" id="scSauver">💾 Enregistrer</button>' +
      '<select id="scListe"><option value="">— scénarios enregistrés (' + scen.length + ') —</option>' + scen.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select>' +
      '<button class="sec" id="scCharger">Charger</button><button class="sec" id="scSuppr">Supprimer</button>' +
      '<span style="flex:1"></span><button class="sec" id="inverser" title="L\'attaquant devient défenseur">⇅ Inverser les camps</button>' +
      '<button class="sec" id="reinit">Réinitialiser</button></div></div>';
    var cbs = listeCombats();
    if (cbs.length || etat.combatReel) {
      html += '<div class="card"><div class="ligne"><b>Combat réel</b>' +
        (cbs.length ? '<select id="cbListe">' + cbs.map(function (cb) { return '<option value="' + esc(cb.cle) + '"' + (etat.combatReel && etat.combatReel.cle === cb.cle ? ' selected' : '') + '>' + esc(titreCombat(cb)) + '</option>'; }).join('') + '</select>' +
          '<button class="sec" id="cbImporter">⤓ Importer ce combat</button>' : '') +
        (etat.combatReel ? '<span class="muted">comparé aux simulations : <b>' + esc(etat.combatReel.titre) + '</b></span><button class="mini" id="cbOublier" title="Ne plus comparer au combat réel">✕</button>' : '') +
        '</div><div class="muted" style="font-size:12px">Les deux flottes sont reprises de l\'état initial du combat. Pour vos flottes : moral, expérience, race et héros du rapport du tour précédent s\'il est chargé (sinon de ce rapport, donc après le combat). Pour l\'adversaire : moral de départ, ajusté sur la durée du combat s\'il a fini sans vainqueur ; ni héros ni stratégie connus. Les « Statistiques » comparent alors le résultat réel aux simulations.</div></div>';
    }
    html += '<div class="card" id="barresCout">' + htmlBarresCout() + '</div>';
    html += '<div class="grid2">' + [0, 1].map(rendreCamp).join('') + '</div>';
    html += '<div class="card" id="duel"></div>';
    v.innerHTML = html;
    rendreDuel();
  }

  // Camp par clé : 0 et 1 pour l'onglet Flottes, 'p' pour la flotte du combat planétaire
  function campPar(k) { return k === 'p' ? etat.planetaire.flotte : k === 'm' ? etat.mines.flotte : etat.camps[+k]; }
  function rendreCamp(i) {
    var c = campPar(i);
    var fl = reg.flottes && reg.flottes.liste ? reg.flottes.liste : [];
    var h = c.heros;
    var s = c.strategie;
    var types = {};
    c.lignes.forEach(function (l) { types[l.plan] = 1; });
    var html = '<div class="card" data-camp="' + i + '">' +
      '<div class="titreCamp"><span class="puce" style="background:var(--camp' + (i === 'p' || i === 'm' ? 0 : i) + ')"></span><h2 style="margin:0">' + (i === 'p' ? 'Flotte attaquante' : i === 'm' ? 'Flotte sur la case' : i === 0 ? 'Attaquant' : 'Défenseur') + '</h2>' +
      '<input data-champ="nom" value="' + esc(c.nom) + '" style="flex:1"></div>';
    if (fl.length) {
      html += '<div class="ligne"><label>Importer une de mes flottes (T' + esc(reg.flottes.tour) + ')</label><select data-action="choixFlotte">' +
        fl.map(function (f, k) { return '<option value="' + k + '">' + esc(f.nom) + ' (n°' + (+f.num + 1) + ', ' + esc(f.pos.replace(/^0_/, '').replace('_', '-')) + ', puissance ' + f.puissance + ')</option>'; }).join('') +
        '</select><button class="sec" data-action="importer">Importer</button></div>';
    }
    html += '<div class="tablewrap"><table><thead><tr><th>Plan</th><th class="n">Nombre</th><th class="n" title="Moral de l\'équipage (4 500 au départ)">Moral</th><th class="n" title="Expérience (niveau 1 à 4 000, 2 à 20 000, 3 à 40 000, 4 à 100 000)">Expérience</th><th class="n" title="Numéro de race de l\'équipage (comparé à celle du héros)">Race</th><th class="n" title="Coût de la ligne (nombre × coût unitaire) : centaures, minerai, PdC. Survolez pour le coût unitaire.">Coût</th><th></th></tr></thead><tbody>' +
      c.lignes.map(function (l, k) {
        var pl = planCompile(l.plan);
        return '<tr data-ligne="' + k + '"><td><select data-champ="plan">' + optionsPlans(l.plan) + '</select>' +
          (pl ? ' <span class="muted" title="taille, vitesse, AS / AP">T' + (pl.taille + 1) + ' · v' + pl.stats.vitesse + ' · ' + pl.stats.as + '/' + pl.stats.ap + '</span>' : ' <span class="pastille manque">sans composition</span>') +
          (+l.dommages > 0 ? ' <span class="pastille manque" title="Points de dégâts déjà encaissés par chaque vaisseau au début du combat (repris du rapport)">dégâts ' + l.dommages + '/vaisseau</span>' : '') + '</td>' +
          '<td class="n"><input type="number" min="0" data-champ="nombre" value="' + esc(l.nombre) + '"></td>' +
          '<td class="n"><input type="number" min="0" step="100" data-champ="moral" value="' + esc(l.moral) + '"></td>' +
          '<td class="n"><input type="number" min="0" step="1000" data-champ="experience" value="' + esc(l.experience) + '"></td>' +
          '<td class="n"><input type="number" min="0" class="court" data-champ="race" value="' + esc(l.race) + '"></td>' +
          '<td class="n cout" style="font-size:12px">' + celluleCout(l) + '</td>' +
          '<td><button class="mini danger" data-action="supprLigne" title="Retirer">✕</button></td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="ligne"><button class="sec" data-action="ajoutLigne">+ Ajouter un type de vaisseau</button>' +
      '<label title="Niveau de maîtrise militaire du commandant : chaque niveau retire 2 à la force des collisions internes de fin de tour">Maîtrise militaire <select data-champ="militaire">' +
      ['—', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'].map(function (r, k) { return '<option value="' + k + '"' + (k === (+c.militaire || 0) ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select></label></div>';
    if (i !== 'm') {
    // héros
    html += '<details' + (h ? ' open' : '') + '><summary>Héros' + (h ? ' : ' + esc(h.nom || 'présent') : ' (aucun)') + '</summary>' +
      '<div class="ligne"><label><input type="checkbox" data-action="heros"' + (h ? ' checked' : '') + '> héros sur la flotte</label>' +
      (h ? ['att', 'def', 'mor', 'vit'].map(function (k) {
        return '<label>' + { att: 'Attaque', def: 'Défense', mor: 'Moral', vit: 'Vitesse' }[k] + ' <input type="number" class="court" min="0" data-heros="' + k + '" value="' + esc(h[k]) + '"></label>';
      }).join('') + '<label>Race <input type="number" class="court" min="0" data-heros="race" value="' + esc(h.race) + '"></label>' : '') + '</div>';
    if (h) {
      html += '<div class="ligne">' + COMPETENCES.map(function (cp) {
        var val = h.competences && h.competences[cp[0]] ? +h.competences[cp[0]] : 0;
        return '<label>' + cp[1] + ' <select data-competence="' + cp[0] + '">' + [0, 1, 2, 3, 4, 5].map(function (nv) {
          return '<option value="' + nv + '"' + (nv === val ? ' selected' : '') + '>' + (nv ? ROMAINS[nv] : '—') + '</option>';
        }).join('') + '</select></label>';
      }).join('') + '</div>';
      var hm = M.preparerHeros(h);
      html += '<div class="muted" style="font-size:12px">Effet : +' + hm.att + ' % pour toucher, −' + hm.def + ' % pour être touché, +' + hm.mor + ' tour(s) de combativité, initiative +0 à ' + (hm.vit * 99) +
        (hm.inspiration ? ', +' + (1 + hm.inspiration) + ' % / −' + (1 + hm.inspiration) + ' % pour un équipage de sa race' : ', +1 % / −1 % pour un équipage de sa race') + '.</div>';
    }
    html += '</details>';
    // stratégie
    if (i === 'p') html += htmlStrategiePlanetaire(s);
    else html += '<details' + (s.agressivite !== 3 || s.typeCible !== 0 || Object.keys(s.positions || {}).length || Object.keys(s.cibles || {}).length ? ' open' : '') + '><summary>Stratégie : ' + AGRESSIVITE[s.agressivite] + ', cible ' + CIBLES[s.typeCible].toLowerCase() + '</summary>' +
      '<div class="ligne"><label>Agressivité <select data-strat="agressivite">' + AGRESSIVITE.map(function (a, k) { return '<option value="' + k + '"' + (k === s.agressivite ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select></label>' +
      '<label>Cible principale <select data-strat="typeCible">' + CIBLES.map(function (a, k) { return '<option value="' + k + '"' + (k === s.typeCible ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="muted" style="font-size:12px">Fuite : Fuyard toujours, Prudent sous la moitié de la puissance adverse, Normal sous le quart, Combatif sous le huitième, Rage jamais, Pillage si l\'adversaire n\'a aucun vaisseau du type visé.</div>' +
      '<table style="margin-top:6px"><thead><tr><th>Type</th><th title="0 à 30 ; vide = au hasard">Position x</th><th title="0 à 10 ; vide = au hasard">Position y</th><th title="Les 10 tailles (1 à 10) dans l\'ordre de préférence ; vide = de la plus grande à la plus petite">Tailles visées, par préférence</th></tr></thead><tbody>' +
      Object.keys(types).map(function (t) {
        var p = (s.positions || {})[t] || ['', ''], ci = (s.cibles || {})[t];
        return '<tr data-type="' + esc(t) + '"><td>' + esc(t) + '</td><td><input type="number" class="court" min="0" max="30" data-pos="0" value="' + esc(p[0]) + '"></td>' +
          '<td><input type="number" class="court" min="0" max="10" data-pos="1" value="' + esc(p[1]) + '"></td>' +
          '<td><input data-cibles placeholder="10 9 8 7 6 5 4 3 2 1" value="' + esc(ci ? ci.join(' ') : '') + '" style="width:190px"></td></tr>';
      }).join('') + '</tbody></table>' +
      (i === 1 ? '<label style="display:block;margin-top:6px"><input type="checkbox" data-action="bugMiroir"' + (etat.bugMiroir === false ? '' : ' checked') + '> Bizarrerie du moteur : un vaisseau défenseur sur deux d\'un même type garde la position non retournée (le Java modifie la stratégie en place)</label>' : '') +
      '</details>';
    }
    var r = resumeCamp(i);
    html += '<div class="resume">' + texteResume(r) + '</div>' +
      (r.erreurs.length ? '<div class="msg warn">Plan sans composition : ' + r.erreurs.map(esc).join(', ') + '. Complétez-le dans l\'onglet Plans.</div>' : '') +
      '</div>';
    return html;
  }

  function rendreDuel() {
    var a = resumeCamp(0), d = resumeCamp(1), el = $('#duel');
    if (!el) return;
    var fuite = function (p1, p2, ag) { return ag === 1 || (ag === 2 && p1 < Math.trunc(p2 / 2)) || (ag === 3 && p1 < Math.trunc(p2 / 4)) || (ag === 4 && p1 < Math.trunc(p2 / 8)); };
    var l = [];
    l.push('Rapport de puissance : <b class="camp0">' + fmt(a.puissance) + '</b> contre <b class="camp1">' + fmt(d.puissance) + '</b>.');
    if (a.puissance >= d.puissance * 5) l.push('L\'attaquant a au moins 5 fois la puissance adverse : il gardera sa directive.');
    else l.push('L\'attaquant n\'a pas 5 fois la puissance adverse : après le combat, il passera en attitude neutre (et ne pourra plus attaquer le système ce tour-ci).');
    if (d.puissance >= a.puissance * 5) l.push('Le défenseur a au moins 5 fois la puissance adverse : il gardera sa directive.');
    if (fuite(a.puissance, d.puissance, etat.camps[0].strategie.agressivite)) l.push('<span class="camp0">L\'attaquant fuit dès le premier tour</span> (il reste dans le combat et tire, mais s\'éloigne).');
    if (fuite(d.puissance, a.puissance, etat.camps[1].strategie.agressivite)) l.push('<span class="camp1">Le défenseur fuit dès le premier tour</span>.');
    if (a.prix && d.prix) {
      var ratio = function (x, y) { return y ? fmt(x / y, 2) : '–'; };
      l.push('Coût : <b class="camp0">' + fmt(a.prix) + ' ¢ · ' + fmt(a.minerai) + ' minerai · ' + fmt(a.pdc) + ' PdC</b> contre <b class="camp1">' + fmt(d.prix) + ' ¢ · ' + fmt(d.minerai) + ' minerai · ' + fmt(d.pdc) + ' PdC</b>' +
        ' (attaquant / défenseur : ' + ratio(a.prix, d.prix) + ' en centaures, ' + ratio(a.minerai, d.minerai) + ' en minerai, ' + ratio(a.pdc, d.pdc) + ' en PdC).');
      l.push('<span class="ligne" style="margin:4px 0">Mettre à coût égal en <select id="egalRessource"><option value="prix">centaures</option><option value="minerai">minerai</option><option value="pdc">PdC</option></select>' +
        '<button class="sec" data-egaliser="1">ajuster le défenseur</button><button class="sec" data-egaliser="0">ajuster l\'attaquant</button>' +
        '<span class="muted" style="font-size:12px">tous les nombres de la flotte ajustée sont multipliés par le même facteur, puis arrondis</span></span>');
    }
    el.innerHTML = '<div class="ligne" style="justify-content:space-between"><div>' + l.join('<br>') + '</div><div><button class="go" id="allerResultats">▶ Simuler</button></div></div>';
  }

  // événements de la vue Flottes
  var vueF = $('#vue-flottes');
  vueF.addEventListener('change', function (e) {
    var r = changementCamp(e);
    if (!r) return;
    memoriser();
    if (r.restructure) rendreFlottes(); else { majResumes(); }
  });
  // Modification d'un champ d'une carte de flotte (onglets Flottes et Combat planétaire) ; null si hors carte
  function changementCamp(e) {
    var t = e.target, carte = t.closest('[data-camp]');
    if (!carte) return null;
    var c = campPar(carte.dataset.camp), tr = t.closest('tr');
    var restructure = false;
    if (t.dataset.champ === 'nom') c.nom = t.value;
    else if (t.dataset.champ === 'militaire') c.militaire = +t.value;
    else if (t.dataset.champ && tr && tr.dataset.ligne != null) {
      var l = c.lignes[+tr.dataset.ligne];
      l[t.dataset.champ] = t.dataset.champ === 'plan' ? t.value : +t.value;
      restructure = t.dataset.champ === 'plan' || t.dataset.champ === 'moral';
    } else if (t.dataset.heros) { c.heros[t.dataset.heros] = +t.value; restructure = true; }
    else if (t.dataset.competence) {
      c.heros.competences = c.heros.competences || {};
      if (+t.value) c.heros.competences[t.dataset.competence] = +t.value; else delete c.heros.competences[t.dataset.competence];
      restructure = true;
    } else if (t.dataset.strat) { c.strategie[t.dataset.strat] = +t.value; restructure = true; }
    else if (t.dataset.pos != null) {
      var type = tr.dataset.type, inputs = $$('input[data-pos]', tr);
      if (inputs[0].value === '' && inputs[1].value === '') delete c.strategie.positions[type];
      else c.strategie.positions[type] = [Math.min(30, Math.max(0, +inputs[0].value || 0)), Math.min(10, Math.max(0, +inputs[1].value || 0))];
    } else if (t.hasAttribute('data-cibles')) {
      var tp = tr.dataset.type, val = t.value.trim();
      if (!val) delete c.strategie.cibles[tp];
      else {
        var arr = val.split(/[\s,;]+/).map(Number);
        var ok = arr.length === 10 && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].every(function (x) { return arr.indexOf(x) >= 0; });
        if (ok) c.strategie.cibles[tp] = arr;
        else { message('warn', 'Tailles visées pour « ' + esc(tp) + ' » : il faut les 10 tailles de 1 à 10, chacune une fois.'); t.value = ''; delete c.strategie.cibles[tp]; }
      }
    } else if (t.dataset.action === 'heros') {
      c.heros = t.checked ? { nom: '', att: 0, def: 0, mor: 0, vit: 0, race: 0, competences: {} } : null; restructure = true;
    } else if (t.dataset.action === 'bugMiroir') etat.bugMiroir = t.checked;
    return { restructure: restructure, cle: carte.dataset.camp };
  }
  function majResumes() {
    // résumé de camp et duel sans tout redessiner
    [0, 1].forEach(function (i) {
      var carte = $('[data-camp="' + i + '"]'); if (!carte) return;
      var r = resumeCamp(i), res = $('.resume', carte);
      if (res) res.innerHTML = texteResume(r);
      $$('tr[data-ligne]', carte).forEach(function (tr) { var l = etat.camps[i].lignes[+tr.dataset.ligne], td = $('.cout', tr); if (l && td) td.innerHTML = celluleCout(l); });
    });
    var bc = $('#barresCout'); if (bc) bc.innerHTML = htmlBarresCout();
    rendreDuel();
  }
  // Une barre par ressource : part de l'attaquant (à gauche) et du défenseur (à droite) dans le coût total.
  // Barre partagée entre l'attaquant (bleu, à gauche) et le défenseur (orange, à droite), au prorata de x et y.
  function barreDuo(libelle, x, y, suffixe, note) {
    var t = x + y, px = t ? 100 * x / t : 50;
    return '<div class="bc-ligne"><span class="bc-res">' + libelle + '</span>' +
      '<span class="bc-val camp0">' + fmt(x) + suffixe + '</span>' +
      '<span class="bc-barre" title="' + esc(libelle) + ' : ' + fmt(x) + suffixe + ' contre ' + fmt(y) + suffixe + '">' +
      (t ? (x ? '<span class="bc-seg" style="width:' + px + '%;background:var(--camp0)"></span>' : '') +
        (y ? '<span class="bc-seg" style="width:' + (100 - px) + '%;background:var(--camp1)"></span>' : '')
        : '<span class="bc-seg" style="width:100%;background:var(--surface-2)"></span>') +
      '</span><span class="bc-val camp1">' + fmt(y) + suffixe + '</span>' +
      '<span class="bc-note muted">' + (t ? fmt(px, 0) + ' % · ' + fmt(100 - px, 0) + ' %' + (note ? ' — ' + note : '') : (note || '—')) + '</span></div>';
  }
  function plusGros(x, y, verbe) {
    if (!(x + y) || Math.abs(x - y) < 1e-9) return 'à égalité';
    if (Math.min(x, y) === 0) return (x > y ? esc(etat.camps[0].nom) : esc(etat.camps[1].nom)) + ' seul';
    return (x > y ? esc(etat.camps[0].nom) : esc(etat.camps[1].nom)) + ' ' + verbe + ' ' + fmt(Math.max(x, y) / Math.min(x, y), 2) + ' fois plus';
  }
  function htmlBarresCout() {
    var a = resumeCamp(0), d = resumeCamp(1);
    return '<div class="barresCout">' + [['prix', 'Centaures', ' ¢'], ['pdc', 'PdC', ''], ['minerai', 'Minerai', '']].map(function (r) {
      return barreDuo(r[1], a[r[0]], d[r[0]], r[2], plusGros(a[r[0]], d[r[0]], 'coûte'));
    }).join('') + '</div>';
  }
  // Puissance au départ et puissance restante (fin du combat, ou moyenne des simulations)
  // libelle : texte de la seconde barre (par défaut « Puissance restante », ou « (moyenne) » pour les statistiques)
  function htmlBarresPuissance(dep, fin, etroit, moyenne, libelle) {
    var garde = [0, 1].map(function (i) { return dep[i] ? fmt(100 * fin[i] / dep[i], 0) + ' %' : '–'; });
    return '<div class="barresCout' + (etroit ? ' etroit' : '') + '">' +
      barreDuo('Puissance au départ', dep[0], dep[1], '', plusGros(dep[0], dep[1], 'a')) +
      barreDuo(libelle || (moyenne ? 'Puissance restante (moyenne)' : 'Puissance restante'), fin[0], fin[1], '',
        'part de sa puissance gardée : <b class="camp0">' + garde[0] + '</b> · <b class="camp1">' + garde[1] + '</b>') + '</div>';
  }
  vueF.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.egaliser != null) { egaliser(+b.dataset.egaliser, $('#egalRessource').value); memoriser(); rendreFlottes(); return; }
    var a = b.dataset.action || b.id;
    if (actionCamp(b)) { /* ligne ajoutée ou retirée, flotte importée */ }
    else if (a === 'scSauver') {
      var nom = $('#scNom').value.trim();
      if (!nom) { message('warn', 'Donnez un nom au scénario.'); return; }
      etat.nomScenario = nom;
      reg.scenarios[nom] = JSON.parse(JSON.stringify({ camps: etat.camps, bugMiroir: etat.bugMiroir }));
      message('ok', 'Scénario « ' + esc(nom) + ' » enregistré.', 4000);
    }
    else if (a === 'scCharger' || a === 'scSuppr') {
      var n2 = $('#scListe').value; if (!n2) return;
      if (a === 'scCharger') { var sc = JSON.parse(JSON.stringify(reg.scenarios[n2])); etat.camps = sc.camps; etat.bugMiroir = sc.bugMiroir; etat.nomScenario = n2; etat.combatReel = null; }
      else if (confirm('Supprimer le scénario « ' + n2 + ' » ?')) delete reg.scenarios[n2];
    }
    else if (a === 'inverser') { etat.camps.reverse(); if (etat.combatReel) etat.combatReel.inverse = !etat.combatReel.inverse; }
    else if (a === 'cbImporter') { var cb = reg.combats[$('#cbListe').value]; if (cb) importerCombat(cb); }
    else if (a === 'cbOublier') { etat.combatReel = null; }
    else if (a === 'reinit') { if (!confirm('Revenir aux flottes d\'exemple ?')) return; var g = etat; etat = etatDefaut(); etat.n = g.n; etat.planetaire = g.planetaire; }
    else if (a === 'allerResultats') { montrer('resultats'); lancerUnique(); return; }
    else return;
    memoriser(); rendreFlottes();
  });


  // Boutons d'une carte de flotte (onglets Flottes et Combat planétaire) ; true si traité
  function actionCamp(b) {
    var carte = b.closest('[data-camp]'), c = carte ? campPar(carte.dataset.camp) : null;
    if (!c) return false;
    var a = b.dataset.action || b.id;
    if (a === 'ajoutLigne') { c.lignes.push({ plan: c.lignes.length ? c.lignes[c.lignes.length - 1].plan : 'Fregate standard', nombre: 1, moral: 4500, experience: 0, race: c.lignes.length ? c.lignes[0].race : 0 }); }
    else if (a === 'supprLigne') { c.lignes.splice(+b.closest('tr').dataset.ligne, 1); }
    else if (a === 'importer') {
      var f = reg.flottes.liste[+$('select[data-action="choixFlotte"]', carte).value];
      c.nom = f.nom;
      c.militaire = reg.flottes.militaire || 0;
      c.lignes = f.lignes.map(function (l) { return { plan: l.plan, nombre: l.nombre, moral: l.moral, experience: l.experience, race: l.race }; });
      if (f.heros) {
        var comp = {};
        Object.keys(f.heros.competences || {}).forEach(function (k) { comp[k] = Math.max(1, +f.heros.competences[k]); });
        c.heros = { nom: f.heros.nom, att: f.heros.att, def: f.heros.def, mor: f.heros.mor, vit: f.heros.vit, race: f.heros.race, competences: comp };
      } else c.heros = null;
      var manquants = c.lignes.filter(function (l) { return !planCompile(l.plan); }).map(function (l) { return l.plan; });
      if (manquants.length) message('warn', 'Plans inconnus : ' + manquants.map(esc).join(', ') + '. Chargez le rapport.xml qui les contient, ou data.xml pour les plans publics.');
      if (f.as || f.ap) {
        var r0 = 0; c.lignes.forEach(function (l) { var p = planCompile(l.plan); if (p) r0 += l.nombre * (p.stats.as + p.stats.ap); });
        if (r0 && r0 > f.as + f.ap) message('warn', 'La flotte « ' + esc(f.nom) + ' » est endommagée (AS + AP ' + (f.as + f.ap) + ' au lieu de ' + r0 + ') : le simulateur la prend intacte.');
      }
    }
    else return false;
    return true;
  }

  // ------------------------------------------------------------------ combats réels (rapport.xml)
  function listeCombats() {
    var l = Object.keys(reg.combats || {}).map(function (k) { return reg.combats[k]; });
    return l.sort(function (a, b) { return b.tour - a.tour || a.position.localeCompare(b.position); });
  }
  function nomFlotteReelle(cb, f) {
    if (f.proprio === cb.moi) {
      var info = flotteConnue(cb, f);
      return (info ? info.nom : 'flotte') + ' (n°' + (+f.numero + 1) + ')';
    }
    return (f.proprio === '0' ? 'neutre' : 'cdt ' + f.proprio) + ' n°' + (+f.numero + 1);
  }
  function titreCombat(cb) {
    var vides = finReelle(cb);
    var issue = vides[0] && !vides[1] ? ' · vainqueur : ' + nomCourt(cb, 1) : vides[1] && !vides[0] ? ' · vainqueur : ' + nomCourt(cb, 0) : ' · sans vainqueur';
    return 'T' + cb.tour + ' · ' + cb.position.replace(/^0_/, '').replace('_', '-') + ' · ' + nomFlotteReelle(cb, cb.initial[0]) + ' contre ' + nomFlotteReelle(cb, cb.initial[1]) + ' · ' + cb.tours.length + ' tours' + issue;
  }
  function nomCourt(cb, i) { return cb.initial[i].proprio === cb.moi ? 'vous' : (cb.initial[i].proprio === '0' ? 'le neutre' : 'cdt ' + cb.initial[i].proprio); }
  // flotte vide à la fin du combat réel, pour chaque flotte de cb.initial
  function finReelle(cb) {
    var fin = cb.tours[cb.tours.length - 1] || [];
    return cb.initial.map(function (f) {
      var y = fin.filter(function (z) { return z.proprio === f.proprio && z.numero === f.numero; })[0];
      return !y || y.vaisseaux.every(function (v) { return !v.nombre; });
    });
  }
  // Notre flotte : rapport du tour précédent (état avant le combat), sinon celui du combat (état après).
  function flotteConnue(cb, f) {
    var pt = reg.flottesParTour || {};
    var cherche = function (liste) { return (liste || []).filter(function (x) { return String(x.num) === String(f.numero); })[0]; };
    var avant = cherche(pt[cb.tour - 1]);
    if (avant) { avant.source = 'T' + (cb.tour - 1); return avant; }
    var apres = cherche(pt[cb.tour]);
    if (apres) { apres.source = 'T' + cb.tour + ' (après le combat)'; return apres; }
    return null;
  }
  function importerCombat(cb) {
    // camp 0 : flotte du commandant noté « attaquant » (le rapport y met le plus petit numéro de commandant)
    var ordre = cb.initial[1].proprio === cb.attaquant && cb.initial[0].proprio !== cb.attaquant ? [1, 0] : [0, 1];
    var sansVainqueur = finReelle(cb).every(function (v) { return !v; });
    var notes = [];
    etat.camps = ordre.map(function (idx) {
      var f = cb.initial[idx], info = f.proprio === cb.moi ? flotteConnue(cb, f) : null;
      var lignes = f.vaisseaux.filter(function (v) { return v.nombre > 0; }).map(function (v) {
        var l = { plan: v.nom, nombre: v.nombre, moral: 4500, experience: 0, race: 0, dommages: Math.floor(v.encaisses / v.nombre) };
        if (info) {
          var ls = info.lignes.filter(function (x) { return x.plan === v.nom; });
          if (ls.length) {
            var n = 0, m = 0, e = 0;
            ls.forEach(function (x) { n += x.nombre; m += x.moral * x.nombre; e += x.experience * x.nombre; });
            l.moral = Math.round(m / n); l.experience = Math.round(e / n); l.race = ls[0].race;
          }
        } else if (sansVainqueur && cb.tours.length !== 9) {
          // combativité réelle = nombre de tours : niveau de moral = tours − 5
          var niv = Math.max(0, Math.min(11, cb.tours.length - 5));
          l.moral = niv <= 9 ? niv * 1000 + 500 : niv === 10 ? 12000 : 15000;
        }
        return l;
      });
      var heros = null;
      if (info && info.heros) {
        var comp = {};
        Object.keys(info.heros.competences || {}).forEach(function (k) { comp[k] = Math.max(1, +info.heros.competences[k]); });
        heros = { nom: info.heros.nom, att: info.heros.att, def: info.heros.def, mor: info.heros.mor, vit: info.heros.vit, race: info.heros.race, competences: comp };
      }
      if (f.proprio === cb.moi) notes.push(info ? 'votre flotte reprise du rapport ' + info.source : 'votre flotte introuvable dans les rapports chargés : moral et expérience par défaut');
      var mt = reg.militaireParTour || {};
      var militaire = f.proprio === cb.moi ? (mt[cb.tour - 1] != null ? mt[cb.tour - 1] : mt[cb.tour] || 0) : 0;
      return { nom: nomFlotteReelle(cb, f), lignes: lignes, heros: heros, militaire: militaire, strategie: { agressivite: 3, typeCible: 0, positions: {}, cibles: {} } };
    });
    etat.combatReel = { cle: cb.cle, titre: titreCombat(cb), ordre: ordre, inverse: false };
    etat.nomScenario = 'Combat T' + cb.tour + ' ' + cb.position.replace(/^0_/, '').replace('_', '-');
    var inconnus = [];
    etat.camps.forEach(function (c) { c.lignes.forEach(function (l) { if (!planCompile(l.plan)) inconnus.push(l.plan); }); });
    message(inconnus.length ? 'warn' : 'ok', 'Combat importé : ' + esc(etat.combatReel.titre) + '.' + (notes.length ? ' ' + notes.map(esc).join(' ; ') + '.' : '') +
      (inconnus.length ? ' Plans sans composition : ' + inconnus.map(esc).join(', ') + ' (à compléter dans l\'onglet Plans).' : ''), 9000);
  }
  // Tableaux réels de chaque tour, dans l'ordre des camps de la page
  function campsReels() {
    var cr = etat.combatReel, cb = cr && reg.combats ? reg.combats[cr.cle] : null;
    if (!cb) return null;
    var ordre = cr.inverse ? [cr.ordre[1], cr.ordre[0]] : cr.ordre;
    return { cb: cb, ordre: ordre, flottes: ordre.map(function (i) { return cb.initial[i]; }) };
  }
  function tablesReelles(cr) {
    return cr.cb.tours.map(function (t) {
      return cr.flottes.map(function (f) {
        var y = t.filter(function (z) { return z.proprio === f.proprio && z.numero === f.numero; })[0] || { vaisseaux: [] };
        return f.vaisseaux.filter(function (v) { return v.nombre > 0; }).map(function (v) {
          var w = y.vaisseaux.filter(function (x) { return x.nom === v.nom; })[0] || { nombre: 0, encaisses: 0, infliges: 0 };
          return { type: v.nom, nombre: w.nombre, encaisses: w.encaisses, infliges: w.infliges };
        });
      });
    }).map(function (tour, k, tous) {
      // variations par rapport au tour précédent (ou à l'état initial)
      return tour.map(function (lignes, c) {
        return lignes.map(function (l, j) {
          var prec = k ? tous[k - 1][c][j] : { nombre: cr.flottes[c].vaisseaux.filter(function (v) { return v.nombre > 0; })[j].nombre, encaisses: cr.flottes[c].vaisseaux.filter(function (v) { return v.nombre > 0; })[j].encaisses };
          return { type: l.type, nombre: l.nombre, variation: l.nombre - prec.nombre, encaisses: l.encaisses, variationEncaisses: l.encaisses - prec.encaisses, infliges: l.infliges };
        });
      });
    });
  }
  function htmlTables(tables, noms) {
    return tables.map(function (t, k) {
      return '<h3>Tour ' + (k + 1) + '</h3><div class="grid2">' + [0, 1].map(function (i) {
        return '<div class="tablewrap"><table><thead><tr><th class="camp' + i + '">' + esc(noms[i]) + '</th><th class="n">Nombre</th><th class="n">Dommages encaissés</th><th class="n">Dommages infligés</th></tr></thead><tbody>' +
          t[i].map(function (l) {
            return '<tr><td>' + esc(l.type) + '</td><td class="n">' + l.nombre + (l.variation ? ' <span style="color:var(--err)">(' + l.variation + ')</span>' : '') + '</td>' +
              '<td class="n">' + l.encaisses + (l.variationEncaisses ? ' <span style="color:var(--warn)">(+' + l.variationEncaisses + ')</span>' : '') + '</td><td class="n">' + l.infliges + '</td></tr>';
          }).join('') + '</tbody></table></div>';
      }).join('') + '</div>';
    }).join('');
  }
  function rendreReel() {
    var el = $('#carteReel'); if (!el) return;
    var cr = campsReels();
    if (!cr) { el.hidden = true; return; }
    el.hidden = false;
    var vides = finReelle(cr.cb), v = cr.ordre.map(function (i) { return vides[i]; });
    var issue = v[1] && !v[0] ? '<b class="camp0">victoire de ' + esc(etat.camps[0].nom) + '</b>' : v[0] && !v[1] ? '<b class="camp1">victoire de ' + esc(etat.camps[1].nom) + '</b>' : '<b>aucun vainqueur</b>';
    el.innerHTML = '<h2>Combat réel</h2><div>' + esc(etat.combatReel.titre) + ' : ' + cr.cb.tours.length + ' tours, ' + issue + '. Lancez les « Statistiques » pour le comparer aux simulations.</div>' +
      '<details style="margin-top:6px"><summary>Tableaux réels de chaque tour (rapport du jeu)</summary>' + htmlTables(tablesReelles(cr), [etat.camps[0].nom, etat.camps[1].nom]) + '</details>';
  }
  // Compare le résultat réel à la distribution simulée
  function comparerAuReel(resultats) {
    var cr = campsReels(); if (!cr || !resultats.length) return;
    var n = resultats.length, fin = cr.cb.tours[cr.cb.tours.length - 1];
    var lignes = [], horsFourchette = 0;
    cr.flottes.forEach(function (f, c) {
      var y = fin.filter(function (z) { return z.proprio === f.proprio && z.numero === f.numero; })[0] || { vaisseaux: [] };
      f.vaisseaux.filter(function (v) { return v.nombre > 0; }).forEach(function (v) {
        var reel = (y.vaisseaux.filter(function (x) { return x.nom === v.nom; })[0] || { nombre: 0 }).nombre;
        var sim = resultats.map(function (r) { return (r.survivants[c][v.nom] || [0])[0]; }).sort(function (a, b) { return a - b; });
        var moy = sim.reduce(function (s, x) { return s + x; }, 0) / n;
        var lo = sim[Math.floor(0.05 * (n - 1))], hi = sim[Math.ceil(0.95 * (n - 1))];
        var pMoins = sim.filter(function (x) { return x < reel; }).length / n, pPlus = sim.filter(function (x) { return x > reel; }).length / n;
        var verdict;
        if (reel < lo) { verdict = '<span style="color:var(--err)">plus de pertes que prévu</span>'; horsFourchette++; }
        else if (reel > hi) { verdict = '<span style="color:var(--ok)">moins de pertes que prévu</span>'; horsFourchette++; }
        else verdict = 'dans la fourchette';
        lignes.push('<tr><td class="camp' + c + '">' + esc(etat.camps[c].nom) + '</td><td>' + esc(v.nom) + '</td><td class="n">' + v.nombre + '</td><td class="n"><b>' + reel + '</b></td><td class="n">' + fmt(moy, 1) + '</td><td class="n">' + lo + ' à ' + hi + '</td>' +
          '<td class="n" title="Part des simulations avec moins (ou plus) de survivants que la réalité">' + pct(pMoins) + ' · ' + pct(pPlus) + '</td><td>' + verdict + '</td></tr>');
      });
    });
    var vides = finReelle(cr.cb), v = cr.ordre.map(function (i) { return vides[i]; });
    var vReel = v[1] && !v[0] ? 0 : v[0] && !v[1] ? 1 : -1;
    var pIssue = resultats.filter(function (r) { return r.vainqueur === vReel; }).length / n;
    var tReel = cr.cb.tours.length, pTours = resultats.filter(function (r) { return r.tours === tReel; }).length / n;
    var toursTri = resultats.map(function (r) { return r.tours; }).sort(function (a, b) { return a - b; });
    var libIssue = vReel === 0 ? 'victoire de ' + etat.camps[0].nom : vReel === 1 ? 'victoire de ' + etat.camps[1].nom : 'aucun vainqueur';
    var html = '<h3>Comparaison avec le combat réel</h3>' +
      '<div class="tuiles"><div class="tuile"><div class="v">' + pct(pIssue) + '</div><div class="l">des simulations donnent l\'issue réelle (' + esc(libIssue) + ')</div></div>' +
      '<div class="tuile"><div class="v">' + tReel + '</div><div class="l">tours réels ; simulés ' + toursTri[Math.floor(0.05 * (n - 1))] + ' à ' + toursTri[Math.ceil(0.95 * (n - 1))] + ' (' + pct(pTours) + ' exactement ' + tReel + ')</div></div>' +
      '<div class="tuile"><div class="v">' + (lignes.length - horsFourchette) + ' / ' + lignes.length + '</div><div class="l">types de vaisseaux dans la fourchette à 90 %</div></div></div>' +
      '<div class="tablewrap"><table><thead><tr><th>Camp</th><th>Type</th><th class="n">Départ</th><th class="n">Restants réels</th><th class="n">Restants simulés (moyenne)</th><th class="n">Fourchette à 90 %</th><th class="n">Simulations avec moins · plus</th><th>Verdict</th></tr></thead><tbody>' +
      lignes.join('') + '</tbody></table></div>' +
      '<div class="muted" style="font-size:12px">« Plus de pertes que prévu » : la réalité est dans les 5 % les plus défavorables des simulations (malchance, ou adversaire mieux équipé que supposé : héros, vétérans, stratégie, plan différent).</div>';
    var d = document.createElement('div'); d.innerHTML = html;
    $('#carteStats').appendChild(d);
  }

  // ------------------------------------------------------------------ configuration du moteur
  function construireConfig(camps, bugMiroir) {
    var erreurs = [];
    var cfg = { bugMiroir: bugMiroir !== false, camps: camps.map(function (c, i) {
      var vs = [];
      c.lignes.forEach(function (l) {
        if (!(+l.nombre > 0)) return;
        var p = planCompile(l.plan);
        if (!p) { erreurs.push(l.plan); return; }
        vs.push({ plan: p, nombre: +l.nombre, moral: +l.moral, experience: +l.experience, race: +l.race, dommages: +l.dommages || 0 });
      });
      if (!vs.length) erreurs.push((i ? 'défenseur' : 'attaquant') + ' sans vaisseau');
      return { nom: c.nom, vaisseaux: vs, heros: c.heros, strategie: c.strategie, militaire: +c.militaire || 0 };
    }) };
    return { cfg: cfg, erreurs: erreurs };
  }

  // ------------------------------------------------------------------ vue Résultats
  function rendreResultats() {
    var scen = Object.keys(reg.scenarios).sort();
    $('#vue-resultats').innerHTML =
      '<div class="card"><div class="ligne">' +
      '<span class="titreCamp"><span class="puce" style="background:var(--camp0)"></span><b id="nomA"></b></span> contre ' +
      '<span class="titreCamp"><span class="puce" style="background:var(--camp1)"></span><b id="nomD"></b></span></div>' +
      '<div class="ligne"><label>Graine <input id="graine" placeholder="au hasard" style="width:110px" value="' + esc(etat.graine || '') + '"></label>' +
      '<button class="go" id="btnUnique">▶ Un combat</button>' +
      '<span style="width:20px"></span><label>Nombre de combats <input type="number" id="nbCombats" min="10" step="100" value="' + esc(etat.n || 1000) + '"></label>' +
      '<button class="go" id="btnStats">📊 Statistiques</button><button class="sec" id="btnStop" disabled>■ Arrêter</button></div>' +
      '<div class="barre" id="barre" hidden><div></div></div><div class="muted" id="progres"></div></div>' +
      '<div class="card" id="carteReel"' + (etat.combatReel ? '' : ' hidden') + '></div>' +
      '<div class="card" id="carteUnique" hidden><h2>Combat unique</h2>' +
      '<div class="cote"><div class="arene-wrap"><canvas id="arene"></canvas></div><div>' +
      '<div class="ligne"><button class="sec" id="aDebut" title="Premier tour">⏮</button><button class="sec" id="aPrec" title="Tour précédent">◀◀</button><button class="go" id="aJouer">▶</button><button class="sec" id="aSuiv" title="Tour suivant">▶▶</button>' +
      '<select id="aTour"></select><select id="aVitesse"><option value="0.5">× 0,5</option><option value="1" selected>× 1</option><option value="2">× 2</option><option value="4">× 4</option></select></div>' +
      '<div class="legende"><span class="pt" style="--c:var(--camp0)">attaquant</span><span class="pt" style="--c:var(--camp1)">défenseur</span><span style="--c:var(--camp0)">tir qui touche la coque</span><span style="--c:var(--bouclier)">tir arrêté par un bouclier</span><span style="--c:var(--rate)">tir raté ou absorbé</span></div>' +
      '<div class="muted" style="font-size:12px">Vue de dessus (x, y) ; la taille du point suit celle du vaisseau. Un vaisseau en fuite sort de l\'arène vers son bord. Survolez un vaisseau pour le détail.</div>' +
      '<div id="aResume" style="margin-top:8px"></div><div class="journal" id="aJournal"></div></div></div>' +
      '<details style="margin-top:10px"><summary>Tableaux de chaque tour (comme le rapport du jeu)</summary><div id="aTables"></div></details></div>' +
      '<div class="card" id="carteStats" hidden></div>' +
      '<div class="card"><h2>Comparer des scénarios</h2>' +
      (scen.length ? '<div class="ligne">' + scen.map(function (s) { return '<label><input type="checkbox" data-comparer="' + esc(s) + '"> ' + esc(s) + '</label>'; }).join('') + '</div>' +
        '<div class="ligne"><label><input type="checkbox" id="compCourant" checked> flottes en cours</label><button class="go" id="btnComparer">Comparer</button></div><div id="comparaison"></div>'
        : '<div class="muted">Enregistrez des scénarios dans l\'onglet Flottes (une composition par scénario), puis comparez-les ici avec le même nombre de combats.</div>') + '</div>';
    $('#nomA').textContent = etat.camps[0].nom; $('#nomD').textContent = etat.camps[1].nom;
    rendreReel();
  }
  var vueR = $('#vue-resultats');
  vueR.addEventListener('change', function (e) {
    if (e.target.id === 'graine') { etat.graine = e.target.value.trim(); memoriser(); }
    if (e.target.id === 'nbCombats') { etat.n = Math.max(1, +e.target.value || 1000); memoriser(); }
    if (e.target.id === 'aTour') { anim.tour = +e.target.value; anim.t = 0; anim.joue = false; majBoutonJouer(); dessiner(); majJournal(); }
    if (e.target.id === 'aVitesse') anim.vitesse = +e.target.value;
  });
  vueR.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.id === 'btnUnique') lancerUnique();
    else if (b.id === 'btnStats') lancerStats();
    else if (b.id === 'btnStop') { if (calcul) calcul.arreter = true; }
    else if (b.id === 'btnComparer') lancerComparaison();
    else if (b.id === 'aJouer') { if (!anim.res) return; if (anim.fini) { anim.tour = -1; anim.t = 0; anim.fini = false; } anim.joue = !anim.joue; majBoutonJouer(); if (anim.joue) boucle(); }
    else if (b.id === 'aDebut') { anim.tour = -1; anim.t = 0; anim.fini = false; dessiner(); majTour(); }
    // ◀◀ et ▶▶ : tour voisin, affiché en entier (mouvements et tirs)
    else if (b.id === 'aPrec') { if (!anim.res) return; anim.joue = false; anim.tour = Math.max(-1, anim.tour - 1); anim.t = 1; anim.fini = false; majBoutonJouer(); dessiner(); majTour(); }
    else if (b.id === 'aSuiv') { if (!anim.res) return; anim.joue = false; anim.tour = Math.min(anim.res.trace.tours.length - 1, anim.tour + 1); anim.t = 1; anim.fini = anim.tour === anim.res.trace.tours.length - 1; majBoutonJouer(); dessiner(); majTour(); }
  });

  // ---------------------------------------------------------------- combat unique
  var anim = { res: null, tour: 0, t: 0, joue: false, vitesse: 1, fini: false };
  function lancerUnique() {
    var c = construireConfig(etat.camps, etat.bugMiroir);
    if (c.erreurs.length) { message('err', 'Impossible de simuler : ' + c.erreurs.map(esc).join(', ') + '.'); return; }
    var g = etat.graine ? (parseInt(etat.graine, 10) >>> 0) : ((Math.random() * 4294967295) >>> 0);
    var res = M.combattre(c.cfg, g, { trace: true });
    res.cfg = c.cfg;
    dernierePuissance = '';
    anim = { res: res, tour: -1, t: 0, joue: true, vitesse: +($('#aVitesse') ? $('#aVitesse').value : 1), fini: false };
    $('#carteUnique').hidden = false; $('#carteStats').hidden = true;   // un combat : la visualisation seule
    $('#aTour').innerHTML = '<option value="-1">Tour 0 (placement)</option>' + res.trace.tours.map(function (x, k) { return '<option value="' + k + '">Tour ' + (k + 1) + '</option>'; }).join('');
    var issue = res.vainqueur === 0 ? '<b class="camp0">victoire de l\'attaquant</b>' : res.vainqueur === 1 ? '<b class="camp1">victoire du défenseur</b>' : '<b>aucun vainqueur</b> (plus aucun vaisseau combatif)';
    $('#aResume').innerHTML = '<div>Graine <b>' + g + '</b> · ' + res.tours + ' tours · ' + issue + '</div>' +
      '<div style="margin:8px 0" id="aPuissance"></div>' +
      [0, 1].map(function (i) {
        var p = res.pertes[i], t = Object.keys(p).filter(function (k) { return p[k]; });
        return '<div class="camp' + i + '">' + esc(etat.camps[i].nom) + ' : ' + res.nbFin[i] + ' / ' + res.nbDepart[i] + ' vaisseaux, puissance ' + res.puissanceFin[i] + ' / ' + res.puissanceDepart[i] +
          (t.length ? ' (pertes : ' + t.map(function (k) { return p[k] + ' ' + esc(k); }).join(', ') + ')' : ' (aucune perte)') +
          (res.gardeDirective[i] ? ', garde sa directive' : ', passe en attitude neutre') +
          (res.collisions && res.collisions[i].dommages > 0 ? '. Collisions de fin de tour : ' + (res.collisions[i].nbDetruits ? '<b>' + res.collisions[i].nbDetruits + ' vaisseau(x) perdu(s)</b> (' + Object.keys(res.collisions[i].detruits).map(function (t) { return res.collisions[i].detruits[t] + ' ' + esc(t); }).join(', ') + '), ' + res.nbApresCollisions[i] + ' restent' : 'aucune perte' + (res.collisions[i].endommages ? ', ' + res.collisions[i].endommages + ' vaisseau(x) endommagé(s)' : '')) : '') + '</div>';
      }).join('') + (res.debris ? '<div class="muted">Plus de 200 points de dégâts : un champ de débris se forme.</div>' : '');
    rendreTables(res);
    redimensionner(); majBoutonJouer(); majTour(); boucle();
    $('#carteUnique').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function rendreTables(res) {
    $('#aTables').innerHTML = htmlTables(res.tables, [etat.camps[0].nom, etat.camps[1].nom]);
  }
  function majBoutonJouer() { var b = $('#aJouer'); if (b) b.textContent = anim.joue ? '⏸' : '▶'; }
  function majTour() { var s = $('#aTour'); if (s) s.value = anim.tour; majJournal(); majPuissance(null); }
  function majJournal() {
    if (!anim.res) return;
    if (anim.tour < 0) {
      $('#aJournal').innerHTML = '<b>Tour 0 : placement initial</b><br>' + [0, 1].map(function (i) {
        return '<span class="camp' + i + '">' + esc(etat.camps[i].nom) + '</span> : ' + anim.res.trace.vaisseaux[i].length + ' vaisseaux dans sa zone de départ (' + (i ? 'à droite, y 20 à 29' : 'à gauche, y 0 à 9') + ', plus un écart aléatoire)';
      }).join('<br>');
      return;
    }
    var tr = anim.res.trace.tours[anim.tour];
    var cnt = [{ tirs: 0, coque: 0, bouclier: 0, rate: 0, degats: 0 }, { tirs: 0, coque: 0, bouclier: 0, rate: 0, degats: 0 }];
    tr.tirs.forEach(function (t) {
      var c = cnt[t[0]], j = t[4];
      for (var k = 0; k < j.length; k += 2) { c.tirs++; if (j[k] === 'coque') { c.coque++; c.degats += j[k + 1]; } else if (j[k] === 'bouclier') c.bouclier++; else c.rate++; }
    });
    var types = [anim.res.trace.vaisseaux[0], anim.res.trace.vaisseaux[1]];
    $('#aJournal').innerHTML = '<b>Tour ' + (anim.tour + 1) + '</b><br>' + [0, 1].map(function (i) {
      var c = cnt[i], det = tr.detruits[1 - i].map(function (id) { return types[1 - i][id].type; });
      var parType = {}; det.forEach(function (t) { parType[t] = (parType[t] || 0) + 1; });
      var fuit = tr.apres[i].filter(function (p) { return p[4]; }).length;
      return '<span class="camp' + i + '">' + esc(etat.camps[i].nom) + '</span> : ' + c.tirs + ' tirs, ' + c.coque + ' à la coque (' + c.degats + ' dégâts), ' + c.bouclier + ' sur bouclier, ' + c.rate + ' ratés' +
        (det.length ? ' ; détruit ' + Object.keys(parType).map(function (t) { return parType[t] + ' ' + esc(t); }).join(', ') : '') + (fuit ? ' ; ' + fuit + ' vaisseau(x) s\'éloigne(nt)' : '');
    }).join('<br>');
  }

  // ---------------------------------------------------------------- arène (canvas)
  var X0 = -6, X1 = 36, Y0 = -6, Y1 = 36;
  function redimensionner() {
    var cv = $('#arene'); if (!cv) return;
    var r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    if (!r.width) return;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.width * dpr);
  }
  window.addEventListener('resize', function () { redimensionner(); dessiner(); });
  function couleur(nom) { return getComputedStyle(document.documentElement).getPropertyValue(nom).trim(); }
  function ecran(cv, x, y) {
    var w = cv.width, h = cv.height;
    var cx = Math.max(X0 + 0.5, Math.min(X1 - 0.5, x)), cy = Math.max(Y0 + 0.5, Math.min(Y1 - 0.5, y));
    // vue de gauche à droite : l'axe y du jeu (attaquant en 0-9, défenseur en 20-29) devient l'horizontale
    return [(cy - Y0) / (Y1 - Y0) * w, (cx - X0) / (X1 - X0) * h, cx !== x || cy !== y];
  }
  var DUREE = { placement: 900, mouvement: 700, tirs: 1100, pause: 250 };
  function boucle() {
    if (!anim.joue || !anim.res) return;
    var dernier = performance.now();
    function f(now) {
      if (!anim.joue) return;
      var dt = (now - dernier) * anim.vitesse; dernier = now;
      anim.t += dt / (anim.tour < 0 ? DUREE.placement : DUREE.mouvement + DUREE.tirs + DUREE.pause);
      if (anim.t >= 1) {
        if (anim.tour < anim.res.trace.tours.length - 1) { anim.tour++; anim.t = 0; majTour(); }
        else { anim.t = 1; anim.joue = false; anim.fini = true; majBoutonJouer(); }
      }
      dessiner();
      if (anim.joue) requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  var survol = null;
  function positionsCourantes() {
    if (anim.tour < 0) {
      var p0 = [{}, {}];
      [0, 1].forEach(function (c) { anim.res.trace.vaisseaux[c].forEach(function (v) { p0[c][v.id] = [v.pos[0], v.pos[1], v.pos[2], 0]; }); });
      return { pos: p0, ptirs: 0, fin: false };
    }
    var tr = anim.res.trace.tours[anim.tour];
    var T = DUREE.mouvement + DUREE.tirs + DUREE.pause;
    var pm = Math.min(1, anim.t * T / DUREE.mouvement);
    var ease = pm < 0.5 ? 2 * pm * pm : 1 - Math.pow(-2 * pm + 2, 2) / 2;
    var pos = [{}, {}];
    [0, 1].forEach(function (c) {
      var av = {}; tr.avant[c].forEach(function (p) { av[p[0]] = p; });
      tr.apres[c].forEach(function (p) {
        var a = av[p[0]] || p;
        pos[c][p[0]] = [a[1] + (p[1] - a[1]) * ease, a[2] + (p[2] - a[2]) * ease, p[3], p[4]];
      });
    });
    return { pos: pos, ptirs: Math.max(0, Math.min(1, (anim.t * T - DUREE.mouvement) / DUREE.tirs)), fin: anim.t * T >= DUREE.mouvement + DUREE.tirs };
  }
  // Barre « puissance restante » du tour affiché : avant la fin des tirs du tour, celle du tour précédent
  // (ou de départ) ; une fois les tirs joués, celle de la fin du tour.
  var dernierePuissance = '';
  function majPuissance(st) {
    var el = $('#aPuissance'); if (!el || !anim.res) return;
    var tours = anim.res.trace.tours, k = anim.tour, val, nb, quand;
    var fini = k >= 0 && (anim.t >= 1 || (st && st.fin));
    if (k < 0 || (k === 0 && !fini)) { val = anim.res.puissanceDepart; nb = anim.res.nbDepart; quand = 'avant le combat'; }
    else if (fini) { val = tours[k].puissance; nb = tours[k].nombre; quand = 'fin du tour ' + (k + 1); }
    else { val = tours[k - 1].puissance; nb = tours[k - 1].nombre; quand = 'fin du tour ' + k; }
    var cle = quand + val.join('/') + nb.join('/');
    if (cle === dernierePuissance) return;
    dernierePuissance = cle;
    var dep = anim.res.nbDepart;
    var perdus = [0, 1].map(function (i) { return dep[i] - nb[i]; });
    el.innerHTML = htmlBarresPuissance(anim.res.puissanceDepart, val, true, false, 'Puissance restante (' + quand + ')') +
      '<div class="vaisseauxRestants"><div class="muted" style="font-size:12px;margin:6px 0 2px">Vaisseaux restants (' + quand + ')</div>' +
      [0, 1].map(function (i) {
        var pv = dep[i] ? 100 * nb[i] / dep[i] : 0;
        return '<div class="vr-ligne" title="' + esc(etat.camps[i].nom) + ' : ' + fmt(nb[i]) + ' vaisseaux sur ' + fmt(dep[i]) + ', ' + fmt(perdus[i]) + ' perdus">' +
          '<span class="vr-nom camp' + i + '">' + esc(etat.camps[i].nom) + '</span>' +
          '<span class="vr-barre">' + (nb[i] ? '<span class="vr-vivant" style="width:' + pv + '%;background:var(--camp' + i + ')"></span>' : '') +
          (perdus[i] ? '<span class="vr-perdu" style="width:' + (100 - pv) + '%"></span>' : '') + '</span>' +
          '<span class="vr-val"><b class="camp' + i + '">' + fmt(nb[i]) + '</b> / ' + fmt(dep[i]) + (perdus[i] ? ' <span class="muted">(−' + fmt(perdus[i]) + ')</span>' : '') + '</span></div>';
      }).join('') + '</div>';
  }
  function dessiner() {
    var cv = $('#arene'); if (!cv || !anim.res || !cv.width) return;
    var g = cv.getContext('2d'); if (!g) return;
    var w = cv.width, h = cv.height, dpr = window.devicePixelRatio || 1;
    var col = { c0: couleur('--camp0'), c1: couleur('--camp1'), b: couleur('--bouclier'), r: couleur('--rate'), grille: couleur('--grille'), fond: couleur('--arene'), txt: couleur('--muted'), err: couleur('--err') };
    g.fillStyle = col.fond; g.fillRect(0, 0, w, h);
    // grille : zones de départ et repères tous les 5
    g.strokeStyle = col.grille; g.lineWidth = 1 * dpr;
    for (var k = 0; k <= 30; k += 5) {
      var a = ecran(cv, k, Y0), b = ecran(cv, k, Y1); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
      a = ecran(cv, X0, k); b = ecran(cv, X1, k); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
    }
    g.globalAlpha = 0.07;
    [[0, 0, col.c0], [20, 1, col.c1]].forEach(function (z) {
      var p0 = ecran(cv, 0, z[0] + 9), p1 = ecran(cv, 29, z[0]); g.fillStyle = z[2]; g.fillRect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1]);
    });
    g.globalAlpha = 1;
    g.fillStyle = col.txt; g.font = (11 * dpr) + 'px system-ui, sans-serif';
    g.fillText(anim.tour < 0 ? 'Tour 0 (placement) / ' + anim.res.trace.tours.length : 'Tour ' + (anim.tour + 1) + ' / ' + anim.res.trace.tours.length, 8 * dpr, 16 * dpr);
    var st = positionsCourantes(), tr = anim.tour < 0 ? { tirs: [] } : anim.res.trace.tours[anim.tour];
    majPuissance(st);
    var infos = anim.res.trace.vaisseaux;
    // tirs
    var n = tr.tirs.length, visibles = Math.floor(st.ptirs * n + (st.ptirs > 0 ? 1 : 0));
    for (var i = 0; i < Math.min(n, visibles); i++) {
      var t = tr.tirs[i], j = t[4], res = 'rate';
      for (var q = 0; q < j.length; q += 2) { if (j[q] === 'coque') { res = 'coque'; break; } if (j[q] === 'bouclier') res = 'bouclier'; }
      var ps = st.pos[t[0]][t[1]], pc = st.pos[1 - t[0]][t[2]];
      if (!ps || !pc) continue;
      var s1 = ecran(cv, ps[0], ps[1]), s2 = ecran(cv, pc[0], pc[1]);
      var recent = visibles - i <= Math.max(3, n / 8);
      g.globalAlpha = st.fin ? 0.25 : (recent ? 0.95 : 0.3);
      g.strokeStyle = res === 'coque' ? (t[0] ? col.c1 : col.c0) : res === 'bouclier' ? col.b : col.r;
      g.lineWidth = (res === 'coque' ? 2 : 1.2) * dpr;
      g.setLineDash(res === 'rate' ? [3 * dpr, 3 * dpr] : []);
      g.beginPath(); g.moveTo(s1[0], s1[1]); g.lineTo(s2[0], s2[1]); g.stroke();
    }
    g.setLineDash([]); g.globalAlpha = 1;
    // vaisseaux détruits pendant les tirs visibles
    var detruits = [{}, {}];
    for (var i2 = 0; i2 < Math.min(n, visibles); i2++) if (tr.tirs[i2][5]) detruits[1 - tr.tirs[i2][0]][tr.tirs[i2][2]] = 1;
    [0, 1].forEach(function (c) {
      Object.keys(st.pos[c]).forEach(function (id) {
        var p = st.pos[c][id], s = ecran(cv, p[0], p[1]), info = infos[c][id];
        var rayon = (3.5 + info.taille * 1.2) * dpr;
        g.globalAlpha = s[2] ? 0.45 : 1;
        g.fillStyle = c ? col.c1 : col.c0;
        g.beginPath(); g.arc(s[0], s[1], rayon, 0, 2 * Math.PI); g.fill();
        g.lineWidth = 1.5 * dpr; g.strokeStyle = col.fond; g.stroke();
        if (detruits[c][id]) {
          g.globalAlpha = 1; g.strokeStyle = col.err; g.lineWidth = 2 * dpr;
          var r2 = rayon + 3 * dpr;
          g.beginPath(); g.moveTo(s[0] - r2, s[1] - r2); g.lineTo(s[0] + r2, s[1] + r2); g.moveTo(s[0] + r2, s[1] - r2); g.lineTo(s[0] - r2, s[1] + r2); g.stroke();
        }
        if (survol && survol.c === c && survol.id === +id) {
          g.globalAlpha = 1; g.strokeStyle = couleur('--text'); g.lineWidth = 1.5 * dpr;
          g.beginPath(); g.arc(s[0], s[1], rayon + 4 * dpr, 0, 2 * Math.PI); g.stroke();
        }
      });
    });
    g.globalAlpha = 1;
  }
  document.addEventListener('mousemove', function (e) {
    var cv = $('#arene'), ib = $('#infobulle');
    if (!cv || e.target !== cv || !anim.res) { if (ib.style.display !== 'none' && e.target !== cv) { ib.style.display = 'none'; if (survol) { survol = null; dessiner(); } } return; }
    var r = cv.getBoundingClientRect(), dpr = cv.width / r.width;
    var mx = (e.clientX - r.left) * dpr, my = (e.clientY - r.top) * dpr;
    var st = positionsCourantes(), best = null, bd = 12 * dpr;
    [0, 1].forEach(function (c) {
      Object.keys(st.pos[c]).forEach(function (id) {
        var p = st.pos[c][id], s = ecran(cv, p[0], p[1]), d = Math.hypot(s[0] - mx, s[1] - my);
        if (d < bd) { bd = d; best = { c: c, id: +id, p: p }; }
      });
    });
    if (!best) { ib.style.display = 'none'; if (survol) { survol = null; dessiner(); } return; }
    survol = best;
    var info = anim.res.trace.vaisseaux[best.c][best.id], tr = anim.tour < 0 ? { tirs: [], detruits: [[], []] } : anim.res.trace.tours[anim.tour];
    var tire = tr.tirs.filter(function (t) { return t[0] === best.c && t[1] === best.id; })[0];
    var recu = tr.tirs.filter(function (t) { return t[0] !== best.c && t[2] === best.id; });
    var desc = '<b class="camp' + best.c + '">' + esc(info.type) + '</b> n°' + (best.id + 1) + '<br>taille ' + (info.taille + 1) + ' · position ' + Math.round(best.p[0]) + ', ' + Math.round(best.p[1]) + ', z ' + best.p[2] + (best.p[3] ? ' · <i>s\'éloigne</i>' : '');
    if (tire) {
      var j = tire[4], c = { coque: 0, bouclier: 0, rate: 0, absorbe: 0 };
      for (var k = 0; k < j.length; k += 2) c[j[k]]++;
      desc += '<br>tire sur ' + esc(anim.res.trace.vaisseaux[1 - best.c][tire[2]].type) + ' n°' + (tire[2] + 1) + ' à distance ' + tire[3] + ' : ' + (j.length / 2) + ' armes, ' + c.coque + ' coque, ' + c.bouclier + ' bouclier, ' + (c.rate + c.absorbe) + ' raté(s)' + (tire[5] ? ', <b>détruit</b>' : '');
    } else if (anim.tour >= 0) desc += '<br>ne tire pas ce tour (hors de portée, sans cible ou plus combatif)';
    if (recu.length) desc += '<br>pris pour cible par ' + recu.length + ' vaisseau(x)' + (tr.detruits[best.c].indexOf(best.id) >= 0 ? ', <b>détruit</b>' : '');
    ib.innerHTML = desc; ib.style.display = 'block';
    ib.style.left = Math.min(window.innerWidth - 300, e.clientX + 14) + 'px'; ib.style.top = (e.clientY + 14) + 'px';
    dessiner();
  });

  // ---------------------------------------------------------------- statistiques
  var calcul = null;
  function executer(cfg, n, progres) {
    // Calcul par tranches pour ne pas bloquer la page ; renvoie une promesse et garde « arreter ».
    var ctl = { arreter: false };
    calcul = ctl;
    var resultats = [], graine = (Math.random() * 4294967295) >>> 0;
    return new Promise(function (ok) {
      function tranche() {
        var t0 = performance.now();
        while (resultats.length < n && performance.now() - t0 < 40 && !ctl.arreter) {
          var r = M.combattre(cfg, (graine + resultats.length * 2654435761) >>> 0);
          delete r.tables;
          resultats.push(r);
        }
        progres(resultats.length, n);
        if (resultats.length >= n || ctl.arreter) ok({ resultats: resultats, arrete: ctl.arreter && resultats.length < n });
        else setTimeout(tranche, 0);
      }
      tranche();
    });
  }
  function occupe(oui) {
    ['#btnStats', '#btnUnique', '#btnComparer'].forEach(function (s) { var b = $(s); if (b) b.disabled = oui; });
    $('#btnStop').disabled = !oui; $('#barre').hidden = !oui;
  }
  function progres(k, n, libelle) {
    $('#barre > div').style.width = (100 * k / n) + '%';
    $('#progres').textContent = (libelle ? libelle + ' : ' : '') + fmt(k) + ' / ' + fmt(n) + ' combats';
  }
  function lancerStats() {
    var c = construireConfig(etat.camps, etat.bugMiroir);
    if (c.erreurs.length) { message('err', 'Impossible de simuler : ' + c.erreurs.map(esc).join(', ') + '.'); return; }
    var n = Math.max(1, +$('#nbCombats').value || 1000);
    // statistiques : on cache la visualisation du combat (et on arrête son animation)
    if (anim) { anim.joue = false; majBoutonJouer(); }
    $('#carteUnique').hidden = true;
    occupe(true);
    var t0 = performance.now();
    executer(c.cfg, n, progres).then(function (r) {
      occupe(false);
      $('#progres').textContent = fmt(r.resultats.length) + ' combats en ' + fmt((performance.now() - t0) / 1000, 1) + ' s' + (r.arrete ? ' (arrêté)' : '') + '.';
      if (!r.resultats.length) return;
      rendreStats(M.agreger(r.resultats), c.cfg);
      if (etat.combatReel) comparerAuReel(r.resultats);
    });
  }
  function coutPertes(a, cfg, camp) {
    var s = 0;
    cfg.camps[camp].vaisseaux.forEach(function (v) { var t = a.camps[camp].types[v.plan.nom], c = coutPlan(v.plan.nom); if (t) s += t.moyenne * (c ? c.centaures : v.plan.prix) * (v.nombre / t.depart); });
    return s;
  }
  function rendreStats(a, cfg) {
    var el = $('#carteStats'); el.hidden = false;
    var noms = [etat.camps[0].nom, etat.camps[1].nom];
    var pv = [a.victoires[0] / a.n, a.nuls / a.n, a.victoires[1] / a.n];
    var tours = Object.keys(a.tours).map(Number).sort(function (x, y) { return x - y; });
    var med = (function () { var s = 0; for (var i = 0; i < tours.length; i++) { s += a.tours[tours[i]]; if (s >= a.n / 2) return tours[i]; } return 0; })();
    var html = '<h2>Statistiques sur ' + fmt(a.n) + ' combats</h2>' +
      '<div class="tuiles">' +
      '<div class="tuile"><div class="v camp0">' + pct(pv[0]) + '</div><div class="l">victoire de ' + esc(noms[0]) + '</div></div>' +
      '<div class="tuile"><div class="v">' + pct(pv[1]) + '</div><div class="l">aucun vainqueur</div></div>' +
      '<div class="tuile"><div class="v camp1">' + pct(pv[2]) + '</div><div class="l">victoire de ' + esc(noms[1]) + '</div></div>' +
      '<div class="tuile"><div class="v">' + pct(a.garde[0] / a.n) + '</div><div class="l">l\'attaquant garde sa directive</div></div>' +
      '<div class="tuile"><div class="v">' + med + '</div><div class="l">tours de combat (médiane)</div></div></div>';
    var dep = [0, 1].map(function (i) { return cfg.camps[i].vaisseaux.reduce(function (t, v) { return t + v.nombre * v.plan.stats.puissance; }, 0); });
    html += '<div style="margin-bottom:12px">' + htmlBarresPuissance(dep, [a.camps[0].puissanceFin.moyenne, a.camps[1].puissanceFin.moyenne], false, true) + '</div>';
    // barre d'issue (3 segments, 2px d'écart)
    html += '<svg width="100%" height="18" viewBox="0 0 1000 18" preserveAspectRatio="none" style="display:block;margin-bottom:12px" aria-label="Répartition des issues">' +
      (function () {
        var x = 0, out = '', cols = ['var(--camp0)', 'var(--rate)', 'var(--camp1)'], lib = ['victoire ' + noms[0], 'aucun vainqueur', 'victoire ' + noms[1]];
        pv.forEach(function (p, i) {
          var w = p * 1000; if (w <= 0) return;
          out += '<rect x="' + (x + (x ? 1 : 0)) + '" y="0" width="' + Math.max(0, w - (x ? 1 : 0) - (x + w < 999.9 ? 1 : 0)) + '" height="18" rx="4" fill="' + cols[i] + '" data-tip="' + esc(lib[i]) + ' : ' + pct(p) + '"></rect>';
          x += w;
        });
        return out;
      })() + '</svg>';
    // pertes par type
    html += '<div class="grid2">' + [0, 1].map(function (i) {
      var c = a.camps[i];
      return '<div><h3 class="camp' + i + '">' + esc(noms[i]) + '</h3><div class="tablewrap"><table><thead><tr><th>Type</th><th class="n">Départ</th><th class="n">Pertes moyennes</th><th class="n" title="10 % des combats font moins de pertes, 10 % en font plus">Pertes 10 % · médiane · 90 %</th><th class="n">Tous perdus</th></tr></thead><tbody>' +
        Object.keys(c.types).map(function (t) {
          var x = c.types[t];
          return '<tr><td>' + esc(t) + '</td><td class="n">' + x.depart + '</td><td class="n">' + fmt(x.moyenne, 2) + '</td><td class="n">' + fmt(x.q10, 0) + ' · ' + fmt(x.q50, 0) + ' · ' + fmt(x.q90, 0) + '</td><td class="n">' + pct(x.toutPerdu) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="resume"><span>vaisseaux restants <b>' + fmt(c.survivants.moyenne, 1) + '</b> (' + fmt(c.survivants.q10) + ' à ' + fmt(c.survivants.q90) + ')</span>' +
        '<span>puissance restante <b>' + fmt(c.puissanceFin.moyenne, 0) + '</b></span><span>dégâts encaissés <b>' + fmt(c.encaisses.moyenne, 0) + '</b></span>' +
        '<span>valeur perdue <b>' + fmt(coutPertes(a, cfg, i)) + '</b> ¢</span>' +
        (c.collisions && c.collisions.q90 > 0 ? '<span title="Collisions internes de fin de tour, sur les survivants du combat' + (Object.keys(c.typesCollisions).length ? ' ; par type : ' + Object.keys(c.typesCollisions).map(function (t) { return t + ' ' + fmt(c.typesCollisions[t], 1); }).join(', ') : '') + '">puis perdus en collisions de fin de tour <b>' + fmt(c.collisions.moyenne, 1) + '</b> (' + fmt(c.collisions.q10) + ' à ' + fmt(c.collisions.q90) + ')</span>' : '') +
        '</div></div>';
    }).join('') + '</div>';
    // histogramme du nombre de tours
    var maxN = Math.max.apply(null, tours.map(function (t) { return a.tours[t]; }));
    var tmin = tours[0], tmax = tours[tours.length - 1], nb = tmax - tmin + 1;
    var W = 600, H = 150, bw = Math.min(48, (W - 40) / nb);
    html += '<h3>Nombre de tours de combat</h3><svg viewBox="0 0 ' + W + ' ' + (H + 24) + '" width="100%" style="max-width:640px" aria-label="Histogramme du nombre de tours">' +
      '<line x1="30" y1="' + H + '" x2="' + W + '" y2="' + H + '" stroke="var(--border)"/>';
    for (var t = tmin; t <= tmax; t++) {
      var v = a.tours[t] || 0, hh = maxN ? (v / maxN) * (H - 16) : 0, x = 34 + (t - tmin) * bw;
      if (hh > 0) html += '<path d="M' + (x + 1) + ',' + H + 'V' + (H - hh + 4) + 'q0,-4 4,-4h' + Math.max(0, bw - 10) + 'q4,0 4,4V' + H + 'z" fill="var(--accent)" data-tip="' + t + ' tours : ' + pct(v / a.n) + ' (' + fmt(v) + ')"></path>';
      if (nb <= 20 || (t - tmin) % 2 === 0) html += '<text x="' + (x + bw / 2) + '" y="' + (H + 15) + '" text-anchor="middle">' + t + '</text>';
    }
    html += '</svg>';
    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('mouseover', function (e) {
    var t = e.target.closest && e.target.closest('[data-tip]'), ib = $('#infobulle');
    if (!t) { if (ib.dataset.tip) { ib.style.display = 'none'; ib.dataset.tip = ''; } return; }
    ib.textContent = t.getAttribute('data-tip'); ib.dataset.tip = '1'; ib.style.display = 'block';
    ib.style.left = Math.min(window.innerWidth - 260, e.clientX + 12) + 'px'; ib.style.top = (e.clientY + 12) + 'px';
  });

  function lancerComparaison() {
    var noms = $$('[data-comparer]').filter(function (x) { return x.checked; }).map(function (x) { return x.dataset.comparer; });
    var liste = [];
    if ($('#compCourant').checked) liste.push({ nom: 'flottes en cours', camps: etat.camps, bugMiroir: etat.bugMiroir });
    noms.forEach(function (n) { liste.push({ nom: n, camps: reg.scenarios[n].camps, bugMiroir: reg.scenarios[n].bugMiroir }); });
    if (!liste.length) { message('warn', 'Cochez au moins un scénario.'); return; }
    var n = Math.max(1, +$('#nbCombats').value || 1000), lignes = [];
    occupe(true);
    var i = 0;
    (function suivant() {
      if (i >= liste.length || (calcul && calcul.arreter && i)) { occupe(false); $('#progres').textContent = 'Comparaison terminée.'; afficher(); return; }
      var sc = liste[i], c = construireConfig(sc.camps, sc.bugMiroir);
      if (c.erreurs.length) { lignes.push({ nom: sc.nom, erreur: c.erreurs.join(', ') }); i++; suivant(); return; }
      executer(c.cfg, n, function (k, tot) { progres(k, tot, sc.nom + ' (' + (i + 1) + '/' + liste.length + ')'); }).then(function (r) {
        var a = M.agreger(r.resultats);
        var p0 = 0, p1 = 0;
        c.cfg.camps[0].vaisseaux.forEach(function (v) { p0 += v.nombre * v.plan.stats.puissance; });
        c.cfg.camps[1].vaisseaux.forEach(function (v) { p1 += v.nombre * v.plan.stats.puissance; });
        lignes.push({ nom: sc.nom, a: a, cfg: c.cfg, camps: sc.camps, p: [p0, p1] });
        i++; suivant();
      });
    })();
    function afficher() {
      var tours = function (a) { var ks = Object.keys(a.tours).map(Number).sort(function (x, y) { return x - y; }), s = 0; for (var k = 0; k < ks.length; k++) { s += a.tours[ks[k]]; if (s >= a.n / 2) return ks[k]; } return 0; };
      $('#comparaison').innerHTML = '<div class="tablewrap"><table><thead><tr><th>Scénario</th><th>Flottes</th><th class="n">Puissance</th><th class="n" title="Centaures · minerai · PdC">Coût</th><th class="n">Victoire attaquant</th><th class="n">Aucun vainqueur</th><th class="n">Victoire défenseur</th>' +
        '<th class="n">Attaquant : vaisseaux restants</th><th class="n">Défenseur : vaisseaux restants</th><th class="n">Valeur perdue (¢) att. · déf.</th><th class="n">Tours (médiane)</th></tr></thead><tbody>' +
        lignes.map(function (l) {
          if (l.erreur) return '<tr><td>' + esc(l.nom) + '</td><td colspan="10" style="color:var(--err)">' + esc(l.erreur) + '</td></tr>';
          var a = l.a, desc = l.camps.map(function (c) { return c.lignes.filter(function (x) { return x.nombre > 0; }).map(function (x) { return x.nombre + ' ' + x.plan; }).join(', '); });
          return '<tr><td><b>' + esc(l.nom) + '</b></td><td style="font-size:12px"><span class="camp0">' + esc(desc[0]) + '</span><br><span class="camp1">' + esc(desc[1]) + '</span></td>' +
            '<td class="n"><span class="camp0">' + fmt(l.p[0]) + '</span><br><span class="camp1">' + fmt(l.p[1]) + '</span></td>' +
            '<td class="n" style="font-size:12px">' + [0, 1].map(function (i) {
              var t = { centaures: 0, minerai: 0, pdc: 0 };
              l.cfg.camps[i].vaisseaux.forEach(function (v) { var c = coutPlan(v.plan.nom); if (c) { t.centaures += v.nombre * c.centaures; t.minerai += v.nombre * c.minerai; t.pdc += v.nombre * c.pdc; } });
              return '<span class="camp' + i + '">' + texteCout(t, 1) + '</span>';
            }).join('<br>') + '</td>' +
            '<td class="n">' + pct(a.victoires[0] / a.n) + '</td><td class="n">' + pct(a.nuls / a.n) + '</td><td class="n">' + pct(a.victoires[1] / a.n) + '</td>' +
            '<td class="n">' + fmt(a.camps[0].survivants.moyenne, 1) + ' / ' + l.cfg.camps[0].vaisseaux.reduce(function (s, v) { return s + v.nombre; }, 0) + '</td>' +
            '<td class="n">' + fmt(a.camps[1].survivants.moyenne, 1) + ' / ' + l.cfg.camps[1].vaisseaux.reduce(function (s, v) { return s + v.nombre; }, 0) + '</td>' +
            '<td class="n">' + fmt(coutPertes(a, l.cfg, 0)) + ' · ' + fmt(coutPertes(a, l.cfg, 1)) + '</td><td class="n">' + tours(a) + '</td></tr>';
        }).join('') + '</tbody></table></div><div class="muted" style="font-size:12px">' + fmt(n) + ' combats par scénario. Valeur perdue = prix des vaisseaux détruits, en moyenne.</div>';
    }
  }

  // ------------------------------------------------------------------ vue Plans
  var edition = null;   // { nomOrigine, nom, composants: [{code, nb}] }
  var filtre = { texte: '', origines: {} };
  function familles() {
    var f = [['Réacteurs', function (c) { return c.type === 'moteur'; }], ['Armes spatiales', function (c) { return c.type === 'arme' && (c.typeArme === 'CS' || c.typeArme === 'M'); }],
      ['Bombes', function (c) { return c.type === 'arme' && c.typeArme === 'CP'; }], ['Boucliers', function (c) { return c.caracs && c.caracs.bouclier; }],
      ['Absorbeurs', function (c) { return c.caracs && c.caracs.absorption; }], ['Autres', function () { return true; }]];
    var pris = {}, r = [];
    f.forEach(function (x) {
      var l = Object.keys(CAT.composants).map(function (k) { return CAT.composants[k]; }).filter(function (c) { return !pris[c.code] && x[1](c); });
      l.forEach(function (c) { pris[c.code] = 1; });
      r.push([x[0], l]);
    });
    return r;
  }
  var FAMILLES = familles();
  function optionsComposants(choisi) {
    return FAMILLES.map(function (f) {
      return '<optgroup label="' + f[0] + '">' + f[1].map(function (c) { return '<option value="' + c.code + '"' + (c.code === choisi ? ' selected' : '') + '>' + esc(c.nom) + ' (' + c.cases + ' case' + (c.cases > 1 ? 's' : '') + ')</option>'; }).join('') + '</optgroup>';
    }).join('');
  }
  function descComposant(c) {
    if (c.type === 'arme' && c.arme.portee) return 'vitesse ' + c.arme.vitesse + ', portée ' + c.arme.portee + ', dégâts bouclier ' + c.arme.degatBouclier + ' / coque ' + c.arme.degatCoque + ' / sol ' + c.arme.degatSol + ' ; toucher (tailles 1→10) ' + c.toucher.join(' ');
    if (c.type === 'arme') return 'dégâts au sol ' + c.arme.degatSol + ' (pas de tir spatial)';
    if (c.caracs) return Object.keys(c.caracs).map(function (k) { return { propulsion: 'propulsion', bouclier: 'charge du bouclier', absorption: 'absorption', cargo: 'cargo', brouillage: 'brouillage %', scannerFlotte: 'scanner flottes', scannerSysteme: 'scanner systèmes' }[k] + ' ' + c.caracs[k]; }).join(', ');
    return 'aucun effet en combat (encaisse des dégâts)';
  }
  function rendrePlans() {
    var tous = tousLesPlans(), noms = nomsPlansTries();
    var origs = {}; noms.forEach(function (n) { origs[tous[n].origine] = (origs[tous[n].origine] || 0) + 1; });
    var manques = Object.keys(reg.rencontres).sort();
    var html = '';
    if (edition) html += rendreEditeur();
    html += '<div class="card"><h2>Plans disponibles</h2><div class="ligne"><input id="pFiltre" placeholder="rechercher…" value="' + esc(filtre.texte) + '">' +
      Object.keys(origs).map(function (o) { return '<label><input type="checkbox" data-origine="' + esc(o) + '"' + (filtre.origines[o] === false ? '' : ' checked') + '> ' + esc(ORIGINES[o] || o) + ' (' + origs[o] + ')</label>'; }).join('') +
      '<span style="flex:1"></span><button class="go" data-action="nouveau">+ Nouveau plan</button></div>' +
      '<div class="tablewrap"><table><thead><tr><th>Nom</th><th>Origine</th><th class="n">Cases</th><th class="n">Taille</th><th class="n">Vitesse</th><th class="n">AS</th><th class="n">AP</th><th class="n">Puissance</th><th class="n">Boucliers</th><th class="n">Absorption</th><th class="n">Prix</th><th class="n">Minerai</th><th class="n">PdC</th><th></th></tr></thead><tbody>' +
      noms.filter(function (n) {
        return filtre.origines[tous[n].origine] !== false && (!filtre.texte || n.toLowerCase().indexOf(filtre.texte.toLowerCase()) >= 0);
      }).map(function (n) {
        var d = tous[n], p = planCompile(n);
        var st = p ? p.stats : {};
        return '<tr data-plan="' + esc(n) + '"><td title="' + esc((d.composants || []).map(function (c) { return c.nb + ' × ' + (CAT.composants[c.code] ? CAT.composants[c.code].nom : c.code); }).join('\n')) + '">' + esc(n) + (d.marque ? ' <span class="muted">' + esc(d.marque) + '</span>' : '') + '</td>' +
          '<td><span class="pastille' + (d.origine === 'perso' ? ' perso' : '') + '">' + esc(ORIGINES[d.origine] || d.origine) + '</span></td>' +
          (p ? '<td class="n">' + p.nbCases + '</td><td class="n">' + (p.taille + 1) + '</td><td class="n">' + st.vitesse + '</td><td class="n">' + st.as + '</td><td class="n">' + st.ap + '</td><td class="n">' + st.puissance + '</td><td class="n">' + st.boucliers + '</td><td class="n">' + (st.absorption || '') + '</td><td class="n">' + fmt(p.prix) + '</td><td class="n">' + p.minerai + '</td><td class="n">' + p.pdc + '</td>'
            : '<td colspan="11" class="muted">composants inconnus</td>') +
          '<td style="white-space:nowrap"><button class="mini" data-action="dupliquer">Copier</button>' + (d.origine === 'perso' ? ' <button class="mini" data-action="modifier">Modifier</button> <button class="mini danger" data-action="supprimer">✕</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div><div class="muted" style="font-size:12px">Taille et vitesse de combat comme dans le jeu (taille 1 à 10 selon le nombre de cases ; vitesse = meilleur réacteur + bonus de taille). Survolez un nom pour ses composants.</div></div>';
    html += '<div class="card"><h2>Vaisseaux rencontrés à compléter (' + manques.length + ')</h2>' +
      (manques.length ? '<div class="muted" style="font-size:13px">Vus en combat, mais leur plan est privé : donnez-leur une composition pour les utiliser dans une flotte.</div><table><tbody>' +
        manques.map(function (n) { var r = reg.rencontres[n]; return '<tr data-rencontre="' + esc(n) + '"><td>' + esc(n) + '</td><td class="muted">' + (r.proprio ? 'commandant ' + esc(r.proprio) : '') + (r.tour ? ', tour ' + esc(r.tour) : '') + '</td><td><button class="mini" data-action="completer">Définir la composition</button> <button class="mini danger" data-action="oublier">✕</button></td></tr>'; }).join('') + '</tbody></table>'
        : '<div class="muted">Aucun. Chargez des rapport.xml ou combat.htm : les vaisseaux ennemis vus en combat dont le plan est inconnu apparaîtront ici.</div>') + '</div>';
    $('#vue-plans').innerHTML = html;
  }
  function rendreEditeur() {
    var e = edition, tous = tousLesPlans();
    var def = { nom: e.nom || 'nouveau', composants: e.composants.filter(function (c) { return c.code && c.nb > 0; }) };
    var p = M.compilerPlan(def, CAT), st = p.stats;
    var alertes = [];
    if (!def.composants.length) alertes.push(['warn', 'Ajoutez au moins un composant.']);
    if (!st.propulsion) alertes.push(['warn', 'Aucun réacteur : vitesse 0, le vaisseau ne bouge pas en combat (et ne peut pas voyager).']);
    var moteurs = def.composants.filter(function (c) { return CAT.composants[c.code].type === 'moteur'; }).reduce(function (s, c) { return s + c.nb; }, 0);
    if (moteurs > 1) alertes.push(['warn', 'Plusieurs réacteurs : seul le meilleur compte pour la vitesse, les autres ne servent qu\'à encaisser des dégâts.']);
    if (p.typesBoucliers > 10) alertes.push(['err', 'Plus de 10 types de boucliers : le jeu refuse le plan (NB_BOUCLIERS_MAX).']);
    var absorbs = def.composants.filter(function (c) { var x = CAT.composants[c.code]; return x.caracs && x.caracs.absorption; }).reduce(function (s, c) { return s + c.nb; }, 0);
    if (absorbs > 1) alertes.push(['warn', 'Plusieurs absorbeurs : seul le meilleur compte.']);
    var nom = (e.nom || '').trim();
    if (!nom) alertes.push(['err', 'Donnez un nom au plan.']);
    else if (nom !== e.nomOrigine && tous[nom] && tous[nom].origine !== 'perso') alertes.push(['err', 'Ce nom est déjà pris par un plan ' + (ORIGINES[tous[nom].origine] || tous[nom].origine) + '.']);
    else if (nom !== e.nomOrigine && tous[nom]) alertes.push(['warn', 'Un plan perso porte déjà ce nom : il sera remplacé.']);
    var bloque = alertes.some(function (a) { return a[0] === 'err'; }) || !def.composants.length;
    return '<div class="card" id="editeur"><h2>' + (e.nomOrigine ? 'Modifier « ' + esc(e.nomOrigine) + ' »' : e.rencontre ? 'Composition de « ' + esc(e.nom) + ' »' : 'Nouveau plan') + '</h2>' +
      '<div class="ligne"><label>Nom <input id="eNom" value="' + esc(e.nom || '') + '" style="width:240px"' + (e.rencontre ? ' readonly' : '') + '></label></div>' +
      '<table class="composants"><thead><tr><th>Composant</th><th class="n">Nombre</th><th>Effet</th><th></th></tr></thead><tbody>' +
      e.composants.map(function (c, k) {
        var x = CAT.composants[c.code];
        return '<tr data-comp="' + k + '"><td><select data-e="code">' + optionsComposants(c.code) + '</select></td><td class="n"><input type="number" min="0" data-e="nb" value="' + esc(c.nb) + '"></td><td class="muted" style="font-size:12px">' + (x ? esc(descComposant(x)) : '') + '</td><td><button class="mini danger" data-action="eSuppr">✕</button></td></tr>';
      }).join('') + '</tbody></table>' +
      '<div class="ligne"><button class="sec" data-action="eAjout">+ Ajouter un composant</button></div>' +
      '<div class="resume"><span>cases <b>' + p.nbCases + '</b></span><span>taille <b>' + (p.taille + 1) + '</b></span><span>vitesse <b>' + st.vitesse + '</b></span><span>AS <b>' + st.as + '</b></span><span>AP <b>' + st.ap + '</b></span><span>puissance <b>' + st.puissance + '</b></span>' +
      '<span>boucliers <b>' + st.boucliers + '</b></span><span>absorption <b>' + st.absorption + '</b></span><span>prix <b>' + fmt(p.prix) + '</b> ¢</span><span>minerai <b>' + p.minerai + '</b></span><span>PdC <b>' + p.pdc + '</b></span></div>' +
      alertes.map(function (a) { return '<div class="msg ' + a[0] + '">' + a[1] + '</div>'; }).join('') +
      '<div class="ligne"><button class="go" data-action="eEnregistrer"' + (bloque ? ' disabled' : '') + '>Enregistrer comme plan perso</button><button class="sec" data-action="eAnnuler">Annuler</button></div></div>';
  }
  var vueP = $('#vue-plans');
  vueP.addEventListener('input', function (e) {
    if (e.target.id === 'pFiltre') {
      filtre.texte = e.target.value; var pos = e.target.selectionStart; rendrePlans();
      var f = $('#pFiltre'); f.focus(); f.setSelectionRange(pos, pos);
    }
  });
  vueP.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset.origine) { filtre.origines[t.dataset.origine] = t.checked; rendrePlans(); return; }
    if (t.id === 'eNom') { edition.nom = t.value; rendrePlans(); return; }
    if (t.dataset.e) {
      var k = +t.closest('tr').dataset.comp;
      edition.composants[k][t.dataset.e] = t.dataset.e === 'nb' ? Math.max(0, +t.value || 0) : t.value;
      rendrePlans();
    }
  });
  vueP.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var a = b.dataset.action, tr = b.closest('tr'), nom = tr && (tr.dataset.plan || tr.dataset.rencontre);
    var tous = tousLesPlans();
    if (a === 'nouveau') edition = { nom: '', composants: [{ code: 'moteurI', nb: 1 }, { code: 'laserI', nb: 4 }] };
    else if (a === 'dupliquer') edition = { nom: nom + ' (copie)', composants: JSON.parse(JSON.stringify(tous[nom].composants || [])) };
    else if (a === 'modifier') edition = { nomOrigine: nom, nom: nom, composants: JSON.parse(JSON.stringify(tous[nom].composants || [])) };
    else if (a === 'completer') edition = { nom: nom, rencontre: true, composants: [{ code: 'moteurI', nb: 1 }] };
    else if (a === 'supprimer') { if (!confirm('Supprimer le plan perso « ' + nom + ' » ?')) return; delete reg.plans[nom]; D.sauver(reg); }
    else if (a === 'oublier') { delete reg.rencontres[nom]; D.sauver(reg); }
    else if (a === 'eAjout') edition.composants.push({ code: 'laserI', nb: 1 });
    else if (a === 'eSuppr') edition.composants.splice(+tr.dataset.comp, 1);
    else if (a === 'eAnnuler') edition = null;
    else if (a === 'eEnregistrer') {
      var n = edition.nom.trim();
      var comp = {};
      edition.composants.forEach(function (c) { if (c.code && c.nb > 0) comp[c.code] = (comp[c.code] || 0) + c.nb; });
      if (edition.nomOrigine && edition.nomOrigine !== n) delete reg.plans[edition.nomOrigine];
      reg.plans[n] = { nom: n, origine: 'perso', marque: edition.rencontre ? 'rencontré (composition supposée)' : 'perso', date: new Date().toISOString().slice(0, 10),
        composants: Object.keys(comp).map(function (k) { return { code: k, nb: comp[k] }; }) };
      delete reg.rencontres[n];
      // les flottes qui utilisaient l'ancien nom suivent le renommage
      if (edition.nomOrigine && edition.nomOrigine !== n) etat.camps.forEach(function (c) { c.lignes.forEach(function (l) { if (l.plan === edition.nomOrigine) l.plan = n; }); });
      D.sauver(reg); memoriser(); cachePlans = {};
      message('ok', 'Plan « ' + esc(n) + ' » enregistré. Pensez à « ⬇ Exporter » pour le garder dans le dépôt.', 6000);
      edition = null;
      rendreFlottes();
    } else return;
    rendrePlans();
    if (edition && (a === 'nouveau' || a === 'dupliquer' || a === 'modifier' || a === 'completer')) $('#editeur').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ------------------------------------------------------------------ combat planétaire
  // Une flotte (même carte que l'onglet Flottes) contre les planètes d'un système (M.combattrePlanetes).
  var DIRECTIVES_P = [[1, 'Attaque système'], [5, 'Attaque de planète'], [4, 'Pillage système'], [6, 'Pillage de planète'], [7, 'Éradication de planète']];
  var ARRETS = { combativite: 'combativité épuisée', puissance: 'puissance sous 50', flotte: 'flotte détruite', aucun: 'toutes les cibles traitées' };
  function planetaireDefaut() {
    var f = campDefaut('Ma flotte', 'Fregate standard', 6);
    f.lignes.push({ plan: 'Grand Bombardier standard', nombre: 3, moral: 4500, experience: 0, race: 0 });
    return { flotte: f, directive: 1, cible: 0, ordre: 'hasard', n: 1000, graine: '', reel: null,
      proprios: [{ nom: 'Neutre', protege: false, defense: false, armement: false, gouverneur: null }],
      planetes: [
        { nom: 'Planète 1', proprio: 0, population: 150, stabilite: 100, milice: '', batiments: [{ code: 'mineI', nombre: 2 }] },
        { nom: 'Planète 2', proprio: 0, population: 400, stabilite: 80, milice: '', batiments: [{ code: 'battlaI', nombre: 1 }] },
        { nom: 'Planète 3', proprio: 0, population: 90, stabilite: 100, milice: '', batiments: [] }] };
  }
  if (!etat.planetaire) etat.planetaire = planetaireDefaut();
  function proprioDefaut(nom) { return { nom: nom, protege: false, defense: false, armement: false, gouverneur: null }; }

  var optionsBatimentsCache = null;
  function optionsBatiments(choisi) {
    if (!optionsBatimentsCache) {
      var groupes = { 'Défense': [], 'Boucliers planétaires': [], 'Autres': [] };
      Object.keys(CAT.batiments).forEach(function (k) {
        var b = CAT.batiments[k];
        (b.arme ? groupes['Défense'] : b.bouclier ? groupes['Boucliers planétaires'] : groupes['Autres']).push(b);
      });
      optionsBatimentsCache = groupes;
    }
    var html = '';
    Object.keys(optionsBatimentsCache).forEach(function (g) {
      html += '<optgroup label="' + g + '">' + optionsBatimentsCache[g].map(function (b) {
        return '<option value="' + b.code + '"' + (b.code === choisi ? ' selected' : '') + '>' + esc(b.nom) + '</option>';
      }).join('') + '</optgroup>';
    });
    return html;
  }
  function texteBatiment(code) {
    var b = CAT.batiments[code]; if (!b) return code;
    var a = b.arme ? CAT.composants[b.arme] : null;
    return b.nom + ' : structure ' + fmt(b.structure) + (a ? ', ' + esc(a.nom) + ' (50 salves par tour, dégâts coque ' + a.arme.degatCoque + ', bouclier ' + a.arme.degatBouclier + ')' : '') +
      (b.bouclier ? ' ; tant qu\'il tient, toute la flotte tire sur lui et la milice n\'est pas touchée' : '');
  }
  function milicePlanete(p) {
    var pl = etat.planetaire, pr = pl.proprios[+p.proprio || 0] || {};
    return M.miliceDeDepart({ population: p.population, stabilite: p.stabilite }, pr);
  }

  function htmlStrategiePlanetaire(s) {
    var c = etat.planetaire.flotte, strato = 0, sol = 0;
    c.lignes.forEach(function (l) {
      var p = planCompile(l.plan), k = +l.nombre || 0; if (!p) return;
      var ag = s.agressivite, st = p.stats;
      if (ag === 1 || ag === 2) strato += k;
      else if (ag === 0 || ag === 3) { if (st.bombardier) strato += k; else sol += k; }
      else if (ag === 4) { if (!st.chasseur) strato += k; else sol += k; }
      else sol += k;
    });
    return '<details' + (s.agressivite !== 3 ? ' open' : '') + '><summary>Stratégie : ' + AGRESSIVITE[s.agressivite] + '</summary>' +
      '<div class="ligne"><label>Agressivité <select data-strat="agressivite">' + AGRESSIVITE.map(function (a, k) { return '<option value="' + k + '"' + (k === s.agressivite ? ' selected' : '') + '>' + a + '</option>'; }).join('') + '</select></label>' +
      '<span>stratosphère <b>' + strato + '</b> · air-sol <b>' + sol + '</b></span></div>' +
      '<div class="muted" style="font-size:12px">En combat planétaire, l\'agressivité répartit la flotte (<code>Flotte.forceAttaqueStratospherique</code> / <code>forceAttaqueAirSol</code>). ' +
      'Normal ou Pillage : les vaisseaux qui ont une arme de combat planétaire bombardent depuis la stratosphère, les autres attaquent en air-sol. Combatif : seuls ceux qui ont une arme spatiale vont en air-sol. ' +
      'Prudent ou Fuyard : tout en stratosphère (seules les armes planétaires tirent, la milice ne riposte pas). Rage : tout en air-sol. ' +
      'Les batteries visent la stratosphère s\'il y a quelqu\'un, sinon l\'air-sol ; la milice ne tire que sur l\'air-sol.</div></details>';
  }

  function listeAttaquesPlanetes() {
    var l = Object.keys(reg.attaquesPlanetes || {}).map(function (k) { return reg.attaquesPlanetes[k]; });
    return l.sort(function (a, b) { return b.tour - a.tour || a.position.localeCompare(b.position); });
  }
  function titreAttaque(s) {
    var noms = s.combats.map(function (c) { return c.initial.planete.nom; });
    return 'T' + s.tour + ' en ' + s.position.replace(/^0_/, '').replace('_', '-') + ' : ' + (s.attaquant === s.moi ? 'vous' : 'cdt ' + s.attaquant) + ' contre ' +
      s.combats.length + ' planète(s) (' + noms.slice(0, 3).join(', ') + (noms.length > 3 ? '…' : '') + '), ' + s.fin + ' tours';
  }

  function rendrePlanetaire() {
    var v = $('#vue-planetes'); if (!v) return;
    if (!$('#pConfig', v)) {
      v.innerHTML = '<div id="pConfig"></div>' +
        '<div class="card"><div class="ligne"><label>Graine <input id="pGraine" placeholder="au hasard" style="width:110px"></label>' +
        '<button class="go" id="pUnique">▶ Un combat</button><span style="width:20px"></span>' +
        '<label>Nombre de combats <input type="number" id="pN" min="10" step="100"></label>' +
        '<button class="go" id="pStats">📊 Statistiques</button><button class="sec" id="pStop" disabled>■ Arrêter</button></div>' +
        '<div class="barre" id="pBarre" hidden><div></div></div><div class="muted" id="pProgres"></div></div>' +
        '<div class="card" id="pCarteUnique" hidden></div><div class="card" id="pCarteStats" hidden></div>';
    }
    var pl = etat.planetaire;
    $('#pGraine').value = pl.graine || ''; $('#pN').value = pl.n || 1000;
    var html = '';
    // imports
    var sys = reg.systemes && reg.systemes.liste ? reg.systemes.liste : [], att = listeAttaquesPlanetes(), connus = listeConnus();
    html += '<div class="card"><div class="ligne"><b>Importer</b>' +
      (sys.length ? '<select id="pSysListe">' + sys.map(function (s, k) { return '<option value="' + k + '">' + esc(s.nom) + ' (' + esc(s.pos.replace(/^0_/, '').replace('_', '-')) + ', ' + s.planetes.length + ' planètes)</option>'; }).join('') + '</select><button class="sec" id="pSysImporter">⤓ un de mes systèmes (T' + esc(reg.systemes.tour) + ')</button>' : '') +
      (connus.length ? '<select id="pConnuListe">' + connus.map(function (e) { return '<option value="' + esc(e.pos) + '"' + (pl.connuChoisi === e.pos ? ' selected' : '') + '>' + esc(titreConnu(e)) + '</option>'; }).join('') + '</select><button class="sec" id="pConnuImporter">⤓ un système connu</button>' : '') +
      (att.length ? '<select id="pAttListe">' + att.map(function (s) { return '<option value="' + esc(s.cle) + '"' + (pl.reel && pl.reel.cle === s.cle ? ' selected' : '') + '>' + esc(titreAttaque(s)) + '</option>'; }).join('') + '</select><button class="sec" id="pAttImporter">⤓ une attaque réelle</button>' : '') +
      (!sys.length && !att.length && !connus.length ? '<span class="muted">Chargez un rapport.xml (bouton « 📂 Charger des fichiers ») pour importer vos systèmes ou les attaques de planètes du tour.</span>' : '') +
      (pl.reel ? '<span class="muted">comparé au réel : <b>' + esc(pl.reel.titre) + '</b></span><button class="mini" id="pReelOublier" title="Ne plus comparer">✕</button>' : '') +
      '<span style="flex:1"></span><button class="sec" id="pReinit">Réinitialiser</button></div>' +
      '<div class="muted" style="font-size:12px">Un système importé donne la population, la stabilité et les bâtiments de chaque planète, la politique Défense, le stock d\'Armement du poste et votre gouverneur ; vos planètes sont marquées « protégées » (décochez pour simuler une attaque contre vous). ' +
      'Un système connu rassemble ce que disent tous les rapports chargés : le détail complet le plus récent si vous y avez eu une planète, les planètes vues lors d\'une attaque (milice et bâtiments) et la dernière détection (nombre de planètes, population, propriétaires) ; les planètes inconnues sont estimées (« estimée » dans leur nom) et restent modifiables. ' +
      'Une attaque réelle reprend la flotte, l\'ordre réel des planètes, leur milice et leurs bâtiments au début de chaque combat ; les statistiques la comparent alors au résultat réel.</div></div>';
    html += rendreCamp('p') + rendreSysteme();
    $('#pConfig').innerHTML = html;
  }

  function rendreSysteme() {
    var pl = etat.planetaire, unique = pl.directive === 5 || pl.directive === 6 || pl.directive === 7;
    var html = '<div class="card" id="pSysteme"><div class="titreCamp"><span class="puce" style="background:var(--camp1)"></span><h2 style="margin:0">Système visé</h2></div>' +
      '<div class="ligne"><label>Directive <select data-pchamp="directive">' + DIRECTIVES_P.map(function (d) { return '<option value="' + d[0] + '"' + (d[0] === pl.directive ? ' selected' : '') + '>' + d[1] + '</option>'; }).join('') + '</select></label>' +
      (unique ? '<label>Planète visée <select data-pchamp="cible">' + pl.planetes.map(function (p, k) { return '<option value="' + k + '"' + (k === +pl.cible ? ' selected' : '') + '>' + esc(p.nom) + '</option>'; }).join('') + '</select></label>'
        : '<label title="Le jeu attaque les planètes dans un ordre au hasard (Utile.ordreAuHasard)">Ordre <select data-pchamp="ordre"><option value="hasard"' + (pl.ordre !== 'liste' ? ' selected' : '') + '>au hasard, comme le jeu</option><option value="liste"' + (pl.ordre === 'liste' ? ' selected' : '') + '>celui de la liste</option></select></label>') + '</div>';
    // propriétaires
    html += '<h3>Propriétaires</h3><div class="tablewrap"><table><thead><tr><th>Nom</th><th title="Vos planètes, ou celles d\'un commandant avec qui vous avez un PNA ou une alliance : elles ne sont pas attaquées">Protégé</th><th title="Politique Défense dans ce système : milice × 1,5, plafonnée à la population">Défense</th><th title="Au moins 100 Armement au poste commercial du système : milice × 1,5, plafonnée à la population">Armement</th><th title="Gouverneur du système : son attaque aide les batteries et la milice, sa défense et son inspiration fanatique gênent les tirs de la flotte">Gouverneur</th><th></th></tr></thead><tbody>' +
      pl.proprios.map(function (pr, k) {
        var g = pr.gouverneur;
        return '<tr data-proprio="' + k + '"><td><input data-pc="nom" value="' + esc(pr.nom) + '" style="width:130px"></td>' +
          '<td><input type="checkbox" data-pc="protege"' + (pr.protege ? ' checked' : '') + '></td>' +
          '<td><input type="checkbox" data-pc="defense"' + (pr.defense ? ' checked' : '') + '></td>' +
          '<td><input type="checkbox" data-pc="armement"' + (pr.armement ? ' checked' : '') + '></td>' +
          '<td><label><input type="checkbox" data-pc="gouverneur"' + (g ? ' checked' : '') + '></label>' +
          (g ? ' <label title="Attaque">att <input type="number" class="court" min="0" data-pg="att" value="' + esc(g.att) + '"></label> <label title="Défense">déf <input type="number" class="court" min="0" data-pg="def" value="' + esc(g.def) + '"></label>' +
            ' <label title="Inspiration fanatique">insp. <select data-pgc="5">' + [0, 1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (n === (+(g.competences || {})[5] || 0) ? ' selected' : '') + '>' + (n ? ROMAINS[n] : '—') + '</option>'; }).join('') + '</select></label>' +
            ' <label title="Maîtrise de l\'attaque">m.att <select data-pgc="1">' + [0, 1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (n === (+(g.competences || {})[1] || 0) ? ' selected' : '') + '>' + (n ? ROMAINS[n] : '—') + '</option>'; }).join('') + '</select></label>' +
            ' <label title="Maîtrise de la défense">m.déf <select data-pgc="2">' + [0, 1, 2, 3, 4, 5].map(function (n) { return '<option value="' + n + '"' + (n === (+(g.competences || {})[2] || 0) ? ' selected' : '') + '>' + (n ? ROMAINS[n] : '—') + '</option>'; }).join('') + '</select></label>' : '') + '</td>' +
          '<td>' + (pl.proprios.length > 1 ? '<button class="mini danger" data-paction="supprProprio" title="Retirer">✕</button>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div><div class="ligne"><button class="sec" data-paction="ajoutProprio">+ Ajouter un propriétaire</button></div>';
    // planètes
    html += '<h3>Planètes</h3><div class="tablewrap"><table><thead><tr><th>Planète</th><th>Propriétaire</th><th class="n">Population</th><th class="n">Stabilité</th><th class="n" title="Milice = population × stabilité / 100 (× 1,5 en Défense, × 1,5 avec Armement, plafond = population). Saisissez une valeur pour l\'imposer (par exemple celle d\'un rapport de combat).">Milice</th><th>Bâtiments</th><th></th></tr></thead><tbody>' +
      pl.planetes.map(function (p, k) {
        var pr = pl.proprios[+p.proprio || 0] || {}, calc = milicePlanete(p);
        return '<tr data-planete="' + k + '"' + (pr.protege ? ' style="opacity:.55" title="Planète protégée : non attaquée"' : '') + '><td><input data-pc="nom" value="' + esc(p.nom) + '" style="width:100px"></td>' +
          '<td><select data-pc="proprio">' + pl.proprios.map(function (x, j) { return '<option value="' + j + '"' + (j === (+p.proprio || 0) ? ' selected' : '') + '>' + esc(x.nom) + '</option>'; }).join('') + '</select></td>' +
          '<td class="n"><input type="number" min="0" data-pc="population" value="' + esc(p.population) + '"></td>' +
          '<td class="n"><input type="number" min="0" max="100" class="court" data-pc="stabilite" value="' + esc(p.stabilite) + '"></td>' +
          '<td class="n"><input type="number" min="0" class="court" data-pc="milice" placeholder="' + calc + '" value="' + esc(p.milice) + '" style="width:64px"></td>' +
          '<td class="bats">' + (p.batiments || []).map(function (b, j) {
            return '<span class="ligne" style="margin:2px 0;gap:4px" data-bat="' + j + '" title="' + esc(texteBatiment(b.code)) + '"><input type="number" min="0" class="court" data-pb="nombre" value="' + esc(b.nombre) + '" style="width:44px"><select data-pb="code" style="max-width:190px">' + optionsBatiments(b.code) + '</select>' +
              (+b.dommages > 0 ? '<span class="pastille manque" title="Dégâts déjà encaissés par bâtiment">dégâts ' + b.dommages + '</span>' : '') + '<button class="mini danger" data-paction="supprBat" title="Retirer">✕</button></span>';
          }).join('') + '<button class="mini" data-paction="ajoutBat">+ bâtiment</button></td>' +
          '<td><button class="mini danger" data-paction="supprPlanete" title="Retirer">✕</button></td></tr>';
      }).join('') + '</tbody></table></div><div class="ligne"><button class="sec" data-paction="ajoutPlanete">+ Ajouter une planète</button></div>';
    // résumé
    var cibles = pl.planetes.filter(function (p) { return !(pl.proprios[+p.proprio || 0] || {}).protege; });
    var milice = 0, batt = 0, bouc = 0;
    cibles.forEach(function (p) {
      milice += p.milice !== '' && p.milice != null ? +p.milice : milicePlanete(p);
      (p.batiments || []).forEach(function (b) { var d = CAT.batiments[b.code]; if (!d) return; if (d.arme) batt += +b.nombre || 0; if (d.bouclier) bouc += +b.nombre || 0; });
    });
    var r = resumeCamp('p');
    html += '<div class="resume"><span><b>' + cibles.length + '</b> planète(s) attaquable(s)</span><span>milice totale <b>' + fmt(milice) + '</b></span><span>batteries <b>' + batt + '</b></span><span>boucliers planétaires <b>' + bouc + '</b></span></div>' +
      '<div class="resume" id="pAvis">' + avisPlanetaire(r) + '</div></div>';
    return html;
  }
  function avisPlanetaire(r) {
    var l = [];
    if (r.puissance < 50) l.push('<span class="msg err" style="margin:0">Puissance ' + fmt(r.puissance) + ' : sous le minimum de 50, la flotte n\'attaquera pas.</span>');
    else if (r.puissance < 100) l.push('<span class="msg warn" style="margin:0">Puissance ' + fmt(r.puissance) + ' : le seuil de 50 est revérifié avant chaque planète, dégâts compris ; la flotte peut s\'arrêter en route.</span>');
    l.push('<span>combativité moyenne <b>' + combativiteMoyenne() + '</b> tours, partagés entre toutes les planètes</span>');
    return l.join('');
  }
  function combativiteMoyenne() {
    var c = etat.planetaire.flotte, h = M.preparerHeros(c.heros), s = 0, n = 0;
    c.lignes.forEach(function (l) { var k = +l.nombre || 0; if (!planCompile(l.plan)) return; s += k * (5 + M.niveauMoral(+l.moral || 0) + h.mor); n += k; });
    return n ? Math.trunc(s / n) : 0;
  }

  // Configuration du moteur depuis l'état de l'onglet
  function configPlanetaire() {
    var pl = etat.planetaire, c = construireConfig([pl.flotte]);
    var cfg = { flotte: c.cfg.camps[0], directive: pl.directive, cible: +pl.cible || 0, ordre: pl.ordre,
      proprios: pl.proprios.map(function (p) { return { nom: p.nom, protege: p.protege, defense: p.defense, armement: p.armement, gouverneur: p.gouverneur }; }),
      planetes: pl.planetes.map(function (p) {
        return { nom: p.nom, proprio: +p.proprio || 0, population: +p.population || 0, stabilite: +p.stabilite || 0, milice: p.milice === '' || p.milice == null ? undefined : +p.milice,
          batiments: (p.batiments || []).filter(function (b) { return CAT.batiments[b.code] && +b.nombre > 0; }) };
      }) };
    if (!cfg.planetes.length) c.erreurs.push('aucune planète');
    else if (!cfg.planetes.some(function (p) { return !(cfg.proprios[p.proprio] || {}).protege; })) c.erreurs.push('toutes les planètes sont protégées');
    return { cfg: cfg, erreurs: c.erreurs };
  }

  // Imports
  function importerSysteme(s) {
    var pl = etat.planetaire, moi = reg.systemes.commandant ? reg.systemes.commandant.numero : null;
    var index = {}, proprios = [];
    s.planetes.forEach(function (p) {
      if (index[p.proprio] != null) return;
      index[p.proprio] = proprios.length;
      if (p.proprio === moi) proprios.push({ nom: 'Vous', protege: true, defense: s.politique === 2, armement: s.armement >= 100, gouverneur: s.gouverneur ? JSON.parse(JSON.stringify(s.gouverneur)) : null });
      else proprios.push(proprioDefaut(p.proprio === '0' ? 'Neutre' : 'Commandant n°' + p.proprio));
    });
    var inconnus = {};
    pl.proprios = proprios;
    pl.planetes = s.planetes.map(function (p) {
      return { nom: s.nom + ' ' + (p.num + 1), proprio: index[p.proprio], population: p.population, stabilite: p.stabilite, milice: '',
        batiments: p.batiments.filter(function (b) { if (!CAT.batiments[b.code]) { inconnus[b.code] = 1; return false; } return true; }).map(function (b) { return { code: b.code, nombre: b.nombre }; }) };
    });
    pl.reel = null; pl.cible = 0;
    message('ok', 'Système ' + esc(s.nom) + ' importé : ' + s.planetes.length + ' planètes.' + (Object.keys(inconnus).length ? ' Bâtiments inconnus ignorés : ' + Object.keys(inconnus).map(esc).join(', ') + '.' : '') +
      ' La politique, l\'Armement et le gouverneur des autres propriétaires ne sont pas connus.', 8000);
  }
  function importerAttaque(s) {
    var pl = etat.planetaire, c0 = s.combats[0], nomsBat = {};
    Object.keys(CAT.batiments).forEach(function (k) { nomsBat[CAT.batiments[k].nom] = k; });
    var vaisseaux = c0.initial.vaisseaux.filter(function (v) { return v.nombre > 0; });
    var lignes = vaisseaux.map(function (v) { return { plan: v.nom, nombre: v.nombre, moral: 4500, experience: 0, race: 0, dommages: Math.floor(v.encaisses / v.nombre) }; });
    var heros = null, nom = s.attaquant === s.moi ? 'Ma flotte' : 'Flotte du cdt ' + s.attaquant, note = [];
    // notre flotte : retrouvée par sa composition dans le rapport du tour précédent
    if (s.attaquant === s.moi && reg.flottesParTour && reg.flottesParTour[s.tour - 1]) {
      var sig = function (ls) { var o = {}; ls.forEach(function (l) { o[l.plan || l.nom] = (o[l.plan || l.nom] || 0) + l.nombre; }); return Object.keys(o).sort().map(function (k) { return o[k] + ' ' + k; }).join('+'); };
      var cible = sig(vaisseaux), f = reg.flottesParTour[s.tour - 1].filter(function (x) { return sig(x.lignes) === cible; })[0];
      if (f) {
        nom = f.nom;
        lignes.forEach(function (l) {
          var ls = f.lignes.filter(function (x) { return x.plan === l.plan; }), n = 0, m = 0, e = 0;
          ls.forEach(function (x) { n += x.nombre; m += x.moral * x.nombre; e += x.experience * x.nombre; });
          if (n) { l.moral = Math.round(m / n); l.experience = Math.round(e / n); l.race = ls[0].race; }
        });
        if (f.heros) { var comp = {}; Object.keys(f.heros.competences || {}).forEach(function (k) { comp[k] = Math.max(1, +f.heros.competences[k]); }); heros = { nom: f.heros.nom, att: f.heros.att, def: f.heros.def, mor: f.heros.mor, vit: f.heros.vit, race: f.heros.race, competences: comp }; }
        note.push('moral, expérience et héros repris du rapport du tour ' + (s.tour - 1));
      } else note.push('flotte introuvable au tour ' + (s.tour - 1) + ' (fusion ?) : moral 4 500 supposé');
    } else if (s.attaquant !== s.moi) note.push('flotte adverse : moral 4 500 supposé, héros inconnu');
    // durée : si la dernière planète tient et que la flotte reste, la combativité vaut le nombre de tours
    var dern = s.combats[s.combats.length - 1], dt = dern.tours[dern.tours.length - 1];
    if (dt.milice > 0 && dt.vaisseaux.some(function (v) { return v.nombre > 0; })) {
      var hm = M.preparerHeros(heros).mor, somme = 0, nb = 0;
      lignes.forEach(function (l) { somme += l.nombre * (5 + M.niveauMoral(l.moral) + hm); nb += l.nombre; });
      if (nb && Math.trunc(somme / nb) !== s.fin) {
        var niv = Math.max(0, Math.min(11, s.fin - 5 - hm)), moral = niv <= 9 ? niv * 1000 + 500 : niv === 10 ? 12000 : 15000;
        lignes.forEach(function (l) { l.moral = moral; });
        note.push('moral ajusté à ' + fmt(moral) + ' pour retrouver la durée réelle (' + s.fin + ' tours)');
      }
    }
    pl.flotte.nom = nom; pl.flotte.lignes = lignes; pl.flotte.heros = heros;
    pl.flotte.militaire = reg.militaireParTour && reg.militaireParTour[s.tour] || 0;
    var index = {}, inconnus = {};
    pl.proprios = [];
    pl.planetes = s.combats.map(function (c) {
      var pr = c.initial.planete.proprio;
      if (index[pr] == null) { index[pr] = pl.proprios.length; pl.proprios.push(proprioDefaut(pr === '0' ? 'Neutre' : pr === s.moi ? 'Vous' : 'Commandant n°' + pr)); }
      return { nom: c.initial.planete.nom, proprio: index[pr], population: c.initial.milice, stabilite: 100, milice: c.initial.milice,
        batiments: c.initial.batiments.filter(function (b) { if (!nomsBat[b.nom]) { inconnus[b.nom] = 1; return false; } return b.nombre > 0; })
          .map(function (b) { return { code: nomsBat[b.nom], nombre: b.nombre, dommages: Math.floor(b.encaisses / b.nombre) }; }) };
    });
    pl.directive = 1; pl.ordre = 'liste'; pl.cible = 0;
    pl.reel = { cle: s.cle, titre: titreAttaque(s) };
    var manquants = lignes.filter(function (l) { return !planCompile(l.plan); }).map(function (l) { return l.plan; });
    message(manquants.length ? 'warn' : 'ok', 'Attaque importée : ' + s.combats.length + ' planète(s), milice imposée à celle du début de chaque combat, ordre réel. ' + note.join(' ; ') + '.' +
      (Object.keys(inconnus).length ? ' Bâtiments inconnus ignorés : ' + Object.keys(inconnus).map(esc).join(', ') + '.' : '') +
      (manquants.length ? ' Plans sans composition : ' + manquants.map(esc).join(', ') + ' (à compléter dans l\'onglet Plans).' : ''), 10000);
  }


  // ---- systèmes connus : toutes les sources des rapports chargés, planètes inconnues estimées
  function listeConnus() {
    var c = reg.systemesConnus || {};
    return Object.keys(c).map(function (k) { return c[k]; }).sort(function (a, b) { return (a.nom || '').localeCompare(b.nom || '', 'fr') || a.pos.localeCompare(b.pos); });
  }
  function resumeConnu(e) {
    var nb = e.detail ? e.detail.systeme.planetes.length : e.detection ? e.detection.nbpla : 0;
    var parAttaque = Object.keys(e.planetes).length;
    if (!nb) nb = Math.max.apply(null, Object.keys(e.planetes).map(function (k) { return +k + 1; }).concat([0]));
    return { nb: nb, detail: !!e.detail, attaques: parAttaque };
  }
  function titreConnu(e) {
    var r = resumeConnu(e), pos = e.pos.replace(/^0_/, '').replace('_', '-'), parts = [];
    if (r.detail) parts.push('détail complet T' + e.detail.tour);
    else {
      if (r.attaques) parts.push(r.attaques + ' planète(s) vues en attaque');
      if (e.detection) parts.push('détecté T' + e.detection.tour + ', pop. ' + fmt(e.detection.pop));
    }
    return (e.nom || '?') + ' (' + pos + ', ' + r.nb + ' planètes) — ' + parts.join(', ');
  }
  function importerConnu(e) {
    var pl = etat.planetaire, nomsBat = {}, notes = [];
    Object.keys(CAT.batiments).forEach(function (k) { nomsBat[CAT.batiments[k].nom] = k; });
    var moi = (e.detail && e.detail.moi) || (e.detection && e.detection.moi) || (reg.flottes && reg.flottes.commandant && reg.flottes.commandant.numero) || null;
    var index = {}, proprios = [];
    function proprio(num) {
      num = String(num);
      if (index[num] == null) { index[num] = proprios.length; proprios.push(num === moi ? { nom: 'Vous', protege: true, defense: false, armement: false, gouverneur: null } : proprioDefaut(num === '0' ? 'Neutre' : 'Commandant n°' + num)); }
      return index[num];
    }
    var nb = resumeConnu(e).nb, planetes = [], inconnus = {};
    var detail = e.detail ? e.detail.systeme : null;
    var toursDetail = e.detail ? e.detail.tour : -1;
    for (var k = 0; k < nb; k++) {
      var d = detail ? detail.planetes.filter(function (p) { return p.num === k; })[0] : null;
      var a = e.planetes[k];
      if (a && (!d || a.tour > toursDetail)) {
        // vue en attaque (plus récente que le détail) : milice et bâtiments au début du combat
        planetes.push({ nom: a.nom || (e.nom + ' ' + (k + 1)), proprio: proprio(a.proprio), population: a.milice, stabilite: 100, milice: a.milice, source: 'attaque T' + a.tour,
          batiments: (a.batiments || []).filter(function (b) { if (!nomsBat[b.nom]) { inconnus[b.nom] = 1; return false; } return b.nombre > 0; })
            .map(function (b) { return { code: nomsBat[b.nom], nombre: b.nombre, dommages: Math.floor((b.encaisses || 0) / b.nombre) }; }) });
      } else if (d) {
        planetes.push({ nom: e.nom + ' ' + (k + 1), proprio: proprio(d.proprio), population: d.population, stabilite: d.stabilite, milice: '', source: 'T' + toursDetail,
          batiments: d.batiments.filter(function (b) { if (!CAT.batiments[b.code]) { inconnus[b.code] = 1; return false; } return true; }).map(function (b) { return { code: b.code, nombre: b.nombre }; }) });
      } else planetes.push(null);
    }
    // planètes inconnues : population restante de la détection répartie, propriétaire le plus probable
    var vides = planetes.filter(function (p) { return !p; }).length;
    if (vides) {
      var det = e.detection, connue = 0;
      planetes.forEach(function (p) { if (p) connue += +p.population || 0; });
      var reste = det ? Math.max(0, det.pop - connue) : 0, popEst = vides ? Math.round(reste / vides) : 0;
      var autres = det ? det.proprios.filter(function (x) { return x !== moi; }) : [];
      var parDefaut = autres.length === 1 ? autres[0] : autres.filter(function (x) { return x !== '0'; })[0] || autres[0] || '0';
      planetes = planetes.map(function (p, k) {
        if (p) return p;
        return { nom: (e.nom || 'Planète') + ' ' + (k + 1) + ' (estimée)', proprio: proprio(parDefaut), population: popEst, stabilite: 100, milice: '', batiments: [], estimee: true };
      });
      notes.push(vides + ' planète(s) inconnue(s) estimée(s)' + (det ? ' : ' + fmt(popEst) + ' habitants chacune (population détectée au T' + det.tour + ' moins celle des planètes connues), stabilité 100 % (milice maximale), propriétaire ' + (parDefaut === '0' ? 'neutre' : 'n°' + parDefaut) + (autres.length > 1 ? ' (propriétaires possibles : ' + autres.map(function (x) { return x === '0' ? 'neutre' : 'n°' + x; }).join(', ') + ')' : '') : ' sans population connue'));
    }
    if (e.detection) e.detection.proprios.forEach(function (x) { proprio(x); });
    planetes.forEach(function (p) { delete p.source; delete p.estimee; });
    if (detail && moi && e.detail.moi === moi) {
      var mien = proprios[index[moi]];
      if (mien) { mien.defense = detail.politique === 2; mien.armement = detail.armement >= 100; mien.gouverneur = detail.gouverneur ? JSON.parse(JSON.stringify(detail.gouverneur)) : null; }
    }
    pl.proprios = proprios; pl.planetes = planetes; pl.reel = null; pl.cible = 0;
    var sources = [];
    if (e.detail) sources.push('détail complet du T' + e.detail.tour);
    var attaques = Object.keys(e.planetes).map(function (k) { return e.planetes[k]; });
    if (attaques.length) sources.push(attaques.length + ' planète(s) vues en attaque (milice et bâtiments, ' + Array.from(new Set(attaques.map(function (x) { return 'T' + x.tour; }))).join(', ') + ')');
    if (e.detection) sources.push('détection du T' + e.detection.tour);
    message(vides ? 'warn' : 'ok', 'Système ' + esc(e.nom) + ' importé (' + nb + ' planètes) à partir de : ' + sources.join(' ; ') + '.' + (notes.length ? ' ' + notes.join(' ; ') + '. Corrigez-les dans le tableau si vous en savez plus.' : '') +
      (Object.keys(inconnus).length ? ' Bâtiments inconnus ignorés : ' + Object.keys(inconnus).map(esc).join(', ') + '.' : '') +
      ' Politique, Armement et gouverneur des autres propriétaires inconnus.', 12000);
  }

  var vueP = $('#vue-planetes');
  vueP.addEventListener('change', function (e) {
    var pl = etat.planetaire;
    var r = changementCamp(e);
    if (r) { memoriser(); rendrePlanetaire(); return; }
    var t = e.target, tr = t.closest('tr');
    if (t.id === 'pGraine') { pl.graine = t.value.trim(); memoriser(); return; }
    if (t.id === 'pN') { pl.n = Math.max(1, +t.value || 1000); memoriser(); return; }
    if (t.id === 'pSysListe' || t.id === 'pAttListe' || t.id === 'pConnuListe') return;
    if (t.dataset.pchamp) {
      var k = t.dataset.pchamp;
      pl[k] = k === 'ordre' ? t.value : +t.value;
    } else if (tr && tr.dataset.proprio != null) {
      var pr = pl.proprios[+tr.dataset.proprio];
      if (t.dataset.pc === 'nom') pr.nom = t.value;
      else if (t.dataset.pc === 'gouverneur') pr.gouverneur = t.checked ? { nom: '', att: 0, def: 0, mor: 0, vit: 0, race: -1, competences: {} } : null;
      else if (t.dataset.pc) pr[t.dataset.pc] = t.checked;
      else if (t.dataset.pg) pr.gouverneur[t.dataset.pg] = +t.value || 0;
      else if (t.dataset.pgc) { pr.gouverneur.competences = pr.gouverneur.competences || {}; if (+t.value) pr.gouverneur.competences[t.dataset.pgc] = +t.value; else delete pr.gouverneur.competences[t.dataset.pgc]; }
    } else if (tr && tr.dataset.planete != null) {
      var p = pl.planetes[+tr.dataset.planete], sb = t.closest('[data-bat]');
      if (sb) { var b = p.batiments[+sb.dataset.bat]; if (t.dataset.pb === 'code') { b.code = t.value; b.dommages = 0; } else b.nombre = Math.max(0, +t.value || 0); }
      else if (t.dataset.pc === 'nom') p.nom = t.value;
      else if (t.dataset.pc === 'proprio') p.proprio = +t.value;
      else if (t.dataset.pc === 'milice') p.milice = t.value === '' ? '' : Math.max(0, +t.value || 0);
      else if (t.dataset.pc === 'stabilite') p.stabilite = Math.max(0, Math.min(100, +t.value || 0));
      else if (t.dataset.pc) p[t.dataset.pc] = Math.max(0, +t.value || 0);
    } else return;
    memoriser(); rendrePlanetaire();
  });
  vueP.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var pl = etat.planetaire, tr = b.closest('tr'), a = b.dataset.paction || b.dataset.action || b.id;
    if (actionCamp(b)) { /* carte de la flotte */ }
    else if (a === 'ajoutProprio') pl.proprios.push(proprioDefaut('Commandant'));
    else if (a === 'supprProprio') {
      var k = +tr.dataset.proprio;
      pl.proprios.splice(k, 1);
      pl.planetes.forEach(function (p) { if (+p.proprio === k) p.proprio = 0; else if (+p.proprio > k) p.proprio = +p.proprio - 1; });
    }
    else if (a === 'ajoutPlanete') { var dp = pl.planetes[pl.planetes.length - 1]; pl.planetes.push({ nom: 'Planète ' + (pl.planetes.length + 1), proprio: dp ? dp.proprio : 0, population: 100, stabilite: 100, milice: '', batiments: [] }); }
    else if (a === 'supprPlanete') { pl.planetes.splice(+tr.dataset.planete, 1); if (+pl.cible >= pl.planetes.length) pl.cible = 0; }
    else if (a === 'ajoutBat') pl.planetes[+tr.dataset.planete].batiments.push({ code: 'battlaI', nombre: 1 });
    else if (a === 'supprBat') pl.planetes[+tr.dataset.planete].batiments.splice(+b.closest('[data-bat]').dataset.bat, 1);
    else if (a === 'pSysImporter') importerSysteme(reg.systemes.liste[+$('#pSysListe').value]);
    else if (a === 'pConnuImporter') { var ec = (reg.systemesConnus || {})[$('#pConnuListe').value]; if (ec) { pl.connuChoisi = ec.pos; importerConnu(ec); } }
    else if (a === 'pAttImporter') { var s = reg.attaquesPlanetes[$('#pAttListe').value]; if (s) importerAttaque(s); }
    else if (a === 'pReelOublier') pl.reel = null;
    else if (a === 'pReinit') { if (!confirm('Revenir à l\'exemple de départ ?')) return; etat.planetaire = planetaireDefaut(); }
    else if (a === 'pUnique') { lancerUniqueP(); return; }
    else if (a === 'pStats') { lancerStatsP(); return; }
    else if (a === 'pStop') { if (calcul) calcul.arreter = true; return; }
    else return;
    memoriser(); rendrePlanetaire();
  });

  // Combat unique
  function lancerUniqueP() {
    var c = configPlanetaire();
    if (c.erreurs.length) { message('err', 'Impossible de simuler : ' + c.erreurs.map(esc).join(', ') + '.'); return; }
    var pl = etat.planetaire;
    var g = pl.graine ? (parseInt(pl.graine, 10) >>> 0) : ((Math.random() * 4294967295) >>> 0);
    var res = M.combattrePlanetes(c.cfg, g, { trace: true, catalogue: CAT });
    rendreUniqueP(res, c.cfg);
  }
  function attaqueReelle() {
    var pl = etat.planetaire;
    return pl.reel && reg.attaquesPlanetes ? reg.attaquesPlanetes[pl.reel.cle] || null : null;
  }
  function htmlVaisseauxRestants(depart, fin, libelle) {
    return Object.keys(depart).map(function (t) {
      var d = depart[t][0], f = fin[t] ? fin[t][0] : 0;
      return '<div class="vr-ligne"><span class="vr-nom" title="' + esc(t) + '">' + esc(t) + '</span><span class="vr-barre">' +
        (f ? '<span class="vr-vivant" style="width:' + (100 * f / d) + '%;background:var(--camp0)"></span>' : '') +
        (d - f ? '<span class="vr-perdu" style="width:' + (100 * (d - f) / d) + '%"></span>' : '') +
        '</span><span class="vr-val">' + fmt(f, libelle ? 1 : 0) + ' / ' + d + '</span></div>';
    }).join('');
  }
  function rendreUniqueP(res, cfg) {
    var el = $('#pCarteUnique'); el.hidden = false; $('#pCarteStats').hidden = true;
    var reel = attaqueReelle(), nomProprio = function (k) { return (cfg.proprios[k] || {}).nom || ''; };
    var perdus = res.nbDepart - res.nbFin;
    var html = '<h2>Combat unique <span class="muted" style="font-weight:400;font-size:13px">(graine ' + res.graine + ', ' + esc(M.DIRECTIVES[res.directive]) + ')</span></h2>' +
      '<div class="tuiles"><div class="tuile"><div class="v">' + res.prises + ' / ' + res.ciblesPossibles + '</div><div class="l">planètes ' + (res.directive === 4 || res.directive === 6 ? 'pillées' : res.directive === 7 ? 'éradiquées' : 'prises') + '</div></div>' +
      '<div class="tuile"><div class="v">' + res.tours + '</div><div class="l">tours de combat utilisés</div></div>' +
      '<div class="tuile"><div class="v" style="font-size:16px;padding:4px 0">' + esc(ARRETS[res.arret || 'aucun']) + '</div><div class="l">fin de l\'attaque</div></div>' +
      '<div class="tuile"><div class="v">' + perdus + '</div><div class="l">vaisseau(x) perdu(s) sur ' + res.nbDepart + '</div></div>' +
      '<div class="tuile"><div class="v">' + fmt(res.puissanceFin) + '</div><div class="l">puissance restante (sur ' + fmt(res.puissanceDepart) + ')</div></div></div>';
    html += '<div class="grid2"><div><h3>Vaisseaux restants</h3>' + htmlVaisseauxRestants(res.depart, res.survivants) +
      (res.collisions && res.collisions.dommages > 0 ? '<div class="muted" style="font-size:12px">Collisions internes de fin de tour : ' + (res.collisions.nbDetruits ? '<b>' + res.collisions.nbDetruits + ' vaisseau(x) perdu(s)</b>, ' + res.nbApresCollisions + ' restent' : 'aucune perte') + '.</div>' : '') + '</div><div></div></div>';
    // planètes dans l'ordre de l'attaque
    var attaquees = {};
    res.planetes.forEach(function (p) { attaquees[p.index] = p; });
    var lignes = res.planetes.map(function (p, k) {
      var nd = 0, nf = 0;
      Object.keys(p.batimentsDepart).forEach(function (c) { nd += p.batimentsDepart[c][0]; });
      Object.keys(p.batimentsFin).forEach(function (c) { nf += p.batimentsFin[c][0]; });
      var pd = 0, pf = 0;
      Object.keys(p.vaisseauxDepart).forEach(function (t) { pd += p.vaisseauxDepart[t][0]; });
      Object.keys(p.vaisseauxFin).forEach(function (t) { pf += p.vaisseauxFin[t][0]; });
      var rc = reel && reel.combats[p.index], rfin = rc ? rc.tours[rc.tours.length - 1] : null;
      var etatP = p.arret === 'puissance' ? '<span class="camp1">non attaquée : puissance sous 50</span>' : p.prise ? '<b class="camp0">' + esc(p.resultat) + '</b>' : '<span class="camp1">tient</span>' + (p.arret ? ' (' + esc(ARRETS[p.arret]) + ')' : '');
      return '<tr><td class="n">' + (k + 1) + '</td><td>' + esc(p.nom) + '</td><td>' + esc(nomProprio(p.proprio)) + '</td>' +
        '<td class="n">' + (p.tables.length ? (p.tourDebut + 1) + (p.tourFin > p.tourDebut + 1 ? '–' + p.tourFin : '') : '–') + '</td>' +
        '<td class="n">' + fmt(p.miliceDepart) + ' → <b>' + fmt(p.miliceFin) + '</b></td>' +
        (reel ? '<td class="n">' + (rfin ? fmt(rfin.milice) + (rfin.milice === 0 ? ' (prise)' : '') : '–') + '</td>' : '') +
        '<td class="n">' + (nd ? (nd - nf) + ' / ' + nd : '–') + '</td><td class="n">' + fmt(p.populationPerdue || 0) + '</td>' +
        '<td class="n">' + (pd - pf ? '<span class="camp1">' + (pd - pf) + '</span>' : '0') + '</td><td>' + etatP + '</td></tr>';
    }).join('');
    var restes = cfg.planetes.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return !attaquees[x.i] && !(cfg.proprios[x.p.proprio] || {}).protege; });
    html += '<h3>Planètes, dans l\'ordre de l\'attaque</h3><div class="tablewrap"><table><thead><tr><th class="n">#</th><th>Planète</th><th>Propriétaire</th><th class="n" title="Tours de combat (numérotés à la suite sur tout le système)">Tours</th><th class="n">Milice</th>' +
      (reel ? '<th class="n">Milice réelle</th>' : '') + '<th class="n">Bâtiments détruits</th><th class="n" title="Population perdue : la milice tuée, au plus 10 % de la population">Population perdue</th><th class="n">Vaisseaux perdus</th><th>Résultat</th></tr></thead><tbody>' + lignes + '</tbody></table></div>' +
      (restes.length ? '<div class="muted" style="font-size:12px;margin-top:4px">Non attaquées : ' + restes.map(function (x) { return esc(x.p.nom); }).join(', ') + ' (' + esc(ARRETS[res.arret || 'aucun']) + ').</div>' : '');
    // tableaux de chaque tour
    html += '<details style="margin-top:10px"><summary>Tableaux de chaque tour (comme le rapport du jeu)</summary>' + res.planetes.filter(function (p) { return p.tables.length; }).map(function (p) {
      return '<h3>' + esc(p.nom) + ' — combativité ' + p.combativite + '</h3>' + p.tables.map(function (t) {
        return '<div style="margin:4px 0 10px"><b>Tour ' + t.tour + '</b> <span class="muted" style="font-size:12px">(' + t.strato + ' en stratosphère, ' + t.sol + ' en air-sol' + (t.degatsBatteries ? ', batteries ' + t.degatsBatteries + ' dégâts' : '') + (t.degatsMilice ? ', milice ' + t.degatsMilice + ' dégâts' : '') + ')</span>' +
          '<div class="grid2"><div class="tablewrap"><table><thead><tr><th>Vaisseau</th><th class="n">Nombre</th><th class="n">Dommages encaissés</th><th class="n">Dommages infligés</th></tr></thead><tbody>' +
          t.flotte.map(function (l) { return '<tr><td>' + esc(l.type) + '</td><td class="n">' + l.nombre + (l.variation ? ' <span class="camp1">(' + l.variation + ')</span>' : '') + '</td><td class="n">' + l.encaisses + (l.variationEncaisses ? ' <span class="muted">(+' + l.variationEncaisses + ')</span>' : '') + '</td><td class="n">' + l.infliges + '</td></tr>'; }).join('') +
          '</tbody></table></div><div class="tablewrap"><table><thead><tr><th>Planète</th><th class="n">Nombre</th><th class="n">Dommages</th></tr></thead><tbody>' +
          '<tr><td>Milice</td><td class="n">' + fmt(t.milice) + (t.milice !== t.miliceAvant ? ' <span class="camp1">(' + (t.milice - t.miliceAvant) + ')</span>' : '') + '</td><td></td></tr>' +
          t.batiments.map(function (l) { return '<tr><td>' + esc(l.nom) + '</td><td class="n">' + l.nombre + (l.variation ? ' <span class="camp1">(' + l.variation + ')</span>' : '') + '</td><td class="n">' + l.encaisses + (l.variationEncaisses ? ' <span class="muted">(+' + l.variationEncaisses + ')</span>' : '') + '</td></tr>'; }).join('') +
          '</tbody></table></div></div></div>';
      }).join('');
    }).join('') + '</details>';
    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Statistiques
  function occupeP(oui) {
    ['#pStats', '#pUnique'].forEach(function (s) { var b = $(s); if (b) b.disabled = oui; });
    $('#pStop').disabled = !oui; $('#pBarre').hidden = !oui;
  }
  function lancerStatsP() {
    var c = configPlanetaire();
    if (c.erreurs.length) { message('err', 'Impossible de simuler : ' + c.erreurs.map(esc).join(', ') + '.'); return; }
    var n = Math.max(1, +$('#pN').value || 1000), ctl = { arreter: false }, resultats = [], graine = (Math.random() * 4294967295) >>> 0, t0 = performance.now();
    calcul = ctl;
    $('#pCarteUnique').hidden = true;
    occupeP(true);
    (function tranche() {
      var t1 = performance.now();
      while (resultats.length < n && performance.now() - t1 < 40 && !ctl.arreter) {
        var r = M.combattrePlanetes(c.cfg, (graine + resultats.length * 2654435761) >>> 0, { catalogue: CAT });
        r.planetes.forEach(function (p) { delete p.tables; });
        resultats.push(r);
      }
      $('#pBarre > div').style.width = (100 * resultats.length / n) + '%';
      $('#pProgres').textContent = fmt(resultats.length) + ' / ' + fmt(n) + ' combats';
      if (resultats.length < n && !ctl.arreter) { setTimeout(tranche, 0); return; }
      occupeP(false);
      $('#pProgres').textContent = fmt(resultats.length) + ' combats en ' + fmt((performance.now() - t0) / 1000, 1) + ' s' + (ctl.arreter && resultats.length < n ? ' (arrêté)' : '') + '.';
      if (resultats.length) rendreStatsP(M.agregerPlanetes(resultats), resultats, c.cfg);
    })();
  }
  function rendreStatsP(a, resultats, cfg) {
    var el = $('#pCarteStats'); el.hidden = false;
    var reel = attaqueReelle(), nbCibles = resultats[0].ciblesPossibles;
    var verbe = cfg.directive === 4 || cfg.directive === 6 ? 'pillées' : cfg.directive === 7 ? 'éradiquées' : 'prises';
    var toutes = (a.prises[nbCibles] || 0) / a.n;
    var html = '<h2>Statistiques sur ' + fmt(a.n) + ' attaques</h2><div class="tuiles">' +
      '<div class="tuile"><div class="v">' + fmt(a.nbPrises.moyenne, 1) + '</div><div class="l">planètes ' + verbe + ' en moyenne (sur ' + nbCibles + ')</div></div>' +
      '<div class="tuile"><div class="v">' + pct(toutes) + '</div><div class="l">toutes ' + verbe + '</div></div>' +
      Object.keys(a.arrets).sort(function (x, y) { return a.arrets[y] - a.arrets[x]; }).map(function (k) {
        return '<div class="tuile"><div class="v">' + pct(a.arrets[k] / a.n) + '</div><div class="l">' + esc(ARRETS[k] || k) + '</div></div>';
      }).join('') + '</div>';
    var p0 = cfg.flotte.vaisseaux.reduce(function (t, v) { return t + v.nombre * v.plan.stats.puissance; }, 0);
    var survMoy = {};
    Object.keys(a.types).forEach(function (t) { survMoy[t] = [a.types[t].depart - a.types[t].moyenne]; });
    var dep = {};
    Object.keys(a.types).forEach(function (t) { dep[t] = [a.types[t].depart]; });
    html += '<div class="grid2"><div><h3>Vaisseaux restants (moyenne)</h3>' + htmlVaisseauxRestants(dep, survMoy, true) +
      '<div class="resume"><span>puissance restante <b>' + fmt(a.puissanceFin.moyenne) + '</b> sur ' + fmt(p0) + '</span><span>vaisseaux restants <b>' + fmt(a.survivants.moyenne, 1) + '</b> (' + fmt(a.survivants.q10) + ' à ' + fmt(a.survivants.q90) + ')</span>' +
      (a.collisions.q90 > 0 ? '<span>puis perdus en collisions de fin de tour <b>' + fmt(a.collisions.moyenne, 1) + '</b></span>' : '') + '</div></div>';
    // histogramme du nombre de planètes prises
    var W = 420, H = 130, bw = Math.min(48, (W - 40) / (nbCibles + 1)), maxN = 0;
    for (var k = 0; k <= nbCibles; k++) maxN = Math.max(maxN, a.prises[k] || 0);
    html += '<div><h3>Nombre de planètes ' + verbe + '</h3><svg viewBox="0 0 ' + W + ' ' + (H + 24) + '" width="100%" style="max-width:460px" aria-label="Répartition du nombre de planètes ' + verbe + '"><line x1="30" y1="' + H + '" x2="' + W + '" y2="' + H + '" stroke="var(--border)"/>';
    for (k = 0; k <= nbCibles; k++) {
      var v = a.prises[k] || 0, hh = maxN ? (v / maxN) * (H - 16) : 0, x = 34 + k * bw;
      if (hh > 0) html += '<path d="M' + (x + 1) + ',' + H + 'V' + (H - hh + 4) + 'q0,-4 4,-4h' + Math.max(0, bw - 10) + 'q4,0 4,4V' + H + 'z" fill="var(--accent)" data-tip="' + k + ' planète(s) : ' + pct(v / a.n) + ' (' + fmt(v) + ')"></path>';
      html += '<text x="' + (x + bw / 2) + '" y="' + (H + 15) + '" text-anchor="middle">' + k + '</text>';
    }
    html += '</svg></div></div>';
    // planètes
    html += '<h3>Par planète</h3><div class="tablewrap"><table><thead><tr><th>Planète</th><th>Propriétaire</th><th class="n">Milice de départ</th><th class="n">Attaquée</th><th class="n">' + verbe.charAt(0).toUpperCase() + verbe.slice(1) + '</th><th class="n" title="Quand elle est attaquée : moyenne, 10 % et 90 %">Milice restante</th><th class="n">Bâtiments détruits</th><th class="n">Population perdue</th>' + (reel ? '<th class="n">Réel</th>' : '') + '</tr></thead><tbody>' +
      cfg.planetes.map(function (p, i) {
        var pr = cfg.proprios[p.proprio] || {}, s = a.planetes[i];
        var rc = reel && reel.combats[i], rfin = rc ? rc.tours[rc.tours.length - 1] : null;
        var verdict = '';
        if (rfin && s) {
          var tri = resultats.map(function (r) { var x = r.planetes.filter(function (y) { return y.index === i; })[0]; return x ? x.miliceFin : M.miliceDeDepart(p, pr); }).sort(function (x, y) { return x - y; });
          var lo = tri[Math.floor(0.05 * tri.length)], hi = tri[Math.min(tri.length - 1, Math.floor(0.95 * tri.length))];
          verdict = fmt(rfin.milice) + (rfin.milice === 0 ? ' (prise)' : '') + ' ' + (rfin.milice >= lo && rfin.milice <= hi ? '<span class="pastille" style="color:var(--ok)">dans la fourchette</span>' : '<span class="pastille manque">hors fourchette ' + fmt(lo) + '–' + fmt(hi) + '</span>');
        }
        if (pr.protege) return '<tr style="opacity:.55"><td>' + esc(p.nom) + '</td><td>' + esc(pr.nom) + '</td><td colspan="' + (reel ? 7 : 6) + '" class="muted">protégée</td></tr>';
        return '<tr><td>' + esc(p.nom) + '</td><td>' + esc(pr.nom) + '</td><td class="n">' + fmt(M.miliceDeDepart(p, pr)) + '</td>' +
          '<td class="n">' + (s ? pct(s.pAttaquee) : '0 %') + '</td><td class="n"><b>' + (s ? pct(s.pPrise) : '0 %') + '</b></td>' +
          '<td class="n">' + (s ? fmt(s.miliceFin.moyenne) + ' <span class="muted">(' + fmt(s.miliceFin.q10) + '–' + fmt(s.miliceFin.q90) + ')</span>' : '–') + '</td>' +
          '<td class="n">' + (s ? fmt(s.batimentsDetruits, 1) : '–') + '</td><td class="n">' + (s ? fmt(s.populationPerdue.moyenne) : '–') + '</td>' + (reel ? '<td class="n">' + verdict + '</td>' : '') + '</tr>';
      }).join('') + '</tbody></table></div>';
    // pertes par type
    html += '<h3>Pertes de la flotte</h3><div class="tablewrap"><table><thead><tr><th>Type</th><th class="n">Départ</th><th class="n">Pertes moyennes</th><th class="n" title="10 % des attaques font moins de pertes, 10 % en font plus">Pertes 10 % · médiane · 90 %</th><th class="n">Tous perdus</th>' + (reel ? '<th class="n">Restants réels</th>' : '') + '</tr></thead><tbody>' +
      Object.keys(a.types).map(function (t) {
        var x = a.types[t], rv = '';
        if (reel) {
          var dern = reel.combats[reel.combats.length - 1], dt = dern.tours[dern.tours.length - 1];
          var nr = (dt.vaisseaux.filter(function (v) { return v.nom === t; })[0] || { nombre: 0 }).nombre;
          var tri = resultats.map(function (r) { return (r.survivants[t] || [0])[0]; }).sort(function (u, w) { return u - w; });
          var lo = tri[Math.floor(0.05 * tri.length)], hi = tri[Math.min(tri.length - 1, Math.floor(0.95 * tri.length))];
          rv = nr + ' ' + (nr >= lo && nr <= hi ? '<span class="pastille" style="color:var(--ok)">dans la fourchette</span>' : '<span class="pastille manque">simulé ' + lo + '–' + hi + '</span>');
        }
        return '<tr><td>' + esc(t) + '</td><td class="n">' + x.depart + '</td><td class="n">' + fmt(x.moyenne, 2) + '</td><td class="n">' + fmt(x.q10) + ' · ' + fmt(x.q50) + ' · ' + fmt(x.q90) + '</td><td class="n">' + pct(x.toutPerdu) + '</td>' + (reel ? '<td class="n">' + rv + '</td>' : '') + '</tr>';
      }).join('') + '</tbody></table></div>';
    if (reel) {
      var reelPrises = reel.combats.filter(function (c) { return c.tours[c.tours.length - 1].milice === 0; }).length;
      html += '<div class="msg ' + ((a.prises[reelPrises] || 0) / a.n >= 0.05 ? 'ok' : 'warn') + '">Réel : <b>' + reelPrises + '</b> planète(s) prise(s) en ' + reel.fin + ' tours ; ce nombre sort dans <b>' + pct((a.prises[reelPrises] || 0) / a.n) + '</b> des simulations.</div>';
    }
    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  // ------------------------------------------------------------------ mines et débris
  // Dégâts subis en début de tour par une flotte restée sur une case à débris ou à mines (M.simulerMines).
  var ROMAINS10 = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
  function minesDefaut() {
    var f = campDefaut('Ma flotte', 'Fregate standard', 20);
    return { flotte: f, debris: 0, mines: 50000, tours: 1, collisionsInternes: false, n: 1000, graine: '',
      calcLanceur: 0, calcNb: 10, calcTours: 1, calcCombat: 1000 };
  }
  if (!etat.mines) etat.mines = minesDefaut();
  function vaisseauxMines() {
    var vs = [], err = [];
    etat.mines.flotte.lignes.forEach(function (l) {
      if (!(+l.nombre > 0)) return;
      var p = planCompile(l.plan);
      if (!p) { err.push(l.plan); return; }
      vs.push({ plan: p, nombre: +l.nombre, moral: +l.moral, experience: +l.experience, race: +l.race, dommages: +l.dommages || 0 });
    });
    return { vaisseaux: vs, erreurs: err };
  }
  function infoProtection() {
    var vs = vaisseauxMines().vaisseaux, dragage = 0, lignes = [];
    vs.forEach(function (v) {
      var drag = 0, nbDrag = 0, det = 0;
      v.plan.composants.forEach(function (c) {
        if (c.caracs && c.caracs.dragueur) { drag += c.caracs.dragueur; nbDrag++; }
        if (c.caracs && c.caracs.detectionMines) det += c.caracs.detectionMines;
      });
      dragage += drag * v.nombre;
      var immunise = nbDrag >= Math.trunc(v.plan.composants.length / 2);
      lignes.push({ nom: v.plan.nom, nombre: v.nombre, drag: drag, det: det, immunise: immunise, unSeul: immunise && !nbDrag });
    });
    return { dragage: dragage, lignes: lignes };
  }
  function rendreMines() {
    var v = $('#vue-mines'); if (!v) return;
    if (!$('#mConfig', v)) {
      v.innerHTML = '<div id="mConfig"></div>' +
        '<div class="card"><div class="ligne"><label>Graine <input id="mGraine" placeholder="au hasard" style="width:110px"></label>' +
        '<button class="go" id="mUnique">▶ Un tirage</button><span style="width:20px"></span>' +
        '<label>Nombre de tirages <input type="number" id="mN" min="10" step="100"></label>' +
        '<button class="go" id="mStats">📊 Statistiques</button><button class="sec" id="mStop" disabled>■ Arrêter</button></div>' +
        '<div class="barre" id="mBarre" hidden><div></div></div><div class="muted" id="mProgres"></div></div>' +
        '<div class="card" id="mCarteUnique" hidden></div><div class="card" id="mCarteStats" hidden></div>';
    }
    var m = etat.mines;
    $('#mGraine').value = m.graine || ''; $('#mN').value = m.n || 1000;
    var lanceur = CAT.composants['lmine' + ROMAINS10[+m.calcLanceur || 0]];
    var html = '<div class="card"><h2>Champ de mines et de débris</h2>' +
      '<div class="ligne"><label title="Débris laissés par les combats de flottes (DEBRIS_RESTE_VAISSEAUX)">Débris de vaisseaux <input type="number" min="0" step="100" data-mchamp="debris" value="' + esc(m.debris) + '" style="width:110px"></label>' +
      '<label title="Mines anti-matière posées par des lanceurs (DEBRIS_MINES_CLASSIQUES)">Mines <input type="number" min="0" step="1000" data-mchamp="mines" value="' + esc(m.mines) + '" style="width:110px"></label>' +
      '<label title="Nombre de tours où la flotte reste sur la case (le champ n\'est réduit que par le dragage)">Tours sur la case <input type="number" min="1" max="50" class="court" data-mchamp="tours" value="' + esc(m.tours) + '"></label>' +
      '<label><input type="checkbox" data-mchamp="collisionsInternes"' + (m.collisionsInternes ? ' checked' : '') + '> ajouter les collisions internes de fin de tour</label></div>' +
      '<div class="ligne" style="font-size:13px"><span class="muted">Ajouter au champ :</span>' +
      '<span><select data-mchamp="calcLanceur">' + ROMAINS10.map(function (r, k) { var c = CAT.composants['lmine' + r]; return '<option value="' + k + '"' + (k === (+m.calcLanceur || 0) ? ' selected' : '') + '>' + esc(c.nom) + ' (' + fmt(c.caracs.mines) + ' mines)</option>'; }).join('') + '</select>' +
      ' × <input type="number" min="1" class="court" data-mchamp="calcNb" value="' + esc(m.calcNb) + '"> lanceurs × <input type="number" min="1" class="court" data-mchamp="calcTours" value="' + esc(m.calcTours) + '"> ordres = <b>' + fmt(lanceur.caracs.mines * (+m.calcNb || 0) * (+m.calcTours || 0)) + '</b> mines ' +
      '<button class="mini" id="mAjoutMines">+ ajouter</button></span>' +
      '<span>débris d\'un combat de <input type="number" min="0" step="100" data-mchamp="calcCombat" value="' + esc(m.calcCombat) + '" style="width:80px"> points de dégâts <button class="mini" id="mAjoutDebris">+ ajouter</button></span></div>' +
      '<div class="muted" style="font-size:12px">Les champs s\'additionnent et ne disparaissent jamais d\'eux-mêmes : seul le dragage les réduit. Un combat de flottes n\'en laisse que si ses dégâts dépassent 200 au total. Les mines touchent tout le monde, y compris celui qui les a posées. Le jeu annonce « Évaluation du danger : N » (le risque devient important à partir de 500, selon le jeu).</div>' +
      htmlAideDebris(m) + '</div>';
    html += rendreCamp('m');
    var pr = infoProtection();
    html += '<div class="card"><h3 style="margin-top:0">Protection de la flotte</h3>' +
      '<div>Capacité de dragage : <b>' + fmt(pr.dragage) + '</b> par tour' + (pr.dragage ? ' (retirée d\'abord des débris de vaisseaux, puis des mines ; le moteur ne la décompte pas, elle s\'applique en entier aux deux)' : ' — aucun dragueur de mines') + '.</div>' +
      '<div class="tablewrap"><table style="margin-top:6px"><thead><tr><th>Plan</th><th class="n">Nombre</th><th class="n">Dragage</th><th class="n">Détection</th><th>Protégé ?</th></tr></thead><tbody>' +
      pr.lignes.map(function (l) {
        return '<tr><td>' + esc(l.nom) + '</td><td class="n">' + fmt(l.nombre) + '</td><td class="n">' + (l.drag ? fmt(l.drag) + ' × ' + fmt(l.nombre) : '') + '</td><td class="n">' + (l.det ? Math.min(100, l.det) + ' %' : '') + '</td>' +
          '<td>' + (l.unSeul ? '<b>oui</b> : un seul composant (bizarrerie du moteur : dragueurs ≥ composants / 2 arrondi vers le bas)' : l.immunise ? '<b>oui</b> : au moins la moitié de ses composants sont des dragueurs' : l.det ? 'esquive ' + Math.min(100, l.det) + ' % des collisions (détecteur)' : 'non') + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="muted" style="font-size:12px">Dragueurs : I à X = 1, 2, 4, 8, 16, 40, 80, 160, 320, 650 par tour. Détecteurs : 10 % par niveau, additionnés sur le vaisseau. Un dragueur endommagé ne drague plus.</div></div>';
    $('#mConfig').innerHTML = html;
  }
  // Dégât moyen par vaisseau et par tour selon la taille, pour le champ saisi
  function htmlAideDebris(m) {
    var champs = [];
    if (+m.debris > 0) champs.push(['débris', +m.debris]);
    if (+m.mines > 0) champs.push(['mines', +m.mines]);
    if (!champs.length) return '';
    var tailles = [0, 1, 2, 3, 4, 5, 6, 8];
    return '<div class="tablewrap" style="margin-top:8px"><table><thead><tr><th>Dégât par vaisseau exposé, par tour (avant dragage)</th>' + tailles.map(function (t) { return '<th class="n">taille ' + (t + 1) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      champs.map(function (c) {
        return '<tr><td>' + fmt(c[1]) + ' ' + c[0] + ' : moyenne · part sans dégât</td>' + tailles.map(function (t) {
          var d = M.distributionDegatDebris(c[1], t);
          return '<td class="n">' + fmt(d.moyenne, d.moyenne < 10 ? 2 : 0) + ' · ' + fmt(100 * d.pZero, 0) + ' %</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>' +
      '<div class="muted" style="font-size:12px">Formule (Flotte.gererCollision) : aléa(max(1, (Q / (aléa(500) + 1)) / (11 − taille))) / 10, tirée à chaque tour pour chaque vaisseau exposé. Un vaisseau est détruit quand tous ses composants sont hors d\'usage (autant de points que de cases).</div>';
  }
  var vueM = $('#vue-mines');
  vueM.addEventListener('change', function (e) {
    var m = etat.mines;
    if (changementCamp(e)) { memoriser(); rendreMines(); return; }
    var t = e.target;
    if (t.id === 'mGraine') { m.graine = t.value.trim(); memoriser(); return; }
    if (t.id === 'mN') { m.n = Math.max(1, +t.value || 1000); memoriser(); return; }
    if (t.dataset.mchamp) {
      var k = t.dataset.mchamp;
      m[k] = t.type === 'checkbox' ? t.checked : Math.max(0, +t.value || 0);
      if (k === 'tours') m.tours = Math.max(1, Math.min(50, m.tours));
      memoriser(); rendreMines();
    }
  });
  vueM.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var m = etat.mines;
    if (actionCamp(b)) { memoriser(); rendreMines(); return; }
    if (b.id === 'mAjoutMines') { m.mines = (+m.mines || 0) + CAT.composants['lmine' + ROMAINS10[+m.calcLanceur || 0]].caracs.mines * (+m.calcNb || 0) * (+m.calcTours || 0); }
    else if (b.id === 'mAjoutDebris') { if (+m.calcCombat > 200) m.debris = (+m.debris || 0) + (+m.calcCombat); else { message('warn', 'Un combat de 200 points de dégâts ou moins ne laisse pas de débris.'); return; } }
    else if (b.id === 'mUnique') { minesUnique(); return; }
    else if (b.id === 'mStats') { minesStats(); return; }
    else if (b.id === 'mStop') { if (calculM) calculM.arreter = true; return; }
    else return;
    memoriser(); rendreMines();
  });
  function configMines() {
    var m = etat.mines, v = vaisseauxMines();
    if (!v.vaisseaux.length) v.erreurs.push('flotte vide');
    return { cfg: { vaisseaux: v.vaisseaux, debris: +m.debris || 0, mines: +m.mines || 0, tours: +m.tours || 1,
      collisionsInternes: !!m.collisionsInternes, militaire: +m.flotte.militaire || 0 }, erreurs: v.erreurs };
  }
  // Barres « restant / perdu » (vaisseaux et puissance), avec le pourcentage de pertes, comme après un combat
  function htmlBarresPertes(nbDep, nbFin, pDep, pFin, dec) {
    function ligne(nom, dep, fin) {
      var pv = dep ? Math.max(0, Math.min(100, 100 * fin / dep)) : 0;
      return '<div class="vr-ligne"><span class="vr-nom camp0">' + nom + '</span><span class="vr-barre">' +
        (pv > 0 ? '<span class="vr-vivant" style="width:' + pv + '%;background:var(--camp0)"></span>' : '') +
        (pv < 100 ? '<span class="vr-perdu" style="width:' + (100 - pv) + '%"></span>' : '') +
        '</span><span class="vr-val">' + fmt(fin, dec) + ' / ' + fmt(dep) + ' <b' + (pv < 100 ? ' style="color:var(--err)"' : '') + '>−' + fmt(100 - pv, 0) + ' %</b></span></div>';
    }
    return '<div style="margin:8px 0 12px">' + ligne('Vaisseaux', nbDep, nbFin) + ligne('Puissance', pDep, pFin) + '</div>';
  }
  function minesUnique() {
    var c = configMines();
    if (c.erreurs.length) { message('err', 'Impossible de simuler : ' + c.erreurs.map(esc).join(', ') + '.'); return; }
    var m = etat.mines, g = m.graine ? (parseInt(m.graine, 10) >>> 0) : ((Math.random() * 4294967295) >>> 0);
    var r = M.simulerMines(c.cfg, g), el = $('#mCarteUnique');
    el.hidden = false; $('#mCarteStats').hidden = true;
    var parType = function (o) { var k = Object.keys(o); return k.length ? k.map(function (t) { return o[t] + ' ' + esc(t); }).join(', ') : '—'; };
    el.innerHTML = '<h2>Un tirage</h2><div>Graine <b>' + g + '</b> · ' + r.tours.length + ' tour(s) · ' +
      (r.flotteDetruite ? '<b style="color:var(--err)">flotte détruite</b>' : '<b>' + r.nbFin + '</b> vaisseaux sur ' + r.nbDepart + ' restent, puissance ' + fmt(r.puissanceFin) + ' / ' + fmt(r.puissanceDepart)) + '.</div>' +
      htmlBarresPertes(r.nbDepart, r.flotteDetruite ? 0 : r.nbFin, r.puissanceDepart, r.flotteDetruite ? 0 : r.puissanceFin, 0) +
      '<div class="tablewrap"><table style="margin-top:8px"><thead><tr><th>Tour</th><th class="n">Débris avant → après dragage</th><th class="n">Mines avant → après dragage</th><th class="n">Dragage</th><th class="n">Dégâts débris</th><th class="n">Dégâts mines</th>' +
      (c.cfg.collisionsInternes ? '<th class="n">Collisions internes</th>' : '') + '<th class="n">Vaisseaux touchés</th><th>Détruits</th><th class="n">Restants</th></tr></thead><tbody>' +
      r.tours.map(function (t, k) {
        return '<tr><td>' + (k + 1) + '</td><td class="n">' + fmt(t.champAvant.debris) + ' → ' + fmt(t.champApres.debris) + '</td><td class="n">' + fmt(t.champAvant.mines) + ' → ' + fmt(t.champApres.mines) + '</td>' +
          '<td class="n">' + fmt(t.dragage) + '</td><td class="n">' + fmt(t.degats.debris) + '</td><td class="n">' + fmt(t.degats.mines) + '</td>' +
          (c.cfg.collisionsInternes ? '<td class="n">' + fmt(t.interne) + '</td>' : '') + '<td class="n">' + fmt(t.touches) + '</td><td>' + parType(t.detruits) + '</td><td class="n">' + fmt(t.nbFin) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  var calculM = null;
  function minesStats() {
    var c = configMines();
    if (c.erreurs.length) { message('err', 'Impossible de simuler : ' + c.erreurs.map(esc).join(', ') + '.'); return; }
    var n = Math.max(1, +etat.mines.n || 1000), ctl = { arreter: false }, res = [], g0 = (Math.random() * 4294967295) >>> 0, t0 = performance.now();
    calculM = ctl;
    $('#mCarteUnique').hidden = true;
    $('#mStats').disabled = true; $('#mUnique').disabled = true; $('#mStop').disabled = false; $('#mBarre').hidden = false;
    (function tranche() {
      var d = performance.now();
      while (res.length < n && performance.now() - d < 40 && !ctl.arreter) res.push(M.simulerMines(c.cfg, (g0 + res.length * 2654435761) >>> 0));
      $('#mBarre > div').style.width = (100 * res.length / n) + '%';
      $('#mProgres').textContent = fmt(res.length) + ' / ' + fmt(n) + ' tirages';
      if (res.length < n && !ctl.arreter) { setTimeout(tranche, 0); return; }
      $('#mStats').disabled = false; $('#mUnique').disabled = false; $('#mStop').disabled = true; $('#mBarre').hidden = true;
      $('#mProgres').textContent = fmt(res.length) + ' tirages en ' + fmt((performance.now() - t0) / 1000, 1) + ' s' + (ctl.arreter && res.length < n ? ' (arrêté)' : '') + '.';
      if (res.length) rendreStatsMines(M.agregerMines(res, c.cfg.tours), c.cfg);
    })();
  }
  function rendreStatsMines(a, cfg) {
    var el = $('#mCarteStats'); el.hidden = false;
    var dernier = a.tours[a.tours.length - 1];
    var html = '<h2>Statistiques sur ' + fmt(a.n) + ' tirages, ' + cfg.tours + ' tour(s)</h2>' +
      '<div class="tuiles"><div class="tuile"><div class="v">' + fmt(dernier.perdusCumul.moyenne, 1) + '</div><div class="l">vaisseaux perdus en moyenne (' + fmt(dernier.perdusCumul.q10) + ' à ' + fmt(dernier.perdusCumul.q90) + ') sur ' + fmt(a.nbDepart) + '</div></div>' +
      '<div class="tuile"><div class="v">' + pct(a.detruite) + '</div><div class="l">flotte entièrement détruite</div></div>' +
      '<div class="tuile"><div class="v">' + fmt(a.puissanceFin.moyenne) + '</div><div class="l">puissance restante moyenne, sur ' + fmt(a.puissanceDepart) + '</div></div></div>' +
      htmlBarresPertes(a.nbDepart, a.nbDepart - dernier.perdusCumul.moyenne, a.puissanceDepart, a.puissanceFin.moyenne, 1) +
      '<h3>Tour par tour (moyennes)</h3><div class="tablewrap"><table><thead><tr><th>Tour</th><th class="n">Débris après dragage</th><th class="n">Mines après dragage</th><th class="n">Dragage</th><th class="n">Dégâts</th>' +
      (cfg.collisionsInternes ? '<th class="n">Collisions internes</th>' : '') + '<th class="n">Perdus depuis le début (10 % · médiane · 90 %)</th></tr></thead><tbody>' +
      a.tours.map(function (t, k) {
        return '<tr><td>' + (k + 1) + '</td><td class="n">' + fmt(t.champApres.debris) + '</td><td class="n">' + fmt(t.champApres.mines) + '</td><td class="n">' + fmt(t.dragage) + '</td><td class="n">' + fmt(t.degats, 1) + '</td>' +
          (cfg.collisionsInternes ? '<td class="n">' + fmt(t.interne, 1) + '</td>' : '') +
          '<td class="n">' + fmt(t.perdusCumul.moyenne, 2) + ' (' + fmt(t.perdusCumul.q10) + ' · ' + fmt(t.perdusCumul.q50) + ' · ' + fmt(t.perdusCumul.q90) + ')</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<h3>Pertes par type, à la fin</h3><div class="tablewrap"><table><thead><tr><th>Type</th><th class="n">Départ</th><th class="n">Pertes moyennes</th><th class="n">10 % · 90 %</th><th class="n">Tous perdus</th></tr></thead><tbody>' +
      Object.keys(a.types).map(function (t) { var x = a.types[t]; return '<tr><td>' + esc(t) + '</td><td class="n">' + fmt(x.depart) + '</td><td class="n">' + fmt(x.moyenne, 2) + '</td><td class="n">' + fmt(x.q10) + ' · ' + fmt(x.q90) + '</td><td class="n">' + pct(x.toutPerdu) + '</td></tr>'; }).join('') +
      '</tbody></table></div>';
    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ------------------------------------------------------------------ démarrage
  function tout() { rendreFlottes(); rendreResultats(); rendrePlans(); rendrePlanetaire(); rendreMines(); }
  $('#version').textContent = M.VERSION;
  tout();
  try { var o = localStorage.getItem('sheril-combat:onglet'); if (o && o !== 'resultats') montrer(o); } catch (e) { }
})();
