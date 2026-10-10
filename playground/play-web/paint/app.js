(() => {
  const ASSETS = {
    original: './orginal.png',
    bubble: './bubble.png',
    jelly: './jelly.png',
    pixel: './pixel.png',
  }

  const MODE_COPY = {
    original: 'Each material has its own brush behaviour.',
    bubble: 'Slow strokes bloom wider. Fast strokes leave tighter bubbles and glowing rims.',
    jelly: 'The brush stretches, thins and refracts depending on how fast you move.',
    pixel: 'Speed changes the grid density while the edge breaks into chromatic blocks.',
  }

  const BRUSH_CSS = {
    bubble: 126,
    jelly: 140,
    pixel: 112,
  }

  const COMPLETION_THRESHOLD = 88

  const stage = document.getElementById('imageStage')
  const bottomCanvas = document.getElementById('bottomCanvas')
  const topCanvas = document.getElementById('topCanvas')
  const effectsCanvas = document.getElementById('effectsCanvas')
  const bottomCtx = bottomCanvas.getContext('2d', { alpha: true })
  const topCtx = topCanvas.getContext('2d', { alpha: true })
  const effectsCtx = effectsCanvas.getContext('2d', { alpha: true })
  const brushPreview = document.getElementById('brushPreview')
  const resetButton = document.getElementById('resetButton')
  const modeButtons = [...document.querySelectorAll('.mode-button')]
  const statusText = document.getElementById('statusText')
  const statusDot = document.getElementById('statusDot')
  const emptyHint = document.getElementById('emptyHint')
  const progressValue = document.getElementById('progressValue')
  const progressBar = document.getElementById('progressBar')
  const modeDescription = document.getElementById('modeDescription')
  const modeFlash = document.getElementById('modeFlash')
  const completionMoment = document.getElementById('completionMoment')
  const completionMode = document.getElementById('completionMode')
  const completionLabel = document.getElementById('completionLabel')

  const images = {}
  const organicBrush = createOrganicBrush(256)
  const softBrush = createSoftBrush(256)

  let mode = 'original'
  let ready = false
  let pointerDown = false
  let lastPoint = null
  let firstPainted = false
  let naturalWidth = 1
  let naturalHeight = 1
  let lastTime = performance.now()
  let effectsRaf = 0
  let progressRaf = 0
  let flashTimer = 0
  let completionTimer = 0
  let completionShown = false
  let lastProgressPercent = 0
  let edgeGate = 0

  const particles = []
  const edgeTrails = []
  const progressGrid = {
    cols: 56,
    rows: 32,
    cells: new Set(),
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value))
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error(`Could not load ${src}`))
      image.src = src
    })
  }

  async function preload() {
    try {
      const entries = await Promise.all(
        Object.entries(ASSETS).map(async ([key, src]) => [key, await loadImage(src)]),
      )

      entries.forEach(([key, image]) => {
        images[key] = image
      })

      naturalWidth = images.original.naturalWidth
      naturalHeight = images.original.naturalHeight

      if (entries.some(([, image]) => image.naturalWidth !== naturalWidth || image.naturalHeight !== naturalHeight)) {
        console.warn('Reveal images do not all share the exact same pixel dimensions. Alignment may differ.')
      }

      setupCanvas()
      ready = true
      renderBottom()
      resetTop()
      updateModeUI()
    } catch (error) {
      console.error(error)
      statusText.textContent = 'Could not load one or more images'
      statusDot.style.background = '#c64242'
    }
  }

  function setupCanvas() {
    ;[bottomCanvas, topCanvas, effectsCanvas].forEach((canvas) => {
      canvas.width = naturalWidth
      canvas.height = naturalHeight
    })

    stage.style.aspectRatio = `${naturalWidth} / ${naturalHeight}`
    stage.style.setProperty('--paint-aspect', String(naturalWidth / naturalHeight))
    // Preserve source aspect ratio while fitting the landscape demo viewport.
    const fitPortfolioStage = () => {
      const availableHeight = Math.max(200, window.innerHeight - 184)
      stage.style.setProperty('--paint-max-width', Math.round(availableHeight * naturalWidth / naturalHeight) + 'px')
    }
    fitPortfolioStage()
    window.addEventListener('resize', fitPortfolioStage, { passive: true })
    bottomCtx.imageSmoothingEnabled = true
    bottomCtx.imageSmoothingQuality = 'high'
    topCtx.imageSmoothingEnabled = true
    topCtx.imageSmoothingQuality = 'high'
    effectsCtx.imageSmoothingEnabled = true
    effectsCtx.imageSmoothingQuality = 'high'
  }

  function renderBottom() {
    if (!ready) return
    const revealImage = mode === 'original' ? images.original : images[mode]
    bottomCtx.globalCompositeOperation = 'source-over'
    bottomCtx.clearRect(0, 0, naturalWidth, naturalHeight)
    bottomCtx.drawImage(revealImage, 0, 0, naturalWidth, naturalHeight)
  }

  function resetTop() {
    if (!ready) return
    topCtx.globalCompositeOperation = 'source-over'
    topCtx.clearRect(0, 0, naturalWidth, naturalHeight)
    topCtx.drawImage(images.original, 0, 0, naturalWidth, naturalHeight)
    topCtx.globalCompositeOperation = 'destination-out'

    effectsCtx.clearRect(0, 0, naturalWidth, naturalHeight)
    particles.length = 0
    edgeTrails.length = 0
    progressGrid.cells.clear()
    lastPoint = null
    firstPainted = false
    completionShown = false
    lastProgressPercent = 0
    hideCompletionMoment()
    updateProgress()
    updateHint()
  }

  function resetReveal() {
    resetTop()
    renderBottom()
    pulseReset()
  }

  function setMode(nextMode) {
    if (!ready || !ASSETS[nextMode] || nextMode === mode) return
    mode = nextMode
    renderBottom()
    resetTop()
    updateModeUI()
    triggerModeFlash()
  }

  function triggerModeFlash() {
    clearTimeout(flashTimer)
    modeFlash.className = `mode-flash show ${mode}`
    flashTimer = window.setTimeout(() => {
      modeFlash.className = 'mode-flash'
    }, 320)
  }

  function pulseReset() {
    resetButton.classList.remove('popped')
    void resetButton.offsetWidth
    resetButton.classList.add('popped')
  }

  function updateModeUI() {
    modeButtons.forEach((button) => {
      const active = button.dataset.mode === mode
      button.classList.toggle('active', active)
      button.setAttribute('aria-pressed', String(active))
    })

    stage.classList.remove('mode-bubble', 'mode-jelly', 'mode-pixel')
    const painting = mode !== 'original'
    stage.classList.toggle('paint-mode', painting)
    stage.classList.toggle('original-mode', !painting)
    if (painting) stage.classList.add(`mode-${mode}`)

    brushPreview.classList.remove('visible')
    brushPreview.className = `brush-preview ${painting ? `preview-${mode}` : ''}`

    if (!painting) {
      statusText.textContent = 'Original image'
      statusDot.style.background = '#b8b1a8'
      statusDot.style.boxShadow = '0 0 0 4px rgba(184,177,168,.12)'
    } else {
      const label = mode.charAt(0).toUpperCase() + mode.slice(1)
      statusText.textContent = `${label} · move cursor to paint`
      statusDot.style.background = mode === 'pixel' ? '#35533a' : mode === 'jelly' ? '#8051d8' : '#8f72dd'
      statusDot.style.boxShadow = '0 0 0 4px rgba(17,17,17,.08)'
    }

    modeDescription.textContent = MODE_COPY[mode]
    updateHint()
  }

  function updateHint() {
    if (mode === 'original') {
      emptyHint.classList.remove('hidden')
      emptyHint.querySelector('strong').textContent = 'Choose a style'
      emptyHint.querySelector('small').textContent = 'Each style reveals with a different material behaviour.'
      return
    }

    if (firstPainted) {
      emptyHint.classList.add('hidden')
      return
    }

    const label = mode.charAt(0).toUpperCase() + mode.slice(1)
    emptyHint.classList.remove('hidden')
    emptyHint.querySelector('strong').textContent = `Paint to reveal ${label}`
    emptyHint.querySelector('small').textContent = mode === 'pixel'
      ? 'Move slowly for larger blocks. Move fast for a tighter glitch grid.'
      : mode === 'jelly'
        ? 'The faster you move, the thinner and longer the jelly becomes.'
        : 'Slow strokes bloom wider. Fast strokes make tighter bubbles.'
  }

  function createOrganicBrush(size) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const center = size / 2
    const radius = size * 0.49
    const points = 38

    ctx.save()
    ctx.beginPath()
    for (let index = 0; index <= points; index += 1) {
      const angle = (index / points) * Math.PI * 2
      const wobble = Math.sin(index * 1.83) * size * 0.018 + Math.cos(index * 3.11) * size * 0.012
      const r = radius * 0.94 + wobble
      const x = center + Math.cos(angle) * r
      const y = center + Math.sin(angle) * r
      index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.clip()

    const gradient = ctx.createRadialGradient(center, center, size * 0.07, center, center, radius)
    gradient.addColorStop(0, 'rgba(0,0,0,1)')
    gradient.addColorStop(.56, 'rgba(0,0,0,.98)')
    gradient.addColorStop(.78, 'rgba(0,0,0,.72)')
    gradient.addColorStop(.92, 'rgba(0,0,0,.22)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    ctx.restore()
    return canvas
  }

  function createSoftBrush(size) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    const c = size / 2
    const g = ctx.createRadialGradient(c, c, 0, c, c, c)
    g.addColorStop(0, 'rgba(0,0,0,1)')
    g.addColorStop(.64, 'rgba(0,0,0,.96)')
    g.addColorStop(.84, 'rgba(0,0,0,.5)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return canvas
  }

  function pointerToCanvas(event) {
    const rect = stage.getBoundingClientRect()
    const localX = event.clientX - rect.left
    const localY = event.clientY - rect.top
    if (localX < 0 || localY < 0 || localX > rect.width || localY > rect.height) return null

    return {
      x: (localX / rect.width) * naturalWidth,
      y: (localY / rect.height) * naturalHeight,
      localX,
      localY,
      scale: naturalWidth / rect.width,
      time: performance.now(),
    }
  }

  function getBrushPhysics(point, previous) {
    if (!previous) {
      return { speed: 0, normalized: 0, angle: 0, directionX: 0, directionY: 0 }
    }

    const dx = point.x - previous.x
    const dy = point.y - previous.y
    const distanceCanvas = Math.hypot(dx, dy)
    const distanceCss = distanceCanvas / Math.max(.001, point.scale)
    const dt = Math.max(6, point.time - previous.time)
    const speed = distanceCss / dt
    const normalized = clamp(speed / 1.55, 0, 1)
    const angle = Math.atan2(dy, dx)
    const length = Math.max(.001, distanceCanvas)

    return {
      speed,
      normalized,
      angle,
      directionX: dx / length,
      directionY: dy / length,
    }
  }

  function markProgress(x, y, radius) {
    const cellW = naturalWidth / progressGrid.cols
    const cellH = naturalHeight / progressGrid.rows
    const minCol = Math.max(0, Math.floor((x - radius) / cellW))
    const maxCol = Math.min(progressGrid.cols - 1, Math.floor((x + radius) / cellW))
    const minRow = Math.max(0, Math.floor((y - radius) / cellH))
    const maxRow = Math.min(progressGrid.rows - 1, Math.floor((y + radius) / cellH))

    for (let row = minRow; row <= maxRow; row += 1) {
      for (let col = minCol; col <= maxCol; col += 1) {
        const cx = (col + .5) * cellW
        const cy = (row + .5) * cellH
        if (Math.hypot(cx - x, cy - y) <= radius * .9) progressGrid.cells.add(`${col}:${row}`)
      }
    }
  }

  function requestProgressUpdate() {
    if (progressRaf) return
    progressRaf = requestAnimationFrame(() => {
      progressRaf = 0
      updateProgress()
    })
  }

  function updateProgress() {
    const total = progressGrid.cols * progressGrid.rows
    const percent = mode === 'original' ? 0 : Math.min(100, Math.round((progressGrid.cells.size / total) * 100))
    lastProgressPercent = percent
    progressValue.textContent = `${percent}%`
    progressBar.style.width = `${percent}%`
    stage.classList.toggle('mostly-revealed', percent >= 72)

    if (percent >= COMPLETION_THRESHOLD && !completionShown && mode !== 'original') {
      triggerCompletionMoment(percent)
    }
  }

  function triggerCompletionMoment(percent) {
    completionShown = true
    clearTimeout(completionTimer)

    completionMode.textContent = mode.toUpperCase()
    completionLabel.textContent = percent >= 98 ? 'FULL MATERIAL REVEAL' : 'MATERIAL REVEALED'
    completionMoment.className = `completion-moment show completion-${mode}`
    stage.classList.add('completion-hit')

    completionTimer = window.setTimeout(() => {
      completionMoment.className = 'completion-moment'
      stage.classList.remove('completion-hit')
    }, 1250)
  }

  function hideCompletionMoment() {
    clearTimeout(completionTimer)
    completionMoment.className = 'completion-moment'
    stage.classList.remove('completion-hit')
  }

  function eraseBubble(point, previous) {
    const physics = getBrushPhysics(point, previous)
    const base = BRUSH_CSS.bubble * point.scale
    const sizeFactor = 1.12 - physics.normalized * .28
    const central = base * (.68 + (1 - physics.normalized) * .08) * sizeFactor

    topCtx.drawImage(softBrush, point.x - central / 2, point.y - central / 2, central, central)

    const satellites = physics.normalized > .7 ? 4 : 6
    for (let i = 0; i < satellites; i += 1) {
      const angle = i * 2.399 + point.x * .003
      const radius = base * (.15 + (i % 3) * .045) * sizeFactor
      const offset = base * (.21 + (i % 2) * .08) * sizeFactor
      const directionalPull = physics.normalized * base * .08
      const x = point.x + Math.cos(angle) * offset - physics.directionX * directionalPull
      const y = point.y + Math.sin(angle) * offset - physics.directionY * directionalPull
      topCtx.drawImage(softBrush, x - radius / 2, y - radius / 2, radius, radius)
    }

    const progressRadius = base * (.42 + (1 - physics.normalized) * .08)
    markProgress(point.x, point.y, progressRadius)
    spawnBubbleParticles(point, base, physics)
    spawnEdgeReaction(point, base, physics)
  }

  function eraseJelly(point, previous) {
    const physics = getBrushPhysics(point, previous)
    const base = BRUSH_CSS.jelly * point.scale
    const widthFactor = 1.14 - physics.normalized * .28
    const stretch = 1 + physics.normalized * 1.42
    const squash = .98 - physics.normalized * .37

    topCtx.save()
    topCtx.translate(point.x, point.y)
    topCtx.rotate(physics.angle)
    topCtx.scale(stretch, squash * widthFactor)
    topCtx.drawImage(organicBrush, -base / 2, -base / 2, base, base)
    topCtx.restore()

    if (previous) {
      const tailSize = base * (.5 - physics.normalized * .12)
      topCtx.drawImage(softBrush, previous.x - tailSize / 2, previous.y - tailSize / 2, tailSize, tailSize)
    }

    markProgress(point.x, point.y, base * (.5 - physics.normalized * .06))
    spawnJellyParticle(point, base, physics)
    spawnEdgeReaction(point, base, physics)
  }

  function erasePixel(point, previous) {
    const physics = getBrushPhysics(point, previous)
    const cssBlock = 22 - physics.normalized * 8
    const block = Math.max(8, Math.round(cssBlock * point.scale))
    const radius = BRUSH_CSS.pixel * point.scale * (.58 - physics.normalized * .11)
    const startX = Math.floor((point.x - radius) / block) * block
    const endX = Math.ceil((point.x + radius) / block) * block
    const startY = Math.floor((point.y - radius) / block) * block
    const endY = Math.ceil((point.y + radius) / block) * block

    for (let y = startY; y <= endY; y += block) {
      for (let x = startX; x <= endX; x += block) {
        const cx = x + block / 2
        const cy = y + block / 2
        const distance = Math.hypot(cx - point.x, cy - point.y)
        if (distance > radius) continue
        const hash = Math.abs(Math.sin(x * 12.9898 + y * 78.233))
        const edgeCutoff = .63 + physics.normalized * .15
        if (distance > radius * edgeCutoff && hash > .68) continue
        topCtx.fillRect(x, y, block + .5, block + .5)
      }
    }

    markProgress(point.x, point.y, radius * .94)
    spawnPixelParticles(point, block, physics)
    spawnEdgeReaction(point, radius * 1.5, physics, block)
  }

  function stamp(point, previous = null) {
    if (!ready || mode === 'original') return
    if (mode === 'bubble') eraseBubble(point, previous)
    else if (mode === 'jelly') eraseJelly(point, previous)
    else erasePixel(point, previous)
    requestProgressUpdate()
  }

  function paintSegment(from, to) {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.hypot(dx, dy)
    const cssSize = BRUSH_CSS[mode] || 118
    const brushSize = cssSize * to.scale
    const stepRatio = mode === 'pixel' ? .17 : mode === 'jelly' ? .11 : .14
    const step = Math.max(2, brushSize * stepRatio)
    const count = Math.max(1, Math.ceil(distance / step))
    let previous = from

    for (let index = 1; index <= count; index += 1) {
      const t = index / count
      const point = {
        x: from.x + dx * t,
        y: from.y + dy * t,
        localX: from.localX + (to.localX - from.localX) * t,
        localY: from.localY + (to.localY - from.localY) * t,
        scale: to.scale,
        time: from.time + (to.time - from.time) * t,
      }
      stamp(point, previous)
      previous = point
    }
  }

  function spawnBubbleParticles(point, base, physics) {
    if (particles.length > 90) return
    if (Math.random() > (.46 + physics.normalized * .18)) return

    const count = physics.normalized > .65 ? 1 : 2
    for (let i = 0; i < count; i += 1) {
      particles.push({
        type: 'bubble',
        x: point.x + (Math.random() - .5) * base * .55,
        y: point.y + (Math.random() - .5) * base * .4,
        vx: (Math.random() - .5) * base * .006 - physics.directionX * base * .0015,
        vy: -base * (.002 + Math.random() * .004) - physics.directionY * base * .001,
        size: base * (.06 + Math.random() * .085),
        life: 1,
      })
    }
    startEffects()
  }

  function spawnJellyParticle(point, base, physics) {
    if (particles.length > 75 || Math.random() > .48) return
    particles.push({
      type: 'jelly',
      x: point.x,
      y: point.y,
      vx: -Math.cos(physics.angle) * base * (.002 + physics.normalized * .004),
      vy: -Math.sin(physics.angle) * base * (.002 + physics.normalized * .004) + base * .0015,
      size: base * (.07 + Math.random() * .08),
      life: 1,
      wobble: Math.random() * Math.PI * 2,
    })
    startEffects()
  }

  function spawnPixelParticles(point, block, physics) {
    if (particles.length > 70 || Math.random() > (.38 + physics.normalized * .16)) return
    particles.push({
      type: 'pixel',
      x: Math.round(point.x / block) * block,
      y: Math.round(point.y / block) * block,
      vx: (Math.random() - .5) * block * (.03 + physics.normalized * .03),
      vy: (Math.random() - .5) * block * (.03 + physics.normalized * .03),
      size: block * (.42 + Math.random() * .55),
      life: 1,
    })
    startEffects()
  }

  function spawnEdgeReaction(point, base, physics, block = 0) {
    edgeGate = (edgeGate + 1) % 2
    if (edgeGate !== 0) return
    if (edgeTrails.length > 150) edgeTrails.splice(0, 18)

    edgeTrails.push({
      type: mode,
      x: point.x,
      y: point.y,
      size: base,
      angle: physics.angle,
      speed: physics.normalized,
      block,
      life: 1,
    })
    startEffects()
  }

  function startEffects() {
    if (!effectsRaf) {
      lastTime = performance.now()
      effectsRaf = requestAnimationFrame(drawEffects)
    }
  }

  function drawEdgeReaction(edge, dt) {
    const decay = edge.type === 'jelly' ? 520 : edge.type === 'bubble' ? 430 : 360
    edge.life -= dt / decay
    if (edge.life <= 0) return false

    const alpha = clamp(edge.life, 0, 1)
    effectsCtx.save()
    effectsCtx.globalCompositeOperation = 'screen'

    if (edge.type === 'bubble') {
      const radius = edge.size * (.31 + (1 - edge.life) * .08)
      effectsCtx.globalAlpha = alpha * .52
      effectsCtx.strokeStyle = 'rgba(255,255,255,.95)'
      effectsCtx.lineWidth = Math.max(1, edge.size * .012)
      effectsCtx.setLineDash([edge.size * .08, edge.size * .045])
      effectsCtx.beginPath()
      effectsCtx.arc(edge.x, edge.y, radius, 0, Math.PI * 2)
      effectsCtx.stroke()

      effectsCtx.globalAlpha = alpha * .26
      effectsCtx.setLineDash([])
      effectsCtx.strokeStyle = 'rgba(171,143,255,.95)'
      effectsCtx.lineWidth = Math.max(1, edge.size * .02)
      effectsCtx.beginPath()
      effectsCtx.arc(edge.x - edge.size * .06, edge.y - edge.size * .04, radius * .82, -.7, 1.1)
      effectsCtx.stroke()
    } else if (edge.type === 'jelly') {
      const stretch = 1.2 + edge.speed * 1.4
      const squash = .78 - edge.speed * .2
      effectsCtx.translate(edge.x, edge.y)
      effectsCtx.rotate(edge.angle)
      effectsCtx.scale(stretch, squash)
      effectsCtx.globalAlpha = alpha * .42
      effectsCtx.strokeStyle = 'rgba(255,255,255,.96)'
      effectsCtx.lineWidth = Math.max(1.2, edge.size * .014)
      effectsCtx.beginPath()
      effectsCtx.ellipse(0, 0, edge.size * .31, edge.size * .27, 0, 0, Math.PI * 2)
      effectsCtx.stroke()

      effectsCtx.globalAlpha = alpha * .18
      effectsCtx.strokeStyle = 'rgba(205,120,255,.95)'
      effectsCtx.lineWidth = Math.max(2, edge.size * .025)
      effectsCtx.beginPath()
      effectsCtx.ellipse(-edge.size * .035, edge.size * .02, edge.size * .25, edge.size * .21, 0, 0, Math.PI * 2)
      effectsCtx.stroke()
    } else {
      const block = edge.block || Math.max(8, edge.size * .12)
      const offset = block * (.2 + edge.speed * .35)
      const size = block * (1.1 + edge.speed * .5)
      effectsCtx.globalAlpha = alpha * .42
      effectsCtx.fillStyle = 'rgba(255,70,120,.9)'
      effectsCtx.fillRect(edge.x - size / 2 - offset, edge.y - size / 2, size, size)
      effectsCtx.fillStyle = 'rgba(70,225,255,.9)'
      effectsCtx.fillRect(edge.x - size / 2 + offset, edge.y - size / 2, size, size)
      effectsCtx.globalAlpha = alpha * .7
      effectsCtx.strokeStyle = 'rgba(255,255,255,.95)'
      effectsCtx.lineWidth = Math.max(1, block * .08)
      effectsCtx.strokeRect(edge.x - size / 2, edge.y - size / 2, size, size)
    }

    effectsCtx.restore()
    return true
  }

  function drawEffects(now) {
    effectsRaf = 0
    const dt = Math.min(32, now - lastTime)
    lastTime = now
    effectsCtx.clearRect(0, 0, naturalWidth, naturalHeight)

    for (let i = edgeTrails.length - 1; i >= 0; i -= 1) {
      if (!drawEdgeReaction(edgeTrails[i], dt)) edgeTrails.splice(i, 1)
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i]
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt / 650
      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      effectsCtx.save()
      effectsCtx.globalCompositeOperation = 'screen'
      effectsCtx.globalAlpha = Math.max(0, p.life) * .55

      if (p.type === 'bubble') {
        effectsCtx.strokeStyle = 'rgba(255,255,255,.95)'
        effectsCtx.lineWidth = Math.max(1, p.size * .055)
        effectsCtx.beginPath()
        effectsCtx.arc(p.x, p.y, p.size * (1.25 - p.life * .25), 0, Math.PI * 2)
        effectsCtx.stroke()
      } else if (p.type === 'jelly') {
        p.wobble += dt * .012
        effectsCtx.translate(p.x, p.y)
        effectsCtx.rotate(Math.sin(p.wobble) * .35)
        effectsCtx.scale(1.5, .7)
        effectsCtx.fillStyle = 'rgba(255,255,255,.8)'
        effectsCtx.beginPath()
        effectsCtx.arc(0, 0, p.size, 0, Math.PI * 2)
        effectsCtx.fill()
      } else {
        effectsCtx.fillStyle = 'rgba(255,255,255,.88)'
        effectsCtx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      effectsCtx.restore()
    }

    if (particles.length || edgeTrails.length) effectsRaf = requestAnimationFrame(drawEffects)
  }

  function shouldPaint(event) {
    if (mode === 'original') return false
    if (event.pointerType === 'mouse') return true
    return pointerDown
  }

  function showPreview(point) {
    if (!point || mode === 'original') {
      brushPreview.classList.remove('visible')
      return
    }

    const physics = getBrushPhysics(point, lastPoint)
    let size = BRUSH_CSS[mode]

    if (mode === 'bubble') size *= 1.08 - physics.normalized * .22
    if (mode === 'pixel') size *= 1.08 - physics.normalized * .15

    brushPreview.style.setProperty('--brush-size', `${size}px`)
    brushPreview.style.left = `${point.localX}px`
    brushPreview.style.top = `${point.localY}px`
    brushPreview.style.setProperty('--brush-speed', String(physics.normalized))

    if (lastPoint && mode === 'jelly') {
      brushPreview.style.setProperty('--brush-angle', `${physics.angle}rad`)
      brushPreview.style.setProperty('--brush-stretch', String(1 + physics.normalized * .78))
      brushPreview.style.setProperty('--brush-squash', String(.98 - physics.normalized * .22))
    } else {
      brushPreview.style.setProperty('--brush-angle', '0rad')
      brushPreview.style.setProperty('--brush-stretch', '1')
      brushPreview.style.setProperty('--brush-squash', '1')
    }

    brushPreview.classList.add('visible')
  }

  function handlePointerMove(event) {
    if (!ready) return
    const point = pointerToCanvas(event)
    showPreview(point)
    if (!point || !shouldPaint(event)) return

    if (!firstPainted) {
      firstPainted = true
      updateHint()
    }

    if (lastPoint) paintSegment(lastPoint, point)
    else stamp(point)
    lastPoint = point
  }

  function handlePointerEnter(event) {
    const point = pointerToCanvas(event)
    showPreview(point)
    lastPoint = null
  }

  function handlePointerLeave() {
    brushPreview.classList.remove('visible')
    lastPoint = null
    pointerDown = false
  }

  function handlePointerDown(event) {
    pointerDown = true
    if (event.pointerType !== 'mouse') {
      try { stage.setPointerCapture(event.pointerId) } catch (_) {}
    }
    handlePointerMove(event)
  }

  function handlePointerUp(event) {
    pointerDown = false
    lastPoint = null
    if (event.pointerType !== 'mouse') {
      try { stage.releasePointerCapture(event.pointerId) } catch (_) {}
    }
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.mode))
  })

  resetButton.addEventListener('click', resetReveal)
  stage.addEventListener('pointerenter', handlePointerEnter)
  stage.addEventListener('pointermove', handlePointerMove)
  stage.addEventListener('pointerleave', handlePointerLeave)
  stage.addEventListener('pointerdown', handlePointerDown)
  stage.addEventListener('pointerup', handlePointerUp)
  stage.addEventListener('pointercancel', handlePointerUp)

  preload()
})()
