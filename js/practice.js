/* global SOUNDINGS, QuizData, QuizChart */
// Practice page: identify chart features and plot data, with hints, retries and "Show me". Nothing is graded.
(function () {
  'use strict';
  const { NAMES, FIND, SERIES, plotItems, shuffle } = QuizData;
  const $ = id => document.getElementById(id);
  const svg = $('quizchart');

  // Links from the test results can open a particular skill, or start on one line,
  // e.g. ?skill=find&line=parcel. Every later round has all the lines.
  const params = new URLSearchParams(location.search);
  let skill = params.get('skill') === 'plot' ? 'plot' : 'find';
  let chart, round;

  SOUNDINGS.forEach((s, i) => $('sounding').add(new Option(s.name, i)));

  // Not every sounding has every feature: without an LFC there is no EL, CAPE or CIN shading.
  const roundItems = () => (skill === 'plot' ? plotItems(SOUNDINGS[$('sounding').value]) : FIND.filter(item => chart.has(item.kind)));

  // A round is a shuffled list of tasks. Pass items to repeat particular ones.
  function startRound(items) {
    chart = QuizChart.create(svg, SOUNDINGS[$('sounding').value]);
    const left = skill === 'find' ? FIND.filter(item => !chart.has(item.kind)).map(item => item.kind.toUpperCase()) : [];
    round = { left, items: shuffle((items || roundItems()).slice()), index: 0, done: [], hard: [], finished: false };
    freshTask();
    render();
  }
  const freshTask = () => Object.assign(round, { tries: 0, solved: false, picked: null, miss: null, hint: '' });
  const waiting = () => !round.finished && !round.solved;

  function feedback(message, kind = '') {
    $('feedback').textContent = message;
    $('feedback').className = kind;
  }

  function render() {
    const item = round.items[round.index];
    document.querySelectorAll('[data-skill]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.skill === skill)));
    document.querySelector('.quiz').classList.toggle('finished', round.finished && skill !== 'plot');
    svg.classList.toggle('plotting', skill === 'plot');
    svg.classList.toggle('unlabelled', skill === 'find');
    svg.classList.toggle('clickable', waiting());
    svg.setAttribute('aria-label', skill === 'plot' ? 'Blank Skew-T diagram. Click to plot the point.' : 'Skew-T diagram. Click the feature asked for.');
    $('figure').replaceChildren();
    chart.clear();
    $('reveal').hidden = !waiting();
    $('repeat').hidden = !(round.finished && round.hard.length);
    $('qnext').hidden = waiting();
    if (round.finished) return summary();

    $('qcount').textContent = `${round.index + 1} of ${round.items.length}`;
    $('qnext').textContent = round.index === round.items.length - 1 ? 'Finish round' : 'Next';
    if (skill === 'find') {
      $('question').textContent = item.q;
      if (round.solved) chart.showAnswer(item.kind, round.picked);
      else if (round.picked) chart.showAnswer(null, round.picked);
    } else {
      $('question').textContent = `Plot the ${SERIES[item.key].name.toLowerCase()}`;
      $('figure').appendChild(QuizChart.valueCard(item));
      chart.drawPoints({
        placed: round.done.concat(round.solved ? [item] : []),
        miss: round.solved ? null : round.miss,
        // After two misses, show which pressure line to use.
        guide: !round.solved && round.tries >= 2 ? item.p : null,
      });
    }
    const note = round.left.length && round.index === 0 ? ` This sounding has no ${round.left.join(', ').replace(/, (?=[^,]*$)/, ' or ')}, so this round leaves ${round.left.length > 1 ? 'them' : 'it'} out.` : '';
    if (!round.hint) feedback(skill === 'find' ? `Click or tap it on the chart.${note}` : 'Click or tap the chart where this point belongs.');
    else feedback(round.hint, round.good ? 'right' : 'wrong');
  }

  // Marks the current task finished. Anything that needed a second try or "Show me" is worth repeating.
  function solve(message, good) {
    const item = round.items[round.index];
    Object.assign(round, { solved: true, hint: message, good });
    if (round.tries > 0 || !good) round.hard.push(item);
    render();
    $('qnext').focus({ preventScroll: true });
  }

  function miss(message) {
    round.tries++;
    Object.assign(round, { hint: `✗ Not yet. ${message}`, good: false });
    render();
  }

  function answerFind(line) {
    const item = round.items[round.index];
    round.picked = line;
    if (line.kind === item.kind) solve(`✓ Correct! ${item.why}`, true);
    else miss(`You clicked ${NAMES[line.kind]}. Hint: ${item.why} Try again.`);
  }

  function answerPlot(point) {
    const item = round.items[round.index], hint = QuizChart.plotHint(point, item);
    if (!hint) return solve('✓ Correct!', true);
    round.miss = point;
    return miss(`${hint}${round.tries >= 1 ? ` The ${item.p} mb line is now highlighted.` : ''}`);
  }

  function summary() {
    $('qcount').textContent = 'Round complete';
    $('question').textContent = skill === 'plot' ? 'You plotted every point in this round' : 'You identified everything in this round';
    $('qnext').textContent = 'New round';
    if (skill === 'plot') chart.drawPoints({ placed: round.done });
    if (!round.hard.length) return feedback('All on the first try. Nice work!', 'right');
    feedback('Worth repeating: these needed another try or "Show me".');
    const list = document.createElement('ul');
    for (const item of round.hard) {
      const li = document.createElement('li');
      li.textContent = skill === 'plot' ? item.q.replace('Plot the ', '') : item.q;
      list.appendChild(li);
    }
    return $('figure').appendChild(list);
  }

  svg.addEventListener('pointermove', e => {
    if (skill !== 'find' || !waiting() || e.pointerType === 'touch') return chart.preview(null);
    return chart.preview(chart.lineAt(e, round.items[round.index].kind));
  });
  svg.addEventListener('pointerleave', () => chart.preview(null));
  svg.addEventListener('click', e => {
    if (!waiting()) return;
    if (skill === 'plot') {
      const point = chart.pointAt(e);
      if (point) answerPlot(point);
      return;
    }
    const line = chart.lineAt(e, round.items[round.index].kind);
    if (line) answerFind(line);
    else feedback('There is nothing to pick right there. Try again, a little closer.');
  });

  // "Show me" gives the answer, so nobody gets stuck, including keyboard users.
  $('reveal').addEventListener('click', () => {
    const item = round.items[round.index];
    round.picked = null;
    solve(skill === 'plot' ? `Here is where that point belongs. ${item.why}` : `Here is the answer, now highlighted. ${item.why}`, false);
  });
  $('qnext').addEventListener('click', () => {
    if (round.finished) startRound();
    else {
      round.done.push(round.items[round.index]);
      if (round.index === round.items.length - 1) round.finished = true;
      else {
        round.index++;
        freshTask();
      }
      render();
      window.scrollTo(0, 0); // back to the chart for the next task
    }
    $('question').focus({ preventScroll: true });
  });
  $('repeat').addEventListener('click', () => {
    startRound(round.hard);
    $('question').focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-skill]').forEach(b => b.addEventListener('click', () => {
    skill = b.dataset.skill;
    startRound();
  }));
  $('sounding').addEventListener('change', () => startRound());
  const linked = skill === 'find' ? FIND.filter(item => item.kind === params.get('line')) : [];
  startRound(linked.length ? linked : undefined);
})();
