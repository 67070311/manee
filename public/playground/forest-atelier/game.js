(() => {
  const $ = (s) => document.querySelector(s);
  const customerFrameSets = {
    monkey: Array.from({length: 6}, (_, i) => `./asset-game/client/monkey_walk_6_frames/monkey_walk_${String(i + 1).padStart(2, '0')}.png`),
    frog: Array.from({length: 6}, (_, i) => `./asset-game/client/frog/${i + 1}.png`)
  };
  const rabbitFrames = Array.from({length: 10}, (_, i) => `./asset-game/character/${i + 1}.png`);

  const state = {
    coins: 35,
    rep: 0,
    sold: 0,
    visitorIndex: 0,
    customerX: 103,
    targetX: 70.5,
    frame: 0,
    customerFrames: customerFrameSets.monkey,
    customerKind: 'monkey',
    walkTimer: 0,
    lastTime: 0,
    customerState: 'idle',
    currentRequest: null,
    currentArt: null,
    pendingOffer: 0,
    fairPrice: 0,
    score: 0,
    brushColor: '#d96a4d',
    brushSize: 18,
    tool: 'brush',
    painting: false,
    strokes: 0,
    undo: [],
    lastPoint: null
  };

  const requests = [
    {
      name: 'Milo the Forager',
      title: 'Something warm for the kitchen',
      text: 'My home feels a little empty. Could you paint something warm and cheerful?',
      mood: 'Warm & cheerful',
      tip: 'Warm reds, oranges and yellows make Milo happy.',
      colors: ['#d96a4d','#e8a044','#e6d36a'],
      base: 24,
      sprite: 'monkey'
    },
    {
      name: 'Juniper the Mapmaker',
      title: 'A calm picture of the woods',
      text: 'I have been walking all morning. I want a painting that feels quiet.',
      mood: 'Calm & natural',
      tip: 'Greens, blue-greens and open space fit this request.',
      colors: ['#477c57','#6f9a6b','#5f8fa3'],
      base: 30,
      sprite: 'frog'
    },
    {
      name: 'Pip the Berry Seller',
      title: 'Make it colorful!',
      text: 'My stall needs something people can spot from far away. Make it lively!',
      mood: 'Bright & lively',
      tip: 'Use several different colors and cover plenty of the canvas.',
      colors: ['#d96a4d','#e8a044','#e6d36a','#5f8fa3','#83619b'],
      base: 36,
      sprite: 'monkey'
    },
    {
      name: 'Old Rowan',
      title: 'Paint me something simple',
      text: 'Nothing too busy. I like pictures that know when to stop.',
      mood: 'Simple & balanced',
      tip: 'A little empty space is good. Two or three colors are enough.',
      colors: ['#385d3a','#d1b87a','#7c6049'],
      base: 42,
      sprite: 'frog'
    }
  ];

  const paletteColors = ['#385d3a','#6f9a6b','#5f8fa3','#4e70a7','#83619b','#d96a4d','#e8a044','#e6d36a','#7c6049','#2f3130','#f1ead0','#ffffff'];

  const els = {
    intro: $('#intro'),
    start: $('#startBtn'),
    customerWrap: $('#customerWrap'),
    customer: $('#customer'),
    speech: $('#speech'),
    speechName: $('#speechName'),
    speechText: $('#speechText'),
    speechActions: $('#speechActions'),
    station: $('#paintingStation'),
    artPreview: $('#artPreview'),
    paintNow: $('#paintNowBtn'),
    paintOverlay: $('#paintOverlay'),
    paintCanvas: $('#paintCanvas'),
    palette: $('#palette'),
    commissionTitle: $('#commissionTitle'),
    commissionBrief: $('#commissionBrief'),
    requestMood: $('#requestMood'),
    requestTip: $('#requestTip'),
    closePaint: $('#closePaintBtn'),
    brushSizeSlider: $('#brushSizeSlider'),
    brushSizeValue: $('#brushSizeValue'),
    brushToolBtn: $('#brushToolBtn'),
    fillBtn: $('#fillBtn'),
    undo: $('#undoBtn'),
    clear: $('#clearBtn'),
    finish: $('#finishBtn'),
    strokeCount: $('#strokeCount'),
    coverageValue: $('#coverageValue'),
    resultOverlay: $('#resultOverlay'),
    resultArt: $('#resultArt'),
    resultQuote: $('#resultQuote'),
    resultReason: $('#resultReason'),
    offerValue: $('#offerValue'),
    scoreValue: $('#scoreValue'),
    priceInput: $('#priceInput'),
    sell: $('#sellBtn'),
    decline: $('#declineBtn'),
    coinValue: $('#coinValue'),
    repValue: $('#repValue'),
    soldCount: $('#soldCount'),
    careerFill: $('#careerFill'),
    careerText: $('#careerText'),
    journal: $('#journal'),
    journalBtn: $('#journalBtn'),
    journalClose: $('#journalClose'),
    toast: $('#toast'),
    taskTitle: $('#taskTitle'),
    taskText: $('#taskText'),
    taskProgress: $('#taskProgress')
  };

  const ctx = els.paintCanvas.getContext('2d', { willReadFrequently: true });

  // The rabbit is the resident painter: it never walks away.
  // Its 10 supplied frames are played in place as a gentle painting/idle loop.
  const rabbitPainter = $('#rabbitPainter');
  const warmQueue=[...customerFrameSets.monkey,...rabbitFrames.slice(1),...customerFrameSets.frog];
  let warmIndex=0;
  function warmNext(){
    let count=0;
    while(warmIndex<warmQueue.length&&count<2){
      const img=new Image();
      img.decoding="async";
      img.src=warmQueue[warmIndex++];
      count++;
    }
    if(warmIndex<warmQueue.length){
      if("requestIdleCallback" in window)window.requestIdleCallback(warmNext,{timeout:1200});
      else window.setTimeout(warmNext,210);
    }
  }
  if("requestIdleCallback" in window)window.requestIdleCallback(warmNext,{timeout:1600});
  else window.setTimeout(warmNext,500);
  let rabbitFrame = 0;
  let rabbitTimer = 0;
  let rabbitLastTime = 0;

  function animateRabbitPainter(t) {
    const dt = Math.min(60, t - (rabbitLastTime || t));
    rabbitLastTime = t;
    rabbitTimer += dt;
    if (rabbitPainter && rabbitTimer > 180) {
      rabbitTimer = 0;
      rabbitFrame = (rabbitFrame + 1) % rabbitFrames.length;
      rabbitPainter.src = rabbitFrames[rabbitFrame];
    }
    window.setTimeout(()=>requestAnimationFrame(animateRabbitPainter),66);
  }

  function initPalette() {
    els.palette.innerHTML = '';
    paletteColors.forEach((color, i) => {
      const b = document.createElement('button');
      b.className = 'color-swatch' + (i === 5 ? ' active' : '');
      b.style.background = color;
      b.setAttribute('aria-label', color);
      b.addEventListener('click', () => {
        state.brushColor = color;
        document.querySelectorAll('.color-swatch').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
      els.palette.appendChild(b);
    });
  }

  function resetCanvas() {
    ctx.clearRect(0, 0, els.paintCanvas.width, els.paintCanvas.height);
    state.strokes = 0;
    state.undo = [];
    updateCanvasStats();
  }

  function saveUndo() {
    if (state.undo.length > 14) state.undo.shift();
    state.undo.push(ctx.getImageData(0, 0, els.paintCanvas.width, els.paintCanvas.height));
  }

  function getPoint(e) {
    const r = els.paintCanvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (els.paintCanvas.width / r.width);
    const y = (e.clientY - r.top) * (els.paintCanvas.height / r.height);
    return {x, y};
  }

  function hexToRgba(hex) {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
      255
    ];
  }

  function floodFill(x, y, hex) {
    const w = els.paintCanvas.width;
    const h = els.paintCanvas.height;
    const sx = Math.max(0, Math.min(w - 1, Math.floor(x)));
    const sy = Math.max(0, Math.min(h - 1, Math.floor(y)));
    const image = ctx.getImageData(0, 0, w, h);
    const data = image.data;
    const start = (sy * w + sx) * 4;
    const target = [data[start], data[start + 1], data[start + 2], data[start + 3]];
    const fill = hexToRgba(hex);

    if (target.every((v, i) => v === fill[i])) return false;

    const same = (idx) =>
      Math.abs(data[idx] - target[0]) < 5 &&
      Math.abs(data[idx + 1] - target[1]) < 5 &&
      Math.abs(data[idx + 2] - target[2]) < 5 &&
      Math.abs(data[idx + 3] - target[3]) < 5;

    const stack = [sy * w + sx];
    const seen = new Uint8Array(w * h);

    while (stack.length) {
      const pos = stack.pop();
      if (seen[pos]) continue;
      seen[pos] = 1;

      const idx = pos * 4;
      if (!same(idx)) continue;

      data[idx] = fill[0];
      data[idx + 1] = fill[1];
      data[idx + 2] = fill[2];
      data[idx + 3] = fill[3];

      const cx = pos % w;
      const cy = (pos / w) | 0;
      if (cx > 0) stack.push(pos - 1);
      if (cx < w - 1) stack.push(pos + 1);
      if (cy > 0) stack.push(pos - w);
      if (cy < h - 1) stack.push(pos + w);
    }

    ctx.putImageData(image, 0, 0);
    return true;
  }

  function setPaintTool(tool) {
    state.tool = tool;
    els.brushToolBtn.classList.toggle('active', tool === 'brush');
    els.fillBtn.classList.toggle('active', tool === 'fill');
    els.paintCanvas.classList.toggle('fill-mode', tool === 'fill');
  }

  function beginPaint(e) {
    e.preventDefault();
    const p = getPoint(e);

    if (state.tool === 'fill') {
      saveUndo();
      if (floodFill(p.x, p.y, state.brushColor)) {
        state.strokes += 1;
        updateCanvasStats();
      }
      return;
    }

    saveUndo();
    state.painting = true;
    state.strokes += 1;
    state.lastPoint = p;
    ctx.beginPath();
    ctx.arc(state.lastPoint.x, state.lastPoint.y, state.brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = state.brushColor;
    ctx.fill();
    updateCanvasStats();
  }

  function movePaint(e) {
    if (state.tool !== 'brush' || !state.painting) return;
    e.preventDefault();
    const p = getPoint(e);
    ctx.strokeStyle = state.brushColor;
    ctx.lineWidth = state.brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(state.lastPoint.x, state.lastPoint.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    state.lastPoint = p;
  }

  function endPaint() {
    state.painting = false;
    state.lastPoint = null;
  }

  function approximateCoverage() {
    const w = els.paintCanvas.width, h = els.paintCanvas.height;
    const img = ctx.getImageData(0, 0, w, h).data;
    let painted = 0, total = 0;
    const step = 12;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const i = (y * w + x) * 4;
        if (img[i + 3] > 12) painted++;
        total++;
      }
    }
    return painted / total;
  }

  function getUsedColorStats() {
    const w = els.paintCanvas.width, h = els.paintCanvas.height;
    const img = ctx.getImageData(0, 0, w, h).data;
    const bins = new Map();
    for (let y = 0; y < h; y += 14) {
      for (let x = 0; x < w; x += 14) {
        const i = (y * w + x) * 4;
        if (img[i + 3] <= 12) continue;
        const r = img[i], g = img[i+1], b = img[i+2];
        const key = `${Math.round(r/48)}-${Math.round(g/48)}-${Math.round(b/48)}`;
        bins.set(key, (bins.get(key) || 0) + 1);
      }
    }
    return bins.size;
  }

  function updateCanvasStats() {
    els.strokeCount.textContent = `${state.strokes} stroke${state.strokes === 1 ? '' : 's'}`;
    const c = Math.round(approximateCoverage() * 100);
    els.coverageValue.textContent = `${c}% coverage`;
  }

  function showToast(text) {
    els.toast.textContent = text;
    els.toast.classList.remove('hidden');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => els.toast.classList.add('hidden'), 2000);
  }

  function updateHud() {
    els.coinValue.textContent = state.coins;
    els.repValue.textContent = state.rep;
    els.soldCount.textContent = state.sold;
    const pct = Math.min(100, state.rep * 2);
    els.careerFill.style.width = pct + '%';
    const rank = state.rep < 12 ? 'Unknown painter' : state.rep < 28 ? 'Local favorite' : state.rep < 48 ? 'Forest artist' : 'Celebrated painter';
    els.careerText.textContent = `${rank} — ${state.rep} reputation`;
  }

  function updateTask(stage) {
    if (stage === 'waiting') {
      els.taskTitle.textContent = 'Wait for a customer';
      els.taskText.textContent = 'Someone from the forest is on the way to your little studio.';
      els.taskProgress.style.width = '24%';
    } else if (stage === 'commission') {
      els.taskTitle.textContent = 'Accept the commission';
      els.taskText.textContent = 'Read what the visitor wants, then paint your interpretation.';
      els.taskProgress.style.width = '46%';
    } else if (stage === 'paint') {
      els.taskTitle.textContent = 'Make the painting';
      els.taskText.textContent = 'Use the colors, brush sizes and canvas however you like.';
      els.taskProgress.style.width = '68%';
    } else if (stage === 'offer') {
      els.taskTitle.textContent = 'Decide on the offer';
      els.taskText.textContent = 'Choose your asking price. A fair price sells; an absurd one may offend the customer.';
      els.taskProgress.style.width = '84%';
    } else if (stage === 'sold') {
      els.taskTitle.textContent = 'Build your reputation';
      els.taskText.textContent = 'More customers will visit. Each one values a different kind of art.';
      els.taskProgress.style.width = '100%';
    }
  }

  function currentRequest() {
    return requests[state.visitorIndex % requests.length];
  }

  function setupRequestUI() {
    const r = state.currentRequest;
    els.commissionTitle.textContent = r.title;
    els.commissionBrief.textContent = r.text;
    els.requestMood.textContent = r.mood;
    els.requestTip.textContent = r.tip;
  }

  function spawnCustomer(delay = 700) {
    state.currentRequest = currentRequest();
    state.customerX = 105;
    state.targetX = 70.5;
    state.frame = 0;
    state.customerKind = state.currentRequest.sprite || 'monkey';
    state.customerFrames = customerFrameSets[state.customerKind] || customerFrameSets.monkey;
    state.customerState = 'waiting';
    els.customer.src = state.customerFrames[0];
    els.customerWrap.dataset.kind = state.customerKind;
    els.customerWrap.style.left = state.customerX + '%';
    els.customerWrap.classList.remove('hidden');
    els.speech.classList.add('hidden');
    updateTask('waiting');
    setTimeout(() => state.customerState = 'entering', delay);
  }

  function animateCustomer(t) {
    const dt = Math.min(40, t - (state.lastTime || t));
    state.lastTime = t;

    if (state.customerState === 'entering') {
      state.customerX -= dt * 0.012;
      state.walkTimer += dt;
      if (state.walkTimer > 88) {
        state.walkTimer = 0;
        state.frame = (state.frame + 1) % state.customerFrames.length;
        els.customer.src = state.customerFrames[state.frame];
      }
      if (state.customerX <= state.targetX) {
        state.customerX = state.targetX;
        state.customerState = 'talking';
        showRequestBubble();
      }
      els.customerWrap.style.left = state.customerX + '%';
    } else if (state.customerState === 'leaving') {
      state.customerX -= dt * 0.015;
      state.walkTimer += dt;
      if (state.walkTimer > 78) {
        state.walkTimer = 0;
        state.frame = (state.frame + 1) % state.customerFrames.length;
        els.customer.src = state.customerFrames[state.frame];
      }
      els.customerWrap.style.left = state.customerX + '%';
      if (state.customerX < -20) {
        state.customerState = 'idle';
        els.customerWrap.classList.add('hidden');
        state.visitorIndex += 1;
        spawnCustomer(900);
      }
    }
    const active=state.customerState==='entering'||state.customerState==='leaving';
    if(active)requestAnimationFrame(animateCustomer);
    else window.setTimeout(()=>requestAnimationFrame(animateCustomer),110);
  }

  function showRequestBubble() {
    const r = state.currentRequest;
    els.speechName.textContent = r.name.toUpperCase();
    els.speechText.textContent = r.text;
    els.speechActions.innerHTML = '';

    const accept = document.createElement('button');
    accept.textContent = 'TAKE COMMISSION';
    accept.onclick = openPaint;

    const later = document.createElement('button');
    later.textContent = 'NOT NOW';
    later.className = 'ghost';
    later.onclick = () => {
      els.speech.classList.add('hidden');
      els.paintNow.classList.remove('hidden');
    };

    els.speechActions.append(accept, later);
    els.speech.classList.remove('hidden');
    updateTask('commission');
  }

  function openPaint() {
    if (!state.currentRequest) return;
    setupRequestUI();
    resetCanvas();
    els.speech.classList.add('hidden');
    els.paintNow.classList.add('hidden');
    els.paintOverlay.classList.remove('hidden');
    updateTask('paint');
  }

  function closePaint() {
    els.paintOverlay.classList.add('hidden');
    els.paintNow.classList.remove('hidden');
  }

  function colorDistance(hexA, hexB) {
    const parse = h => [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
    const a = parse(hexA), b = parse(hexB);
    return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
  }

  function scorePainting() {
    const coverage = approximateCoverage();
    const diversity = getUsedColorStats();
    const r = state.currentRequest;

    let coverageScore;
    if (r.mood.includes('Simple')) {
      coverageScore = 100 - Math.min(100, Math.abs(coverage - .34) * 190);
    } else {
      coverageScore = Math.min(100, coverage * 180);
    }

    const diversityTarget = r.mood.includes('Bright') ? 10 : r.mood.includes('Simple') ? 4 : 7;
    const diversityScore = 100 - Math.min(100, Math.abs(diversity - diversityTarget) * 10);

    const img = ctx.getImageData(0, 0, els.paintCanvas.width, els.paintCanvas.height).data;
    const sampled = [];
    for (let y = 0; y < els.paintCanvas.height; y += 24) {
      for (let x = 0; x < els.paintCanvas.width; x += 24) {
        const i = (y * els.paintCanvas.width + x) * 4;
        const rr=img[i], gg=img[i+1], bb=img[i+2], aa=img[i+3];
        if (aa <= 12) continue;
        sampled.push('#' + [rr,gg,bb].map(v=>v.toString(16).padStart(2,'0')).join(''));
      }
    }

    let moodScore = 45;
    if (sampled.length) {
      const hits = sampled.reduce((sum, c) => {
        const best = Math.min(...r.colors.map(target => colorDistance(c, target)));
        return sum + Math.max(0, 1 - best / 230);
      }, 0);
      moodScore = Math.min(100, (hits / sampled.length) * 145);
    }

    const strokeScore = Math.min(100, state.strokes * 8);
    let score = Math.round(coverageScore * .34 + diversityScore * .18 + moodScore * .34 + strokeScore * .14);
    if (coverage < .035) score = Math.min(score, 24);
    return Math.max(5, Math.min(100, score));
  }

  const rudePriceLines = [
    'Are you stupid?',
    'Be serious. I am not paying that.',
    'That price is ridiculous.',
    'Did you paint this with gold?',
    'No chance. That is absurd.'
  ];

  function finishPainting() {
    const score = scorePainting();
    const data = els.paintCanvas.toDataURL('image/png');

    state.score = score;
    state.currentArt = data;
    state.fairPrice = Math.max(8, Math.round(state.currentRequest.base * (.55 + score / 72)));
    state.pendingOffer = state.fairPrice;

    els.paintOverlay.classList.add('hidden');
    els.resultArt.src = data;
    els.scoreValue.textContent = score;
    els.offerValue.textContent = state.fairPrice;
    els.priceInput.value = state.fairPrice;

    let quote, reason;
    if (score >= 86) {
      quote = '“This is exactly what I hoped for.”';
      reason = 'Excellent match. You can probably ask a little above the fair value.';
    } else if (score >= 68) {
      quote = '“Oh… I really like this.”';
      reason = 'A strong painting. The customer is willing to pay a fair price.';
    } else if (score >= 48) {
      quote = '“It has something.”';
      reason = 'Interesting, but the customer may push back if you price it too high.';
    } else {
      quote = '“Hmm. It is… certainly a painting.”';
      reason = 'They are not fully convinced. Price carefully.';
    }

    els.resultQuote.textContent = quote;
    els.resultReason.textContent = reason;
    els.resultOverlay.classList.remove('hidden');
    updateTask('offer');

    requestAnimationFrame(() => {
      els.priceInput.focus();
      els.priceInput.select();
    });
  }

  function finalizeSale(price, line) {
    const repGain = Math.max(1, Math.round(state.score / 18));
    state.coins += price;
    state.rep += repGain;
    state.sold += 1;
    updateHud();

    els.resultOverlay.classList.add('hidden');
    els.artPreview.style.backgroundColor = 'transparent';
    els.artPreview.style.backgroundImage = `url("${state.currentArt}")`;
    els.artPreview.classList.add('show');

    showToast(`Sold for ${price} coins  •  +${repGain} reputation`);
    updateTask('sold');

    els.speechName.textContent = state.currentRequest.name.toUpperCase();
    els.speechText.textContent = line;
    els.speechActions.innerHTML = '';
    els.speech.classList.remove('hidden');

    setTimeout(() => {
      els.speech.classList.add('hidden');
      state.customerState = 'leaving';
    }, 3200);
  }

  function askCustomPrice() {
    const asked = Math.max(1, Math.round(Number(els.priceInput.value || 0)));
    const fair = state.fairPrice;

    if (!Number.isFinite(asked) || asked < 1) {
      showToast('Enter a valid price');
      return;
    }

    // A bargain: always accepted.
    if (asked <= Math.floor(fair * .75)) {
      finalizeSale(asked, 'That is a bargain. Deal!');
      return;
    }

    // Fair/slightly ambitious: accepted.
    if (asked <= Math.ceil(fair * 1.15)) {
      finalizeSale(asked, state.score >= 68 ? 'Deal. I am happy with that.' : 'Alright. I will take it.');
      return;
    }

    // High, but not insulting: customer counters and stays.
    if (asked <= Math.ceil(fair * 1.55)) {
      els.resultQuote.textContent = `“Too much. I can do ${fair}.”`;
      els.resultReason.textContent = 'The customer pushed back. Lower your asking price and try again.';
      els.priceInput.classList.add('price-shake');
      setTimeout(() => els.priceInput.classList.remove('price-shake'), 420);
      showToast('Customer countered your price');
      return;
    }

    // Ridiculous price: customer gets offended and leaves.
    const rude = rudePriceLines[Math.floor(Math.random() * rudePriceLines.length)];
    els.resultQuote.textContent = `“${rude}”`;
    els.resultReason.textContent = `You asked ${asked} coins for a painting they value around ${fair}. They are done negotiating.`;
    els.priceInput.classList.add('price-shake');
    showToast('Customer is offended by the price');

    setTimeout(() => {
      els.resultOverlay.classList.add('hidden');
      els.priceInput.classList.remove('price-shake');

      els.speechName.textContent = state.currentRequest.name.toUpperCase();
      els.speechText.textContent = rude;
      els.speechActions.innerHTML = '';
      els.speech.classList.remove('hidden');

      setTimeout(() => {
        els.speech.classList.add('hidden');
        state.customerState = 'leaving';
      }, 3000);
    }, 1400);
  }

  function declineOffer() {
    els.resultOverlay.classList.add('hidden');
    els.artPreview.style.backgroundColor = 'transparent';
    els.artPreview.style.backgroundImage = `url("${state.currentArt}")`;
    els.artPreview.classList.add('show');

    showToast('You kept the painting');
    els.speechName.textContent = state.currentRequest.name.toUpperCase();
    els.speechText.textContent = 'Fair enough. Perhaps another day.';
    els.speechActions.innerHTML = '';
    els.speech.classList.remove('hidden');

    setTimeout(() => {
      els.speech.classList.add('hidden');
      state.customerState = 'leaving';
    }, 2600);
  }

  let gameStarted=false;
  els.start.addEventListener('click', () => {
    if(gameStarted)return;
    gameStarted=true;
    els.intro.classList.add('hidden');
    spawnCustomer();
    requestAnimationFrame(animateCustomer);
    requestAnimationFrame(animateRabbitPainter);
  });

  els.station.addEventListener('click', () => {
    if (state.currentRequest) openPaint();
    else showToast('Wait for a customer to request a painting');
  });

  els.paintNow.addEventListener('click', openPaint);
  els.closePaint.addEventListener('click', closePaint);
  els.finish.addEventListener('click', finishPainting);
  els.sell.addEventListener('click', askCustomPrice);
  els.decline.addEventListener('click', declineOffer);
  els.priceInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') askCustomPrice();
  });
  els.priceInput.addEventListener('blur', () => {
    const value = Math.round(Number(els.priceInput.value || state.fairPrice || 1));
    els.priceInput.value = Math.max(1, value);
  });

  els.undo.addEventListener('click', () => {
    const prev = state.undo.pop();
    if (prev) {
      ctx.putImageData(prev, 0, 0);
      state.strokes = Math.max(0, state.strokes - 1);
      updateCanvasStats();
    }
  });

  els.clear.addEventListener('click', () => {
    saveUndo();
    ctx.clearRect(0, 0, els.paintCanvas.width, els.paintCanvas.height);
    state.strokes = 0;
    updateCanvasStats();
  });

  els.brushSizeSlider.addEventListener('input', () => {
    state.brushSize = Number(els.brushSizeSlider.value);
    els.brushSizeValue.textContent = `${state.brushSize} px`;
    setPaintTool('brush');
  });

  els.brushToolBtn.addEventListener('click', () => setPaintTool('brush'));
  els.fillBtn.addEventListener('click', () => setPaintTool('fill'));

  els.paintCanvas.addEventListener('pointerdown', beginPaint);
  els.paintCanvas.addEventListener('pointermove', movePaint);
  window.addEventListener('pointerup', endPaint);
  els.paintCanvas.addEventListener('pointerleave', endPaint);

  els.journalBtn.addEventListener('click', () => els.journal.classList.remove('hidden'));
  els.journalClose.addEventListener('click', () => els.journal.classList.add('hidden'));

  window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !els.paintOverlay.classList.contains('hidden')) {
      e.preventDefault();
      els.undo.click();
    }
    if (e.key === 'Escape') {
      if (!els.journal.classList.contains('hidden')) els.journal.classList.add('hidden');
      else if (!els.paintOverlay.classList.contains('hidden')) closePaint();
    }
  });

  initPalette();
  resetCanvas();
  setPaintTool('brush');
  els.brushSizeValue.textContent = `${state.brushSize} px`;
  updateHud();
})();