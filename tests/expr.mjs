// Test helper: a safe formula reader (no eval) the tests use to re-check practice answers independently.
// (It used to be the graph plotter's; the plotter was removed from the app.)

// ---------- reading a formula ----------
const FUNS = { sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp, ln: Math.log,
  log: (x) => Math.log10(x), log2: Math.log2, arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan };
const CONSTS = { pi: Math.PI, π: Math.PI, e: Math.E };
export const PARAMS = ['a', 'b', 'c', 'd', 'h', 'k', 'm', 'n'];

function tokens(src) {
  const out = []; let i = 0;
  const s = String(src).replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3');
  while (i < s.length) {
    const ch = s[i];
    const num = s.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
    if (num) { out.push({ t: 'num', v: parseFloat(num[1]) }); i += num[1].length; continue; }
    const word = s.slice(i).match(/^(arcsin|arccos|arctan|sqrt|sin|cos|tan|abs|exp|log2|log|ln|pi|π|[a-zA-Z])/);
    if (word) { out.push({ t: 'name', v: word[1] }); i += word[1].length; continue; }
    if ('+-*/^(),|'.includes(ch)) { out.push({ t: ch }); i++; continue; }
    throw new Error(`I don’t understand “${ch}”`);
  }
  return out;
}

// Recursive descent with implicit multiplication (2x, 3(x+1), x sin x, (x+1)(x-1)).
export function parse(src) {
  const tk = tokens(src); let i = 0, inAbs = 0; const used = new Set();
  const peek = () => tk[i], take = (t) => { if (tk[i]?.t !== t) throw new Error(t === ')' ? 'Missing a closing bracket' : `Expected “${t}”`); return tk[i++]; };
  const startsTerm = (x) => x && (x.t === 'num' || x.t === 'name' || x.t === '(' || (x.t === '|' && !inAbs)); // inside |…| a bar closes it
  function expr() {
    let left = term();
    while (peek() && (peek().t === '+' || peek().t === '-')) { const op = tk[i++].t, r = term(), l = left; left = op === '+' ? (v) => l(v) + r(v) : (v) => l(v) - r(v); }
    return left;
  }
  function term() {
    let left = unary();
    for (;;) {
      if (peek()?.t === '*' || peek()?.t === '/') { const op = tk[i++].t, r = unary(), l = left; left = op === '*' ? (v) => l(v) * r(v) : (v) => l(v) / r(v); }
      else if (startsTerm(peek())) { const r = power(), l = left; left = (v) => l(v) * r(v); } // implicit ×
      else return left;
    }
  }
  function unary() { if (peek()?.t === '-') { i++; const f = unary(); return (v) => -f(v); } if (peek()?.t === '+') { i++; return unary(); } return power(); }
  function power() {
    const base = atom();
    if (peek()?.t === '^') { i++; const ex = unary(); return (v) => Math.pow(base(v), ex(v)); }
    return base;
  }
  function atom() {
    const x = tk[i++];
    if (!x) throw new Error('The formula ends too soon');
    if (x.t === 'num') return () => x.v;
    if (x.t === '(') { const f = expr(); take(')'); return f; }
    if (x.t === '|') { inAbs++; const f = expr(); take('|'); inAbs--; return (v) => Math.abs(f(v)); }
    if (x.t === 'name') {
      const n = x.v;
      if (FUNS[n]) {
        let arg, pre = null;
        if (peek()?.t === '^') { i++; pre = atom(); } // sin^2(x)
        if (peek()?.t === '(') { i++; arg = expr(); take(')'); } else arg = power(); // sin x, sin 2x
        if (pre) { const g = arg; return (v) => Math.pow(FUNS[n](g(v)), pre(v)); }
        if (peek()?.t === '^') { i++; const ex = unary(); const g = arg; return (v) => Math.pow(FUNS[n](g(v)), ex(v)); }
        return (v) => FUNS[n](arg(v));
      }
      if (n in CONSTS) return () => CONSTS[n];
      if (n === 'x') return (v) => v.x;
      if (PARAMS.includes(n)) { used.add(n); return (v) => v[n]; }
      throw new Error(`Unknown letter “${n}” – use x, and a, b, c, d, h, k, m, n for sliders`);
    }
    throw new Error(`Unexpected “${x.t}”`);
  }
  if (!tk.length) throw new Error('Type a formula');
  const f = expr();
  if (i < tk.length) throw new Error(tk[i].t === ')' ? 'Too many closing brackets' : `Unexpected “${tk[i].v ?? tk[i].t}”`);
  return { f, params: [...used].sort() };
}

