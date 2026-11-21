// Graph plotter (#/graph): type functions of x, slide the parameters, pan and zoom, tap to read off points.
// parse() turns text like "2x^2 - 3sin(x) + a" into a safe function (no eval). The page part needs a browser.

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

// ---------- the page ----------
const COLORS = ['#7c3aed', '#0d9488', '#e11d48'];
// Example graph families – each only offered once something matching has been uploaded (unlock.js).
const PRESETS = [
  ['Parabola', 'a(x-h)^2+k', ['quadratic', 'parabola', 'turning point']], ['Cubic', 'a(x-b)(x-c)(x-d)', ['cubic', 'polynomial']],
  ['Hyperbola', 'a/(x-h)+k', ['hyperbol']], ['Square root', 'a sqrt(x-h)+k', ['square root', 'root function']],
  ['Exponential', 'a e^(b x)+k', ['exponential']], ['Logarithm', 'a ln(x-h)+k', ['log']],
  ['Sine', 'a sin(b(x-h))+k', ['sine', 'cosine', 'trig', 'circular']], ['Tangent', 'a tan(b x)', ['tan graph', 'trig', 'circular']],
  ['Straight line', 'm x + c', ['straight line', 'linear', 'gradient']], ['Transformations', 'a(n(x-h))^2+k', ['transform', 'dilat']],
];
import { unlocked } from './unlock.js';
const SAVED = 'methods-study-graph';
let state = (() => { try { return JSON.parse(localStorage.getItem(SAVED)) || null; } catch { return null; } })()
  || { fns: ['', '', ''], p: { a: 1, b: 1, c: 0, d: 0, h: 0, k: 0, m: 1, n: 1 }, view: { x: 0, y: 0, s: 40 } };
const save = () => { try { localStorage.setItem(SAVED, JSON.stringify(state)); } catch { /* fine */ } };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function graphHtml() {
  return `<nav class="crumbs" aria-label="You are here"><a href="#/">Home</a> <span>›</span> <b>Graph</b></nav>
    <div class="bar"><h2>Graph plotter</h2><div class="tools"><button data-g="reset">Reset view</button></div></div>
    <p class="lead">Type up to three functions of <i>x</i>. Letters a, b, c, d, h, k, m, n become sliders. Drag to move, scroll or pinch to zoom, tap the graph to read off a point.</p>
    <div class="g-wrap">
      <div class="g-side">
        ${state.fns.map((f, i) => `<label class="g-fn" style="--fc:${COLORS[i]}"><span>y${i + 1} =</span><input data-fn="${i}" value="${esc(f)}" placeholder="${i ? 'optional' : 'e.g. x^2 - 4'}" spellcheck="false" autocomplete="off"></label>
          <small class="g-err" data-err="${i}"></small>`).join('')}
        <div class="g-sliders" id="g-sliders"></div>
        ${PRESETS.some(([, , k]) => unlocked(k)) ? `<details class="g-presets"><summary>Graphs from your topics</summary><div class="chips">${PRESETS.filter(([, , k]) => unlocked(k)).map(([n, f]) => `<button class="chip ask" data-preset="${esc(f)}">${n}: ${esc(f)}</button>`).join('')}</div></details>` : ''}
        <p class="hint tipline">Tips: <code>2x</code> means 2×x · <code>x^3</code> powers · <code>sqrt(x)</code>, <code>ln(x)</code>, <code>log(x)</code> (base 10), <code>e^x</code>, <code>sin(x)</code> in radians, <code>pi</code>, <code>|x|</code></p>
      </div>
      <div class="g-plot"><canvas id="g-canvas" aria-label="Graph"></canvas><div class="g-read" id="g-read"></div></div>
    </div>`;
}

export function bindGraph(main) {
  const cv = main.querySelector('#g-canvas'); if (!cv) return;
  const g = cv.getContext('2d');
  let parsed = [], trace = null;
  function compile() {
    parsed = state.fns.map((src, i) => {
      const err = main.querySelector(`[data-err="${i}"]`); if (err) err.textContent = '';
      if (!src.trim()) return null;
      try { return parse(src); } catch (e) { if (err) err.textContent = e.message; return null; }
    });
    const ps = [...new Set(parsed.flatMap((p) => p?.params || []))].sort();
    main.querySelector('#g-sliders').innerHTML = ps.map((n) => `<label class="g-sl"><b>${n}</b>
      <input type="range" min="-10" max="10" step="0.1" value="${state.p[n] ?? 1}" data-p="${n}"><output>${(+(state.p[n] ?? 1)).toFixed(1)}</output></label>`).join('');
  }
  function size() { const r = cv.getBoundingClientRect(), k = devicePixelRatio || 1; cv.width = r.width * k; cv.height = r.height * k; g.setTransform(k, 0, 0, k, 0, 0); }
  function draw() {
    if (!cv.isConnected) { ro?.disconnect(); return; } // left the page
    const W = cv.clientWidth, H = cv.clientHeight, { x: cx, y: cy, s } = state.view;
    const X = (x) => W / 2 + (x - cx) * s, Y = (y) => H / 2 - (y - cy) * s, wx = (px) => cx + (px - W / 2) / s;
    const css = getComputedStyle(document.body);
    g.clearRect(0, 0, W, H); g.fillStyle = css.getPropertyValue('--panel') || '#fff'; g.fillRect(0, 0, W, H);
    const step = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100].find((t) => t * s >= 40) || 100;
    g.lineWidth = 1; g.strokeStyle = css.getPropertyValue('--line') || '#ddd'; g.fillStyle = css.getPropertyValue('--muted') || '#666'; g.font = '11px system-ui';
    for (let x = Math.ceil(wx(0) / step) * step; X(x) < W; x += step) { g.beginPath(); g.moveTo(X(x), 0); g.lineTo(X(x), H); g.stroke(); }
    for (let y = Math.ceil((cy - H / 2 / s) / step) * step; Y(y) > 0; y += step) { g.beginPath(); g.moveTo(0, Y(y)); g.lineTo(W, Y(y)); g.stroke(); }
    g.strokeStyle = css.getPropertyValue('--muted') || '#666'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(W, Y(0)); g.moveTo(X(0), 0); g.lineTo(X(0), H); g.stroke();
    const fmt = (v) => +v.toFixed(2);
    for (let x = Math.ceil(wx(0) / step) * step; X(x) < W; x += step) if (Math.abs(x) > 1e-9) g.fillText(fmt(x), X(x) + 3, Math.min(H - 4, Math.max(12, Y(0) + 13)));
    for (let y = Math.ceil((cy - H / 2 / s) / step) * step; Y(y) > 0; y += step) if (Math.abs(y) > 1e-9) g.fillText(fmt(y), Math.min(W - 30, Math.max(3, X(0) + 4)), Y(y) - 3);
    parsed.forEach((p, i) => {
      if (!p) return;
      g.strokeStyle = COLORS[i]; g.lineWidth = 2.6; g.beginPath(); let pen = false, lastY = null;
      for (let px = 0; px <= W; px += 1) {
        const y = p.f({ ...state.p, x: wx(px) }), py = Y(y);
        const ok = Number.isFinite(y) && Math.abs(py) < 1e5 && !(lastY !== null && Math.abs(py - lastY) > H * 2);
        if (ok) { pen ? g.lineTo(px, py) : g.moveTo(px, py); pen = true; } else pen = false;
        lastY = ok ? py : null;
      }
      g.stroke();
    });
    const read = main.querySelector('#g-read'); if (!read) return;
    if (trace !== null) {
      const vals = parsed.map((p, i) => (p ? [i, p.f({ ...state.p, x: trace })] : null)).filter((v) => v && Number.isFinite(v[1]));
      g.strokeStyle = css.getPropertyValue('--muted'); g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(trace), 0); g.lineTo(X(trace), H); g.stroke(); g.setLineDash([]);
      vals.forEach(([i, y]) => { g.fillStyle = COLORS[i]; g.beginPath(); g.arc(X(trace), Y(y), 5, 0, 7); g.fill(); });
      read.innerHTML = `x = ${fmt(trace)}${vals.map(([i, y]) => ` · <b style="color:${COLORS[i]}">y${i + 1} = ${fmt(y)}</b>`).join('')}`;
    } else read.textContent = '';
  }
  const redraw = () => { save(); draw(); };
  main.oninput = (ev) => {
    const fn = ev.target.dataset.fn, p = ev.target.dataset.p;
    if (fn != null) { state.fns[+fn] = ev.target.value; compile(); redraw(); }
    if (p) { state.p[p] = +ev.target.value; ev.target.nextElementSibling.textContent = (+ev.target.value).toFixed(1); redraw(); }
  };
  main.onclick = (ev) => {
    const pr = ev.target.closest('[data-preset]');
    if (pr) { const i = Math.max(0, state.fns.findIndex((f) => !f.trim())); state.fns[i === -1 ? 0 : i] = pr.dataset.preset; main.querySelector(`[data-fn="${i}"]`).value = pr.dataset.preset; compile(); redraw(); }
    if (ev.target.closest('[data-g="reset"]')) { state.view = { x: 0, y: 0, s: 40 }; trace = null; redraw(); }
  };
  // Drag to pan (a short tap reads off a point), wheel / pinch to zoom.
  const pts = new Map(); let moved = 0, pinch = null;
  cv.onpointerdown = (e) => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0; };
  cv.onpointermove = (e) => {
    const last = pts.get(e.pointerId); if (!last) return;
    if (pts.size === 2) {
      const [a, b] = [...pts.values()], d0 = Math.hypot(a.x - b.x, a.y - b.y);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [c, d] = [...pts.values()], d1 = Math.hypot(c.x - d.x, c.y - d.y);
      if (d0 > 0) state.view.s = Math.min(2000, Math.max(2, state.view.s * d1 / d0)); moved = 99; pinch = true; draw(); return;
    }
    const dx = e.clientX - last.x, dy = e.clientY - last.y; moved += Math.abs(dx) + Math.abs(dy);
    state.view.x -= dx / state.view.s; state.view.y += dy / state.view.s; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); draw();
  };
  cv.onpointerup = (e) => {
    pts.delete(e.pointerId);
    if (moved < 6 && !pinch) { const r = cv.getBoundingClientRect(); trace = state.view.x + (e.clientX - r.left - r.width / 2) / state.view.s; draw(); }
    if (!pts.size) { pinch = null; save(); }
  };
  cv.onwheel = (e) => { e.preventDefault(); state.view.s = Math.min(2000, Math.max(2, state.view.s * (e.deltaY < 0 ? 1.15 : 1 / 1.15))); redraw(); };
  let ro = null;
  compile(); size(); draw();
  ro = new ResizeObserver(() => { if (cv.isConnected) { size(); draw(); } else ro.disconnect(); }); ro.observe(cv);
}
