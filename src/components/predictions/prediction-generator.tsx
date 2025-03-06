"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Match } from '@/types';
import { useRouter } from 'next/navigation';

interface PredictionGeneratorProps {
  matches?: Match[];
}

export function PredictionGenerator({ matches }: PredictionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const router = useRouter();

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ generateAll: true }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate predictions');
      }
      
      // Refresh the page to show the new predictions
      router.refresh();
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSingle = async (matchId: string) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate prediction for match ${matchId}`);
      }
      
      setGeneratedCount(prev => prev + 1);
      
      // Refresh the page to show the new prediction
      router.refresh();
    } catch (error) {
      console.error(`Error generating prediction for match ${matchId}:`, error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mb-6">
      <Button
        onClick={handleGenerateAll}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate All Predictions'}
      </Button>
      
      {generatedCount > 0 && (
        <p className="mt-2 text-sm text-green-600">
          Generated {generatedCount} prediction{generatedCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
