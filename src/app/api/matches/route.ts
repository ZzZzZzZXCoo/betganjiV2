import { NextRequest, NextResponse } from 'next/server';
import { getMatches, syncUpcomingMatches } from '@/lib/services/match-service';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get('date');
    const sync = searchParams.get('sync') === 'true';

    if (sync) {
      // Sync matches from API to database
      const matches = await syncUpcomingMatches(date || undefined);
      return NextResponse.json(matches);
    } else {
      // Get matches from database
      const matches = await getMatches(date || undefined);
      return NextResponse.json(matches);
    }
  } catch (error) {
    console.error('Error in /api/matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}
