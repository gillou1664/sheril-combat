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
            r.plans + ' plans' + (r.combats ? ', ' + r.combats + ' combats de flottes' : '') + (r.rencontres ? ', ' + r.rencontres + ' vaisseaux rencontrés à compléter' : '') + (r.scenarios ? ', ' + r.scenarios + ' scénarios' : '');
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
    var camp = etat.camps[i], as = 0, ap = 0, p = 0, n = 0, prix = 0, minerai = 0, pdc = 0, maxCombat = 0, err = [];
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

  function rendreCamp(i) {
    var c = etat.camps[i];
    var fl = reg.flottes && reg.flottes.liste ? reg.flottes.liste : [];
    var h = c.heros;
    var s = c.strategie;
    var types = {};
    c.lignes.forEach(function (l) { types[l.plan] = 1; });
    var html = '<div class="card" data-camp="' + i + '">' +
      '<div class="titreCamp"><span class="puce" style="background:var(--camp' + i + ')"></span><h2 style="margin:0">' + (i === 0 ? 'Attaquant' : 'Défenseur') + '</h2>' +
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
    html += '<details' + (s.agressivite !== 3 || s.typeCible !== 0 || Object.keys(s.positions || {}).length || Object.keys(s.cibles || {}).length ? ' open' : '') + '><summary>Stratégie : ' + AGRESSIVITE[s.agressivite] + ', cible ' + CIBLES[s.typeCible].toLowerCase() + '</summary>' +
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
    var t = e.target, carte = t.closest('[data-camp]');
    if (!carte) return;
    var c = etat.camps[+carte.dataset.camp], tr = t.closest('tr');
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
    memoriser();
    if (restructure) rendreFlottes(); else { majResumes(); }
  });
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
  function htmlBarresPuissance(dep, fin, etroit, moyenne) {
    var garde = [0, 1].map(function (i) { return dep[i] ? fmt(100 * fin[i] / dep[i], 0) + ' %' : '–'; });
    return '<div class="barresCout' + (etroit ? ' etroit' : '') + '">' +
      barreDuo('Puissance au départ', dep[0], dep[1], '', plusGros(dep[0], dep[1], 'a')) +
      barreDuo(moyenne ? 'Puissance restante (moyenne)' : 'Puissance restante', fin[0], fin[1], '',
        'part de sa puissance gardée : <b class="camp0">' + garde[0] + '</b> · <b class="camp1">' + garde[1] + '</b>') + '</div>';
  }
  vueF.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.egaliser != null) { egaliser(+b.dataset.egaliser, $('#egalRessource').value); memoriser(); rendreFlottes(); return; }
    var carte = b.closest('[data-camp]'), c = carte ? etat.camps[+carte.dataset.camp] : null;
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
    else if (a === 'reinit') { if (!confirm('Revenir aux flottes d\'exemple ?')) return; var g = etat; etat = etatDefaut(); etat.n = g.n; }
    else if (a === 'allerResultats') { montrer('resultats'); lancerUnique(); return; }
    else return;
    memoriser(); rendreFlottes();
  });


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
    anim = { res: res, tour: -1, t: 0, joue: true, vitesse: +($('#aVitesse') ? $('#aVitesse').value : 1), fini: false };
    $('#carteUnique').hidden = false;
    $('#aTour').innerHTML = '<option value="-1">Tour 0 (placement)</option>' + res.trace.tours.map(function (x, k) { return '<option value="' + k + '">Tour ' + (k + 1) + '</option>'; }).join('');
    var issue = res.vainqueur === 0 ? '<b class="camp0">victoire de l\'attaquant</b>' : res.vainqueur === 1 ? '<b class="camp1">victoire du défenseur</b>' : '<b>aucun vainqueur</b> (plus aucun vaisseau combatif)';
    $('#aResume').innerHTML = '<div>Graine <b>' + g + '</b> · ' + res.tours + ' tours · ' + issue + '</div>' +
      '<div style="margin:8px 0">' + htmlBarresPuissance(res.puissanceDepart, res.puissanceFin, true, false) + '</div>' +
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
  function majTour() { var s = $('#aTour'); if (s) s.value = anim.tour; majJournal(); }
  function majJournal() {
    if (!anim.res) return;
    if (anim.tour < 0) {
      $('#aJournal').innerHTML = '<b>Tour 0 : placement initial</b><br>' + [0, 1].map(function (i) {
        return '<span class="camp' + i + '">' + esc(etat.camps[i].nom) + '</span> : ' + anim.res.trace.vaisseaux[i].length + ' vaisseaux dans sa zone de départ (y ' + (i ? '20 à 29' : '0 à 9') + ', plus un écart aléatoire)';
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
    return [(cx - X0) / (X1 - X0) * w, h - (cy - Y0) / (Y1 - Y0) * h, cx !== x || cy !== y];
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

  // ------------------------------------------------------------------ démarrage
  function tout() { rendreFlottes(); rendreResultats(); rendrePlans(); }
  $('#version').textContent = M.VERSION;
  tout();
  try { var o = localStorage.getItem('sheril-combat:onglet'); if (o && o !== 'resultats') montrer(o); } catch (e) { }
})();
