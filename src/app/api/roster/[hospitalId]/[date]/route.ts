// src/app/api/roster/[hospitalId]/[date]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getRostersCollection, getEventsCollection } from '@/lib/mongodb';
import { Roster, RosterEvent } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { hospitalId: string; date: string } }
) {
  try {
    const { hospitalId, date } = params;
    const collection = await getRostersCollection();
    
    const roster = await collection.findOne({ 
      hospitalId, 
      date 
    });

    if (!roster) {
      return NextResponse.json(
        { error: 'Roster not found' }, 
        { status: 404 }
      );
    }

    return NextResponse.json(roster);
  } catch (error) {
    console.error('Error fetching roster:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { hospitalId: string; date: string } }
) {
  try {
    const { hospitalId, date } = params;
    const updatedRoster: Roster = await request.json();
    
    const collection = await getRostersCollection();
    const eventsCollection = await getEventsCollection();

    // Get current roster for diff calculation
    const currentRoster = await collection.findOne({ 
      hospitalId, 
      date 
    });

    // Update roster
    const result = await collection.replaceOne(
      { hospitalId, date, version: currentRoster?.version || 0 },
      {
        ...updatedRoster,
        hospitalId,
        date
      },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return NextResponse.json(
        { error: 'Conflict: roster was modified by another user' }, 
        { status: 409 }
      );
    }

    // Create audit event
    const event: RosterEvent = {
      rosterId: `${hospitalId}:${date}`,
      timestamp: new Date(),
      authorId: 'system', // In real app, get from auth
      diff: {
        old: currentRoster,
        new: updatedRoster
      },
      version: updatedRoster.version
    };

    await eventsCollection.insertOne(event);

    return NextResponse.json(updatedRoster);
  } catch (error) {
    console.error('Error updating roster:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}