// Lecture des fichiers du jeu et persistance du simulateur de combats.
(function (racine) {
  'use strict';
  var CLE = 'sheril-combat:v1';

  function registreVide() {
    return { version: 1, plans: {}, rencontres: {}, scenarios: {}, flottes: {}, flottesParTour: {}, combats: {}, brouillon: null };
  }

  function charger() {
    var r = registreVide();
    try {
      var t = localStorage.getItem(CLE);
      if (t) {
        var o = JSON.parse(t);
        Object.keys(r).forEach(function (k) { if (o[k] !== undefined) r[k] = o[k]; });
      }
    } catch (e) { /* stockage indisponible : on travaille en mémoire */ }
    return r;
  }
  function sauver(r) {
    try { localStorage.setItem(CLE, JSON.stringify(r)); return true; } catch (e) { return false; }
  }

  // ------------------------------------------------------------- XML
  function parseXml(texte) {
    var doc = new DOMParser().parseFromString(texte, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('XML illisible');
    return doc;
  }
  function enfants(el, nom) {
    var r = [];
    if (!el) return r;
    for (var n = el.firstElementChild; n; n = n.nextElementSibling) if (n.tagName === nom) r.push(n);
    return r;
  }
  function premier(el, nom) { return enfants(el, nom)[0] || null; }
  function lirePlanXml(p, origine, tour) {
    // Coût du jeu (royalties comprises) : centaures, minerai, pc
    var cout = p.hasAttribute('centaures') ? { centaures: parseFloat(p.getAttribute('centaures')), minerai: +p.getAttribute('minerai'), pdc: +p.getAttribute('pc') } : null;
    return {
      nom: p.getAttribute('nom'), marque: p.getAttribute('marque') || '', origine: origine,
      concepteur: p.getAttribute('concepteur'), tour: tour, cout: cout, royalties: +(p.getAttribute('royalties') || 0),
      composants: enfants(p, 'comp').map(function (c) { return { code: c.getAttribute('code'), nb: +c.getAttribute('nb') }; }),
    };
  }

  // rapport.xml : plans privés, nos flottes, héros, noms de vaisseaux vus en combat
  function lireRapport(texte) {
    var doc = parseXml(texte);
    var rap = doc.documentElement;
    var tour = +(rap.getAttribute('numTour') || 0);
    var cdt = premier(rap, 'commandant');
    if (!cdt) throw new Error('pas de <commandant> : ce n\'est pas un rapport.xml');
    var res = {
      type: 'rapport', tour: tour, commandant: { numero: cdt.getAttribute('numero'), nom: cdt.getAttribute('nom') },
      plans: [], flottes: [], rencontres: [],
    };
    enfants(premier(cdt, 'plans'), 'p').forEach(function (p) { res.plans.push(lirePlanXml(p, 'privé', tour)); });
    var heros = {};
    enfants(premier(cdt, 'lieutenants'), 'l').forEach(function (l) {
      if (l.getAttribute('type') !== '0') return;
      var comp = {};
      enfants(l, 'competence').forEach(function (c) { comp[c.getAttribute('comp')] = +c.getAttribute('val'); });
      heros[l.getAttribute('pos')] = {
        nom: l.getAttribute('nom'), att: +l.getAttribute('att'), def: +l.getAttribute('def'),
        mor: +l.getAttribute('mor'), vit: +l.getAttribute('vit'), race: +l.getAttribute('race'), competences: comp,
      };
    });
    enfants(premier(cdt, 'flottes'), 'f').forEach(function (f) {
      var num = f.getAttribute('num');
      var lignes = {};
      enfants(f, 'vaisseau').forEach(function (v) {
        var plan = v.getAttribute('plan') || v.getAttribute('type');
        var cle = plan + '|' + v.getAttribute('race');
        var l = lignes[cle] || (lignes[cle] = { plan: plan, nombre: 0, moral: 0, experience: 0, race: +v.getAttribute('race') });
        l.nombre++; l.moral += +v.getAttribute('moral'); l.experience += +v.getAttribute('exp');
      });
      var ls = Object.keys(lignes).map(function (k) {
        var l = lignes[k];
        l.moral = Math.round(l.moral / l.nombre); l.experience = Math.round(l.experience / l.nombre);
        return l;
      });
      res.flottes.push({
        num: num, nom: f.getAttribute('nom'), pos: f.getAttribute('pos'), directive: f.getAttribute('directive'),
        as: +f.getAttribute('as'), ap: +f.getAttribute('ap'), puissance: +f.getAttribute('puissance'),
        lignes: ls, heros: heros[num] || null,
      });
    });
    // noms des vaisseaux vus dans les combats de flottes
    var vus = {};
    enfants(premier(cdt, 'combats'), 'c').forEach(function (c) {
      var ini = premier(c, 'initial');
      enfants(ini, 'flotte').forEach(function (fl) {
        if (fl.getAttribute('proprio') === res.commandant.numero) return;
        enfants(fl, 'vaisseau').forEach(function (v) { vus[v.getAttribute('nom')] = fl.getAttribute('proprio'); });
      });
    });
    res.rencontres = Object.keys(vus).map(function (n) { return { nom: n, proprio: vus[n], tour: tour }; });
    // combats flotte contre flotte : état initial et chaque tour (le numéro de flotte 0 n'est pas écrit)
    res.combats = [];
    enfants(premier(cdt, 'combats'), 'c').forEach(function (c) {
      if (c.getAttribute('type') !== 'FLOTTE_FLOTTE') return;
      function lireFlottes(el) {
        return enfants(el, 'flotte').map(function (f) {
          return { proprio: f.getAttribute('proprio'), numero: f.getAttribute('numero') || '0',
            vaisseaux: enfants(f, 'vaisseau').map(function (v) {
              return { nom: v.getAttribute('nom'), nombre: +v.getAttribute('nombre'), encaisses: +(v.getAttribute('encaisses') || 0), infliges: +(v.getAttribute('infliges') || 0) };
            }) };
        });
      }
      var initial = lireFlottes(premier(c, 'initial'));
      if (initial.length !== 2) return;
      var cb = { tour: tour, moi: res.commandant.numero, position: c.getAttribute('position'),
        attaquant: c.getAttribute('attaquant'), defenseur: c.getAttribute('defenseur'),
        initial: initial, tours: enfants(c, 'tour').map(lireFlottes) };
      cb.cle = 'T' + tour + '|' + cb.position + '|' + initial.map(function (f) { return f.proprio + ':' + f.numero; }).sort().join('-');
      res.combats.push(cb);
    });
    return res;
  }

  // data.xml des statistiques : plans publics
  function lireData(texte) {
    var doc = parseXml(texte);
    var pp = doc.getElementsByTagName('planpublic')[0];
    return { type: 'data', plans: enfants(pp, 'p').map(function (p) { return lirePlanXml(p, 'public', +p.getAttribute('tour')); }) };
  }

  // combat.htm : const combats = [...]
  // Seuls les vaisseaux des flottes comptent (pas la milice ni les bâtiments).
  function lireCombatHtm(texte) {
    var vus = {};
    var i = texte.search(/const\s+combats\s*=/), combats = null;
    if (i >= 0) {
      var debut = texte.indexOf('[', i), prof = 0, j = debut, dansChaine = false;
      for (; j < texte.length; j++) {
        var ch = texte[j];
        if (dansChaine) { if (ch === '\\') j++; else if (ch === '"') dansChaine = false; continue; }
        if (ch === '"') dansChaine = true;
        else if (ch === '[') prof++;
        else if (ch === ']') { prof--; if (!prof) break; }
      }
      try { combats = JSON.parse(texte.slice(debut, j + 1)); } catch (e) { combats = null; }
    }
    if (!combats) throw new Error('tableau « combats » illisible');
    combats.forEach(function (c) {
      (c.tours || []).forEach(function (t) {
        ['flotteAttaquante', 'flotteDefenseuse'].forEach(function (k) {
          (t[k] || []).forEach(function (v) {
            var proprio = k === 'flotteAttaquante' ? c.attaquant : c.defenseur;
            if (v && v.nom) vus[v.nom] = proprio ? (proprio.nom || proprio.id) : '';
          });
        });
      });
    });
    return { type: 'combat', rencontres: Object.keys(vus).map(function (n) { return { nom: n, proprio: vus[n] }; }) };
  }

  // Fichier JSON exporté par le simulateur
  function lireExport(texte) {
    var o = JSON.parse(texte);
    if (!o || o.format !== 'sheril-combat') throw new Error('ce JSON ne vient pas du simulateur de combats');
    return { type: 'export', contenu: o };
  }

  function lireFichier(nom, texte) {
    var n = nom.toLowerCase();
    if (n.endsWith('.json')) return lireExport(texte);
    if (/<planpublic/.test(texte)) return lireData(texte);
    if (/<rapport[\s>]/.test(texte) && /<commandant/.test(texte)) return lireRapport(texte);
    if (/const\s+combats\s*=/.test(texte)) return lireCombatHtm(texte);
    throw new Error('format non reconnu (attendu : rapport.xml, data.xml, combat.htm ou export JSON)');
  }

  // Ajoute au registre ce qu'un fichier apporte. Renvoie un résumé.
  function integrer(reg, lu, nomFichier) {
    var r = { plans: 0, rencontres: 0, flottes: 0 };
    function ajouterPlan(p) {
      var ex = reg.plans[p.nom];
      if (ex && ex.origine === 'perso') return;           // un plan perso n'est jamais écrasé
      reg.plans[p.nom] = p; r.plans++;
      delete reg.rencontres[p.nom];
    }
    if (lu.plans) lu.plans.forEach(ajouterPlan);
    if (lu.rencontres) lu.rencontres.forEach(function (v) {
      if (reg.plans[v.nom] || STANDARD[v.nom]) return;
      if (!reg.rencontres[v.nom]) { reg.rencontres[v.nom] = v; r.rencontres++; }
    });
    if (lu.type === 'rapport') {
      // flottes proposées à l'import : celles du rapport le plus récent
      if (!reg.flottes || !reg.flottes.tour || lu.tour >= reg.flottes.tour)
        reg.flottes = { tour: lu.tour, commandant: lu.commandant, liste: lu.flottes, fichier: nomFichier };
      r.flottes = lu.flottes.length;
      reg.flottesParTour = reg.flottesParTour || {};
      reg.flottesParTour[lu.tour] = lu.flottes;
      reg.combats = reg.combats || {};
      lu.combats.forEach(function (cb) { if (!reg.combats[cb.cle]) r.combats = (r.combats || 0) + 1; reg.combats[cb.cle] = cb; });
    }
    if (lu.type === 'export') {
      var c = lu.contenu;
      Object.keys(c.plans || {}).forEach(function (k) { var p = c.plans[k]; reg.plans[k] = p; r.plans++; delete reg.rencontres[k]; });
      Object.keys(c.rencontres || {}).forEach(function (k) { if (!reg.plans[k] && !reg.rencontres[k]) { reg.rencontres[k] = c.rencontres[k]; r.rencontres++; } });
      Object.keys(c.scenarios || {}).forEach(function (k) { reg.scenarios[k] = c.scenarios[k]; });
      r.scenarios = Object.keys(c.scenarios || {}).length;
    }
    return r;
  }

  // Export : plans persos (et à compléter), plans rencontrés sans composition, scénarios
  function exporter(reg, tout) {
    var plans = {};
    Object.keys(reg.plans).forEach(function (k) {
      var p = reg.plans[k];
      if (tout || p.origine === 'perso') plans[k] = p;
    });
    return JSON.stringify({ format: 'sheril-combat', version: 1, date: new Date().toISOString().slice(0, 10),
      plans: plans, rencontres: reg.rencontres, scenarios: reg.scenarios }, null, 1);
  }

  var STANDARD = {};
  if (racine.CATALOGUE) racine.CATALOGUE.plans.forEach(function (p) { STANDARD[p.nom] = 1; });

  racine.DonneesCombat = {
    CLE: CLE, charger: charger, sauver: sauver, registreVide: registreVide,
    lireFichier: lireFichier, integrer: integrer, exporter: exporter,
  };
})(this);
