// Fusionne plusieurs --json du banc d'équilibre joués sur le même scénario (une variante par fichier, par exemple).
// Usage : node equilibre/fusionner.js sortie.json entree1.json entree2.json ...
'use strict';
const fs = require('fs');
const [sortie, ...entrees] = process.argv.slice(2);
if (!sortie || entrees.length < 1) { console.error('Usage : node fusionner.js sortie.json entree1.json entree2.json ...'); process.exit(2); }
const fichiers = entrees.map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const base = fichiers[0];
fichiers.slice(1).forEach((j, i) => {
  if (JSON.stringify(j.plans) !== JSON.stringify(base.plans)) throw new Error(entrees[i + 1] + ' : plans différents de ' + entrees[0]);
  if (JSON.stringify(j.parametres.budgets) !== JSON.stringify(base.parametres.budgets) || j.parametres.n !== base.parametres.n)
    throw new Error(entrees[i + 1] + ' : budgets ou nombre de combats différents de ' + entrees[0]);
});
const noms = new Set();
fichiers.forEach((j, i) => j.variantes.forEach(v => {
  if (noms.has(v.nom)) throw new Error('variante « ' + v.nom + ' » présente deux fois (' + entrees[i] + ')');
  noms.add(v.nom);
}));
const res = Object.assign({}, base, {
  date: new Date().toISOString(),
  variantes: [].concat(...fichiers.map(j => j.variantes)),
  points: [].concat(...fichiers.map(j => j.points)),
  bilans: [].concat(...fichiers.map(j => j.bilans)),
  fusion: entrees,
});
fs.writeFileSync(sortie, JSON.stringify(res, null, 1));
console.log(`${sortie} : ${res.variantes.length} variantes (${res.variantes.map(v => v.nom).join(', ')}), ${res.points.length} points`);
