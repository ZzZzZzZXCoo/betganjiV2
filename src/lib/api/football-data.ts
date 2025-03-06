import axios from 'axios';
import { FootballAPIMatch } from '@/types';

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
  },
});

export async function getUpcomingMatches(date?: string): Promise<FootballAPIMatch[]> {
  try {
    // Format: YYYY-MM-DD (default to today if not specified)
    const matchDate = date || new Date().toISOString().split('T')[0];
    
    const response = await api.get('/fixtures', {
      params: {
        date: matchDate,
        timezone: 'America/New_York', // Adjust based on user preferences
      },
    });

    return response.data.response;
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    throw new Error('Failed to fetch upcoming matches');
  }
}

export async function getMatchesByLeague(leagueId: number, season: string): Promise<FootballAPIMatch[]> {
  try {
    const response = await api.get('/fixtures', {
      params: {
        league: leagueId,
        season,
        next: 10,
      },
    });

    return response.data.response;
  } catch (error) {
    console.error(`Error fetching matches for league ${leagueId}:`, error);
    throw new Error(`Failed to fetch matches for league ${leagueId}`);
  }
}

export async function getMatchDetails(fixtureId: number): Promise<FootballAPIMatch> {
  try {
    const response = await api.get('/fixtures', {
      params: {
        id: fixtureId,
      },
    });

    if (!response.data.response || response.data.response.length === 0) {
      throw new Error(`Match with ID ${fixtureId} not found`);
    }

    return response.data.response[0];
  } catch (error) {
    console.error(`Error fetching match details for fixture ${fixtureId}:`, error);
    throw new Error(`Failed to fetch match details for fixture ${fixtureId}`);
  }
}

export async function getTeamStats(teamId: number, leagueId: number, season: string) {
  try {
    const response = await api.get('/teams/statistics', {
      params: {
        team: teamId,
        league: leagueId,
        season,
      },
    });

    return response.data.response;
  } catch (error) {
    console.error(`Error fetching team stats for team ${teamId}:`, error);
    throw new Error(`Failed to fetch team stats for team ${teamId}`);
  }
}

export async function getH2HMatches(team1: number, team2: number) {
  try {
    const response = await api.get('/fixtures/headtohead', {
      params: {
        h2h: `${team1}-${team2}`,
        last: 5,
      },
    });

    return response.data.response;
  } catch (error) {
    console.error(`Error fetching H2H for teams ${team1} and ${team2}:`, error);
    throw new Error(`Failed to fetch H2H for teams ${team1} and ${team2}`);
  }
}

// Major soccer leagues IDs for quick access
export const MAJOR_LEAGUES = {
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  BUNDESLIGA: 78,
  SERIE_A: 135,
  LIGUE_1: 61,
  CHAMPIONS_LEAGUE: 2,
  EUROPA_LEAGUE: 3,
};
