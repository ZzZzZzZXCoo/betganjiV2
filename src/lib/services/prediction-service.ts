import { prisma } from '@/lib/db';
import { generatePrediction } from '@/lib/api/deepseek';
import { getOddsForMatch, processOdds } from '@/lib/api/odds-api';
import { DeepseekPredictionResponse, Match, Prediction } from '@/types';

// Create or update prediction for a match
export async function createPrediction(matchId: string): Promise<Prediction> {
  try {
    // Get match details
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        homeTeam: true,
        awayTeam: true,
        league: true,
      },
    });

    if (!match) {
      throw new Error(`Match with ID ${matchId} not found`);
    }

    // Get latest season (this is a simplified approach - in a real app you might get this from an API)
    const currentYear = new Date().getFullYear();
    const season = `${currentYear-1}/${currentYear}`;

    // Generate prediction using DeepSeek API
    const prediction = await generatePrediction(
      match.homeTeam.apiId,
      match.awayTeam.apiId,
      match.league.apiId,
      season
    );

    // Check if prediction already exists
    const existingPrediction = await prisma.prediction.findUnique({
      where: { matchId },
    });

    if (existingPrediction) {
      // Update existing prediction
      return prisma.prediction.update({
        where: { id: existingPrediction.id },
        data: {
          homeChance: prediction.homeChance,
          drawChance: prediction.drawChance,
          awayChance: prediction.awayChance,
          prediction: prediction.prediction,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
        },
      });
    } else {
      // Create new prediction
      return prisma.prediction.create({
        data: {
          matchId,
          homeChance: prediction.homeChance,
          drawChance: prediction.drawChance,
          awayChance: prediction.awayChance,
          prediction: prediction.prediction,
          confidence: prediction.confidence,
          reasoning: prediction.reasoning,
        },
      });
    }
  } catch (error) {
    console.error(`Error creating prediction for match ${matchId}:`, error);
    throw new Error(`Failed to create prediction for match ${matchId}`);
  }
}

// Fetch odds and update the database
export async function updateMatchOdds(matchId: string): Promise<void> {
  try {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new Error(`Match with ID ${matchId} not found`);
    }

    // Get odds from API
    const oddsData = await getOddsForMatch(match.apiId);
    
    if (!oddsData) {
      console.log(`No odds available for match ${matchId}`);
      return;
    }

    // Process odds to get average values
    const processedOdds = processOdds(oddsData);
    
    // Create odds entry
    await prisma.odds.create({
      data: {
        matchId,
        provider: 'average',
        homeWin: processedOdds.homeWin,
        draw: processedOdds.draw,
        awayWin: processedOdds.awayWin,
      },
    });
  } catch (error) {
    console.error(`Error updating odds for match ${matchId}:`, error);
    throw new Error(`Failed to update odds for match ${matchId}`);
  }
}

// Generate predictions for all upcoming matches
export async function generateAllPredictions(): Promise<void> {
  try {
    // Get all upcoming matches without predictions
    const matches = await prisma.match.findMany({
      where: {
        status: 'NOT_STARTED',
        matchDate: {
          gte: new Date(),
        },
        prediction: null,
      },
    });

    for (const match of matches) {
      try {
        // Generate prediction for each match
        await createPrediction(match.id);
        
        // Add a small delay to avoid API rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error generating prediction for match ${match.id}:`, error);
        // Continue with the next match
      }
    }
  } catch (error) {
    console.error('Error generating all predictions:', error);
    throw new Error('Failed to generate all predictions');
  }
}

// Get prediction by match ID
export async function getPrediction(matchId: string): Promise<Prediction | null> {
  try {
    return prisma.prediction.findUnique({
      where: { matchId },
    });
  } catch (error) {
    console.error(`Error fetching prediction for match ${matchId}:`, error);
    throw new Error(`Failed to fetch prediction for match ${matchId}`);
  }
}

// Get all matches with predictions
export async function getMatchesWithPredictions(): Promise<Match[]> {
  try {
    return prisma.match.findMany({
      where: {
        prediction: {
          isNot: null,
        },
        matchDate: {
          gte: new Date(),
        },
      },
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
    console.error('Error fetching matches with predictions:', error);
    throw new Error('Failed to fetch matches with predictions');
  }
}
