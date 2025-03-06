import { getMatches } from '@/lib/services/match-service';
import { MatchList } from '@/components/matches/match-list';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  // Fetch upcoming matches
  const matches = await getMatches();

  // Get current user
  const user = await getCurrentUser();
  
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="mb-3">Upcoming Soccer Matches</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          View upcoming matches across major leagues and see AI-powered predictions.
        </p>
      </div>
      
      <div className="mb-6 flex justify-between items-center">
        <h2>Today's Matches</h2>
        <Link href="/predictions">
          <Button>View All Predictions</Button>
        </Link>
      </div>
      
      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-slate-600 mb-4">No upcoming matches found</p>
          <p className="text-slate-500">Check back later for new matches</p>
        </div>
      )}
    </div>
  );
}
