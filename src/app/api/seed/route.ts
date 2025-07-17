// src/app/api/seed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getRostersCollection, getStaffCollection } from '@/lib/mongodb';
import { sampleStaff, sampleRoster } from '@/lib/sampleData';

export async function POST() {
  try {
    // Seed staff
    const staffCollection = await getStaffCollection();
    await staffCollection.deleteMany({});
    await staffCollection.insertMany(sampleStaff);

    // Seed roster
    const rosterCollection = await getRostersCollection();
    await rosterCollection.deleteMany({});
    await rosterCollection.insertOne(sampleRoster);

    return NextResponse.json({ 
      message: 'Sample data seeded successfully',
      staffCount: sampleStaff.length,
      rosterCount: 1
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}