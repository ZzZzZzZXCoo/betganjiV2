import { getMatchesWithPredictions } from '@/lib/services/prediction-service';
import { MatchList } from '@/components/matches/match-list';
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
      
      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600 mb-4">No predictions available</p>
          <p className="text-slate-500 mb-6">Predictions are generated automatically for upcoming matches</p>
          
          {user && (
            <form action={async () => {
              'use server';
              // This would be a server action to trigger prediction generation
              // For now, we'll just redirect to the same page
            }}>
              <Button type="submit">Generate Predictions</Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
