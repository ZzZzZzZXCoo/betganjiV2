import { getMatchesWithPredictions } from '@/lib/services/prediction-service';
import { MatchList } from '@/components/matches/match-list';
import { PredictionGenerator } from '@/components/predictions/prediction-generator';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

export default async function PredictionsPage() {
  const matches = await getMatchesWithPredictions();
  const user = await getCurrentUser();

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="mb-3">Match Predictions</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          View AI-powered predictions for upcoming soccer matches.
        </p>
      </div>
      
      {user && (
        <div className="mb-6">
          <PredictionGenerator matches={matches} />
        </div>
      )}
      
      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600 mb-4">No predictions available</p>
          <p className="text-slate-500 mb-6">Predictions are generated automatically for upcoming matches</p>
          
          {!user && (
            <p className="text-sm text-slate-500">
              Sign in to generate predictions for upcoming matches
            </p>
          )}
        </div>
      )}
    </div>
  );
}
