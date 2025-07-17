// src/app/api/staff/[personId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStaffCollection } from '@/lib/mongodb';
import { Person } from '@/lib/types';

export async function PUT(
  request: NextRequest,
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params;
    const updateData = await request.json();
    
    const collection = await getStaffCollection();
    
    // Check if this is a partial update (e.g., just attendance)
    const isPartialUpdate = Object.keys(updateData).some(key => 
      key === 'attendance' || key === 'availability'
    ) && Object.keys(updateData).length <= 2;
    
    if (isPartialUpdate) {
      // Use $set for partial updates
      const result = await collection.updateOne(
        { personId },
        { $set: updateData }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Staff member not found' },
          { status: 404 }
        );
      }
      
      // Return the updated staff member
      const updatedStaff = await collection.findOne({ personId });
      return NextResponse.json(updatedStaff);
    } else {
      // Full replacement for complete updates
      const result = await collection.replaceOne(
        { personId },
        updateData
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'Staff member not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updateData);
    }
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { personId: string } }
) {
  try {
    const { personId } = params;
    
    const collection = await getStaffCollection();
    const result = await collection.deleteOne({ personId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
