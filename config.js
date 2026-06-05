/**
 * COPA 2026 – API Configuration
 * ZapScore API: https://zapscore-zapscore-api.gtalg3.easypanel.host
 */
const CONFIG = {
  API_BASE: 'https://zapscore-zapscore-api.gtalg3.easypanel.host',
  LEAGUES: [
    { id: 71, name: 'Série A', season: 2026 },
    { id: 72, name: 'Série B', season: 2026 },
    { id: 73, name: 'Copa do Brasil', season: 2026 },
    { id: 612, name: 'Copa do Nordeste', season: 2026 }
  ],
  HIGHLIGHT_TEAMS: [
    'Flamengo', 'Palmeiras', 'Vasco', 'Corinthians', 'São Paulo', 'Santos', 
    'Grêmio', 'Internacional', 'Atlético Mineiro', 'Cruzeiro', 'Bahia', 
    'Vitória', 'Fortaleza', 'Ceará', 'Sport Recife'
  ],
  REFRESH_INTERVAL: 30_000,    // live data refresh: 30s
  CONTENT_INTERVAL: 60_000,    // Google Sheets content refresh: 60s

  // Google Sheets CSV URLs (published to web)
  // User: File > Share > Publish to web > Choose sheet > CSV > Copy link
  // Or use relative paths to local CSV files:
  SHEETS: {
    noticias:      'noticias.csv', // paste your Google Sheet CSV URL or leave 'noticias.csv'
    curiosidades:  'curiosidades.csv', // paste your Google Sheet CSV URL or leave 'curiosidades.csv'
    ticker:        'ticker.csv', // paste your Google Sheet CSV URL or leave 'ticker.csv'
  },

  // OBS target resolution
  OBS_WIDTH: 1920,
  OBS_HEIGHT: 1080,
};
