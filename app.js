/* ============================================================
   COPA DO MUNDO 2026 – APP.JS
   Dual clocks, countdown, particles, groups data
   ============================================================ */

// ── WORLD CUP 2026 START DATE ──────────────────────────────
// Opening match: Mexico vs TBD · June 11, 2026 · 19:00 local CDMX time (UTC-6)
// That's June 12, 2026 · 01:00 UTC
const TARGET_DATE = new Date('2026-06-12T01:00:00Z');

// ── GROUPS DATA ────────────────────────────────────────────
const GROUPS = [
  { id: 'A', teams: [{ flag:'🇺🇸', name:'Estados Unidos' }, { flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿', name:'Inglaterra' },  { flag:'🇦🇺', name:'Austrália' },      { flag:'🇲🇦', name:'Marrocos' }] },
  { id: 'B', teams: [{ flag:'🇧🇷', name:'Brasil' },        { flag:'🇷🇸', name:'Sérvia' },       { flag:'🇨🇭', name:'Suíça' },           { flag:'🇨🇲', name:'Camarões' }] },
  { id: 'C', teams: [{ flag:'🇦🇷', name:'Argentina' },    { flag:'🇵🇱', name:'Polônia' },     { flag:'🇸🇦', name:'Arábia Saudita' },  { flag:'🇲🇽', name:'México' }] },
  { id: 'D', teams: [{ flag:'🇫🇷', name:'França' },       { flag:'🇩🇰', name:'Dinamarca' },   { flag:'🇹🇳', name:'Tunísia' },         { flag:'🇦🇺', name:'Austrália' }] },
  { id: 'E', teams: [{ flag:'🇪🇸', name:'Espanha' },      { flag:'🇩🇪', name:'Alemanha' },    { flag:'🇯🇵', name:'Japão' },           { flag:'🇨🇷', name:'Costa Rica' }] },
  { id: 'F', teams: [{ flag:'🇵🇹', name:'Portugal' },     { flag:'🇺🇾', name:'Uruguai' },     { flag:'🇰🇷', name:'Coreia do Sul' },   { flag:'🇬🇭', name:'Gana' }] },
  { id: 'G', teams: [{ flag:'🇧🇪', name:'Bélgica' },      { flag:'🇭🇷', name:'Croácia' },     { flag:'🇲🇦', name:'Marrocos' },        { flag:'🇨🇦', name:'Canadá' }] },
  { id: 'H', teams: [{ flag:'🇳🇱', name:'Holanda' },      { flag:'🇸🇳', name:'Senegal' },     { flag:'🇪🇨', name:'Equador' },         { flag:'🇶🇦', name:'Catar' }] },
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
  // USA Eastern Time: UTC-5 (standard) / UTC-4 (daylight saving)
  // June = EDT = UTC-4
  const usa = getTimeInZone(-4);
  document.getElementById('time-usa').textContent = formatTime(usa);
  document.getElementById('date-usa').textContent = formatDate(usa);

  // Brazil: BRT = UTC-3 (most of the year)
  const bra = getTimeInZone(-3);
  document.getElementById('time-bra').textContent = formatTime(bra);
  document.getElementById('date-bra').textContent = formatDate(bra);
}

// ── COUNTDOWN ─────────────────────────────────────────────
const prevValues = { days: null, hours: null, minutes: null, seconds: null };

function animateFlip(el) {
  el.classList.add('flip');
  setTimeout(() => el.classList.remove('flip'), 200);
}

function updateCountdown() {
  const now  = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    document.getElementById('cd-days').textContent    = '00';
    document.getElementById('cd-hours').textContent   = '00';
    document.getElementById('cd-minutes').textContent = '00';
    document.getElementById('cd-seconds').textContent = '00';
    document.querySelector('.countdown-label').textContent = '🏆 A COPA JÁ COMEÇOU!';
    return;
  }

  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000)  / 60_000);
  const seconds = Math.floor((diff % 60_000)      / 1_000);

  const ids = { days, hours, minutes, seconds };

  Object.entries(ids).forEach(([key, val]) => {
    const el = document.getElementById(`cd-${key}`);
    if (prevValues[key] !== val) {
      animateFlip(el);
      el.textContent = pad(val);
      prevValues[key] = val;
    }
  });
}

// ── BUILD GROUPS ───────────────────────────────────────────
function buildGroups() {
  const container = document.getElementById('groups-grid');
  GROUPS.forEach(group => {
    const card = document.createElement('div');
    card.className = 'group-card';

    const header = document.createElement('div');
    header.className = 'group-card__header';
    header.textContent = `GRUPO ${group.id}`;
    card.appendChild(header);

    const teamsDiv = document.createElement('div');
    teamsDiv.className = 'group-card__teams';
    group.teams.forEach(team => {
      const row = document.createElement('div');
      row.className = 'team-row';
      row.innerHTML = `<span class="team-flag">${team.flag}</span><span class="team-name">${team.name}</span>`;
      teamsDiv.appendChild(row);
    });
    card.appendChild(teamsDiv);
    container.appendChild(card);
  });
}

// ── TICKER DUPLICATE ──────────────────────────────────────
// Duplicate ticker children so the animation loops seamlessly
function setupTicker() {
  const ticker = document.getElementById('ticker');
  const children = Array.from(ticker.children);
  children.forEach(child => {
    const clone = child.cloneNode(true);
    ticker.appendChild(clone);
  });
}

// ── INIT ───────────────────────────────────────────────────
buildGroups();
setupTicker();
updateClocks();
updateCountdown();

setInterval(() => {
  updateClocks();
  updateCountdown();
}, 1000);
