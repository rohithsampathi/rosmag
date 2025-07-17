// src/lib/sampleData.ts

import { Person, Roster } from './types';

export const sampleStaff: Person[] = [
  {
    personId: "doc-001",
    name: "Dr Anil Mehta",
    role: "Doctor",
    specialty: "Cardiology",
    skills: ["cardiology", "echo", "intervention"],
    preferences: { 
      prefersWith: ["nurse-025"], 
      maxHoursPerWeek: 48,
      preferredPairing: ["nurse-025", "nurse-021"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 15,
      totalSurgeries: 1200,
      specializations: ["Interventional Cardiology", "Echocardiography"]
    }
  },
  {
    personId: "doc-002",
    name: "Dr Maria Jacob",
    role: "Doctor",
    specialty: "Emergency Medicine",
    skills: ["trauma", "airway"],
    preferences: { 
      nightShift: true,
      preferredPairing: ["nurse-022"]
    },
    seniority: "Attending",
    experience: {
      yearsOfExperience: 8,
      totalSurgeries: 450,
      specializations: ["Trauma Surgery", "Emergency Medicine"]
    }
  },
  {
    personId: "doc-003",
    name: "Dr Rohan Kapoor",
    role: "Doctor",
    specialty: "Critical Care",
    skills: ["ventilation", "renal replacement"],
    preferences: {
      preferredPairing: ["nurse-021"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 12,
      totalSurgeries: 800,
      specializations: ["Critical Care", "Pulmonology"]
    }
  },
  {
    personId: "nurse-021",
    name: "Alice Mathews",
    role: "Nurse",
    unit: "ICU",
    skills: ["ventilator", "titratable-drips"],
    preferences: { 
      prefersWith: ["doc-003"],
      preferredPairing: ["doc-003", "doc-001"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 10,
      specializations: ["Critical Care", "ICU Management"]
    }
  },
  {
    personId: "nurse-022",
    name: "Nora Ivanova",
    role: "Nurse",
    unit: "Emergency",
    skills: ["trauma-triage", "IV-access"],
    preferences: {
      preferredPairing: ["doc-002"]
    },
    grade: "RN-Junior",
    experience: {
      yearsOfExperience: 3,
      specializations: ["Emergency Nursing", "Trauma Care"]
    }
  },
  {
    personId: "nurse-025",
    name: "Benedict Chan",
    role: "Nurse",
    unit: "Cardiology",
    skills: ["telemetry", "post-PCI-care"],
    preferences: { 
      prefersWith: ["doc-001"],
      preferredPairing: ["doc-001"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 7,
      specializations: ["Cardiology", "Telemetry"]
    }
  }
];

export const sampleRoster: Roster = {
  _id: "hosp-01:2025-07-17",
  hospitalId: "hosp-01",
  date: "2025-07-17",
  version: 1,
  meta: {
    maxHours7d: 48,
    minRest: 8,
    seniorCoverage: true,
    affinityWeights: {
      "doc-003:nurse-021": 0.9,
      "doc-001:nurse-025": 0.85
    }
  },
  shifts: [
    {
      shiftId: "icu-day",
      ward: "ICU",
      startUtc: "2025-07-17T08:00:00Z",
      endUtc: "2025-07-17T20:00:00Z",
      assignments: [
        { personId: "doc-003", role: "Attending", tags: { senior: true } },
        { personId: "nurse-021", role: "RN", tags: { prefersWith: "doc-003" } }
      ]
    },
    {
      shiftId: "icu-night",
      ward: "ICU",
      startUtc: "2025-07-17T20:00:00Z",
      endUtc: "2025-07-18T08:00:00Z",
      assignments: [
        { personId: "doc-002", role: "Attending", tags: { senior: true } },
        { personId: "nurse-022", role: "RN", tags: {} }
      ]
    },
    {
      shiftId: "cardiology-day",
      ward: "Cardiology",
      startUtc: "2025-07-17T08:00:00Z",
      endUtc: "2025-07-17T20:00:00Z",
      assignments: [
        { personId: "doc-001", role: "Consultant", tags: { senior: true } },
        { personId: "nurse-025", role: "RN", tags: { prefersWith: "doc-001" } }
      ]
    }
  ]
};