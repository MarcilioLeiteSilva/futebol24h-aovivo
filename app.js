/* ============================================================
   COPA DO MUNDO 2026 – APP.JS
   Dual clocks, countdown, particles, groups data
   ============================================================ */

// ── DYNAMIC TARGET MATCH DATE ──────────────────────────────
let targetMatchDate = null;

// ── LEAGUES/COMPETITIONS DATA ──────────────────────────────
const CAMPEONATOS = [
  { name: 'Série A', logo: '🏆', desc: 'Primeira divisão do Campeonato Brasileiro com os 20 principais clubes do país.' },
  { name: 'Série B', logo: '🥈', desc: 'Segunda divisão nacional disputada em pontos corridos rumo ao acesso à elite.' },
  { name: 'Copa do Brasil', logo: '🇧🇷', desc: 'O torneio mais democrático do país reunindo clubes de todos os estados.' },
  { name: 'Copa do Nordeste', logo: '☀️', desc: 'A maior copa regional do país com os gigantes e rivalidades do Nordeste.' }
];

// ── PARTICLE SYSTEM ────────────────────────────────────────
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createParticle() {
  const types = ['⚽', '★', '•', '◆'];
  return {
    x: Math.random() * W,
    y: H + 20,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(Math.random() * 0.6 + 0.3),
    alpha: Math.random() * 0.6 + 0.1,
    size: Math.random() * 14 + 6,
    type: types[Math.floor(Math.random() * types.length)],
    rotate: Math.random() * Math.PI * 2,
    rotateSpeed: (Math.random() - 0.5) * 0.02,
  };
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);

  if (particles.length < 60) {
    particles.push(createParticle());
  }

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.rotate += p.rotateSpeed;
    p.alpha -= 0.0004;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotate);
    ctx.font = `${p.size}px serif`;
    ctx.fillStyle = p.type === '⚽' ? '#FFD700' : 'rgba(255,215,0,0.7)';
    ctx.fillText(p.type, 0, 0);
    ctx.restore();

    if (p.y < -20 || p.alpha <= 0) {
      particles.splice(i, 1);
    }
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animateParticles();

// ── CLOCK HELPERS ──────────────────────────────────────────
const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function pad(n) { return String(n).padStart(2, '0'); }

function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatDate(date) {
  return `${DAYS_SHORT[date.getDay()]}, ${pad(date.getDate())} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

function getTimeInZone(offsetHours) {
  const now     = new Date();
  const utcMs   = now.getTime() + now.getTimezoneOffset() * 60_000;
  return new Date(utcMs + offsetHours * 3_600_000);
}

// ── UPDATE CLOCKS ──────────────────────────────────────────
function updateClocks() {
  // Local time of viewer
  const local = new Date();
  const localTimeEl = document.getElementById('time-local');
  const localDateEl = document.getElementById('date-local');
  if (localTimeEl) localTimeEl.textContent = formatTime(local);
  if (localDateEl) localDateEl.textContent = formatDate(local);

  // Brazil: BRT = UTC-3
  const bra = getTimeInZone(-3);
  const braTimeEl = document.getElementById('time-bra');
  const braDateEl = document.getElementById('date-bra');
  if (braTimeEl) braTimeEl.textContent = formatTime(bra);
  if (braDateEl) braDateEl.textContent = formatDate(bra);
}

// ── COUNTDOWN ─────────────────────────────────────────────
const prevValues = { days: null, hours: null, minutes: null, seconds: null };

function animateFlip(el) {
  el.classList.add('flip');
  setTimeout(() => el.classList.remove('flip'), 200);
}

// ── LOAD NEXT MATCH FOR COUNTDOWN ─────────────────────────
async function loadNextMatchForCountdown() {
  try {
    const upcoming = await API.getUpcomingFixtures(1);
    if (upcoming && upcoming.length) {
      const next = upcoming[0];
      targetMatchDate = new Date(next.date);
      const eventText = document.getElementById('cd-event-text');
      if (eventText) {
        eventText.textContent = `${next.homeTeam.name} vs ${next.awayTeam.name} · ${API.toDisplayDate(next.date)} · ${API.toBrazilTime(next.date)} BRT`;
      }
    } else {
      const eventText = document.getElementById('cd-event-text');
      if (eventText) eventText.textContent = "Nenhum jogo agendado no momento.";
    }
  } catch (e) {
    console.warn("Error loading next match for countdown:", e);
  }
}

function updateCountdown() {
  if (!targetMatchDate) {
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    if (daysEl) daysEl.textContent = '--';
    if (hoursEl) hoursEl.textContent = '--';
    if (minutesEl) minutesEl.textContent = '--';
    if (secondsEl) secondsEl.textContent = '--';
    return;
  }
  const now  = new Date();
  const diff = targetMatchDate - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent    = '00';
    document.getElementById('cd-hours').textContent   = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    const label = document.getElementById('cd-label');
    if (label) label.textContent = '⚽ JOGO EM ANDAMENTO / RECENTE!';
    return;
  }

  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000)  / 60_000);
  const seconds = Math.floor((diff % 60_000)      / 1_000);

  const ids = { days, hours, minutes, seconds };

  Object.entries(ids).forEach(([key, val]) => {
    const el = document.getElementById(`cd-${key}`);
    if (el && prevValues[key] !== val) {
      animateFlip(el);
      el.textContent = pad(val);
      prevValues[key] = val;
    }
  });
}

// ── BUILD LEAGUES ──────────────────────────────────────────
function buildLeagues() {
  const container = document.getElementById('groups-grid');
  if (!container) return;
  container.innerHTML = '';
  CAMPEONATOS.forEach(comp => {
    const card = document.createElement('div');
    card.className = 'group-card';

    const header = document.createElement('div');
    header.className = 'group-card__header';
    header.style.background = 'rgba(0,155,58,0.15)';
    header.style.borderColor = 'rgba(0,155,58,0.3)';
    header.style.color = '#fff';
    header.innerHTML = `<span style="margin-right:8px">${comp.logo}</span>${comp.name}`;
    card.appendChild(header);

    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'group-card__teams';
    bodyDiv.style.padding = '16px';
    bodyDiv.style.fontSize = '0.78rem';
    bodyDiv.style.lineHeight = '1.4';
    bodyDiv.style.color = 'var(--subtext)';
    bodyDiv.textContent = comp.desc;
    card.appendChild(bodyDiv);
    container.appendChild(card);
  });
}

// ── TICKER DUPLICATE ──────────────────────────────────────
async function setupTicker() {
  const ticker = document.getElementById('ticker');
  if (!ticker) return;

  // Load from Sheets or local CSV if configured
  if (CONFIG.SHEETS.ticker) {
    try {
      const rows = await CONTENT.getTicker();
      if (rows && rows.length) {
        ticker.innerHTML = rows.map(r => {
          const icon = r.icon || '⚽';
          const texto = r.texto || r.text || '';
          return `<span>${icon} ${texto}</span>`;
        }).join('');
      }
    } catch (e) {
      console.warn("Could not load dynamic ticker:", e);
    }
  }

  // Duplicate ticker children so the animation loops seamlessly
  const children = Array.from(ticker.children);
  children.forEach(child => {
    const clone = child.cloneNode(true);
    ticker.appendChild(clone);
  });
}

// ── INIT ───────────────────────────────────────────────────
buildLeagues();
setupTicker();
updateClocks();
loadNextMatchForCountdown();
updateCountdown();

setInterval(() => {
  updateClocks();
  updateCountdown();
}, 1000);

// Periodically reload next match for countdown every 5 mins
setInterval(loadNextMatchForCountdown, 300000);
