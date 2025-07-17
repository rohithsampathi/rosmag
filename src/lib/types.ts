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