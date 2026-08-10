export interface SteamGameResult {
  appid: number;
  name: string;
  image_url: string;
  genres: string[];
  min_players?: number;
  max_players?: number;
  description?: string;
  short_description?: string;
}

const POPULAR_STEAM_GAMES: SteamGameResult[] = [
  {
    appid: 730,
    name: 'Counter-Strike 2',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
    genres: ['FPS', 'Tático', 'Competitivo'],
    min_players: 5,
    max_players: 10,
  },
  {
    appid: 570,
    name: 'Dota 2',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg',
    genres: ['MOBA', 'Estratégia'],
    min_players: 5,
    max_players: 10,
  },
  {
    appid: 1086000,
    name: "Baldur's Gate 3",
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1086000/header.jpg',
    genres: ['RPG', 'Coop', 'Turnos'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 553850,
    name: 'HELLDIVERS™ 2',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg',
    genres: ['Tiro', 'Coop', 'Ação'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 1942630,
    name: 'Lethal Company',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1942630/header.jpg',
    genres: ['Terror', 'Coop', 'Sobrevivência'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 1623730,
    name: 'Palworld',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg',
    genres: ['Mundo Aberto', 'Sobrevivência', 'Coop'],
    min_players: 1,
    max_players: 8,
  },
  {
    appid: 252490,
    name: 'Rust',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
    genres: ['Sobrevivência', 'PvP', 'Multiplayer'],
    min_players: 1,
    max_players: 20,
  },
  {
    appid: 271590,
    name: 'Grand Theft Auto V',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg',
    genres: ['Ação', 'Mundo Aberto', 'Multiplayer'],
    min_players: 1,
    max_players: 30,
  },
  {
    appid: 1172470,
    name: 'Apex Legends',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg',
    genres: ['Battle Royale', 'FPS', 'Competitivo'],
    min_players: 3,
    max_players: 3,
  },
  {
    appid: 359550,
    name: 'Tom Clancy\'s Rainbow Six® Siege',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg',
    genres: ['FPS', 'Tático', 'Competitivo'],
    min_players: 5,
    max_players: 5,
  },
  {
    appid: 381210,
    name: 'Dead by Daylight',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg',
    genres: ['Terror Assimétrico', 'Coop', 'Sobrevivência'],
    min_players: 1,
    max_players: 5,
  },
  {
    appid: 105600,
    name: 'Terraria',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg',
    genres: ['Aventura', 'Sandbox', 'Coop'],
    min_players: 1,
    max_players: 8,
  },
  {
    appid: 230410,
    name: 'Warframe',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg',
    genres: ['Ação', 'Looter Shooter', 'Coop'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 892970,
    name: 'Valheim',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg',
    genres: ['Sobrevivência', 'Viking', 'Coop'],
    min_players: 1,
    max_players: 10,
  },
  {
    appid: 1085660,
    name: 'Destiny 2',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1085660/header.jpg',
    genres: ['FPS', 'Looter Shooter', 'Coop'],
    min_players: 1,
    max_players: 6,
  },
  {
    appid: 1172620,
    name: 'Sea of Thieves',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg',
    genres: ['Piratas', 'Aventura', 'Coop'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 108600,
    name: 'Project Zomboid',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg',
    genres: ['Sobrevivência', 'Zumbis', 'Coop'],
    min_players: 1,
    max_players: 8,
  },
  {
    appid: 2881650,
    name: 'Content Warning',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/2881650/header.jpg',
    genres: ['Terror', 'Coop', 'Comédia'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 550,
    name: 'Left 4 Dead 2',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg',
    genres: ['FPS', 'Zumbis', 'Coop'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 945360,
    name: 'Among Us',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg',
    genres: ['Casual', 'Dedução Social', 'Party'],
    min_players: 4,
    max_players: 15,
  },
  {
    appid: 413150,
    name: 'Stardew Valley',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg',
    genres: ['Fazenda', 'Coop', 'Relaxante'],
    min_players: 1,
    max_players: 8,
  },
  {
    appid: 739630,
    name: 'Phasmophobia',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/739630/header.jpg',
    genres: ['Terror', 'Coop', 'Investigação'],
    min_players: 1,
    max_players: 4,
  },
  {
    appid: 1426210,
    name: 'It Takes Two',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1426210/header.jpg',
    genres: ['Plataforma', 'Coop', 'Aventura'],
    min_players: 2,
    max_players: 2,
  },
];

// Fetch full Steam App Details by App ID
export async function fetchSteamAppDetails(appid: number): Promise<SteamGameResult | null> {
  const targetUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=portuguese`;
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    targetUrl,
  ];

  for (const url of proxies) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const appData = json[appid];
        if (appData && appData.success && appData.data) {
          const d = appData.data;
          const genres = (d.genres || []).map((g: any) => g.description);
          const categories = (d.categories || []).map((c: any) => c.description);
          
          let minPlayers = 1;
          let maxPlayers = 4;
          if (categories.includes('Multi-player') || categories.includes('Online Co-op')) {
            maxPlayers = 4;
          }

          return {
            appid,
            name: d.name,
            image_url: d.header_image || `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
            genres: genres.length > 0 ? genres : ['Steam'],
            min_players: minPlayers,
            max_players: maxPlayers,
            description: d.short_description || '',
          };
        }
      }
    } catch {
      // Continue to next proxy
    }
  }

  return null;
}

export async function searchSteamGames(query: string): Promise<SteamGameResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return POPULAR_STEAM_GAMES.slice(0, 10);

  // Check if user entered a Steam URL or numeric App ID directly
  const appidMatch = trimmed.match(/app\/(\d+)/) || trimmed.match(/^(\d+)$/);
  if (appidMatch && appidMatch[1]) {
    const appid = parseInt(appidMatch[1], 10);
    const details = await fetchSteamAppDetails(appid);
    if (details) return [details];
    return [
      {
        appid,
        name: `Steam Game #${appid}`,
        image_url: `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`,
        genres: ['Steam'],
      },
    ];
  }

  // Filter local popular database first
  const localMatches = POPULAR_STEAM_GAMES.filter((g) =>
    g.name.toLowerCase().includes(trimmed.toLowerCase())
  );

  // Attempt live Steam Store Search API via CORS proxies
  const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(trimmed)}&l=portuguese&cc=BR`;
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(searchUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(searchUrl)}`,
    searchUrl,
  ];

  for (const url of proxies) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const apiResults: SteamGameResult[] = data.items.slice(0, 10).map((item: any) => {
            // Check if game exists in local preset to inherit detailed genres
            const preset = POPULAR_STEAM_GAMES.find((p) => p.appid === item.id);
            return {
              appid: item.id,
              name: item.name,
              image_url: `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg`,
              genres: preset ? preset.genres : ['Steam Game'],
              min_players: preset?.min_players || 1,
              max_players: preset?.max_players || 4,
            };
          });

          // Merge local matches with API results, avoiding duplicates
          const seenIds = new Set<number>();
          const combined: SteamGameResult[] = [];

          for (const item of [...apiResults, ...localMatches]) {
            if (!seenIds.has(item.appid)) {
              seenIds.add(item.appid);
              combined.push(item);
            }
          }

          return combined;
        }
      }
    } catch (err) {
      console.warn('Steam API proxy search attempt failed:', err);
    }
  }

  // Fallback to local search if proxies fail or network is limited
  return localMatches;
}

export function getSteamHeaderImage(appid: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
}
