// src/app/api/roster/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Person, Shift, Assignment } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { situation, hospitalId, date, staff, constraints } = await request.json();
    
    // AI-powered roster generation logic
    const generatedShifts = await generateOptimalRoster(situation, staff, constraints, date);
    
    return NextResponse.json({
      shifts: generatedShifts,
      message: 'Roster generated successfully'
    });
  } catch (error) {
    console.error('Error generating roster:', error);
    return NextResponse.json(
      { error: 'Failed to generate roster' },
      { status: 500 }
    );
  }
}

async function generateOptimalRoster(
  situation: string,
  staff: Person[],
  constraints: any,
  date: string
): Promise<Shift[]> {
  // Analyze situation to determine required coverage
  const requiredCoverage = analyzeSituation(situation);
  
  // Create shifts based on analysis
  const shifts: Shift[] = [];
  
  // Get doctors and nurses separately
  const doctors = staff.filter(p => p.role === 'Doctor');
  const nurses = staff.filter(p => p.role === 'Nurse');
  
  // Create shifts for each unit mentioned in the situation
  const units = extractUnits(situation);
  const timeSlots = extractTimeSlots(situation, date);
  
  for (const unit of units) {
    for (const timeSlot of timeSlots) {
      const shiftId = `${unit.toLowerCase()}-${timeSlot.type}`;
      
      // Select appropriate staff for this unit and time
      const assignments = selectStaffForShift(
        unit,
        timeSlot,
        doctors,
        nurses,
        situation,
        constraints
      );
      
      const shift: Shift = {
        shiftId,
        ward: unit,
        startUtc: timeSlot.start,
        endUtc: timeSlot.end,
        assignments
      };
      
      shifts.push(shift);
    }
  }
  
  return shifts;
}

function analyzeSituation(situation: string): any {
  const analysis = {
    urgency: situation.toLowerCase().includes('emergency') || situation.toLowerCase().includes('urgent') ? 'high' : 'normal',
    specialties: [] as string[],
    units: [] as string[],
    procedures: extractProcedures(situation)
  };
  
  // Extract specialties mentioned
  const specialtyKeywords = ['cardiology', 'cardiac', 'icu', 'critical care', 'emergency', 'trauma'];
  for (const specialty of specialtyKeywords) {
    if (situation.toLowerCase().includes(specialty)) {
      analysis.specialties.push(specialty);
    }
  }
  
  return analysis;
}

function extractUnits(situation: string): string[] {
  const units: string[] = [];
  const unitKeywords = {
    'ICU': ['icu', 'intensive care', 'critical care'],
    'Cardiology': ['cardiology', 'cardiac', 'heart'],
    'Emergency': ['emergency', 'er', 'trauma'],
    'Surgery': ['surgery', 'surgical', 'or', 'operating room']
  };
  
  for (const [unit, keywords] of Object.entries(unitKeywords)) {
    if (keywords.some(keyword => situation.toLowerCase().includes(keyword))) {
      units.push(unit);
    }
  }
  
  return units.length > 0 ? units : ['General'];
}

function extractTimeSlots(situation: string, date: string): Array<{type: string, start: string, end: string}> {
  const timeSlots = [];
  
  // Default to day and night shifts
  const dayStart = `${date}T08:00:00Z`;
  const dayEnd = `${date}T20:00:00Z`;
  const nightStart = `${date}T20:00:00Z`;
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nightEnd = `${nextDay.toISOString().split('T')[0]}T08:00:00Z`;
  
  timeSlots.push({
    type: 'day',
    start: dayStart,
    end: dayEnd
  });
  
  timeSlots.push({
    type: 'night',
    start: nightStart,
    end: nightEnd
  });
  
  return timeSlots;
}

function extractProcedures(situation: string): string[] {
  const procedures = [];
  const procedureKeywords = ['surgery', 'procedure', 'operation', 'intervention'];
  
  for (const keyword of procedureKeywords) {
    if (situation.toLowerCase().includes(keyword)) {
      procedures.push(keyword);
    }
  }
  
  return procedures;
}

function selectStaffForShift(
  unit: string,
  timeSlot: any,
  doctors: Person[],
  nurses: Person[],
  situation: string,
  constraints: any
): Assignment[] {
  const assignments: Assignment[] = [];
  
  // Select appropriate doctor for the unit
  const suitableDoctor = findSuitableDoctor(unit, doctors, situation);
  if (suitableDoctor) {
    assignments.push({
      personId: suitableDoctor.personId,
      role: suitableDoctor.role,
      tags: {
        senior: suitableDoctor.seniority?.includes('Senior') || suitableDoctor.seniority?.includes('Consultant'),
        specialty: suitableDoctor.specialty
      }
    });
  }
  
  // Select appropriate nurse for the unit
  const suitableNurse = findSuitableNurse(unit, nurses, situation);
  if (suitableNurse) {
    assignments.push({
      personId: suitableNurse.personId,
      role: suitableNurse.role,
      tags: {
        grade: suitableNurse.grade,
        unit: suitableNurse.unit
      }
    });
  }
  
  return assignments;
}

function findSuitableDoctor(unit: string, doctors: Person[], situation: string): Person | null {
  // Priority based on unit and specialty match
  const unitSpecialtyMap: {[key: string]: string[]} = {
    'ICU': ['Critical Care', 'Emergency Medicine'],
    'Cardiology': ['Cardiology'],
    'Emergency': ['Emergency Medicine'],
    'Surgery': ['Surgery']
  };
  
  const preferredSpecialties = unitSpecialtyMap[unit] || [];
  
  // First try to find a doctor with matching specialty
  for (const specialty of preferredSpecialties) {
    const doctor = doctors.find(d => d.specialty === specialty);
    if (doctor) return doctor;
  }
  
  // If no specialty match, prefer senior doctors
  const seniorDoctor = doctors.find(d => d.seniority?.includes('Senior') || d.seniority?.includes('Consultant'));
  if (seniorDoctor) return seniorDoctor;
  
  // Return any available doctor
  return doctors[0] || null;
}

function findSuitableNurse(unit: string, nurses: Person[], situation: string): Person | null {
  // Try to find a nurse with matching unit
  const matchingNurse = nurses.find(n => n.unit === unit);
  if (matchingNurse) return matchingNurse;
  
  // If no unit match, prefer senior nurses
  const seniorNurse = nurses.find(n => n.grade?.includes('Senior'));
  if (seniorNurse) return seniorNurse;
  
  // Return any available nurse
  return nurses[0] || null;
}