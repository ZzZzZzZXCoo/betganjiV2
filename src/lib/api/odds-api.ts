import axios from 'axios';
import { OddsAPIResponse } from '@/types';

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    apiKey: API_KEY,
  },
});

export async function getOddsForMatch(matchId: string | number): Promise<OddsAPIResponse | null> {
  try {
    // The Odds API usually requires sport key and specific parameters
    // This is a simplified version - in real implementation you'd match the matchId with the specific event
    const response = await api.get('/sports/soccer/events', {
      params: {
        regions: 'us,uk,eu',
        markets: 'h2h', // Head-to-head (1X2) odds
        oddsFormat: 'decimal',
      },
    });
    
    // Find the match by ID or other criteria
    const match = response.data.find((match: any) => 
      match.id === matchId || 
      match.external_ids?.some((id: any) => id === matchId)
    );
    
    if (!match) {
      console.log(`No odds found for match ID ${matchId}`);
      return null;
    }
    
    return match.bookmakers;
  } catch (error) {
    console.error(`Error fetching odds for match ${matchId}:`, error);
    return null;
  }
}

export async function getOddsForSport(sport: string = 'soccer'): Promise<any[]> {
  try {
    const response = await api.get(`/sports/${sport}/odds`, {
      params: {
        regions: 'us,uk,eu',
        markets: 'h2h', // Head-to-head (1X2) odds
        oddsFormat: 'decimal',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching odds for ${sport}:`, error);
    return [];
  }
}

// Process odds to get average odds across bookmakers
export function processOdds(oddsData: OddsAPIResponse): { homeWin: number; draw: number; awayWin: number } {
  if (!oddsData || !oddsData.bookmakers || oddsData.bookmakers.length === 0) {
    return { homeWin: 0, draw: 0, awayWin: 0 };
  }

  let totalHomeWin = 0;
  let totalDraw = 0;
  let totalAwayWin = 0;
  let bookmakerCount = 0;

  for (const bookmaker of oddsData.bookmakers) {
    const h2hMarket = bookmaker.markets.find(market => market.key === 'h2h');
    
    if (h2hMarket && h2hMarket.outcomes.length >= 3) {
      // Find the home, draw, and away outcomes
      const homeOutcome = h2hMarket.outcomes.find(o => o.name === 'home' || o.name === '1');
      const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'draw' || o.name === 'X');
      const awayOutcome = h2hMarket.outcomes.find(o => o.name === 'away' || o.name === '2');
      
      if (homeOutcome && drawOutcome && awayOutcome) {
        totalHomeWin += homeOutcome.price;
        totalDraw += drawOutcome.price;
        totalAwayWin += awayOutcome.price;
        bookmakerCount++;
      }
    }
  }

  if (bookmakerCount === 0) {
    return { homeWin: 0, draw: 0, awayWin: 0 };
  }

  return {
    homeWin: parseFloat((totalHomeWin / bookmakerCount).toFixed(2)),
    draw: parseFloat((totalDraw / bookmakerCount).toFixed(2)),
    awayWin: parseFloat((totalAwayWin / bookmakerCount).toFixed(2)),
  };
}
