/**
 * COPA 2026 – ZapScore API Client
 * Fetches fixtures, standings, and live match data.
 */

const API = (() => {
  const BASE = CONFIG.API_BASE;

  async function get(path) {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
    return res.json();
  }

  // ── PUBLIC METHODS ─────────────────────────────────────

  /** All configured league fixtures */
  async function getFixtures() {
    const promises = CONFIG.LEAGUES.map(league =>
      get(`/fixtures?leagueId=${league.id}&season=${league.season}`)
        .catch(err => {
          console.warn(`Failed to fetch fixtures for league ${league.name}:`, err);
          return [];
        })
    );
    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /** Today's fixtures filtered by configured leagues */
  async function getTodayFixtures() {
    const all = await get('/fixtures/today');
    const leagueIds = CONFIG.LEAGUES.map(l => l.id);
    return all.filter(f => f.league && leagueIds.includes(f.league.externalId));
  }

  /** Fixture detail by internal UUID */
  async function getFixture(id) {
    return get(`/fixtures/${id}`);
  }

  /** Standings for a specific league */
  async function getStandings(leagueId = 71) {
    const league = CONFIG.LEAGUES.find(l => l.id === Number(leagueId));
    if (!league) return [];
    return get(`/standings?leagueId=${leagueId}&season=${league.season}`);
  }

  // ── HELPERS ────────────────────────────────────────────

  /** Get fixtures for a specific date (YYYY-MM-DD in UTC) */
  async function getFixturesByDate(dateStr) {
    const all = await getFixtures();
    return all.filter(f => f.date && f.date.startsWith(dateStr));
  }

  /** Get upcoming fixtures (Not Started, sorted by date) */
  async function getUpcomingFixtures(limit = 10) {
    const all = await getFixtures();
    return all
      .filter(f => f.statusShort === 'NS')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, limit);
  }

  /** Get live fixtures (1H, HT, 2H, ET, P) */
  async function getLiveFixtures() {
    const today = await getTodayFixtures();
    const LIVE_STATUS = ['1H', 'HT', '2H', 'ET', 'P', 'BT'];
    return today.filter(f => LIVE_STATUS.includes(f.statusShort));
  }

  /** Format UTC date to Brazil time string (HH:MM) */
  function toBrazilTime(utcString) {
    const d = new Date(utcString);
    return d.toLocaleTimeString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /** Format UTC date to US Eastern time string (HH:MM) */
  function toUSATime(utcString) {
    const d = new Date(utcString);
    return d.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /** Format UTC date to display date in pt-BR */
  function toDisplayDate(utcString) {
    const d = new Date(utcString);
    return d.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  }

  /** Human-readable status in Portuguese */
  function statusLabel(statusShort, elapsed) {
    const map = {
      NS:  'Não iniciado',
      '1H': `${elapsed}'`,
      HT:  'Intervalo',
      '2H': `${elapsed}'`,
      ET:  `Prorrogação ${elapsed}'`,
      P:   'Pênaltis',
      BT:  'Pausa',
      FT:  'Encerrado',
      AET: 'Após prorrogação',
      PEN: 'Após pênaltis',
      PST: 'Adiado',
      CANC:'Cancelado',
      ABD: 'Abandonado',
    };
    return map[statusShort] || statusShort;
  }

  /** Is match live? */
  function isLive(statusShort) {
    return ['1H','HT','2H','ET','P','BT'].includes(statusShort);
  }

  /** Is match finished? */
  function isFinished(statusShort) {
    return ['FT','AET','PEN'].includes(statusShort);
  }

  return {
    getFixtures,
    getTodayFixtures,
    getFixture,
    getStandings,
    getFixturesByDate,
    getUpcomingFixtures,
    getLiveFixtures,
    toBrazilTime,
    toUSATime,
    toDisplayDate,
    statusLabel,
    isLive,
    isFinished,
  };
})();

// ── GOOGLE SHEETS CONTENT LOADER ──────────────────────────
const CONTENT = (() => {
  function splitCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return result;
  }

  function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    if (!lines.length) return [];
    const headers = splitCSVLine(lines[0]);
    return lines.slice(1).map(line => {
      const values = splitCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => obj[h] = values[i] || '');
      return obj;
    }).filter(row => Object.values(row).some(v => v));
  }

  async function load(sheetUrl) {
    if (!sheetUrl) return [];
    try {
      const res = await fetch(sheetUrl);
      const csv = await res.text();
      return parseCSV(csv);
    } catch (e) {
      console.warn('Sheet load failed:', e.message);
      return [];
    }
  }

  async function getNoticias()     { return load(CONFIG.SHEETS.noticias); }
  async function getCuriosidades()  { return load(CONFIG.SHEETS.curiosidades); }
  async function getTicker()        { return load(CONFIG.SHEETS.ticker); }

  return { getNoticias, getCuriosidades, getTicker };
})();
