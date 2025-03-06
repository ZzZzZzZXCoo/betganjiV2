import { prisma } from '@/lib/db';
import { Match, FootballAPIMatch, MatchStatus } from '@/types';
import { getUpcomingMatches, getMatchesByLeague, MAJOR_LEAGUES } from '@/lib/api/football-data';

// Convert API match status to our database enum
function mapMatchStatus(apiStatus: string): MatchStatus {
  switch (apiStatus) {
    case 'LIVE':
      return 'LIVE';
    case 'FT': // Full Time
    case 'AET': // After Extra Time
    case 'PEN': // After Penalties
      return 'FINISHED';
    case 'PST':
      return 'POSTPONED';
    case 'CANC':
      return 'CANCELLED';
    default:
      return 'NOT_STARTED';
  }
}

// Transform API match to our database model
async function transformApiMatch(apiMatch: FootballAPIMatch) {
  // Check if league exists, if not create it
  let league = await prisma.league.findUnique({
    where: { apiId: apiMatch.league.id },
  });

  if (!league) {
    league = await prisma.league.create({
      data: {
        apiId: apiMatch.league.id,
        name: apiMatch.league.name,
        country: apiMatch.league.country,
        logo: apiMatch.league.logo,
        flag: apiMatch.league.flag,
      },
    });
  }

  // Check if home team exists, if not create it
  let homeTeam = await prisma.team.findUnique({
    where: { apiId: apiMatch.teams.home.id },
  });

  if (!homeTeam) {
    homeTeam = await prisma.team.create({
      data: {
        apiId: apiMatch.teams.home.id,
        name: apiMatch.teams.home.name,
        logo: apiMatch.teams.home.logo,
      },
    });
  }

  // Check if away team exists, if not create it
  let awayTeam = await prisma.team.findUnique({
    where: { apiId: apiMatch.teams.away.id },
  });

  if (!awayTeam) {
    awayTeam = await prisma.team.create({
      data: {
        apiId: apiMatch.teams.away.id,
        name: apiMatch.teams.away.name,
        logo: apiMatch.teams.away.logo,
      },
    });
  }

  // Check if match exists, if not create it
  const existingMatch = await prisma.match.findUnique({
    where: { apiId: apiMatch.fixture.id },
  });

  if (existingMatch) {
    // Update match if it exists
    return prisma.match.update({
      where: { id: existingMatch.id },
      data: {
        status: mapMatchStatus(apiMatch.fixture.status.short),
        matchDate: new Date(apiMatch.fixture.date),
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
        prediction: true,
      },
    });
  } else {
    // Create new match
    return prisma.match.create({
      data: {
        apiId: apiMatch.fixture.id,
        leagueId: league.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        matchDate: new Date(apiMatch.fixture.date),
        status: mapMatchStatus(apiMatch.fixture.status.short),
      },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: true,
        prediction: true,
      },
    });
  }
}

// Fetch and store upcoming matches
export async function syncUpcomingMatches(date?: string): Promise<Match[]> {
  try {
    const apiMatches = await getUpcomingMatches(date);
    const transformedMatches = await Promise.all(
      apiMatches.map(match => transformApiMatch(match))
    );
    return transformedMatches;
  } catch (error) {
    console.error('Error syncing upcoming matches:', error);
    throw new Error('Failed to sync upcoming matches');
  }
}

// Fetch and store matches for specific leagues
export async function syncLeagueMatches(season: string): Promise<Match[]> {
  try {
    const allMatches: Match[] = [];
    
    // Get matches for each major league
    for (const leagueId of Object.values(MAJOR_LEAGUES)) {
      const apiMatches = await getMatchesByLeague(leagueId, season);
      const transformedMatches = await Promise.all(
        apiMatches.map(match => transformApiMatch(match))
      );
      allMatches.push(...transformedMatches);
    }
    
    return allMatches;
  } catch (error) {
    console.error('Error syncing league matches:', error);
    throw new Error('Failed to sync league matches');
  }
}

// Get all upcoming matches
export async function getMatches(date?: string): Promise<Match[]> {
  // If we have a date, convert it to a Date object
  const matchDate = date ? new Date(date) : undefined;
  
  // Query conditions
  const whereClause = matchDate 
    ? {
        matchDate: {
          gte: new Date(matchDate.setHours(0, 0, 0, 0)),
          lt: new Date(matchDate.setHours(23, 59, 59, 999)),
        },
      }
    : {
        matchDate: {
          gte: new Date(),
        },
        status: 'NOT_STARTED',
      };

  try {
    return prisma.match.findMany({
      where: whereClause,
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        prediction: true,
      },
      orderBy: {
        matchDate: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw new Error('Failed to fetch matches');
  }
}

// Get match by ID
export async function getMatchById(id: string): Promise<Match | null> {
  try {
    return prisma.match.findUnique({
      where: { id },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
        odds: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        prediction: true,
      },
    });
  } catch (error) {
    console.error(`Error fetching match with ID ${id}:`, error);
    throw new Error(`Failed to fetch match with ID ${id}`);
  }
}
