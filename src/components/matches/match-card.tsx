"use client";

import React from 'react';
import Image from 'next/image';
import { Match, Prediction } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  formatMatchDate, 
  formatMatchTime, 
  getPredictionColor, 
  getPredictionLabel,
  formatOdds,
  getTeamInitials
} from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onGeneratePrediction?: (matchId: string) => void;
}

export function MatchCard({ match, onGeneratePrediction }: MatchCardProps) {
  const { homeTeam, awayTeam, matchDate, odds, prediction, league } = match;
  const formattedDate = formatMatchDate(matchDate);
  const formattedTime = formatMatchTime(matchDate);
  
  // Get first odds entry if available
  const latestOdds = odds && odds.length > 0 ? odds[0] : null;
  
  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-slate-50 p-2 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-slate-600">
          <span className="font-medium">{league.name}</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>
        <div className="text-sm font-bold text-slate-800">{formattedTime}</div>
      </div>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-11 gap-2 items-center">
          {/* Home Team */}
          <div className="col-span-4 flex flex-col items-center sm:items-end text-center sm:text-right">
            <div className="font-medium">{homeTeam.name}</div>
          </div>
          
          {/* Team Logo or Initials - Home */}
          <div className="col-span-1 flex justify-center">
            {homeTeam.logo ? (
              <div className="relative h-8 w-8">
                <Image 
                  src={homeTeam.logo} 
                  alt={homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                {getTeamInitials(homeTeam.name)}
              </div>
            )}
          </div>
          
          {/* Score/Odds */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="text-sm text-center font-bold">
              {latestOdds && (
                <span title="Home win odds">{formatOdds(latestOdds.homeWin)}</span>
              )}
            </div>
          </div>
          
          {/* Draw/VS */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            {latestOdds ? (
              <div className="text-sm text-center font-bold" title="Draw odds">
                {formatOdds(latestOdds.draw)}
              </div>
            ) : (
              <span className="text-sm text-slate-400">vs</span>
            )}
          </div>
          
          {/* Away Odds */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="text-sm text-center font-bold">
              {latestOdds && (
                <span title="Away win odds">{formatOdds(latestOdds.awayWin)}</span>
              )}
            </div>
          </div>
          
          {/* Team Logo or Initials - Away */}
          <div className="col-span-1 flex justify-center">
            {awayTeam.logo ? (
              <div className="relative h-8 w-8">
                <Image 
                  src={awayTeam.logo} 
                  alt={awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                {getTeamInitials(awayTeam.name)}
              </div>
            )}
          </div>
          
          {/* Away Team */}
          <div className="col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="font-medium">{awayTeam.name}</div>
          </div>
        </div>
        
        {/* Prediction Section */}
        <div className="mt-4 flex items-center justify-between">
          {prediction ? (
            <div className="flex items-center gap-3">
              <div 
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPredictionColor(prediction.prediction)}`}
              >
                {getPredictionLabel(prediction.prediction, homeTeam.name, awayTeam.name)}
              </div>
              <div className="text-sm text-slate-600">
                Confidence: {Math.round(prediction.confidence * 100)}%
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">No prediction available yet</div>
          )}
          
          {onGeneratePrediction && !prediction && (
            <Button 
              size="sm"
              onClick={() => onGeneratePrediction(match.id)}
            >
              Predict
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
