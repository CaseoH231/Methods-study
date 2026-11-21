// Formula sheet (#/formulas): the key Maths Methods Units 1 & 2 formulas, searchable, with stars for the tricky ones.
// Which uploads unlock each formula (word starts, see unlock.js). A formula shows only when something uploaded matches.
import { unlocked, hasUploads } from './unlock.js';
export const KEYS = {"Quadratic formula": ["quadratic"],"Discriminant": ["discriminant","quadratic"],"Completing the square": ["completing the square","turning point","quadratic"],"Difference of two squares": ["difference of","factoris","factoriz","expand"],"Perfect squares": ["perfect square","expand","factoris","factoriz"],"Sum and difference of cubes": ["cubic","cubes","sum of cubes","difference of cubes"],"Factor theorem": ["factor theorem","polynomial","cubic"],"Remainder theorem": ["remainder","polynomial","division"],"Gradient": ["gradient","straight line","linear","coordinate"],"Straight line": ["straight line","linear","equation of a line","coordinate"],"Midpoint": ["midpoint","coordinate"],"Distance between two points": ["distance","coordinate"],"Parallel and perpendicular": ["parallel","perpendicular"],"Turning-point form": ["turning point","parabola","quadratic","vertex"],"Transformations": ["transform","dilat","reflect","translat"],"Hyperbola": ["hyperbol"],"Truncus": ["truncus"],"Square root": ["square root","root function"],"Circle": ["circle"],"Inverse function": ["inverse"],"Index laws": ["index","indices","exponent law","power"],"Zero, negative and fractional powers": ["index","indices","negative power","fractional","surd"],"Definition of a log": ["log"],"Log laws": ["log"],"Log of a power": ["log"],"Special logs": ["log"],"Change of base": ["change of base","log"],"Exponential graphs": ["exponential"],"Degrees and radians": ["radian","degree","circular","trig"],"Arc length": ["arc","sector","radian"],"Pythagorean identity": ["trig","identit","circular"],"Tangent": ["trig","circular"],"Exact values": ["exact value","trig","unit circle","circular"],"Symmetry": ["symmetr","unit circle","trig","circular","cast"],"Complementary angles": ["complementary","trig","circular"],"Graphs of sin and cos": ["sine","cosine","trig graph","circular","amplitude","period"],"Graph of tan": ["tan graph","circular","trig graph","period"],"Complement": ["probab","complement"],"Addition rule": ["probab","venn","union","addition rule"],"Conditional probability": ["conditional"],"Independence": ["independ"],"Law of total probability": ["total probability","tree diagram","conditional"],"Arrangements": ["arrangement","permutation","counting"],"Selections": ["combination","selection","choose","counting"],"Pascal’s triangle": ["pascal","combination"],"Average rate of change": ["rate of change","average rate","chord"],"First principles": ["first principles","limit"],"Power rule": ["differentiat","derivative","power rule", "calculus"],"Sum and constant rules": ["differentiat","derivative"],"Tangent line": ["tangent","normal"],"Stationary points": ["stationary","turning point","maxim","minim"],"Antiderivative (power rule)": ["antideriv","integra"],"Definite integral": ["definite integral","integra","area under"],"Kinematics": ["kinematic","velocity","acceleration","displacement","motion"]};
export const SHEET = [
  ['Algebra', [
    ['Quadratic formula', 'x = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', 'Solves $ax^2 + bx + c = 0$.'],
    ['Discriminant', '\\Delta = b^2 - 4ac', '$\\Delta > 0$: two solutions · $\\Delta = 0$: one · $\\Delta < 0$: none.'],
    ['Completing the square', 'x^2 + bx = \\left(x + \\tfrac{b}{2}\\right)^2 - \\tfrac{b^2}{4}', 'Gives the turning-point form.'],
    ['Difference of two squares', 'a^2 - b^2 = (a - b)(a + b)', ''],
    ['Perfect squares', '(a \\pm b)^2 = a^2 \\pm 2ab + b^2', ''],
    ['Sum and difference of cubes', 'a^3 \\pm b^3 = (a \\pm b)(a^2 \\mp ab + b^2)', ''],
    ['Factor theorem', 'P(a) = 0 \\iff (x - a) \\text{ is a factor of } P(x)', 'Try $a = \\pm$ factors of the constant term.'],
    ['Remainder theorem', 'P(x) \\div (x - a) \\text{ leaves remainder } P(a)', ''],
  ]],
  ['Coordinate geometry', [
    ['Gradient', 'm = \\dfrac{y_2 - y_1}{x_2 - x_1} = \\tan\\theta', '$\\theta$ = angle with the positive $x$-axis.'],
    ['Straight line', 'y - y_1 = m(x - x_1) \\quad\\text{or}\\quad y = mx + c', ''],
    ['Midpoint', 'M = \\left(\\dfrac{x_1 + x_2}{2}, \\dfrac{y_1 + y_2}{2}\\right)', ''],
    ['Distance between two points', 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', ''],
    ['Parallel and perpendicular', 'm_1 = m_2 \\quad\\text{and}\\quad m_1 m_2 = -1', ''],
  ]],
  ['Functions & graphs', [
    ['Turning-point form', 'y = a(x - h)^2 + k', 'Turning point $(h, k)$; axis of symmetry $x = h$.'],
    ['Transformations', 'y = a\\,f\\big(n(x - h)\\big) + k', '$a$: dilation from $x$-axis · $\\tfrac1n$: dilation from $y$-axis · $h$: right · $k$: up. Negative $a$ or $n$ reflects.'],
    ['Hyperbola', 'y = \\dfrac{a}{x - h} + k', 'Asymptotes $x = h$ and $y = k$.'],
    ['Truncus', 'y = \\dfrac{a}{(x - h)^2} + k', 'Asymptotes $x = h$ and $y = k$.'],
    ['Square root', 'y = a\\sqrt{x - h} + k', 'Starts at $(h, k)$; domain $x \\ge h$ (for $a, n > 0$).'],
    ['Circle', '(x - h)^2 + (y - k)^2 = r^2', 'Centre $(h, k)$, radius $r$.'],
    ['Inverse function', 'f^{-1}: \\text{ swap } x \\text{ and } y', 'Domain of $f^{-1}$ = range of $f$. Reflection in $y = x$. Needs $f$ to be one-to-one.'],
  ]],
  ['Indices & logarithms', [
    ['Index laws', 'a^m a^n = a^{m+n},\\; \\dfrac{a^m}{a^n} = a^{m-n},\\; (a^m)^n = a^{mn}', ''],
    ['Zero, negative and fractional powers', 'a^0 = 1,\\; a^{-n} = \\dfrac{1}{a^n},\\; a^{\\frac{m}{n}} = \\sqrt[n]{a^m}', ''],
    ['Definition of a log', 'y = a^x \\iff x = \\log_a y', ''],
    ['Log laws', '\\log_a (xy) = \\log_a x + \\log_a y,\\; \\log_a \\tfrac{x}{y} = \\log_a x - \\log_a y', ''],
    ['Log of a power', '\\log_a x^n = n \\log_a x', ''],
    ['Special logs', '\\log_a 1 = 0,\\quad \\log_a a = 1,\\quad a^{\\log_a x} = x', ''],
    ['Change of base', '\\log_a x = \\dfrac{\\log_b x}{\\log_b a}', ''],
    ['Exponential graphs', 'y = a\\,b^{x - h} + k', 'Horizontal asymptote $y = k$.'],
  ]],
  ['Circular functions', [
    ['Degrees and radians', '\\pi^c = 180^\\circ \\quad\\Rightarrow\\quad 1^\\circ = \\dfrac{\\pi}{180}^c', ''],
    ['Arc length', 'l = r\\theta', '$\\theta$ in radians.'],
    ['Pythagorean identity', '\\sin^2 x + \\cos^2 x = 1', ''],
    ['Tangent', '\\tan x = \\dfrac{\\sin x}{\\cos x}', ''],
    ['Exact values', '\\sin\\tfrac{\\pi}{6} = \\tfrac12,\\; \\sin\\tfrac{\\pi}{4} = \\tfrac{\\sqrt2}{2},\\; \\sin\\tfrac{\\pi}{3} = \\tfrac{\\sqrt3}{2}', 'And $\\cos$ the other way round; $\\tan\\frac{\\pi}{6} = \\frac{1}{\\sqrt3}$, $\\tan\\frac{\\pi}{4} = 1$, $\\tan\\frac{\\pi}{3} = \\sqrt3$.'],
    ['Symmetry', '\\sin(\\pi - x) = \\sin x,\\; \\cos(\\pi - x) = -\\cos x,\\; \\sin(-x) = -\\sin x', 'CAST: All, Sin, Tan, Cos positive in quadrants 1–4.'],
    ['Complementary angles', '\\sin\\left(\\tfrac{\\pi}{2} - x\\right) = \\cos x', ''],
    ['Graphs of sin and cos', 'y = a\\sin\\big(n(x - h)\\big) + k', 'Amplitude $|a|$ · period $\\frac{2\\pi}{n}$ · mean line $y = k$.'],
    ['Graph of tan', 'y = a\\tan(nx)', 'Period $\\frac{\\pi}{n}$; asymptotes at $x = \\frac{\\pi}{2n} + \\frac{k\\pi}{n}$.'],
  ]],
  ['Probability & counting', [
    ['Complement', '\\Pr(A\') = 1 - \\Pr(A)', ''],
    ['Addition rule', '\\Pr(A \\cup B) = \\Pr(A) + \\Pr(B) - \\Pr(A \\cap B)', 'Mutually exclusive: $\\Pr(A \\cap B) = 0$.'],
    ['Conditional probability', '\\Pr(A \\mid B) = \\dfrac{\\Pr(A \\cap B)}{\\Pr(B)}', ''],
    ['Independence', '\\Pr(A \\cap B) = \\Pr(A)\\Pr(B)', 'Equivalently $\\Pr(A \\mid B) = \\Pr(A)$.'],
    ['Law of total probability', '\\Pr(A) = \\Pr(A \\mid B)\\Pr(B) + \\Pr(A \\mid B\')\\Pr(B\')', ''],
    ['Arrangements', '^nP_r = \\dfrac{n!}{(n - r)!}', 'Order matters.'],
    ['Selections', '^nC_r = \\dbinom{n}{r} = \\dfrac{n!}{r!\\,(n - r)!}', 'Order doesn’t matter. $^nC_0 = {}^nC_n = 1$.'],
    ['Pascal’s triangle', '^nC_r = {}^{n-1}C_{r-1} + {}^{n-1}C_r', ''],
  ]],
  ['Calculus', [
    ['Average rate of change', '\\dfrac{f(b) - f(a)}{b - a}', 'Gradient of the chord.'],
    ['First principles', 'f\'(x) = \\lim_{h \\to 0} \\dfrac{f(x + h) - f(x)}{h}', ''],
    ['Power rule', '\\dfrac{d}{dx}\\left(x^n\\right) = n x^{n-1}', ''],
    ['Sum and constant rules', '\\dfrac{d}{dx}\\big(af(x) + g(x)\\big) = af\'(x) + g\'(x)', 'The derivative of a constant is 0.'],
    ['Tangent line', 'y - f(a) = f\'(a)(x - a)', 'Normal: gradient $-\\frac{1}{f\'(a)}$.'],
    ['Stationary points', 'f\'(x) = 0', 'Check the sign of $f\'$ either side: max, min or point of inflection.'],
    ['Antiderivative (power rule)', '\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + c,\\; n \\ne -1', ''],
    ['Definite integral', '\\int_a^b f(x)\\,dx = F(b) - F(a)', '$F$ is an antiderivative of $f$.'],
    ['Kinematics', 'v = \\dfrac{dx}{dt},\\quad a = \\dfrac{dv}{dt}', 'Displacement $x$, velocity $v$, acceleration $a$.'],
  ]],
];

const STARS = 'methods-study-stars';
let stars = new Set((() => { try { return JSON.parse(localStorage.getItem(STARS)) || []; } catch { return []; } })());
let filter = '', onlyStars = false;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function listHtml() {
  const f = filter.toLowerCase();
  const parts = SHEET.map(([sect, rows]) => [sect, rows.filter(([n, tex, note]) => unlocked(KEYS[n]) && (!onlyStars || stars.has(n))
    && (!f || `${sect} ${n} ${tex} ${note}`.toLowerCase().includes(f)))]).filter(([, rows]) => rows.length);
  if (!formulaCount()) return `<div class="empty locked"><p class="lock-ico">🔒</p><p><b>Formulas unlock as you upload your work.</b></p>
    <p>This sheet only shows formulas for things in your uploaded photos${hasUploads() ? ' – nothing uploaded so far matches a formula yet' : ''}.</p></div>`;
  if (!parts.length) return `<p class="empty">${onlyStars ? 'No starred formulas yet – tap ☆ on the ones you keep forgetting.' : 'No formulas match.'}</p>`;
  return parts.map(([sect, rows]) => `<section class="f-sect"><h3 class="sect-h">${esc(sect)}</h3><div class="f-grid">${rows.map(([n, tex, note]) => `
    <article class="f-card"><header><b>${esc(n)}</b><button class="f-star ${stars.has(n) ? 'on' : ''}" data-star="${esc(n)}" aria-label="Star ${esc(n)}">${stars.has(n) ? '★' : '☆'}</button></header>
      <div class="f-tex">$$${esc(tex)}$$</div>${note ? `<p>${esc(note)}</p>` : ''}</article>`).join('')}</div></section>`).join('');
}
export function formulasHtml() {
  return `<nav class="crumbs" aria-label="You are here"><a href="#/">Home</a> <span>›</span> <b>Formula sheet</b></nav>
    <div class="bar"><h2>Formula sheet</h2><div class="tools"><button data-f="stars" class="${onlyStars ? 'dark' : ''}">★ Starred</button><button data-f="print">Print</button></div></div>
    <p class="lead">Only formulas for what you've uploaded – ${formulaCount()} so far. More unlock as you upload more work.</p>
    <input class="f-search" id="f-search" type="search" placeholder="Search formulas – e.g. log, tangent, conditional" value="${esc(filter)}">
    <div id="f-list">${listHtml()}</div>`;
}
export function bindFormulas(main, { drawMaths }) {
  const refresh = () => { main.querySelector('#f-list').innerHTML = listHtml(); drawMaths(main.querySelector('#f-list')); };
  main.querySelector('#f-search').oninput = (e) => { filter = e.target.value; refresh(); };
  main.onclick = (ev) => {
    const s = ev.target.closest('[data-star]');
    if (s) { const n = s.dataset.star; stars.has(n) ? stars.delete(n) : stars.add(n); try { localStorage.setItem(STARS, JSON.stringify([...stars])); } catch { /* fine */ } return refresh(); }
    const b = ev.target.closest('[data-f]');
    if (b?.dataset.f === 'stars') { onlyStars = !onlyStars; b.classList.toggle('dark', onlyStars); refresh(); }
    if (b?.dataset.f === 'print') window.print();
  };
  drawMaths(main);
}
// How many formulas your uploads have unlocked (all = every formula on the sheet).
export const formulaCount = (all = false) => SHEET.reduce((n, [, r]) => n + r.filter(([name]) => all || unlocked(KEYS[name])).length, 0);
