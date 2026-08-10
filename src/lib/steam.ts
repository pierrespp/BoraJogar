export interface SteamGameResult {
  appid: number;
  name: string;
  image_url: string;
  genres: string[];
  min_players?: number;
  max_players?: number;
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
    name: 'Baldur\'s Gate 3',
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
    appid: 1091500,
    name: 'Cyberpunk 2077',
    image_url: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
    genres: ['RPG', 'Mundo Aberto', 'Sci-Fi'],
    min_players: 1,
    max_players: 1,
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
    genres: ['Fazemda', 'Coop', 'Relaxante'],
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

export async function searchSteamGames(query: string): Promise<SteamGameResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return POPULAR_STEAM_GAMES.slice(0, 6);

  try {
    const res = await fetch(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=portuguese&cc=BR`);
    if (res.ok) {
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        return data.items.slice(0, 10).map((item: any) => ({
          appid: item.id,
          name: item.name,
          image_url: `https://cdn.akamai.steamstatic.com/steam/apps/${item.id}/header.jpg`,
          genres: ['Steam Game'],
        }));
      }
    }
  } catch (err) {
    console.warn('Steam API direct fetch fallback to local list', err);
  }

  // Fallback search in static popular list
  return POPULAR_STEAM_GAMES.filter((g) => g.name.toLowerCase().includes(trimmed));
}

export function getSteamHeaderImage(appid: number): string {
  return `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
}
