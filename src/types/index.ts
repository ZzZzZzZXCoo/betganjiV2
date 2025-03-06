import { Match as PrismaMatch, Odds as PrismaOdds, Prediction as PrismaPrediction, PredictionResult, MatchStatus } from '@prisma/client';

export type Match = PrismaMatch & {
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  odds?: Odds[];
  prediction?: Prediction;
};

export type Team = {
  id: string;
  apiId: number;
  name: string;
  logo: string | null;
};

export type League = {
  id: string;
  apiId: number;
  name: string;
  country: string;
  logo: string | null;
  flag: string | null;
};

export type Odds = PrismaOdds;

export type Prediction = PrismaPrediction;

export type MatchWithPrediction = Match & {
  prediction: Prediction;
};

// API Types for external services
export type FootballAPIMatch = {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
};

export type OddsAPIResponse = {
  bookmakers: Array<{
    key: string;
    markets: Array<{
      key: string;
      outcomes: Array<{
        name: string;
        price: number;
      }>;
    }>;
  }>;
};

export type DeepseekPredictionResponse = {
  prediction: PredictionResult;
  confidence: number;
  homeChance: number;
  drawChance: number;
  awayChance: number;
  reasoning: string;
};

export { PredictionResult, MatchStatus };
