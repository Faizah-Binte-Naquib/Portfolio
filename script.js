const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
    document.body.classList.remove('menu-open');
  }));
}

document.querySelectorAll('.details-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    if (target) target.hidden = expanded;
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const navTargets = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55%' });
navTargets.forEach((section) => navObserver.observe(section));

document.getElementById('currentYear').textContent = new Date().getFullYear();

function initOCRDemo() {
  const canvas = document.getElementById('drawingCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const overlay = document.getElementById('canvasOverlay');
  const clearButton = document.getElementById('clearCanvas');
  const processButton = document.getElementById('processOCR');
  const ocrResult = document.getElementById('ocrResult');
  const llmResult = document.getElementById('llmResult');
  const ocrStatus = document.getElementById('ocrStatus');
  const llmStatus = document.getElementById('llmStatus');
  let drawing = false;
  let hasContent = false;

  function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = '#171915';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    hasContent = false;
    overlay.hidden = false;
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener('pointerdown', (event) => {
    drawing = true;
    hasContent = true;
    overlay.hidden = true;
    canvas.setPointerCapture(event.pointerId);
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    const p = point(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });

  const stopDrawing = () => { drawing = false; ctx.beginPath(); };
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);

  function setStatus(element, state, label) {
    element.className = `result-status status-${state}`;
    element.textContent = label;
  }

  function resetResults() {
    ocrResult.textContent = 'Extracted text will appear here.';
    llmResult.textContent = 'Refinement status will appear here.';
    setStatus(ocrStatus, 'ready', 'Ready');
    setStatus(llmStatus, 'ready', 'Ready');
  }

  clearButton.addEventListener('click', () => { setupCanvas(); resetResults(); });

  function preprocessedImage() {
    const output = document.createElement('canvas');
    const outputContext = output.getContext('2d', { willReadFrequently: true });
    const scale = 2;
    output.width = canvas.width * scale;
    output.height = canvas.height * scale;
    outputContext.drawImage(canvas, 0, 0, output.width, output.height);
    const pixels = outputContext.getImageData(0, 0, output.width, output.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const gray = .299 * pixels.data[i] + .587 * pixels.data[i + 1] + .114 * pixels.data[i + 2];
      const value = gray > 175 ? 255 : 0;
      pixels.data[i] = value;
      pixels.data[i + 1] = value;
      pixels.data[i + 2] = value;
    }
    outputContext.putImageData(pixels, 0, 0);
    return output.toDataURL('image/png');
  }

  async function runTesseract(image) {
    if (!window.Tesseract) throw new Error('The browser OCR library did not load.');
    const result = await window.Tesseract.recognize(image, 'eng', {
      logger: (message) => {
        if (message.status === 'recognizing text') setStatus(ocrStatus, 'processing', `Tesseract · ${Math.round(message.progress * 100)}%`);
      }
    });
    return (result.data.text || '').trim();
  }

  async function runOCR(image) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      setStatus(ocrStatus, 'processing', 'Trying hosted PaddleOCR');
      const blob = await (await fetch(image)).blob();
      const form = new FormData();
      form.append('file', blob, 'canvas.png');
      form.append('lang', 'en');
      const response = await fetch('https://yolo12138-paddle-ocr-api.hf.space/ocr', { method: 'POST', body: form, signal: controller.signal });
      if (!response.ok) throw new Error('Hosted OCR unavailable');
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.result || data.results || data.data || []);
      const text = items.map((item) => item.txt || item.text || '').filter(Boolean).join(' ').trim() || (data.text || '').trim();
      if (!text) throw new Error('Hosted OCR returned no text');
      setStatus(ocrStatus, 'success', 'PaddleOCR · complete');
      return text;
    } catch (error) {
      setStatus(ocrStatus, 'processing', 'Using browser fallback');
      const text = await runTesseract(image);
      setStatus(ocrStatus, 'fallback', 'Tesseract.js · fallback');
      return text;
    } finally {
      clearTimeout(timeout);
    }
  }

  function localFormattingFallback(text) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) return '';
    const sentence = normalized.charAt(0).toUpperCase() + normalized.slice(1);
    return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
  }

  async function refineText(text) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      setStatus(llmStatus, 'processing', 'Trying Llama endpoint');
      const response = await fetch('https://vlhcyhksdvgnr2jd6xte3i443m0gbvaa.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model: 'llama-3.1-8b-instruct', task: 'refine' }),
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Refinement endpoint unavailable');
      const data = await response.json();
      let payload = data;
      if (typeof data.body === 'string') {
        try { payload = JSON.parse(data.body); } catch (_) { payload = data; }
      }
      const refined = payload.refined_text || payload.text;
      if (!refined) throw new Error('No model response');
      llmResult.textContent = refined;
      setStatus(llmStatus, 'success', 'Llama 3.1 · complete');
    } catch (error) {
      llmResult.textContent = localFormattingFallback(text);
      setStatus(llmStatus, 'fallback', 'Local formatting · no model');
    } finally {
      clearTimeout(timeout);
    }
  }

  processButton.addEventListener('click', async () => {
    if (!hasContent) {
      setStatus(ocrStatus, 'error', 'Add writing first');
      return;
    }
    processButton.disabled = true;
    processButton.textContent = 'Processing…';
    ocrResult.textContent = 'Reading canvas…';
    llmResult.textContent = 'Waiting for OCR…';
    setStatus(llmStatus, 'ready', 'Waiting');
    try {
      const text = await runOCR(preprocessedImage());
      if (!text) {
        ocrResult.textContent = 'No text detected. Try larger, clearer block letters.';
        llmResult.textContent = 'Nothing to refine.';
        setStatus(ocrStatus, 'error', 'No text detected');
        setStatus(llmStatus, 'ready', 'Not run');
        return;
      }
      ocrResult.textContent = text;
      await refineText(text);
    } catch (error) {
      ocrResult.textContent = `The OCR step could not run: ${error.message}`;
      llmResult.textContent = 'Refinement was not attempted.';
      setStatus(ocrStatus, 'error', 'OCR unavailable');
      setStatus(llmStatus, 'ready', 'Not run');
    } finally {
      processButton.disabled = false;
      processButton.textContent = 'Run OCR';
    }
  });

  const disclosure = canvas.closest('details');
  if (disclosure && !disclosure.open) {
    disclosure.addEventListener('toggle', () => {
      if (disclosure.open && canvas.width === 300) setupCanvas();
    });
  } else {
    setupCanvas();
  }
}

initOCRDemo();
