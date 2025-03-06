"use client";

import React, { useState } from 'react';
import { Match } from '@/types';
import { MatchCard } from './match-card';
import { Button } from '@/components/ui/button';

interface MatchListProps {
  matches: Match[];
  onGeneratePrediction?: (matchId: string) => void;
}

export function MatchList({ matches, onGeneratePrediction }: MatchListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group matches by league
  const matchesByLeague = matches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = [];
    }
    acc[leagueName].push(match);
    return acc;
  }, {} as Record<string, Match[]>);
  
  // Filter matches by search query
  const filteredLeagues = Object.keys(matchesByLeague).filter(leagueName => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Check if league name matches
    if (leagueName.toLowerCase().includes(query)) return true;
    
    // Check if any team in the league matches
    return matchesByLeague[leagueName].some(match => 
      match.homeTeam.name.toLowerCase().includes(query) || 
      match.awayTeam.name.toLowerCase().includes(query)
    );
  });
  
  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for team or league..."
          className="w-full p-2 border border-slate-300 rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredLeagues.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">No matches found</p>
        </div>
      ) : (
        filteredLeagues.map(leagueName => (
          <div key={leagueName} className="mb-6">
            <h2 className="text-xl font-bold mb-3">{leagueName}</h2>
            <div className="space-y-3">
              {matchesByLeague[leagueName].map(match => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onGeneratePrediction={onGeneratePrediction}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
