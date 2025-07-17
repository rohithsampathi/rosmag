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
  
  // Enhanced specialty extraction with procedure-specific mapping
  const procedureSpecialtyMap: {[key: string]: string[]} = {
    'vasectomy': ['Urology'],
    'circumcision': ['Urology'],
    'prostate': ['Urology'],
    'kidney': ['Urology', 'Nephrology'],
    'bladder': ['Urology'],
    'cardiac': ['Cardiology'],
    'heart': ['Cardiology'],
    'angioplasty': ['Cardiology'],
    'catheterization': ['Cardiology'],
    'appendectomy': ['General Surgery'],
    'cholecystectomy': ['General Surgery'],
    'hernia': ['General Surgery'],
    'colonoscopy': ['Gastroenterology'],
    'endoscopy': ['Gastroenterology'],
    'bronchoscopy': ['Pulmonology'],
    'arthroscopy': ['Orthopedics'],
    'fracture': ['Orthopedics'],
    'joint': ['Orthopedics'],
    'cataract': ['Ophthalmology'],
    'retinal': ['Ophthalmology'],
    'tonsillectomy': ['ENT'],
    'rhinoplasty': ['ENT', 'Plastic Surgery'],
    'mammogram': ['Radiology'],
    'mri': ['Radiology'],
    'ct scan': ['Radiology'],
    'ultrasound': ['Radiology'],
    'biopsy': ['Pathology'],
    'chemotherapy': ['Oncology'],
    'radiation': ['Radiation Oncology'],
    'dialysis': ['Nephrology'],
    'delivery': ['Obstetrics'],
    'cesarean': ['Obstetrics'],
    'gynecological': ['Gynecology'],
    'psychiatric': ['Psychiatry'],
    'neurosurgery': ['Neurosurgery'],
    'spine': ['Neurosurgery', 'Orthopedics'],
    'brain': ['Neurosurgery', 'Neurology'],
    'dermatology': ['Dermatology'],
    'plastic': ['Plastic Surgery'],
    'cosmetic': ['Plastic Surgery'],
    'emergency': ['Emergency Medicine'],
    'trauma': ['Emergency Medicine', 'Trauma Surgery'],
    'icu': ['Critical Care'],
    'intensive care': ['Critical Care'],
    'anesthesia': ['Anesthesiology'],
    'pediatric': ['Pediatrics'],
    'geriatric': ['Geriatrics']
  };
  
  // Check for procedure-specific specialties
  const situationLower = situation.toLowerCase();
  for (const [procedure, specialties] of Object.entries(procedureSpecialtyMap)) {
    if (situationLower.includes(procedure)) {
      analysis.specialties.push(...specialties);
    }
  }
  
  // Remove duplicates
  analysis.specialties = [...new Set(analysis.specialties)];
  
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
    'Surgery': ['General Surgery', 'Urology', 'Orthopedics', 'Neurosurgery', 'Plastic Surgery', 'ENT', 'Trauma Surgery'],
    'Urology': ['Urology'],
    'Orthopedics': ['Orthopedics'],
    'Neurosurgery': ['Neurosurgery'],
    'Oncology': ['Oncology'],
    'Gastroenterology': ['Gastroenterology'],
    'Pulmonology': ['Pulmonology'],
    'Nephrology': ['Nephrology'],
    'Obstetrics': ['Obstetrics'],
    'Gynecology': ['Gynecology'],
    'Pediatrics': ['Pediatrics'],
    'Psychiatry': ['Psychiatry'],
    'Dermatology': ['Dermatology'],
    'Ophthalmology': ['Ophthalmology'],
    'ENT': ['ENT'],
    'Radiology': ['Radiology'],
    'Pathology': ['Pathology'],
    'Anesthesiology': ['Anesthesiology']
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
  const technicians = availableStaff.filter(p => p.role === 'Technician');
  const therapists = availableStaff.filter(p => p.role === 'Therapist');
  const pharmacists = availableStaff.filter(p => p.role === 'Pharmacist');
  const itSupport = availableStaff.filter(p => p.role === 'IT Support');
  const admin = availableStaff.filter(p => p.role === 'Admin');
  
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
        technicians,
        therapists,
        pharmacists,
        itSupport,
        admin,
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
  technicians: Person[],
  therapists: Person[],
  pharmacists: Person[],
  itSupport: Person[],
  admin: Person[],
  situation: string,
  constraints: any,
  strategy: 'specialty' | 'balanced' | 'senior'
): Assignment[] {
  const assignments: Assignment[] = [];
  
  let selectedDoctor: Person | null = null;
  let selectedNurse: Person | null = null;
  let selectedTechnician: Person | null = null;
  let selectedTherapist: Person | null = null;
  let selectedPharmacist: Person | null = null;
  let selectedIT: Person | null = null;
  let selectedAdmin: Person | null = null;
  
  switch (strategy) {
    case 'specialty':
      selectedDoctor = findSpecialtyDoctor(unit, doctors, situation);
      selectedNurse = findSpecialtyNurse(unit, nurses, situation);
      selectedTechnician = findSpecialtyTechnician(unit, technicians, situation);
      selectedTherapist = findSpecialtyTherapist(unit, therapists, situation);
      selectedPharmacist = findSpecialtyPharmacist(unit, pharmacists, situation);
      selectedIT = findSpecialtyIT(unit, itSupport, situation);
      selectedAdmin = findSpecialtyAdmin(unit, admin, situation);
      break;
    case 'balanced':
      selectedDoctor = findBalancedDoctor(unit, doctors, situation);
      selectedNurse = findBalancedNurse(unit, nurses, situation);
      selectedTechnician = findBalancedTechnician(unit, technicians, situation);
      selectedTherapist = findBalancedTherapist(unit, therapists, situation);
      selectedPharmacist = findBalancedPharmacist(unit, pharmacists, situation);
      selectedIT = findBalancedIT(unit, itSupport, situation);
      selectedAdmin = findBalancedAdmin(unit, admin, situation);
      break;
    case 'senior':
      selectedDoctor = findSeniorDoctor(unit, doctors, situation);
      selectedNurse = findSeniorNurse(unit, nurses, situation);
      selectedTechnician = findSeniorTechnician(unit, technicians, situation);
      selectedTherapist = findSeniorTherapist(unit, therapists, situation);
      selectedPharmacist = findSeniorPharmacist(unit, pharmacists, situation);
      selectedIT = findSeniorIT(unit, itSupport, situation);
      selectedAdmin = findSeniorAdmin(unit, admin, situation);
      break;
  }
  
  // Add assignments for all selected staff
  const staffToAdd = [
    selectedDoctor,
    selectedNurse,
    selectedTechnician,
    selectedTherapist,
    selectedPharmacist,
    selectedIT,
    selectedAdmin
  ].filter(Boolean) as Person[];
  
  for (const person of staffToAdd) {
    assignments.push({
      personId: person.personId,
      role: person.role,
      tags: {
        senior: person.seniority?.includes('Senior') || person.seniority?.includes('Consultant'),
        specialty: person.specialty,
        grade: person.grade,
        unit: person.unit,
        department: person.department,
        experience: person.experience?.yearsOfExperience || 0,
        matchScore: calculatePersonMatchScore(person, unit, situation)
      }
    });
  }
  
  return assignments;
}

// Strategy-specific staff selection functions
function findSpecialtyDoctor(unit: string, doctors: Person[], situation: string): Person | null {
  const availableDoctors = doctors.filter(d => 
    !d.availability || 
    d.availability.status === 'available' || 
    d.availability.status === undefined
  );
  
  // Extract specialties from situation analysis
  const situationAnalysis = analyzeSituation(situation);
  const requiredSpecialties = situationAnalysis.specialties;
  
  // First, try to match doctors with required specialties from situation
  for (const specialty of requiredSpecialties) {
    const doctor = availableDoctors.find(d => d.specialty === specialty);
    if (doctor) return doctor;
  }
  
  // Fallback to unit-based specialty mapping
  const unitSpecialtyMap: {[key: string]: string[]} = {
    'ICU': ['Critical Care', 'Emergency Medicine'],
    'Cardiology': ['Cardiology'],
    'Emergency': ['Emergency Medicine'],
    'Surgery': ['General Surgery', 'Urology', 'Orthopedics', 'Neurosurgery', 'Plastic Surgery', 'ENT', 'Trauma Surgery'],
    'Urology': ['Urology'],
    'Orthopedics': ['Orthopedics'],
    'Neurosurgery': ['Neurosurgery'],
    'Oncology': ['Oncology'],
    'Gastroenterology': ['Gastroenterology'],
    'Pulmonology': ['Pulmonology'],
    'Nephrology': ['Nephrology'],
    'Obstetrics': ['Obstetrics'],
    'Gynecology': ['Gynecology'],
    'Pediatrics': ['Pediatrics'],
    'Psychiatry': ['Psychiatry'],
    'Dermatology': ['Dermatology'],
    'Ophthalmology': ['Ophthalmology'],
    'ENT': ['ENT'],
    'Radiology': ['Radiology'],
    'Pathology': ['Pathology'],
    'Anesthesiology': ['Anesthesiology']
  };
  
  const preferredSpecialties = unitSpecialtyMap[unit] || [];
  
  for (const specialty of preferredSpecialties) {
    const doctor = availableDoctors.find(d => d.specialty === specialty);
    if (doctor) return doctor;
  }
  
  return availableDoctors[0] || null;
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

// Technician selection functions
function findSpecialtyTechnician(unit: string, technicians: Person[], situation: string): Person | null {
  const unitDepartmentMap: {[key: string]: string[]} = {
    'ICU': ['Respiratory Therapy', 'Laboratory'],
    'Cardiology': ['Cardiac Catheterization', 'Radiology'],
    'Emergency': ['Laboratory', 'Radiology'],
    'Surgery': ['Respiratory Therapy', 'Laboratory'],
    'Radiology': ['Radiology']
  };
  
  const preferredDepartments = unitDepartmentMap[unit] || [];
  
  for (const department of preferredDepartments) {
    const technician = technicians.find(t => t.department === department);
    if (technician) return technician;
  }
  
  return technicians[0] || null;
}

function findBalancedTechnician(unit: string, technicians: Person[], situation: string): Person | null {
  const midLevelTechnician = technicians.find(t => 
    t.experience?.yearsOfExperience && 
    t.experience.yearsOfExperience >= 3 && 
    t.experience.yearsOfExperience <= 10
  );
  
  return midLevelTechnician || technicians[0] || null;
}

function findSeniorTechnician(unit: string, technicians: Person[], situation: string): Person | null {
  const seniorTechnicians = technicians.filter(t => 
    t.grade?.includes('Senior') ||
    (t.experience?.yearsOfExperience && t.experience.yearsOfExperience >= 8)
  );
  
  return seniorTechnicians[0] || technicians[0] || null;
}

// Therapist selection functions
function findSpecialtyTherapist(unit: string, therapists: Person[], situation: string): Person | null {
  const unitDepartmentMap: {[key: string]: string[]} = {
    'Orthopedic': ['Physical Therapy', 'Occupational Therapy'],
    'Neurosurgery': ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy'],
    'Psychiatry': ['Psychiatry'],
    'Rheumatology': ['Physical Therapy']
  };
  
  const preferredDepartments = unitDepartmentMap[unit] || [];
  
  for (const department of preferredDepartments) {
    const therapist = therapists.find(t => t.department === department);
    if (therapist) return therapist;
  }
  
  return therapists[0] || null;
}

function findBalancedTherapist(unit: string, therapists: Person[], situation: string): Person | null {
  const midLevelTherapist = therapists.find(t => 
    t.experience?.yearsOfExperience && 
    t.experience.yearsOfExperience >= 4 && 
    t.experience.yearsOfExperience <= 12
  );
  
  return midLevelTherapist || therapists[0] || null;
}

function findSeniorTherapist(unit: string, therapists: Person[], situation: string): Person | null {
  const seniorTherapists = therapists.filter(t => 
    t.experience?.yearsOfExperience && t.experience.yearsOfExperience >= 10
  );
  
  return seniorTherapists[0] || therapists[0] || null;
}

// Pharmacist selection functions
function findSpecialtyPharmacist(unit: string, pharmacists: Person[], situation: string): Person | null {
  // For day shifts, prefer clinical pharmacists; for night shifts, prefer staff pharmacists
  const clinicalPharmacist = pharmacists.find(p => p.title?.includes('Clinical'));
  const staffPharmacist = pharmacists.find(p => p.title?.includes('Staff'));
  
  return clinicalPharmacist || staffPharmacist || pharmacists[0] || null;
}

function findBalancedPharmacist(unit: string, pharmacists: Person[], situation: string): Person | null {
  return pharmacists[0] || null;
}

function findSeniorPharmacist(unit: string, pharmacists: Person[], situation: string): Person | null {
  const seniorPharmacists = pharmacists.filter(p => 
    p.experience?.yearsOfExperience && p.experience.yearsOfExperience >= 10
  );
  
  return seniorPharmacists[0] || pharmacists[0] || null;
}

// IT Support selection functions
function findSpecialtyIT(unit: string, itSupport: Person[], situation: string): Person | null {
  // For emergencies, prefer systems administrators
  if (situation.toLowerCase().includes('emergency')) {
    const sysAdmin = itSupport.find(it => it.title?.includes('Administrator'));
    if (sysAdmin) return sysAdmin;
  }
  
  return itSupport[0] || null;
}

function findBalancedIT(unit: string, itSupport: Person[], situation: string): Person | null {
  return itSupport[0] || null;
}

function findSeniorIT(unit: string, itSupport: Person[], situation: string): Person | null {
  const seniorIT = itSupport.filter(it => 
    it.experience?.yearsOfExperience && it.experience.yearsOfExperience >= 8
  );
  
  return seniorIT[0] || itSupport[0] || null;
}

// Admin selection functions
function findSpecialtyAdmin(unit: string, admin: Person[], situation: string): Person | null {
  // For quality-related situations, prefer QA coordinators
  if (situation.toLowerCase().includes('quality') || situation.toLowerCase().includes('compliance')) {
    const qaAdmin = admin.find(a => a.department === 'Quality Assurance');
    if (qaAdmin) return qaAdmin;
  }
  
  // For patient-related situations, prefer patient services
  if (situation.toLowerCase().includes('patient')) {
    const patientAdmin = admin.find(a => a.department === 'Patient Services');
    if (patientAdmin) return patientAdmin;
  }
  
  return admin[0] || null;
}

function findBalancedAdmin(unit: string, admin: Person[], situation: string): Person | null {
  return admin[0] || null;
}

function findSeniorAdmin(unit: string, admin: Person[], situation: string): Person | null {
  const seniorAdmin = admin.filter(a => 
    a.experience?.yearsOfExperience && a.experience.yearsOfExperience >= 10
  );
  
  return seniorAdmin[0] || admin[0] || null;
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
    specialists: assignedStaff.filter(p => p.specialty || p.role === 'Technician' || p.role === 'Therapist' || p.role === 'Pharmacist').length,
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
  
  // Specialty match - prioritize situation-specific specialties
  if (person.specialty) {
    const situationAnalysis = analyzeSituation(situation);
    const requiredSpecialties = situationAnalysis.specialties;
    
    // High score for direct specialty match from situation
    if (requiredSpecialties.includes(person.specialty)) {
      score += 35;
    } else {
      // Lower score for unit-based specialty match
      const unitSpecialtyMap: {[key: string]: string[]} = {
        'ICU': ['Critical Care', 'Emergency Medicine'],
        'Cardiology': ['Cardiology'],
        'Emergency': ['Emergency Medicine'],
        'Surgery': ['General Surgery', 'Urology', 'Orthopedics', 'Neurosurgery', 'Plastic Surgery', 'ENT', 'Trauma Surgery'],
        'Urology': ['Urology'],
        'Orthopedics': ['Orthopedics'],
        'Neurosurgery': ['Neurosurgery'],
        'Oncology': ['Oncology'],
        'Gastroenterology': ['Gastroenterology'],
        'Pulmonology': ['Pulmonology'],
        'Nephrology': ['Nephrology'],
        'Obstetrics': ['Obstetrics'],
        'Gynecology': ['Gynecology'],
        'Pediatrics': ['Pediatrics'],
        'Psychiatry': ['Psychiatry'],
        'Dermatology': ['Dermatology'],
        'Ophthalmology': ['Ophthalmology'],
        'ENT': ['ENT'],
        'Radiology': ['Radiology'],
        'Pathology': ['Pathology'],
        'Anesthesiology': ['Anesthesiology']
      };
      
      const preferredSpecialties = unitSpecialtyMap[unit] || [];
      if (preferredSpecialties.includes(person.specialty)) {
        score += 20;
      }
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