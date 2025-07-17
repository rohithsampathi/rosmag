// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const settingsCollection = db.collection('settings');
    
    // Try to get settings from database first
    const savedSettings = await settingsCollection.findOne({ type: 'app_settings' });
    
    const settings = {
      maxHours7d: savedSettings?.maxHours7d || parseInt(process.env.MAX_HOURS_7D || '48'),
      minRest: savedSettings?.minRest || parseInt(process.env.MIN_REST || '8'),
      seniorCoverage: savedSettings?.seniorCoverage ?? (process.env.SENIOR_COVERAGE === 'true'),
      claudeApiKey: savedSettings?.claudeApiKey || (process.env.CLAUDE_API_KEY ? '***masked***' : ''),
      mongoUri: savedSettings?.mongoUri || (process.env.MONGODB_URI ? '***masked***' : ''),
      hospitalName: savedSettings?.hospitalName || process.env.HOSPITAL_NAME || 'General Hospital',
      timezone: savedSettings?.timezone || process.env.TIMEZONE || 'Asia/Kolkata'
    };
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json();
    
    const db = await getDatabase();
    const settingsCollection = db.collection('settings');
    
    // Save settings to database
    await settingsCollection.updateOne(
      { type: 'app_settings' },
      { 
        $set: {
          type: 'app_settings',
          ...settings,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
