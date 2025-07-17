import { NextRequest, NextResponse } from 'next/server';
import { getStaffCollection } from '@/lib/mongodb';
import { Person } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const role = searchParams.get('role');

    const collection = await getStaffCollection();
    let filter: any = {};

    if (department) {
      filter.department = department;
    }

    if (role) {
      filter.role = role;
    }

    const staff = await collection.find(filter).toArray();

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const staffData: Person = await request.json();
    
    const collection = await getStaffCollection();
    const result = await collection.insertOne(staffData);

    return NextResponse.json({ 
      ...staffData, 
      _id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const staffData = await request.json();
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');

    if (!personId) {
      return NextResponse.json(
        { error: 'Person ID is required' },
        { status: 400 }
      );
    }

    const collection = await getStaffCollection();
    const result = await collection.updateOne(
      { personId },
      { $set: staffData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    const updatedStaff = await collection.findOne({ personId });
    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('personId');

    if (!personId) {
      return NextResponse.json(
        { error: 'Person ID is required' },
        { status: 400 }
      );
    }

    const collection = await getStaffCollection();
    const result = await collection.deleteOne({ personId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Staff member deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}

