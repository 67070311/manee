(() => {
  const stage = document.getElementById('imageStage')
  const bottomCanvas = document.getElementById('bottomCanvas')
  const topCanvas = document.getElementById('topCanvas')
  const originalPreview = document.getElementById('originalPreview')
  const compareBadge = document.getElementById('compareBadge')
  const beforeAfterButton = document.getElementById('beforeAfterButton')
  const saveArtworkButton = document.getElementById('saveArtworkButton')
  const focusModeButton = document.getElementById('focusModeButton')
  const saveToast = document.getElementById('saveToast')
  const focusHint = document.getElementById('focusHint')
  const modeButtons = [...document.querySelectorAll('.mode-button')]

  if (!stage || !bottomCanvas || !topCanvas || !originalPreview || !beforeAfterButton || !saveArtworkButton || !focusModeButton) return

  let comparing = false
  let focusing = false
  let toastTimer = 0
  let focusIdleTimer = 0

  function isTypingTarget(target) {
    return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable
  }

  function setCompare(active) {
    if (comparing === active) return
    comparing = active
    stage.classList.toggle('show-original-preview', active)
    beforeAfterButton.classList.toggle('active', active)
    beforeAfterButton.setAttribute('aria-pressed', String(active))
    originalPreview.setAttribute('aria-hidden', String(!active))
    compareBadge?.setAttribute('aria-hidden', String(!active))
  }

  function beginCompare(event) {
    if (event?.cancelable) event.preventDefault()
    setCompare(true)
  }

  function endCompare(event) {
    if (event?.cancelable) event.preventDefault()
    setCompare(false)
  }

  beforeAfterButton.addEventListener('pointerdown', event => {
    beginCompare(event)
    try { beforeAfterButton.setPointerCapture(event.pointerId) } catch (_) {}
  })

  beforeAfterButton.addEventListener('pointerup', event => {
    endCompare(event)
    try { beforeAfterButton.releasePointerCapture(event.pointerId) } catch (_) {}
  })

  beforeAfterButton.addEventListener('pointercancel', endCompare)
  beforeAfterButton.addEventListener('lostpointercapture', endCompare)
  beforeAfterButton.addEventListener('contextmenu', event => event.preventDefault())

  function getCurrentMode() {
    return document.querySelector('.mode-button.active')?.dataset.mode || 'original'
  }

  function showSavedToast(filename) {
    if (!saveToast) return
    clearTimeout(toastTimer)
    saveToast.textContent = `Saved ${filename}`
    saveToast.classList.remove('show')
    void saveToast.offsetWidth
    saveToast.classList.add('show')
    toastTimer = window.setTimeout(() => saveToast.classList.remove('show'), 1800)
  }

  function saveArtwork() {
    if (!bottomCanvas.width || !bottomCanvas.height) return

    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = bottomCanvas.width
    exportCanvas.height = bottomCanvas.height
    const ctx = exportCanvas.getContext('2d', { alpha: false })
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    ctx.drawImage(bottomCanvas, 0, 0)
    ctx.drawImage(topCanvas, 0, 0)

    const mode = getCurrentMode()
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `paint-reveal-${mode}-${timestamp}.png`

    saveArtworkButton.classList.add('saving')

    exportCanvas.toBlob(blob => {
      saveArtworkButton.classList.remove('saving')
      if (!blob) return

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      showSavedToast(filename)
    }, 'image/png')
  }

  function syncFocusStageSize() {
    if (!focusing) return

    const ratio = bottomCanvas.width && bottomCanvas.height
      ? bottomCanvas.width / bottomCanvas.height
      : 16 / 9

    const availableWidth = Math.max(320, window.innerWidth - 32)
    const availableHeight = Math.max(240, window.innerHeight - 32)

    let width = availableWidth
    let height = width / ratio

    if (height > availableHeight) {
      height = availableHeight
      width = height * ratio
    }

    stage.style.setProperty('--focus-stage-width', `${Math.round(width)}px`)
    stage.style.setProperty('--focus-stage-height', `${Math.round(height)}px`)
  }

  function hideFocusUI() {
    clearTimeout(focusIdleTimer)
    focusIdleTimer = 0
    if (!focusing) return
    document.body.classList.add('focus-ui-idle')
  }

  function wakeFocusUI(duration = 1600) {
    if (!focusing) return
    document.body.classList.remove('focus-ui-idle')
    clearTimeout(focusIdleTimer)
    focusIdleTimer = window.setTimeout(hideFocusUI, duration)
  }

  function setFocus(active) {
    if (focusing === active) return
    focusing = active

    document.body.classList.toggle('focus-mode', active)
    document.body.classList.remove('focus-ui-idle')
    focusModeButton.classList.toggle('active', active)
    focusModeButton.setAttribute('aria-pressed', String(active))

    if (active) {
      syncFocusStageSize()
      focusHint?.classList.remove('pulse')
      void focusHint?.offsetWidth
      focusHint?.classList.add('pulse')
      wakeFocusUI(2200)
    } else {
      clearTimeout(focusIdleTimer)
      focusIdleTimer = 0
      stage.style.removeProperty('--focus-stage-width')
      stage.style.removeProperty('--focus-stage-height')
      focusHint?.classList.remove('pulse')
    }
  }

  function toggleFocus() {
    setFocus(!focusing)
  }

  function switchModeByIndex(index) {
    const button = modeButtons[index]
    if (!button) return
    button.click()
    if (focusing) wakeFocusUI(900)
  }

  saveArtworkButton.addEventListener('click', saveArtwork)
  focusModeButton.addEventListener('click', toggleFocus)

  window.addEventListener('resize', syncFocusStageSize)

  window.addEventListener('pointermove', event => {
    if (!focusing) return
    const nearTop = event.clientY < 104
    const nearBottom = event.clientY > window.innerHeight - 150
    const nearLeft = event.clientX < 90
    const nearRight = event.clientX > window.innerWidth - 90

    if (nearTop || nearBottom || nearLeft || nearRight) wakeFocusUI(1500)
  }, { passive: true })

  window.addEventListener('pointerdown', () => {
    if (focusing) wakeFocusUI(1100)
  }, { passive: true })

  window.addEventListener('keydown', event => {
    if (isTypingTarget(event.target)) return

    if (event.code === 'Space') {
      if (event.repeat) return
      event.preventDefault()
      setCompare(true)
      return
    }

    if (event.key === 'f' || event.key === 'F') {
      if (event.repeat) return
      event.preventDefault()
      toggleFocus()
      return
    }

    if (event.key === 'Escape' && focusing) {
      event.preventDefault()
      setFocus(false)
      return
    }

    if (['1', '2', '3', '4'].includes(event.key)) {
      event.preventDefault()
      switchModeByIndex(Number(event.key) - 1)
    }
  })

  window.addEventListener('keyup', event => {
    if (event.code !== 'Space' || isTypingTarget(event.target)) return
    event.preventDefault()
    setCompare(false)
  })

  window.addEventListener('blur', () => {
    setCompare(false)
    if (focusing) document.body.classList.remove('focus-ui-idle')
  })

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) setCompare(false)
  })
})()
