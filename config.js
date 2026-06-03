/**
 * COPA 2026 – API Configuration
 * ZapScore API: https://zapscore-zapscore-api.gtalg3.easypanel.host
 */
const CONFIG = {
  API_BASE: 'https://zapscore-zapscore-api.gtalg3.easypanel.host',
  WORLD_CUP_LEAGUE_ID: 1,      // externalId for FIFA World Cup 2026
  WORLD_CUP_SEASON: 2026,
  REFRESH_INTERVAL: 30_000,    // live data refresh: 30s
  CONTENT_INTERVAL: 60_000,    // Google Sheets content refresh: 60s

  // Google Sheets CSV URLs (published to web)
  // User: File > Share > Publish to web > Choose sheet > CSV > Copy link
  SHEETS: {
    noticias:      '', // paste your Google Sheet CSV URL here
    curiosidades:  '', // paste your Google Sheet CSV URL here
    ticker:        '', // paste your Google Sheet CSV URL here
  },

  // OBS target resolution
  OBS_WIDTH: 1920,
  OBS_HEIGHT: 1080,
};
