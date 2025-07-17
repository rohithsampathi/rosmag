import { NextResponse } from 'next/server';
import { getRostersCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const collection = await getRostersCollection();
    const rosters = await collection.find({}).sort({ date: -1 }).limit(10).toArray();
    
    return NextResponse.json(rosters);
  } catch (error) {
    console.error('Error fetching rosters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rosters' },
      { status: 500 }
    );
  }
}