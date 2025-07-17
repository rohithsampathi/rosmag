// src/app/api/seed/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getRostersCollection, getStaffCollection } from '@/lib/mongodb';
import { sampleStaff, sampleRoster } from '@/lib/sampleData';
import { allNewStaff } from '@/lib/seedStaff';

export async function POST() {
  try {
    // Seed staff
    const staffCollection = await getStaffCollection();
    await staffCollection.deleteMany({});
    
    // Insert original sample staff + new staff (15 doctors + 30 nurses + helper staff)
    const allStaff = [...sampleStaff, ...allNewStaff];
    await staffCollection.insertMany(allStaff);

    // Seed roster
    const rosterCollection = await getRostersCollection();
    await rosterCollection.deleteMany({});
    await rosterCollection.insertOne(sampleRoster);

    return NextResponse.json({ 
      message: 'Sample data seeded successfully',
      staffCount: allStaff.length,
      rosterCount: 1,
      breakdown: {
        originalStaff: sampleStaff.length,
        newDoctors: 15,
        newNurses: 30,
        newHelperStaff: allNewStaff.length - 45
      }
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}