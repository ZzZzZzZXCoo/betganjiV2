import { NextRequest, NextResponse } from 'next/server';
import { 
  createPrediction,
  generateAllPredictions, 
  getMatchesWithPredictions,
  updateMatchOdds 
} from '@/lib/services/prediction-service';

export async function GET(req: NextRequest) {
  try {
    const matches = await getMatchesWithPredictions();
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error in GET /api/predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check if we're generating for a specific match or all matches
    if (body.matchId) {
      // Generate prediction for a single match
      const prediction = await createPrediction(body.matchId);
      
      // Update odds for the match
      await updateMatchOdds(body.matchId);
      
      return NextResponse.json(prediction);
    } else if (body.generateAll) {
      // Generate predictions for all upcoming matches
      await generateAllPredictions();
      return NextResponse.json({ success: true, message: 'Predictions generation started' });
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Provide matchId or generateAll' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/predictions:', error);
    return NextResponse.json(
      { error: 'Failed to create prediction' },
      { status: 500 }
    );
  }
}
