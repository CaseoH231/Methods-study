// Practice (#/practice): endless Year 11 Maths Methods questions, marked straight away, with worked answers.
// Each generator makes a fresh question from a random-number function r() (0 ≤ r < 1), so tests can pass a seeded one.
// A question: { topic, q, a (number) | choices + correct (multiple choice), steps (worked answer) }. Maths in $…$.

const pick = (r, xs) => xs[Math.floor(r() * xs.length)];
const int = (r, lo, hi, not = []) => { for (;;) { const n = lo + Math.floor(r() * (hi - lo + 1)); if (!not.includes(n)) return n; } };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// Tidy LaTeX for a polynomial from [coef, power] pairs: 3x^2 - x + 4
export function poly(terms) {
  let out = '';
  for (const [c, p] of terms) {
    if (!c) continue;
    const sign = c < 0 ? ' - ' : out ? ' + ' : '', a = Math.abs(c);
    const coef = p === 0 ? `${a}` : a === 1 ? '' : `${a}`;
    out += (out ? sign : c < 0 ? '-' : '') + coef + (p === 0 ? '' : p === 1 ? 'x' : `x^{${p}}`);
  }
  return out || '0';
}
export const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? `${n}` : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`; };

export const TOPICS = ['Differentiation', 'Algebra', 'Exponentials & logs', 'Circular functions', 'Probability', 'Integration', 'Functions & graphs'];

const GEN = [
  { topic: 'Differentiation', make(r) {
    const a = int(r, -3, 3, [0]), b = int(r, -5, 5), c = int(r, -6, 6), d = int(r, -9, 9), k = int(r, -3, 3);
    const ans = 3 * a * k * k + 2 * b * k + c;
    return { q: `If $f(x) = ${poly([[a, 3], [b, 2], [c, 1], [d, 0]])}$, find $f'(${k})$.`, a: ans,
      steps: [`$f'(x) = ${poly([[3 * a, 2], [2 * b, 1], [c, 0]])}$ (bring the power down, take one off the power; the constant goes)`, `$f'(${k}) = ${3 * a}(${k})^2 + ${2 * b}(${k}) + ${c} = ${ans}$`] };
  } },
  { topic: 'Differentiation', make(r) {
    const a = int(r, 1, 3), b = int(r, -6, 6, [0]), x0 = int(r, -3, 3);
    const y0 = a * x0 * x0 + b * x0, m = 2 * a * x0 + b;
    return { q: `Find the gradient of the tangent to $y = ${poly([[a, 2], [b, 1]])}$ at the point $(${x0}, ${y0})$.`, a: m,
      steps: [`$\\frac{dy}{dx} = ${poly([[2 * a, 1], [b, 0]])}$`, `At $x = ${x0}$: $\\frac{dy}{dx} = ${2 * a}(${x0}) + ${b} = ${m}$`] };
  } },
  { topic: 'Algebra', make(r) {
    const p = int(r, -7, 7), q = int(r, -7, 7, [p]);
    return { q: `Solve $${poly([[1, 2], [-(p + q), 1], [p * q, 0]])} = 0$. Give the larger solution.`, a: Math.max(p, q),
      steps: [`Find two numbers that multiply to $${p * q}$ and add to $${-(p + q)}$: $${-p}$ and $${-q}$.`, `$(x ${p < 0 ? '+' : '-'} ${Math.abs(p)})(x ${q < 0 ? '+' : '-'} ${Math.abs(q)}) = 0$, so $x = ${p}$ or $x = ${q}$.`, `The larger is $${Math.max(p, q)}$.`] };
  } },
  { topic: 'Functions & graphs', make(r) {
    const b = 2 * int(r, -5, 5, [0]), c = int(r, -9, 9), h = -b / 2, k = c - (b * b) / 4;
    return { q: `Find the $y$-coordinate of the turning point of $y = ${poly([[1, 2], [b, 1], [c, 0]])}$.`, a: k,
      steps: [`Complete the square: $y = (x ${h < 0 ? '-' : '+'} ${Math.abs(h)})^2 ${k < 0 ? '-' : '+'} ${Math.abs(k)}$`, `Turning point $(${h}, ${k})$, so $y = ${k}$.`] };
  } },
  { topic: 'Functions & graphs', make(r) {
    const x1 = int(r, -5, 5), x2 = int(r, -5, 5, [x1]), y1 = int(r, -8, 8), y2 = int(r, -8, 8);
    return { q: `Find the gradient of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`, a: (y2 - y1) / (x2 - x1), shown: frac(y2 - y1, x2 - x1),
      steps: [`$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${y2} - (${y1})}{${x2} - (${x1})} = ${frac(y2 - y1, x2 - x1)}$`] };
  } },
  { topic: 'Differentiation', make(r) {
    const b = int(r, -4, 4), a = int(r, -3, 1), c = int(r, a + 1, a + 4), f = (x) => x * x + b * x, ans = (f(c) - f(a)) / (c - a);
    return { q: `Find the average rate of change of $f(x) = ${poly([[1, 2], [b, 1]])}$ from $x = ${a}$ to $x = ${c}$.`, a: ans, shown: frac(f(c) - f(a), c - a),
      steps: [`$f(${c}) = ${f(c)}$ and $f(${a}) = ${f(a)}$`, `Average rate $= \\frac{f(${c}) - f(${a})}{${c} - (${a})} = \\frac{${f(c) - f(a)}}{${c - a}} = ${frac(f(c) - f(a), c - a)}$`] };
  } },
  { topic: 'Exponentials & logs', make(r) {
    const base = pick(r, [2, 3, 5]), m = int(r, 2, base === 2 ? 6 : 4), s = int(r, -3, 3, [0]);
    return { q: `Solve $${base}^{x ${s < 0 ? '-' : '+'} ${Math.abs(s)}} = ${base ** m}$.`, a: m - s,
      steps: [`Write ${base ** m} as a power of ${base}: $${base ** m} = ${base}^{${m}}$`, `Same base, so the powers are equal: $x ${s < 0 ? '-' : '+'} ${Math.abs(s)} = ${m}$, so $x = ${m - s}$.`] };
  } },
  { topic: 'Exponentials & logs', make(r) {
    const base = pick(r, [2, 3, 10]), m = int(r, 2, base === 10 ? 4 : 5), split = int(r, 1, m - 1), x = base ** split, y = base ** (m - split);
    return { q: `Evaluate $\\log_{${base}} ${x} + \\log_{${base}} ${y}$.`, a: m,
      steps: [`Log law: $\\log_b x + \\log_b y = \\log_b (xy)$`, `$\\log_{${base}} (${x} \\times ${y}) = \\log_{${base}} ${x * y} = \\log_{${base}} ${base}^{${m}} = ${m}$`] };
  } },
  { topic: 'Exponentials & logs', make(r) {
    const a = int(r, 2, 4), b = int(r, 2, 5), c = int(r, 1, 6);
    return { q: `Simplify $\\dfrac{x^{${a + b}} \\times x^{${c}}}{x^{${b}}}$ to $x^n$. What is $n$?`, a: a + c,
      steps: [`Multiply → add powers: $x^{${a + b}} \\times x^{${c}} = x^{${a + b + c}}$`, `Divide → subtract powers: $x^{${a + b + c} - ${b}} = x^{${a + c}}$`] };
  } },
  { topic: 'Circular functions', make(r) {
    const angles = [[0, '0'], [30, '\\frac{\\pi}{6}'], [45, '\\frac{\\pi}{4}'], [60, '\\frac{\\pi}{3}'], [90, '\\frac{\\pi}{2}'], [120, '\\frac{2\\pi}{3}'], [135, '\\frac{3\\pi}{4}'], [150, '\\frac{5\\pi}{6}'], [180, '\\pi']];
    const VAL = { 0: '0', 0.5: '\\frac{1}{2}', '-0.5': '-\\frac{1}{2}', 1: '1', '-1': '-1' };
    const show = (v) => {
      if (!Number.isFinite(v) || Math.abs(v) > 1e6) return '\\text{undefined}';
      const k = Math.round(v * 1e6) / 1e6, s = k < 0 ? '-' : '', a = Math.abs(k);
      if (VAL[k] !== undefined) return VAL[k];
      if (Math.abs(a - Math.SQRT2 / 2) < 1e-6) return `${s}\\frac{\\sqrt{2}}{2}`;
      if (Math.abs(a - Math.sqrt(3) / 2) < 1e-6) return `${s}\\frac{\\sqrt{3}}{2}`;
      if (Math.abs(a - Math.sqrt(3)) < 1e-6) return `${s}\\sqrt{3}`;
      if (Math.abs(a - 1 / Math.sqrt(3)) < 1e-6) return `${s}\\frac{1}{\\sqrt{3}}`;
      return String(k);
    };
    const [deg, rad] = pick(r, angles), fn = pick(r, ['sin', 'cos', 'tan']);
    const v = fn === 'tan' && deg === 90 ? Infinity : Math[fn](deg * Math.PI / 180);
    const correct = show(v);
    const pool = ['0', '\\frac{1}{2}', '-\\frac{1}{2}', '\\frac{\\sqrt{2}}{2}', '-\\frac{\\sqrt{2}}{2}', '\\frac{\\sqrt{3}}{2}', '-\\frac{\\sqrt{3}}{2}', '1', '-1', '\\sqrt{3}', '-\\sqrt{3}', '\\frac{1}{\\sqrt{3}}', '\\text{undefined}'].filter((x) => x !== correct);
    const choices = [correct]; while (choices.length < 4) { const c = pick(r, pool); if (!choices.includes(c)) choices.push(c); }
    choices.sort(() => r() - 0.5);
    const useRad = r() < 0.6;
    return { q: `Find the exact value of $\\${fn}\\left(${useRad ? rad : `${deg}^\\circ`}\\right)$.`, choices, correct,
      steps: [useRad ? `$${rad} = ${deg}^\\circ$` : `Use the exact-value triangles / unit circle.`, `$\\${fn}(${deg}^\\circ) = ${correct}$`] };
  } },
  { topic: 'Probability', make(r) {
    const pa = int(r, 3, 7) / 10, pb = int(r, 2, 6) / 10, pab = int(r, 1, Math.min(pa, pb) * 10 - 1) / 10;
    const ans = Math.round((pa + pb - pab) * 100) / 100;
    return { q: `$\\Pr(A) = ${pa}$, $\\Pr(B) = ${pb}$ and $\\Pr(A \\cap B) = ${pab}$. Find $\\Pr(A \\cup B)$.`, a: ans,
      steps: [`Addition rule: $\\Pr(A \\cup B) = \\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)$`, `$= ${pa} + ${pb} - ${pab} = ${ans}$`] };
  } },
  { topic: 'Probability', make(r) {
    const n = int(r, 5, 10), k = int(r, 2, n - 2);
    let c = 1; for (let i = 1; i <= k; i++) c = (c * (n - k + i)) / i;
    return { q: `How many ways can ${k} people be chosen from a group of ${n}? (Find $^{${n}}C_{${k}}$.)`, a: c,
      steps: [`$^{n}C_{r} = \\frac{n!}{r!(n-r)!}$`, `$^{${n}}C_{${k}} = \\frac{${n}!}{${k}!\\,${n - k}!} = ${c}$`] };
  } },
  { topic: 'Probability', make(r) {
    const pa = int(r, 2, 8) / 10, pb = int(r, 2, 8) / 10, ans = Math.round(pa * pb * 100) / 100;
    return { q: `$A$ and $B$ are independent, with $\\Pr(A) = ${pa}$ and $\\Pr(B) = ${pb}$. Find $\\Pr(A \\cap B)$.`, a: ans,
      steps: [`Independent events: $\\Pr(A \\cap B) = \\Pr(A) \\times \\Pr(B)$`, `$= ${pa} \\times ${pb} = ${ans}$`] };
  } },
  { topic: 'Integration', make(r) {
    const a = int(r, -3, 3, [0]), b = int(r, -4, 4), k = int(r, 1, 4), ans = (a * k * k) / 2 + b * k;
    return { q: `Evaluate $\\displaystyle\\int_0^{${k}} (${poly([[a, 1], [b, 0]])})\\,dx$.`, a: ans, shown: frac(a * k * k + 2 * b * k, 2),
      steps: [`Antiderivative: $${frac(a, 2) === '1' ? '' : frac(a, 2)}x^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}x$ (add one to the power, divide by the new power)`, `$\\left[${frac(a, 2)}x^2 + ${b}x\\right]_0^{${k}} = ${frac(a * k * k + 2 * b * k, 2)} - 0$`] };
  } },
  { topic: 'Integration', make(r) {
    const a = int(r, -2, 1), b = int(r, a + 1, 3), ans = b ** 3 - a ** 3;
    return { q: `Evaluate $\\displaystyle\\int_{${a}}^{${b}} 3x^2\\,dx$.`, a: ans,
      steps: [`Antiderivative of $3x^2$ is $x^3$.`, `$\\left[x^3\\right]_{${a}}^{${b}} = (${b})^3 - (${a})^3 = ${b ** 3} - (${a ** 3}) = ${ans}$`] };
  } },
];

export function makeQuestion(r = Math.random, topic = null) {
  const pool = topic ? GEN.filter((g) => g.topic === topic) : GEN;
  const g = pick(r, pool);
  return { topic: g.topic, ...g.make(r) };
}

// Reads what was typed: 7, -2.5, 3/4, -1/2, 0.25 – returns a number or NaN.
export function readAnswer(text) {
  const s = String(text).trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  const f = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (f) return +f[2] === 0 ? NaN : +f[1] / +f[2];
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? +s : NaN;
}
export const isRight = (q, text) => (q.choices ? text === q.correct : Math.abs(readAnswer(text) - q.a) < 1e-6);

// ---------- the page ----------
const SAVED = 'methods-study-practice';
const load = () => { try { return JSON.parse(localStorage.getItem(SAVED)) || {}; } catch { return {}; } };
let stats = { days: [], topics: {}, ...load() };
const keep = () => { try { localStorage.setItem(SAVED, JSON.stringify(stats)); } catch { /* fine */ } };
let topic = null, q = null, answered = null, session = { right: 0, done: 0 };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const today = () => new Date().toISOString().slice(0, 10);

// Days in a row with at least one question answered (today or ending yesterday).
export function streak(days = stats.days, now = today()) {
  const set = new Set(days); let d = new Date(`${now}T00:00:00Z`), n = 0;
  if (!set.has(now)) d = new Date(d - 864e5);
  while (set.has(d.toISOString().slice(0, 10))) { n++; d = new Date(d - 864e5); }
  return n;
}
export const practiceStats = () => ({ streak: streak(), topics: stats.topics });

export function practiceHtml() {
  if (!q) q = makeQuestion(Math.random, topic);
  const t = stats.topics, acc = (k) => (t[k]?.n ? Math.round((100 * t[k].right) / t[k].n) : null);
  return `<nav class="crumbs" aria-label="You are here"><a href="#/">Home</a> <span>›</span> <b>Practice</b></nav>
    <div class="bar"><h2>Practice</h2><div class="tools"><span class="pill">🔥 ${streak()} day streak</span><span class="pill">This session: ${session.right}/${session.done}</span></div></div>
    <div class="chips pr-topics"><button class="chip ask ${topic ? '' : 'on'}" data-ptopic="">Mixed</button>${TOPICS.map((k) => `<button class="chip ask ${topic === k ? 'on' : ''}" data-ptopic="${esc(k)}">${esc(k)}${acc(k) !== null ? ` · ${acc(k)}%` : ''}</button>`).join('')}</div>
    <section class="pr-card ${answered === null ? '' : answered ? 'right' : 'wrong'}">
      <p class="eyebrow">${esc(q.topic)}</p>
      <div class="pr-q">${esc(q.q)}</div>
      ${q.choices ? `<div class="pr-choices">${q.choices.map((c) => `<button class="pr-choice ${answered !== null && c === q.correct ? 'is-right' : ''}" data-choice="${esc(c)}" ${answered !== null ? 'disabled' : ''}>$${esc(c)}$</button>`).join('')}</div>`
        : `<form class="pr-form" id="pr-form"><input id="pr-in" inputmode="decimal" autocomplete="off" placeholder="Your answer (e.g. 7, -2.5 or 3/4)" ${answered !== null ? 'disabled' : ''}>
           <button class="primary" ${answered !== null ? 'disabled' : ''}>Check</button></form>`}
      ${answered === null ? '<button class="link" data-pr="show">Show me how</button>' : `<div class="pr-result"><b>${answered ? '✓ Correct!' : `✗ Not quite – the answer is ${q.choices ? `$${esc(q.correct)}$` : `$${esc(q.shown ?? String(q.a))}$`}`}</b>
        <ol class="pr-steps">${q.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        <button class="primary" data-pr="next" id="pr-next">Next question →</button></div>`}
    </section>
    <p class="hint tipline">Questions are made fresh each time, so you never run out. Fractions are fine: type <code>3/4</code>.</p>`;
}

function mark(ok) {
  answered = ok; session.done++; if (ok) session.right++;
  const t = (stats.topics[q.topic] ||= { n: 0, right: 0 }); t.n++; if (ok) t.right++;
  if (!stats.days.includes(today())) stats.days = [...stats.days, today()].slice(-400);
  keep();
}
export function bindPractice(main, { redraw }) {
  main.onclick = (ev) => {
    const tp = ev.target.closest('[data-ptopic]');
    if (tp) { topic = tp.dataset.ptopic || null; q = makeQuestion(Math.random, topic); answered = null; return redraw(); }
    const ch = ev.target.closest('[data-choice]');
    if (ch && answered === null) { mark(ch.dataset.choice === q.correct); return redraw(); }
    const b = ev.target.closest('[data-pr]');
    if (b?.dataset.pr === 'next') { q = makeQuestion(Math.random, topic); answered = null; redraw(); main.querySelector('#pr-in')?.focus(); }
    if (b?.dataset.pr === 'show') { mark(false); redraw(); }
  };
  const f = main.querySelector('#pr-form');
  if (f) f.onsubmit = (ev) => { ev.preventDefault(); const v = main.querySelector('#pr-in').value; if (!v.trim()) return; if (Number.isNaN(readAnswer(v))) { main.querySelector('#pr-in').setCustomValidity('Type a number or a fraction like 3/4'); f.reportValidity(); return; } mark(isRight(q, v)); redraw(); };
  main.querySelector('#pr-in')?.addEventListener('input', (e) => e.target.setCustomValidity(''));
}
export const currentQuestion = () => q; // for the tests
