// Choix optimal d'équipement par paire de tailles, à partir d'un --json du banc d'équilibre dont les plans sont nommés « Tn équipement »
// (ex. scenarios/meilleur-equipement.json). Jeu à somme nulle résolu par jeu fictif.
// Usage : node equilibre/meilleur-equipement.js resultats.json [--variante NOM] [--exclure MOTIF]
//   --variante NOM : ne garde que les résultats de cette variante (obligatoire si le fichier en contient plusieurs)
//   --exclure MOTIF : écarte les équipements dont le nom correspond (expression régulière), ex. "boucl|abs|\+B" pour les armes seules
const args = process.argv.slice(2);
const opt = nom => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : null; };
const j = require(require('path').resolve(args[0]));
const variantes = [...new Set(j.points.map(p => p.variante))];
const variante = opt('--variante') || (variantes.length === 1 ? variantes[0] : null);
if (!variante || !variantes.includes(variante)) {
  console.error('Variante à choisir avec --variante parmi : ' + variantes.map(v => '« ' + v + ' »').join(', '));
  process.exit(2);
}
const exclure = opt('--exclure') ? new RegExp(opt('--exclure')) : null;
const taille = n => n.split(' ')[0];
const designs = {};
Object.keys(j.plans).filter(n => !exclure || !exclure.test(n.split(' ').slice(1).join(' ')))
  .forEach(n => { (designs[taille(n)] = designs[taille(n)] || []).push(n); });
const T = Object.keys(designs).sort((a, b) => +a.slice(1) - +b.slice(1));
console.log(`Variante « ${variante} »${exclure ? ', sans les équipements « ' + opt('--exclure') + ' »' : ''}`);
// avantage moyen (sur les budgets) de a contre b
const gain = {};
j.points.filter(p => p.variante === variante).forEach(p => {
  const k = p.A + '|' + p.B;
  (gain[k] = gain[k] || []).push(p.avantageA);
});
const G = (a, b) => { const l = gain[a + '|' + b]; if (l) return l.reduce((s, x) => s + x, 0) / l.length; const m = gain[b + '|' + a]; return -m.reduce((s, x) => s + x, 0) / m.length; };

function resoudre(R, C) {
  const M = R.map(a => C.map(b => G(a, b)));
  const nr = R.length, nc = C.length, cr = new Array(nr).fill(0), cc = new Array(nc).fill(0);
  const sr = new Array(nr).fill(0), sc = new Array(nc).fill(0);   // gains cumulés contre le mélange adverse
  let i = 0, k = 0;
  const N = 20000;
  for (let t = 0; t < N; t++) {
    cr[i]++; cc[k]++;
    for (let x = 0; x < nc; x++) sc[x] += M[i][x];
    for (let y = 0; y < nr; y++) sr[y] += M[y][k];
    i = sr.indexOf(Math.max(...sr));
    k = sc.indexOf(Math.min(...sc));
  }
  const pr = cr.map(x => x / N), pc = cc.map(x => x / N);
  let v = 0;
  for (let y = 0; y < nr; y++) for (let x = 0; x < nc; x++) v += pr[y] * pc[x] * M[y][x];
  // garanti en pur : meilleur pire cas
  const maximin = Math.max(...M.map(l => Math.min(...l)));
  return { v, pr, pc, maximin, minimax: Math.min(...C.map((_, x) => Math.max(...M.map(l => l[x])))) };
}
const court = n => n.split(' ').slice(1).join(' ');
const strat = (noms, p) => noms.map((n, i) => [court(n), p[i]]).filter(x => x[1] >= 0.1).sort((a, b) => b[1] - a[1]).map(x => x[0] + (x[1] < 0.9 ? ' ' + Math.round(100 * x[1]) + ' %' : '')).join(', ');

const V = {}, S = {};
for (let a = 0; a < T.length; a++) for (let b = a + 1; b < T.length; b++) {
  const r = resoudre(designs[T[a]], designs[T[b]]);
  V[T[a] + T[b]] = r.v; V[T[b] + T[a]] = -r.v;
  S[T[a] + T[b]] = { ligne: strat(designs[T[a]], r.pr), colonne: strat(designs[T[b]], r.pc), v: r.v, maximin: r.maximin, minimax: r.minimax };
}
console.log('Valeur (avantage de la ligne, chacun avec son meilleur équipement)');
console.log('      ' + T.map(t => t.padStart(6)).join('') + '   score');
let des = 0, n = 0;
T.forEach(a => {
  const l = T.map(b => a === b ? null : V[a + b]);
  const sc = l.filter(x => x !== null);
  console.log(a.padEnd(6) + l.map(x => x === null ? '     ·' : ((x > 0 ? '+' : '') + x.toFixed(0)).padStart(6)).join('') + ((x => (x > 0 ? '+' : '') + x.toFixed(0))(sc.reduce((s, x) => s + x, 0) / sc.length)).padStart(8));
});
Object.values(S).forEach(s => { des += Math.abs(s.v); n++; });
console.log('Déséquilibre ' + (des / n).toFixed(1));
console.log('\nÉquipements choisis (petite taille | grande taille), valeur, garanti en pur (pire cas du meilleur choix unique)');
Object.keys(S).forEach(k => { const s = S[k]; console.log(k.slice(0, 2) + ' contre ' + k.slice(2) + ' : ' + s.ligne + ' | ' + s.colonne + '  →  ' + (s.v > 0 ? '+' : '') + s.v.toFixed(0) + '  [' + s.maximin.toFixed(0) + ' ; ' + s.minimax.toFixed(0) + ']'); });
