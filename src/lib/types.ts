// src/lib/types.ts


export interface Person {
    personId: string;
    name: string;
    role: "Doctor" | "Nurse" | "Technician" | "Admin" | "Pharmacist" | "Therapist" | "IT Support";
    specialty?: string;
    unit?: string;
    department?: string;
    discipline?: string;
    title?: string;
    skills: string[];
    usp?: string;
    preferences: {
      prefersWith?: string[];
      maxHoursPerWeek?: number;
      nightShift?: boolean;
      dayShift?: boolean;
      preferredPairing?: string[];
    };
    seniority?: string;
    grade?: string;
    certified?: boolean;
    experience?: {
      yearsOfExperience?: number;
      totalSurgeries?: number;
      specializations?: string[];
    };
    availability?: {
      status: "available" | "unavailable" | "assigned";
      reason?: string;
      lastAssigned?: string; // roster ID
      lastAssignedDate?: string;
    };
    attendance?: {
      status: "present" | "absent";
      lastUpdated?: string;
      updatedBy?: string;
    };
  }
  
  export interface Assignment {
    personId: string;
    role: string;
    tags: Record<string, any>;
  }
  
  export interface Shift {
    shiftId: string;
    ward: string;
    startUtc: string;
    endUtc: string;
    assignments: Assignment[];
  }
  
  export interface RosterMeta {
    maxHours7d: number;
    minRest: number;
    seniorCoverage: boolean;
    affinityWeights: Record<string, number>;
  }
  
  export interface Roster {
    _id: string;
    hospitalId: string;
    date: string;
    version: number;
    meta: RosterMeta;
    shifts: Shift[];
  }
  
  export interface RosterEvent {
    _id?: string;
    rosterId: string;
    timestamp: Date;
    authorId: string;
    diff: any;
    version: number;
  }
  
  export interface AIAnalysis {
    status: "OK" | "VIOLATION" | "SUGGESTION";
    explanation: string;
    actions: Array<{
      type: string;
      swap?: [string, string];
      assign?: { personId: string; shiftId: string };
      warning?: string;
    }>;
    score?: number;
  }

  export interface TeamMemberProfile {
    personId: string;
    name: string;
    role: string;
    specialty?: string;
    usp: string;
    experience?: {
      yearsOfExperience?: number;
      totalSurgeries?: number;
      specializations?: string[];
    };
    seniority?: string;
    grade?: string;
    matchScore: number;
  }

  export interface TeamOption {
    optionId: string;
    title: string;
    matchScore: number;
    explanation: string;
    strengths: string[];
    weaknesses: string[];
    shifts: Shift[];
    teamComposition: {
      totalStaff: number;
      doctors: number;
      nurses: number;
      specialists: number;
      seniorStaff: number;
    };
    teamProfiles: TeamMemberProfile[];
  }

  export interface RosterGenerationResult {
    options: TeamOption[];
    analysis: {
      situation: string;
      requiredCoverage: any;
      availableStaff: number;
      constraints: any;
    };
  }