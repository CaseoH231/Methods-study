// The study tools' maths: the graph plotter's formula reader, and the practice questions' answers – each checked a
// second, independent way (numeric derivatives, integrals and minimums of the question's own function).
const path = require('path');
(async () => {
  const { parse } = await import(path.join(__dirname, '..', 'graph.js'));
  const P = await import(path.join(__dirname, '..', 'practice.js'));
  const checks = []; const check = (n, ok) => checks.push(`${ok ? 'ok  ' : 'FAIL'} ${n}`);
  const near = (a, b, tol = 1e-6) => Math.abs(a - b) < tol;

  // Formula reader.
  const val = (s, x, p = {}) => parse(s).f({ a: 2, b: 3, c: 1, h: 1, k: -1, ...p, x });
  const cases = [['2x^2-3', 2, 5], ['a(x-h)^2+k', 3, 7], ['-x^2', 3, -9], ['2^3^2', 0, 512], ['sin x cos x', 1, Math.sin(1) * Math.cos(1)], ['(x+1)(x-1)', 3, 8],
    ['3sqrt(x)', 4, 6], ['e^x', 1, Math.E], ['ln(e^2)', 0, 2], ['log(1000)', 0, 3], ['|x-5|', 2, 3], ['2|x|+|x-1|', -1, 4], ['2pi', 0, 2 * Math.PI],
    ['x/2/2', 8, 2], ['sin^2(x)+cos^2(x)', 0.7, 1], ['a e^(b x)', 0, 2], ['3x²', 2, 12], ['x−1', 5, 4]];
  const wrong = cases.filter(([s, x, want]) => { try { return !near(val(s, x), want); } catch { return true; } });
  check(`graph: ${cases.length} formulas read and worked out correctly`, !wrong.length);
  if (wrong.length) console.log('wrong:', wrong.map((c) => c[0]).join(', '));
  const errs = ['2x+', '(x', 'y+1', 'x))', ''].map((s) => { try { parse(s); return null; } catch (e) { return e.message; } });
  check('graph: broken formulas give a helpful message, never a crash', errs.every((m) => typeof m === 'string' && m.length > 5));
  check('graph: letters become sliders', JSON.stringify(parse('a(x-h)^2+k').params) === '["a","h","k"]' && parse('2x+1').params.length === 0);

  // Practice answers, checked independently.
  let seed = 12345; const r = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const fn = (tex) => parse(tex.replace(/\{(-?\d+)\}/g, '$1').replace(/\\left|\\right/g, '')).f;
  const d = (f, x) => (f({ x: x + 1e-5 }) - f({ x: x - 1e-5 })) / 2e-5;
  const integrate = (f, a, b) => { let s = 0; const n = 2000, h = (b - a) / n; for (let i = 0; i < n; i++) { const x = a + (i + 0.5) * h; s += f({ x }) * h; } return s; };
  let made = 0, verified = 0; const bad = [];
  for (let i = 0; i < 4000; i++) {
    const q = P.makeQuestion(r, null, true); made++;
    if (q.choices) { if (!q.choices.includes(q.correct) || new Set(q.choices).size !== 4) bad.push(q.q); continue; }
    if (!Number.isFinite(q.a)) { bad.push(q.q); continue; }
    let m;
    if ((m = q.q.match(/f\(x\) = (.+?)\$, find \$f'\((-?\d+)\)/))) { verified++; if (!near(d(fn(m[1]), +m[2]), q.a, 1e-4)) bad.push(q.q); }
    else if ((m = q.q.match(/tangent to \$y = (.+?)\$ at the point \$\((-?\d+), (-?\d+)\)/))) { verified++; const f = fn(m[1]); if (!near(d(f, +m[2]), q.a, 1e-4) || !near(f({ x: +m[2] }), +m[3])) bad.push(q.q); }
    else if ((m = q.q.match(/rate of change of \$f\(x\) = (.+?)\$ from \$x = (-?\d+)\$ to \$x = (-?\d+)\$/))) { verified++; const f = fn(m[1]), a = +m[2], b = +m[3]; if (!near((f({ x: b }) - f({ x: a })) / (b - a), q.a)) bad.push(q.q); }
    else if ((m = q.q.match(/\\int_\{?(-?\d+)\}?\^\{(-?\d+)\} \(?(.+?)\)?\\,dx/))) { verified++; if (!near(integrate(fn(m[3]), +m[1], +m[2]), q.a, 1e-3)) bad.push(q.q); }
    else if ((m = q.q.match(/turning point of \$y = (.+?)\$/))) { verified++; const f = fn(m[1]); let lo = Infinity; for (let x = -20; x <= 20; x += 0.5) lo = Math.min(lo, f({ x })); if (!near(lo, q.a)) bad.push(q.q); }
    else if ((m = q.q.match(/Solve \$(.+?) = 0\$/))) { verified++; const f = fn(m[1]); if (!near(f({ x: q.a }), 0)) bad.push(q.q); }
    else if ((m = q.q.match(/Solve \$(\d+)\^\{x ([+-]) (\d+)\} = (\d+)\$/))) { verified++; if (!near((+m[1]) ** (q.a + (m[2] === '+' ? 1 : -1) * +m[3]), +m[4])) bad.push(q.q); }
  }
  check(`practice: ${made} questions, all with a proper answer`, made === 4000 && !bad.length);
  check(`practice: ${verified} answers re-checked independently (derivatives, integrals, roots, rates, turning points)`, verified > 1500 && !bad.length);
  if (bad.length) console.log('bad:', bad.slice(0, 5));
  check('practice: every topic has questions', P.TOPICS.every((t) => P.makeQuestion(r, t, true).topic === t));

  // Nothing is shown until it's been uploaded.
  const U = await import(path.join(__dirname, '..', 'unlock.js'));
  const F = await import(path.join(__dirname, '..', 'formulas.js'));
  U.setSources([]);
  check('locked: with nothing uploaded there are no questions and no formulas', P.makeQuestion(r) === null && P.unlockedTopics().length === 0 && F.formulaCount() === 0 && F.formulaCount(true) === 54);
  U.setSources(['Probability', 'Venn diagrams worksheet']);
  const probOnly = Array.from({ length: 200 }, () => P.makeQuestion(r).topic);
  check('unlocked: uploading probability work gives only probability questions and formulas', probOnly.every((t) => t === 'Probability')
    && JSON.stringify(P.unlockedTopics()) === '["Probability"]' && F.formulaCount() > 0 && F.formulaCount() < 15);
  U.setSources(['Logarithms', 'Ex 5A log laws']);
  check('unlocked: words must start the same – "catalogue" doesn’t unlock logs, "Log laws" does', P.unlockedTopics().join() === 'Exponentials & logs'
    && (U.setSources(['catalogue of photos']), P.unlockedTopics().length === 0));
  check('practice: answers can be typed as whole numbers, decimals or fractions', P.readAnswer('3/4') === 0.75 && P.readAnswer('-2.5') === -2.5 && P.readAnswer(' 7 ') === 7
    && P.readAnswer('−1/2') === -0.5 && Number.isNaN(P.readAnswer('abc')) && Number.isNaN(P.readAnswer('1/0')));
  check('practice: day streaks count back from today (or yesterday)', P.streak(['2026-11-18', '2026-11-19', '2026-11-20'], '2026-11-20') === 3
    && P.streak(['2026-11-18', '2026-11-19'], '2026-11-20') === 2 && P.streak(['2026-11-10'], '2026-11-20') === 0);

  console.log(checks.join('\n')); console.log(checks.every((c) => c.startsWith('ok')) ? 'tools ok' : 'tools FAILED');
})();
