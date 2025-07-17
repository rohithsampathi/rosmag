// src/app/api/roster/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Person, Shift, Assignment, TeamOption, TeamMemberProfile, RosterGenerationResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { situation, hospitalId, date, staff, constraints } = await request.json();
    
    // AI-powered roster generation logic with multiple options
    const rosterResult = await generateOptimalRosterOptions(situation, staff, constraints, date);
    
    return NextResponse.json(rosterResult);
  } catch (error) {
    console.error('Error generating roster:', error);
    return NextResponse.json(
      { error: 'Failed to generate roster' },
      { status: 500 }
    );
  }
}

async function generateOptimalRosterOptions(
  situation: string,
  staff: Person[],
  constraints: any,
  date: string
): Promise<RosterGenerationResult> {
  // Analyze situation to determine required coverage
  const requiredCoverage = analyzeSituation(situation);
  
  // Get available staff
  const availableStaff = staff.filter(p => 
    !p.availability || 
    p.availability.status === 'available' || 
    p.availability.status === undefined
  );
  
  // Generate 3 different team options
  const options: TeamOption[] = [];
  
  // Option 1: Specialty-Focused Team
  const option1 = await generateSpecialtyFocusedTeam(situation, availableStaff, constraints, date, requiredCoverage);
  options.push(option1);
  
  // Option 2: Balanced Experience Team
  const option2 = await generateBalancedExperienceTeam(situation, availableStaff, constraints, date, requiredCoverage);
  options.push(option2);
  
  // Option 3: Senior Leadership Team
  const option3 = await generateSeniorLeadershipTeam(situation, availableStaff, constraints, date, requiredCoverage);
  options.push(option3);
  
  return {
    options,
    analysis: {
      situation,
      requiredCoverage,
      availableStaff: availableStaff.length,
      constraints
    }
  };
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
  // Filter out unavailable doctors
  const availableDoctors = doctors.filter(d => 
    !d.availability || 
    d.availability.status === 'available' || 
    d.availability.status === undefined
  );
  
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
    const doctor = availableDoctors.find(d => d.specialty === specialty);
    if (doctor) return doctor;
  }
  
  // If no specialty match, prefer senior doctors
  const seniorDoctor = availableDoctors.find(d => d.seniority?.includes('Senior') || d.seniority?.includes('Consultant'));
  if (seniorDoctor) return seniorDoctor;
  
  // Return any available doctor
  return availableDoctors[0] || null;
}

function findSuitableNurse(unit: string, nurses: Person[], situation: string): Person | null {
  // Filter out unavailable nurses
  const availableNurses = nurses.filter(n => 
    !n.availability || 
    n.availability.status === 'available' || 
    n.availability.status === undefined
  );
  
  // Try to find a nurse with matching unit
  const matchingNurse = availableNurses.find(n => n.unit === unit);
  if (matchingNurse) return matchingNurse;
  
  // If no unit match, prefer senior nurses
  const seniorNurse = availableNurses.find(n => n.grade?.includes('Senior'));
  if (seniorNurse) return seniorNurse;
  
  // Return any available nurse
  return availableNurses[0] || null;
}

// Generate Team Option 1: Specialty-Focused Team
async function generateSpecialtyFocusedTeam(
  situation: string,
  availableStaff: Person[],
  constraints: any,
  date: string,
  requiredCoverage: any
): Promise<TeamOption> {
  const shifts = await generateShiftsForTeam(situation, availableStaff, constraints, date, 'specialty');
  const composition = calculateTeamComposition(shifts, availableStaff);
  const matchScore = calculateMatchScore(shifts, availableStaff, situation, 'specialty');
  
  const teamProfiles = generateTeamProfiles(shifts, availableStaff, 'specialty');
  
  return {
    optionId: 'specialty-focused',
    title: 'Specialty-Focused Team',
    matchScore,
    explanation: 'Team optimized for specific medical specialties required by the situation',
    strengths: [
      'High expertise in required specialties',
      'Optimal skill-situation matching',
      'Reduced training/supervision needs'
    ],
    weaknesses: [
      'Limited flexibility for unexpected situations',
      'Potential gaps in general care'
    ],
    shifts,
    teamComposition: composition,
    teamProfiles
  };
}

// Generate Team Option 2: Balanced Experience Team
async function generateBalancedExperienceTeam(
  situation: string,
  availableStaff: Person[],
  constraints: any,
  date: string,
  requiredCoverage: any
): Promise<TeamOption> {
  const shifts = await generateShiftsForTeam(situation, availableStaff, constraints, date, 'balanced');
  const composition = calculateTeamComposition(shifts, availableStaff);
  const matchScore = calculateMatchScore(shifts, availableStaff, situation, 'balanced');
  
  const teamProfiles = generateTeamProfiles(shifts, availableStaff, 'balanced');
  
  return {
    optionId: 'balanced-experience',
    title: 'Balanced Experience Team',
    matchScore,
    explanation: 'Team with optimal mix of senior and junior staff for mentorship and efficiency',
    strengths: [
      'Good mentorship opportunities',
      'Balanced skill distribution',
      'Adaptable to various situations'
    ],
    weaknesses: [
      'May require more coordination',
      'Potential slower response in emergencies'
    ],
    shifts,
    teamComposition: composition,
    teamProfiles
  };
}

// Generate Team Option 3: Senior Leadership Team
async function generateSeniorLeadershipTeam(
  situation: string,
  availableStaff: Person[],
  constraints: any,
  date: string,
  requiredCoverage: any
): Promise<TeamOption> {
  const shifts = await generateShiftsForTeam(situation, availableStaff, constraints, date, 'senior');
  const composition = calculateTeamComposition(shifts, availableStaff);
  const matchScore = calculateMatchScore(shifts, availableStaff, situation, 'senior');
  
  const teamProfiles = generateTeamProfiles(shifts, availableStaff, 'senior');
  
  return {
    optionId: 'senior-leadership',
    title: 'Senior Leadership Team',
    matchScore,
    explanation: 'Team led by senior staff with extensive experience and leadership capabilities',
    strengths: [
      'High decision-making capability',
      'Extensive experience',
      'Strong leadership in crises'
    ],
    weaknesses: [
      'Higher cost',
      'May be over-qualified for routine tasks'
    ],
    shifts,
    teamComposition: composition,
    teamProfiles
  };
}

// Generate shifts based on team strategy
async function generateShiftsForTeam(
  situation: string,
  availableStaff: Person[],
  constraints: any,
  date: string,
  strategy: 'specialty' | 'balanced' | 'senior'
): Promise<Shift[]> {
  const shifts: Shift[] = [];
  const doctors = availableStaff.filter(p => p.role === 'Doctor');
  const nurses = availableStaff.filter(p => p.role === 'Nurse');
  
  const units = extractUnits(situation);
  const timeSlots = extractTimeSlots(situation, date);
  
  for (const unit of units) {
    for (const timeSlot of timeSlots) {
      const shiftId = `${unit.toLowerCase()}-${timeSlot.type}`;
      
      // Select staff based on strategy
      const assignments = selectStaffForShiftWithStrategy(
        unit,
        timeSlot,
        doctors,
        nurses,
        situation,
        constraints,
        strategy
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

// Enhanced staff selection with strategy
function selectStaffForShiftWithStrategy(
  unit: string,
  timeSlot: any,
  doctors: Person[],
  nurses: Person[],
  situation: string,
  constraints: any,
  strategy: 'specialty' | 'balanced' | 'senior'
): Assignment[] {
  const assignments: Assignment[] = [];
  
  let selectedDoctor: Person | null = null;
  let selectedNurse: Person | null = null;
  
  switch (strategy) {
    case 'specialty':
      selectedDoctor = findSpecialtyDoctor(unit, doctors, situation);
      selectedNurse = findSpecialtyNurse(unit, nurses, situation);
      break;
    case 'balanced':
      selectedDoctor = findBalancedDoctor(unit, doctors, situation);
      selectedNurse = findBalancedNurse(unit, nurses, situation);
      break;
    case 'senior':
      selectedDoctor = findSeniorDoctor(unit, doctors, situation);
      selectedNurse = findSeniorNurse(unit, nurses, situation);
      break;
  }
  
  if (selectedDoctor) {
    assignments.push({
      personId: selectedDoctor.personId,
      role: selectedDoctor.role,
      tags: {
        senior: selectedDoctor.seniority?.includes('Senior') || selectedDoctor.seniority?.includes('Consultant'),
        specialty: selectedDoctor.specialty,
        experience: selectedDoctor.experience?.yearsOfExperience || 0,
        matchScore: calculatePersonMatchScore(selectedDoctor, unit, situation)
      }
    });
  }
  
  if (selectedNurse) {
    assignments.push({
      personId: selectedNurse.personId,
      role: selectedNurse.role,
      tags: {
        grade: selectedNurse.grade,
        unit: selectedNurse.unit,
        experience: selectedNurse.experience?.yearsOfExperience || 0,
        matchScore: calculatePersonMatchScore(selectedNurse, unit, situation)
      }
    });
  }
  
  return assignments;
}

// Strategy-specific staff selection functions
function findSpecialtyDoctor(unit: string, doctors: Person[], situation: string): Person | null {
  const unitSpecialtyMap: {[key: string]: string[]} = {
    'ICU': ['Critical Care', 'Emergency Medicine'],
    'Cardiology': ['Cardiology'],
    'Emergency': ['Emergency Medicine'],
    'Surgery': ['Surgery']
  };
  
  const preferredSpecialties = unitSpecialtyMap[unit] || [];
  
  for (const specialty of preferredSpecialties) {
    const doctor = doctors.find(d => d.specialty === specialty);
    if (doctor) return doctor;
  }
  
  return doctors[0] || null;
}

function findBalancedDoctor(unit: string, doctors: Person[], situation: string): Person | null {
  const availableDoctors = doctors.filter(d => 
    !d.availability || 
    d.availability.status === 'available' || 
    d.availability.status === undefined
  );
  
  // Try to find a mid-level doctor (not too junior, not too senior)
  const midLevelDoctor = availableDoctors.find(d => 
    d.experience?.yearsOfExperience && 
    d.experience.yearsOfExperience >= 3 && 
    d.experience.yearsOfExperience <= 10
  );
  
  return midLevelDoctor || availableDoctors[0] || null;
}

function findSeniorDoctor(unit: string, doctors: Person[], situation: string): Person | null {
  const seniorDoctors = doctors.filter(d => 
    d.seniority?.includes('Senior') || 
    d.seniority?.includes('Consultant') ||
    (d.experience?.yearsOfExperience && d.experience.yearsOfExperience >= 10)
  );
  
  return seniorDoctors[0] || doctors[0] || null;
}

function findSpecialtyNurse(unit: string, nurses: Person[], situation: string): Person | null {
  const unitNurse = nurses.find(n => n.unit === unit);
  return unitNurse || nurses[0] || null;
}

function findBalancedNurse(unit: string, nurses: Person[], situation: string): Person | null {
  const availableNurses = nurses.filter(n => 
    !n.availability || 
    n.availability.status === 'available' || 
    n.availability.status === undefined
  );
  
  // Try to find a mid-level nurse
  const midLevelNurse = availableNurses.find(n => 
    n.experience?.yearsOfExperience && 
    n.experience.yearsOfExperience >= 2 && 
    n.experience.yearsOfExperience <= 8
  );
  
  return midLevelNurse || availableNurses[0] || null;
}

function findSeniorNurse(unit: string, nurses: Person[], situation: string): Person | null {
  const seniorNurses = nurses.filter(n => 
    n.grade?.includes('Senior') ||
    (n.experience?.yearsOfExperience && n.experience.yearsOfExperience >= 8)
  );
  
  return seniorNurses[0] || nurses[0] || null;
}

// Calculate team composition
function calculateTeamComposition(shifts: Shift[], availableStaff: Person[]): {
  totalStaff: number;
  doctors: number;
  nurses: number;
  specialists: number;
  seniorStaff: number;
} {
  const assignedPersonIds = new Set();
  shifts.forEach(shift => {
    shift.assignments.forEach(assignment => {
      assignedPersonIds.add(assignment.personId);
    });
  });
  
  const assignedStaff = availableStaff.filter(person => assignedPersonIds.has(person.personId));
  
  return {
    totalStaff: assignedStaff.length,
    doctors: assignedStaff.filter(p => p.role === 'Doctor').length,
    nurses: assignedStaff.filter(p => p.role === 'Nurse').length,
    specialists: assignedStaff.filter(p => p.specialty).length,
    seniorStaff: assignedStaff.filter(p => 
      p.seniority?.includes('Senior') || 
      p.seniority?.includes('Consultant') ||
      p.grade?.includes('Senior')
    ).length
  };
}

// Calculate match score for team option
function calculateMatchScore(shifts: Shift[], availableStaff: Person[], situation: string, strategy: string): number {
  let totalScore = 0;
  let assignmentCount = 0;
  
  shifts.forEach(shift => {
    shift.assignments.forEach(assignment => {
      const person = availableStaff.find(p => p.personId === assignment.personId);
      if (person) {
        totalScore += calculatePersonMatchScore(person, shift.ward, situation);
        assignmentCount++;
      }
    });
  });
  
  const baseScore = assignmentCount > 0 ? totalScore / assignmentCount : 0;
  
  // Strategy bonus
  const strategyBonus = {
    'specialty': 0.1,
    'balanced': 0.05,
    'senior': 0.15
  };
  
  return Math.min(100, Math.round(baseScore + (baseScore * strategyBonus[strategy as keyof typeof strategyBonus])));
}

// Calculate individual person match score
function calculatePersonMatchScore(person: Person, unit: string, situation: string): number {
  let score = 50; // Base score
  
  // Specialty match
  if (person.specialty) {
    const unitSpecialtyMap: {[key: string]: string[]} = {
      'ICU': ['Critical Care', 'Emergency Medicine'],
      'Cardiology': ['Cardiology'],
      'Emergency': ['Emergency Medicine'],
      'Surgery': ['Surgery']
    };
    
    const preferredSpecialties = unitSpecialtyMap[unit] || [];
    if (preferredSpecialties.includes(person.specialty)) {
      score += 25;
    }
  }
  
  // Unit match for nurses
  if (person.role === 'Nurse' && person.unit === unit) {
    score += 20;
  }
  
  // Experience boost
  if (person.experience?.yearsOfExperience) {
    score += Math.min(15, person.experience.yearsOfExperience);
  }
  
  // Seniority boost
  if (person.seniority?.includes('Senior') || person.seniority?.includes('Consultant')) {
    score += 10;
  }
  
  // Emergency situation boost
  if (situation.toLowerCase().includes('emergency') || situation.toLowerCase().includes('urgent')) {
    if (person.specialty === 'Emergency Medicine' || person.specialty === 'Critical Care') {
      score += 15;
    }
  }
  
  return Math.min(100, score);
}

// Generate team member profiles with USP
function generateTeamProfiles(shifts: Shift[], availableStaff: Person[], strategy: 'specialty' | 'balanced' | 'senior'): TeamMemberProfile[] {
  const assignedPersonIds = new Set<string>();
  const profiles: TeamMemberProfile[] = [];
  
  // Collect all assigned person IDs
  shifts.forEach(shift => {
    shift.assignments.forEach(assignment => {
      assignedPersonIds.add(assignment.personId);
    });
  });
  
  // Generate profiles for each assigned person
  assignedPersonIds.forEach(personId => {
    const person = availableStaff.find(p => p.personId === personId);
    if (person) {
      const profile: TeamMemberProfile = {
        personId: person.personId,
        name: person.name,
        role: person.role,
        specialty: person.specialty,
        usp: generateUSP(person, strategy),
        experience: person.experience,
        seniority: person.seniority,
        grade: person.grade,
        matchScore: calculateAverageMatchScore(person, shifts)
      };
      profiles.push(profile);
    }
  });
  
  // Sort by match score (highest first)
  return profiles.sort((a, b) => b.matchScore - a.matchScore);
}

// Generate USP based on person's attributes and team strategy
function generateUSP(person: Person, strategy: 'specialty' | 'balanced' | 'senior'): string {
  const uspElements: string[] = [];
  
  // Base USP from existing person data
  if (person.usp) {
    return person.usp;
  }
  
  // Generate USP based on role and specialty
  if (person.role === 'Doctor') {
    if (person.specialty) {
      uspElements.push(`${person.specialty} specialist`);
    }
    if (person.seniority?.includes('Senior') || person.seniority?.includes('Consultant')) {
      uspElements.push('senior leadership');
    }
    if (person.experience?.totalSurgeries && person.experience.totalSurgeries > 100) {
      uspElements.push('extensive surgical experience');
    }
  } else if (person.role === 'Nurse') {
    if (person.unit) {
      uspElements.push(`${person.unit} unit expertise`);
    }
    if (person.grade?.includes('Senior')) {
      uspElements.push('senior nursing leadership');
    }
    if (person.certified) {
      uspElements.push('certified specialist');
    }
  }
  
  // Add experience-based USP
  if (person.experience?.yearsOfExperience) {
    if (person.experience.yearsOfExperience >= 15) {
      uspElements.push('veteran practitioner');
    } else if (person.experience.yearsOfExperience >= 10) {
      uspElements.push('seasoned professional');
    } else if (person.experience.yearsOfExperience >= 5) {
      uspElements.push('experienced practitioner');
    }
  }
  
  // Add skills-based USP
  if (person.skills.length > 0) {
    const keySkills = person.skills.slice(0, 2);
    if (keySkills.length > 0) {
      uspElements.push(`skilled in ${keySkills.join(' and ')}`);
    }
  }
  
  // Strategy-specific USP enhancement
  switch (strategy) {
    case 'specialty':
      if (person.specialty) {
        uspElements.unshift(`Expert ${person.specialty.toLowerCase()} practitioner`);
      }
      break;
    case 'balanced':
      if (person.experience?.yearsOfExperience && person.experience.yearsOfExperience >= 5 && person.experience.yearsOfExperience <= 12) {
        uspElements.unshift('Balanced experience and adaptability');
      }
      break;
    case 'senior':
      if (person.seniority?.includes('Senior') || person.seniority?.includes('Consultant')) {
        uspElements.unshift('Senior leadership and decision-making');
      }
      break;
  }
  
  // Combine USP elements
  if (uspElements.length === 0) {
    return `Dedicated ${person.role.toLowerCase()} with strong clinical skills`;
  }
  
  return uspElements.join(', ');
}

// Calculate average match score for a person across all their assignments
function calculateAverageMatchScore(person: Person, shifts: Shift[]): number {
  let totalScore = 0;
  let assignmentCount = 0;
  
  shifts.forEach(shift => {
    shift.assignments.forEach(assignment => {
      if (assignment.personId === person.personId) {
        const matchScore = assignment.tags?.matchScore || calculatePersonMatchScore(person, shift.ward, '');
        totalScore += matchScore;
        assignmentCount++;
      }
    });
  });
  
  return assignmentCount > 0 ? Math.round(totalScore / assignmentCount) : 0;
}