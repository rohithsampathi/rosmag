// src/app/api/roster/analyze/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Roster, AIAnalysis } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { roster, question } = await request.json();
    
    // Perform roster analysis
    const analysis = await analyzeRoster(roster, question);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing roster:', error);
    return NextResponse.json(
      { error: 'Failed to analyze roster' },
      { status: 500 }
    );
  }
}

async function analyzeRoster(roster: Roster, question: string): Promise<AIAnalysis> {
  // Analyze roster for violations and opportunities
  const violations = [];
  const suggestions = [];
  
  // Check for basic violations
  for (const shift of roster.shifts) {
    // Check if shift has adequate coverage
    if (shift.assignments.length === 0) {
      violations.push({
        type: 'coverage',
        severity: 'high',
        message: `Shift ${shift.shiftId} in ${shift.ward} has no staff assigned`,
        affectedShifts: [shift.shiftId]
      });
    }
    
    // Check if shift has proper doctor coverage
    const hasDoctor = shift.assignments.some(a => a.role === 'Doctor');
    if (!hasDoctor) {
      violations.push({
        type: 'coverage',
        severity: 'medium',
        message: `Shift ${shift.shiftId} in ${shift.ward} has no doctor assigned`,
        affectedShifts: [shift.shiftId]
      });
    }
    
    // Check for shift length violations
    const shiftDuration = new Date(shift.endUtc).getTime() - new Date(shift.startUtc).getTime();
    const shiftHours = shiftDuration / (1000 * 60 * 60);
    
    if (shiftHours > 12) {
      violations.push({
        type: 'hours',
        severity: 'medium',
        message: `Shift ${shift.shiftId} is ${shiftHours} hours long, exceeding recommended 12-hour limit`,
        affectedShifts: [shift.shiftId]
      });
    }
  }
  
  // Generate suggestions
  if (violations.length === 0) {
    suggestions.push({
      type: 'optimization',
      message: 'Roster appears to be well-structured with proper coverage',
      impact: 'positive'
    });
  } else {
    suggestions.push({
      type: 'coverage',
      message: 'Consider adding more staff to shifts with insufficient coverage',
      impact: 'high'
    });
  }
  
  // Check for specialty coverage
  const specialtyUnits = roster.shifts.filter(s => 
    s.ward.toLowerCase().includes('icu') || 
    s.ward.toLowerCase().includes('cardiology') ||
    s.ward.toLowerCase().includes('emergency')
  );
  
  if (specialtyUnits.length > 0) {
    suggestions.push({
      type: 'specialization',
      message: 'Ensure specialty units have appropriately qualified staff',
      impact: 'medium'
    });
  }
  
  const status = violations.length === 0 ? "OK" : "VIOLATION";
  const explanation = violations.length === 0 
    ? 'Roster meets all basic requirements'
    : `Found ${violations.length} issues that need attention`;
  
  const actions = violations.map(v => ({
    type: v.type,
    warning: v.message
  }));

  return {
    status,
    explanation,
    actions,
    score: Math.max(0, 100 - (violations.length * 15))
  };
}