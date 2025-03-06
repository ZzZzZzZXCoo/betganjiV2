import axios from 'axios';
import { DeepseekPredictionResponse, PredictionResult } from '@/types';
import { getH2HMatches, getTeamStats } from './football-data';

const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE_URL = 'https://api.deepseek.com/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Function to generate a prediction using DeepSeek API
export async function generatePrediction(
  homeTeamId: number,
  awayTeamId: number,
  leagueId: number,
  season: string
): Promise<DeepseekPredictionResponse> {
  try {
    // Collect data for analysis
    const [homeTeamStats, awayTeamStats, h2hMatches] = await Promise.all([
      getTeamStats(homeTeamId, leagueId, season),
      getTeamStats(awayTeamId, leagueId, season),
      getH2HMatches(homeTeamId, awayTeamId),
    ]);

    // Create a prompt for the AI model
    const prompt = createPredictionPrompt(
      homeTeamStats, 
      awayTeamStats, 
      h2hMatches,
      season
    );

    // Call DeepSeek API
    const response = await api.post('/chat/completions', {
      model: 'deepseek-coder',
      messages: [
        {
          role: 'system',
          content: 'You are a sophisticated soccer match prediction AI. Analyze the provided data and predict the match outcome accurately. Your response should include the prediction (HOME_WIN, DRAW, or AWAY_WIN), confidence level (0.0-1.0), chances for each outcome as percentages, and a brief reasoning.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const aiResponse = response.data.choices[0].message.content;
    const parsedResponse = JSON.parse(aiResponse);
    
    // Ensure response follows expected structure
    const processedResponse: DeepseekPredictionResponse = {
      prediction: parsedResponse.prediction as PredictionResult,
      confidence: parseFloat(parsedResponse.confidence) || 0.7,
      homeChance: parseFloat(parsedResponse.homeChance) || 0.33,
      drawChance: parseFloat(parsedResponse.drawChance) || 0.33,
      awayChance: parseFloat(parsedResponse.awayChance) || 0.33,
      reasoning: parsedResponse.reasoning || 'Based on team performance analysis'
    };

    return processedResponse;
  } catch (error) {
    console.error('Error generating prediction:', error);
    
    // Return fallback prediction in case of error
    return {
      prediction: 'HOME_WIN',
      confidence: 0.33,
      homeChance: 0.4,
      drawChance: 0.3,
      awayChance: 0.3,
      reasoning: 'Unable to generate prediction due to an error. This is a fallback prediction.'
    };
  }
}

// Create prompt for the AI model
function createPredictionPrompt(
  homeTeamStats: any,
  awayTeamStats: any,
  h2hMatches: any,
  season: string
): string {
  return `
Please predict the outcome of the soccer match with the following data:

HOME TEAM STATISTICS (${season} Season):
${JSON.stringify(homeTeamStats, null, 2)}

AWAY TEAM STATISTICS (${season} Season):
${JSON.stringify(awayTeamStats, null, 2)}

HEAD TO HEAD MATCHES (Last 5):
${JSON.stringify(h2hMatches, null, 2)}

Based on this data, predict the match outcome (HOME_WIN, DRAW, or AWAY_WIN),
assign a confidence level between 0.0 and 1.0,
calculate the percentage chance for each outcome (homeChance, drawChance, awayChance),
and provide a brief reasoning for your prediction.

Please format your response as a JSON object.
`;
}
