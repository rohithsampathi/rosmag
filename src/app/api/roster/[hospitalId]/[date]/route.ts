// src/app/api/roster/[hospitalId]/[date]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getRostersCollection, getEventsCollection, getStaffCollection } from '@/lib/mongodb';
import { Roster, RosterEvent, Person } from '@/lib/types';

async function updateStaffAvailability(roster: Roster, previousRoster?: Roster) {
  const staffCollection = await getStaffCollection();
  const rosterId = `${roster.hospitalId}:${roster.date}`;
  
  // Get all assigned staff IDs from the new roster
  const assignedStaffIds = new Set<string>();
  roster.shifts.forEach(shift => {
    shift.assignments.forEach(assignment => {
      assignedStaffIds.add(assignment.personId);
    });
  });
  
  // Get previously assigned staff IDs if there was a previous roster
  const previouslyAssignedStaffIds = new Set<string>();
  if (previousRoster) {
    previousRoster.shifts.forEach(shift => {
      shift.assignments.forEach(assignment => {
        previouslyAssignedStaffIds.add(assignment.personId);
      });
    });
  }
  
  // Update availability for newly assigned staff
  if (assignedStaffIds.size > 0) {
    await staffCollection.updateMany(
      { personId: { $in: Array.from(assignedStaffIds) } },
      {
        $set: {
          'availability.status': 'assigned',
          'availability.lastAssigned': rosterId,
          'availability.lastAssignedDate': roster.date,
          'availability.reason': 'Assigned to roster'
        }
      }
    );
  }
  
  // Update availability for staff who were previously assigned but are no longer assigned
  const unassignedStaffIds = Array.from(previouslyAssignedStaffIds).filter(id => !assignedStaffIds.has(id));
  if (unassignedStaffIds.length > 0) {
    await staffCollection.updateMany(
      { personId: { $in: unassignedStaffIds } },
      {
        $set: {
          'availability.status': 'available',
          'availability.reason': 'Unassigned from roster'
        },
        $unset: {
          'availability.lastAssigned': '',
          'availability.lastAssignedDate': ''
        }
      }
    );
  }
}

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

    // Update staff availability based on roster assignments
    await updateStaffAvailability(updatedRoster, currentRoster || undefined);

    return NextResponse.json(updatedRoster);
  } catch (error) {
    console.error('Error updating roster:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}