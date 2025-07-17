// src/lib/seedStaff.ts

import { Person } from './types';

// Generate 15 doctors with diverse specialties
export const doctors: Person[] = [
  {
    personId: "doc-004",
    name: "Dr Sarah Johnson",
    role: "Doctor",
    specialty: "Orthopedic Surgery",
    skills: ["joint-replacement", "trauma-surgery", "arthroscopy"],
    preferences: { 
      maxHoursPerWeek: 50,
      dayShift: true,
      preferredPairing: ["nurse-026", "nurse-027"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 18,
      totalSurgeries: 2500,
      specializations: ["Joint Replacement", "Sports Medicine", "Trauma Surgery"]
    }
  },
  {
    personId: "doc-005",
    name: "Dr Michael Chen",
    role: "Doctor",
    specialty: "Neurosurgery",
    skills: ["cranial-surgery", "spine-surgery", "neuro-monitoring"],
    preferences: { 
      maxHoursPerWeek: 45,
      dayShift: true,
      preferredPairing: ["nurse-028", "nurse-029"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 22,
      totalSurgeries: 1800,
      specializations: ["Cranial Surgery", "Spine Surgery", "Pediatric Neurosurgery"]
    }
  },
  {
    personId: "doc-006",
    name: "Dr Emily Rodriguez",
    role: "Doctor",
    specialty: "Pediatrics",
    skills: ["pediatric-care", "neonatal-care", "vaccination"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      preferredPairing: ["nurse-030", "nurse-031"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 14,
      totalSurgeries: 300,
      specializations: ["Neonatal Care", "Pediatric Emergency", "Child Development"]
    }
  },
  {
    personId: "doc-007",
    name: "Dr James Wilson",
    role: "Doctor",
    specialty: "Anesthesiology",
    skills: ["general-anesthesia", "regional-anesthesia", "pain-management"],
    preferences: { 
      maxHoursPerWeek: 48,
      dayShift: true,
      nightShift: true,
      preferredPairing: ["nurse-032", "nurse-033"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 16,
      totalSurgeries: 3000,
      specializations: ["General Anesthesia", "Pain Management", "Critical Care"]
    }
  },
  {
    personId: "doc-008",
    name: "Dr Lisa Thompson",
    role: "Doctor",
    specialty: "Obstetrics & Gynecology",
    skills: ["delivery", "cesarean", "gynecological-surgery"],
    preferences: { 
      maxHoursPerWeek: 46,
      nightShift: true,
      preferredPairing: ["nurse-034", "nurse-035"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 11,
      totalSurgeries: 1200,
      specializations: ["High-Risk Pregnancy", "Minimally Invasive Surgery", "Fertility"]
    }
  },
  {
    personId: "doc-009",
    name: "Dr David Kim",
    role: "Doctor",
    specialty: "Radiology",
    skills: ["ct-interpretation", "mri-interpretation", "interventional-radiology"],
    preferences: { 
      maxHoursPerWeek: 44,
      dayShift: true,
      preferredPairing: ["nurse-036", "technician-001"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 19,
      totalSurgeries: 500,
      specializations: ["Interventional Radiology", "Neuroradiology", "Cardiac Imaging"]
    }
  },
  {
    personId: "doc-010",
    name: "Dr Anna Patel",
    role: "Doctor",
    specialty: "Psychiatry",
    skills: ["mental-health-assessment", "therapy", "medication-management"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["nurse-037", "therapist-001"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 13,
      totalSurgeries: 0,
      specializations: ["Adult Psychiatry", "Addiction Medicine", "Crisis Intervention"]
    }
  },
  {
    personId: "doc-011",
    name: "Dr Robert Brown",
    role: "Doctor",
    specialty: "Dermatology",
    skills: ["skin-cancer-screening", "cosmetic-procedures", "dermatopathology"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["nurse-038", "nurse-039"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 17,
      totalSurgeries: 800,
      specializations: ["Mohs Surgery", "Cosmetic Dermatology", "Pediatric Dermatology"]
    }
  },
  {
    personId: "doc-012",
    name: "Dr Jennifer Lee",
    role: "Doctor",
    specialty: "Oncology",
    skills: ["chemotherapy", "radiation-therapy", "palliative-care"],
    preferences: { 
      maxHoursPerWeek: 45,
      dayShift: true,
      preferredPairing: ["nurse-040", "nurse-041"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 12,
      totalSurgeries: 200,
      specializations: ["Medical Oncology", "Hematology", "Palliative Care"]
    }
  },
  {
    personId: "doc-013",
    name: "Dr Ahmed Hassan",
    role: "Doctor",
    specialty: "Gastroenterology",
    skills: ["endoscopy", "colonoscopy", "liver-disease"],
    preferences: { 
      maxHoursPerWeek: 47,
      dayShift: true,
      preferredPairing: ["nurse-042", "nurse-043"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 15,
      totalSurgeries: 600,
      specializations: ["Endoscopy", "Hepatology", "Inflammatory Bowel Disease"]
    }
  },
  {
    personId: "doc-014",
    name: "Dr Maria Santos",
    role: "Doctor",
    specialty: "Nephrology",
    skills: ["dialysis", "kidney-transplant", "hypertension-management"],
    preferences: { 
      maxHoursPerWeek: 43,
      dayShift: true,
      preferredPairing: ["nurse-044", "nurse-045"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 10,
      totalSurgeries: 150,
      specializations: ["Dialysis", "Transplant Medicine", "Chronic Kidney Disease"]
    }
  },
  {
    personId: "doc-015",
    name: "Dr Thomas Anderson",
    role: "Doctor",
    specialty: "Urology",
    skills: ["prostate-surgery", "kidney-stones", "minimally-invasive-surgery"],
    preferences: { 
      maxHoursPerWeek: 46,
      dayShift: true,
      preferredPairing: ["nurse-046", "nurse-047"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 16,
      totalSurgeries: 1100,
      specializations: ["Robotic Surgery", "Oncologic Urology", "Pediatric Urology"]
    }
  },
  {
    personId: "doc-016",
    name: "Dr Grace Wang",
    role: "Doctor",
    specialty: "Endocrinology",
    skills: ["diabetes-management", "thyroid-disorders", "hormone-therapy"],
    preferences: { 
      maxHoursPerWeek: 41,
      dayShift: true,
      preferredPairing: ["nurse-048", "nurse-049"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 9,
      totalSurgeries: 50,
      specializations: ["Diabetes", "Thyroid Disease", "Reproductive Endocrinology"]
    }
  },
  {
    personId: "doc-017",
    name: "Dr Kevin O'Brien",
    role: "Doctor",
    specialty: "Ophthalmology",
    skills: ["cataract-surgery", "retinal-surgery", "glaucoma-treatment"],
    preferences: { 
      maxHoursPerWeek: 44,
      dayShift: true,
      preferredPairing: ["nurse-050", "technician-002"]
    },
    seniority: "Senior Consultant",
    experience: {
      yearsOfExperience: 20,
      totalSurgeries: 2200,
      specializations: ["Cataract Surgery", "Retinal Surgery", "Corneal Transplant"]
    }
  },
  {
    personId: "doc-018",
    name: "Dr Rachel Green",
    role: "Doctor",
    specialty: "Rheumatology",
    skills: ["arthritis-treatment", "autoimmune-disorders", "joint-injection"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      preferredPairing: ["nurse-051", "therapist-002"]
    },
    seniority: "Consultant",
    experience: {
      yearsOfExperience: 11,
      totalSurgeries: 100,
      specializations: ["Rheumatoid Arthritis", "Lupus", "Osteoarthritis"]
    }
  }
];

// Generate 30 nurses with diverse specialties
export const nurses: Person[] = [
  {
    personId: "nurse-026",
    name: "Emma Thompson",
    role: "Nurse",
    unit: "Orthopedic",
    skills: ["post-surgical-care", "mobility-assistance", "pain-management"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-004"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Orthopedic Surgery", "Rehabilitation"]
    }
  },
  {
    personId: "nurse-027",
    name: "John Martinez",
    role: "Nurse",
    unit: "Orthopedic",
    skills: ["cast-care", "wound-care", "patient-education"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-004"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 5,
      specializations: ["Orthopedic Care", "Wound Management"]
    }
  },
  {
    personId: "nurse-028",
    name: "Sarah Davis",
    role: "Nurse",
    unit: "Neurosurgery",
    skills: ["neurological-assessment", "icp-monitoring", "critical-care"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      preferredPairing: ["doc-005"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 12,
      specializations: ["Neurosurgery", "Critical Care"]
    }
  },
  {
    personId: "nurse-029",
    name: "Michael Brown",
    role: "Nurse",
    unit: "Neurosurgery",
    skills: ["post-operative-care", "family-support", "medication-administration"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-005"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 6,
      specializations: ["Neurosurgery", "Post-operative Care"]
    }
  },
  {
    personId: "nurse-030",
    name: "Lisa Wilson",
    role: "Nurse",
    unit: "Pediatrics",
    skills: ["pediatric-assessment", "family-centered-care", "immunizations"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-006"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 9,
      specializations: ["Pediatric Nursing", "Child Development"]
    }
  },
  {
    personId: "nurse-031",
    name: "David Johnson",
    role: "Nurse",
    unit: "NICU",
    skills: ["neonatal-care", "ventilator-management", "feeding-support"],
    preferences: { 
      maxHoursPerWeek: 40,
      nightShift: true,
      preferredPairing: ["doc-006"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 11,
      specializations: ["Neonatal Care", "Critical Care"]
    }
  },
  {
    personId: "nurse-032",
    name: "Jennifer Lee",
    role: "Nurse",
    unit: "OR",
    skills: ["perioperative-care", "anesthesia-support", "sterile-technique"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-007"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 10,
      specializations: ["Operating Room", "Anesthesia"]
    }
  },
  {
    personId: "nurse-033",
    name: "Robert Garcia",
    role: "Nurse",
    unit: "PACU",
    skills: ["post-anesthesia-care", "recovery-monitoring", "pain-assessment"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-007"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 7,
      specializations: ["Post-Anesthesia Care", "Recovery"]
    }
  },
  {
    personId: "nurse-034",
    name: "Maria Rodriguez",
    role: "Nurse",
    unit: "Labor & Delivery",
    skills: ["labor-support", "fetal-monitoring", "delivery-assistance"],
    preferences: { 
      maxHoursPerWeek: 42,
      nightShift: true,
      preferredPairing: ["doc-008"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 13,
      specializations: ["Labor & Delivery", "High-Risk Obstetrics"]
    }
  },
  {
    personId: "nurse-035",
    name: "Amanda White",
    role: "Nurse",
    unit: "Gynecology",
    skills: ["women's-health", "pre-operative-care", "patient-education"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-008"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 4,
      specializations: ["Women's Health", "Surgical Nursing"]
    }
  },
  {
    personId: "nurse-036",
    name: "Christopher Miller",
    role: "Nurse",
    unit: "Radiology",
    skills: ["imaging-support", "contrast-administration", "patient-positioning"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-009"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 6,
      specializations: ["Radiology", "Interventional Procedures"]
    }
  },
  {
    personId: "nurse-037",
    name: "Patricia Taylor",
    role: "Nurse",
    unit: "Psychiatry",
    skills: ["mental-health-assessment", "de-escalation", "group-therapy-support"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-010"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 14,
      specializations: ["Psychiatric Nursing", "Crisis Intervention"]
    }
  },
  {
    personId: "nurse-038",
    name: "Daniel Anderson",
    role: "Nurse",
    unit: "Dermatology",
    skills: ["wound-care", "skin-assessment", "procedure-assistance"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-011"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 5,
      specializations: ["Dermatology", "Wound Care"]
    }
  },
  {
    personId: "nurse-039",
    name: "Susan Thomas",
    role: "Nurse",
    unit: "Dermatology",
    skills: ["cosmetic-procedures", "patient-counseling", "laser-therapy-support"],
    preferences: { 
      maxHoursPerWeek: 32,
      dayShift: true,
      preferredPairing: ["doc-011"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Cosmetic Dermatology", "Aesthetic Procedures"]
    }
  },
  {
    personId: "nurse-040",
    name: "Kevin Jackson",
    role: "Nurse",
    unit: "Oncology",
    skills: ["chemotherapy-administration", "symptom-management", "palliative-care"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-012"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 11,
      specializations: ["Oncology", "Palliative Care"]
    }
  },
  {
    personId: "nurse-041",
    name: "Michelle White",
    role: "Nurse",
    unit: "Oncology",
    skills: ["radiation-therapy-support", "patient-education", "family-support"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-012"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 7,
      specializations: ["Oncology", "Radiation Therapy"]
    }
  },
  {
    personId: "nurse-042",
    name: "Brian Harris",
    role: "Nurse",
    unit: "Gastroenterology",
    skills: ["endoscopy-assistance", "pre-procedure-care", "post-procedure-monitoring"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-013"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 9,
      specializations: ["Gastroenterology", "Endoscopy"]
    }
  },
  {
    personId: "nurse-043",
    name: "Laura Martin",
    role: "Nurse",
    unit: "Gastroenterology",
    skills: ["nutrition-counseling", "medication-management", "patient-monitoring"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-013"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 6,
      specializations: ["Gastroenterology", "Nutrition"]
    }
  },
  {
    personId: "nurse-044",
    name: "Mark Thompson",
    role: "Nurse",
    unit: "Nephrology",
    skills: ["dialysis-care", "fluid-management", "vascular-access-care"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      preferredPairing: ["doc-014"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 12,
      specializations: ["Nephrology", "Dialysis"]
    }
  },
  {
    personId: "nurse-045",
    name: "Nancy Garcia",
    role: "Nurse",
    unit: "Nephrology",
    skills: ["transplant-care", "immunosuppression-monitoring", "patient-education"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-014"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 10,
      specializations: ["Transplant", "Nephrology"]
    }
  },
  {
    personId: "nurse-046",
    name: "Paul Wilson",
    role: "Nurse",
    unit: "Urology",
    skills: ["urological-procedures", "catheter-care", "post-operative-care"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-015"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Urology", "Surgical Nursing"]
    }
  },
  {
    personId: "nurse-047",
    name: "Rachel Brown",
    role: "Nurse",
    unit: "Urology",
    skills: ["robotic-surgery-support", "patient-positioning", "equipment-management"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-015"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 5,
      specializations: ["Robotic Surgery", "Urology"]
    }
  },
  {
    personId: "nurse-048",
    name: "Steven Davis",
    role: "Nurse",
    unit: "Endocrinology",
    skills: ["diabetes-education", "insulin-management", "glucose-monitoring"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-016"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 7,
      specializations: ["Diabetes Care", "Endocrinology"]
    }
  },
  {
    personId: "nurse-049",
    name: "Carol Johnson",
    role: "Nurse",
    unit: "Endocrinology",
    skills: ["hormone-therapy-support", "patient-counseling", "medication-administration"],
    preferences: { 
      maxHoursPerWeek: 34,
      dayShift: true,
      preferredPairing: ["doc-016"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 9,
      specializations: ["Endocrinology", "Hormone Therapy"]
    }
  },
  {
    personId: "nurse-050",
    name: "Gary Miller",
    role: "Nurse",
    unit: "Ophthalmology",
    skills: ["eye-care", "post-surgical-monitoring", "vision-testing-support"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-017"]
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 10,
      specializations: ["Ophthalmology", "Eye Surgery"]
    }
  },
  {
    personId: "nurse-051",
    name: "Helen Anderson",
    role: "Nurse",
    unit: "Rheumatology",
    skills: ["joint-care", "medication-monitoring", "patient-education"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-018"]
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 6,
      specializations: ["Rheumatology", "Chronic Disease Management"]
    }
  },
  {
    personId: "nurse-052",
    name: "Thomas Garcia",
    role: "Nurse",
    unit: "General Surgery",
    skills: ["pre-operative-care", "post-operative-monitoring", "wound-management"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      nightShift: true
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 13,
      specializations: ["General Surgery", "Critical Care"]
    }
  },
  {
    personId: "nurse-053",
    name: "Diana Wilson",
    role: "Nurse",
    unit: "Medical Ward",
    skills: ["medication-administration", "patient-assessment", "discharge-planning"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      nightShift: true
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Medical Nursing", "Geriatric Care"]
    }
  },
  {
    personId: "nurse-054",
    name: "Anthony Thomas",
    role: "Nurse",
    unit: "Surgical Ward",
    skills: ["surgical-care", "pain-management", "mobility-assistance"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      nightShift: true
    },
    grade: "RN-Staff",
    experience: {
      yearsOfExperience: 5,
      specializations: ["Surgical Nursing", "Post-operative Care"]
    }
  },
  {
    personId: "nurse-055",
    name: "Betty Martinez",
    role: "Nurse",
    unit: "Intensive Care",
    skills: ["critical-care", "ventilator-management", "hemodynamic-monitoring"],
    preferences: { 
      maxHoursPerWeek: 44,
      dayShift: true,
      nightShift: true
    },
    grade: "RN-Senior",
    experience: {
      yearsOfExperience: 15,
      specializations: ["Critical Care", "Trauma"]
    }
  }
];

// Generate helper staff (technicians, therapists, pharmacists, IT, admin)
export const helperStaff: Person[] = [
  {
    personId: "technician-001",
    name: "Alex Johnson",
    role: "Technician",
    department: "Radiology",
    skills: ["ct-operation", "mri-operation", "equipment-maintenance"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-009", "nurse-036"]
    },
    grade: "Tech-Senior",
    experience: {
      yearsOfExperience: 12,
      specializations: ["CT Imaging", "MRI Technology"]
    }
  },
  {
    personId: "technician-002",
    name: "Maria Chen",
    role: "Technician",
    department: "Ophthalmology",
    skills: ["optical-equipment", "vision-testing", "surgical-assistance"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true,
      preferredPairing: ["doc-017", "nurse-050"]
    },
    grade: "Tech-Staff",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Ophthalmic Technology", "Vision Testing"]
    }
  },
  {
    personId: "technician-003",
    name: "David Rodriguez",
    role: "Technician",
    department: "Laboratory",
    skills: ["blood-analysis", "microbiology", "quality-control"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      nightShift: true
    },
    grade: "Tech-Senior",
    experience: {
      yearsOfExperience: 10,
      specializations: ["Clinical Chemistry", "Hematology"]
    }
  },
  {
    personId: "technician-004",
    name: "Jennifer Wilson",
    role: "Technician",
    department: "Cardiac Catheterization",
    skills: ["cardiac-procedures", "equipment-setup", "patient-monitoring"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-001"]
    },
    grade: "Tech-Senior",
    experience: {
      yearsOfExperience: 9,
      specializations: ["Cardiac Catheterization", "Interventional Cardiology"]
    }
  },
  {
    personId: "technician-005",
    name: "Robert Kim",
    role: "Technician",
    department: "Respiratory Therapy",
    skills: ["ventilator-management", "breathing-treatments", "pulmonary-function"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true,
      nightShift: true
    },
    grade: "Tech-Staff",
    experience: {
      yearsOfExperience: 7,
      specializations: ["Respiratory Care", "Critical Care"]
    }
  },
  {
    personId: "therapist-001",
    name: "Dr. Sarah Williams",
    role: "Therapist",
    department: "Psychiatry",
    skills: ["individual-therapy", "group-therapy", "crisis-intervention"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true,
      preferredPairing: ["doc-010", "nurse-037"]
    },
    title: "Licensed Clinical Social Worker",
    experience: {
      yearsOfExperience: 11,
      specializations: ["Cognitive Behavioral Therapy", "Trauma Therapy"]
    }
  },
  {
    personId: "therapist-002",
    name: "Michael Thompson",
    role: "Therapist",
    department: "Physical Therapy",
    skills: ["rehabilitation", "mobility-training", "pain-management"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      preferredPairing: ["doc-004", "doc-018"]
    },
    title: "Physical Therapist",
    experience: {
      yearsOfExperience: 14,
      specializations: ["Orthopedic Rehabilitation", "Sports Medicine"]
    }
  },
  {
    personId: "therapist-003",
    name: "Lisa Davis",
    role: "Therapist",
    department: "Occupational Therapy",
    skills: ["daily-living-skills", "adaptive-equipment", "cognitive-rehabilitation"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true
    },
    title: "Occupational Therapist",
    experience: {
      yearsOfExperience: 9,
      specializations: ["Neurological Rehabilitation", "Pediatric Therapy"]
    }
  },
  {
    personId: "therapist-004",
    name: "James Brown",
    role: "Therapist",
    department: "Speech Therapy",
    skills: ["speech-therapy", "swallowing-therapy", "communication-aids"],
    preferences: { 
      maxHoursPerWeek: 36,
      dayShift: true
    },
    title: "Speech-Language Pathologist",
    experience: {
      yearsOfExperience: 12,
      specializations: ["Dysphagia", "Neurogenic Communication Disorders"]
    }
  },
  {
    personId: "pharmacist-001",
    name: "Dr. Amanda Garcia",
    role: "Pharmacist",
    department: "Pharmacy",
    skills: ["medication-dispensing", "drug-interactions", "clinical-consultations"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true,
      nightShift: true
    },
    title: "Clinical Pharmacist",
    experience: {
      yearsOfExperience: 13,
      specializations: ["Clinical Pharmacy", "Oncology Pharmacy"]
    }
  },
  {
    personId: "pharmacist-002",
    name: "Dr. Kevin Miller",
    role: "Pharmacist",
    department: "Pharmacy",
    skills: ["sterile-compounding", "chemotherapy-preparation", "quality-assurance"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true
    },
    title: "Staff Pharmacist",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Sterile Compounding", "Chemotherapy"]
    }
  },
  {
    personId: "it-001",
    name: "John Anderson",
    role: "IT Support",
    department: "Information Technology",
    skills: ["network-administration", "ehr-support", "system-maintenance"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true
    },
    title: "IT Systems Administrator",
    experience: {
      yearsOfExperience: 10,
      specializations: ["Healthcare IT", "Network Security"]
    }
  },
  {
    personId: "it-002",
    name: "Susan Rodriguez",
    role: "IT Support",
    department: "Information Technology",
    skills: ["help-desk-support", "software-training", "hardware-troubleshooting"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true
    },
    title: "IT Support Specialist",
    experience: {
      yearsOfExperience: 6,
      specializations: ["Help Desk", "User Training"]
    }
  },
  {
    personId: "admin-001",
    name: "Patricia Wilson",
    role: "Admin",
    department: "Human Resources",
    skills: ["staff-scheduling", "payroll-management", "policy-administration"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true
    },
    title: "HR Administrator",
    experience: {
      yearsOfExperience: 15,
      specializations: ["Human Resources", "Healthcare Administration"]
    }
  },
  {
    personId: "admin-002",
    name: "Charles Lee",
    role: "Admin",
    department: "Medical Records",
    skills: ["medical-coding", "records-management", "compliance-monitoring"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true
    },
    title: "Medical Records Administrator",
    experience: {
      yearsOfExperience: 12,
      specializations: ["Medical Coding", "Health Information Management"]
    }
  },
  {
    personId: "admin-003",
    name: "Mary Johnson",
    role: "Admin",
    department: "Patient Services",
    skills: ["patient-registration", "insurance-verification", "scheduling"],
    preferences: { 
      maxHoursPerWeek: 38,
      dayShift: true
    },
    title: "Patient Services Coordinator",
    experience: {
      yearsOfExperience: 8,
      specializations: ["Patient Registration", "Insurance Processing"]
    }
  },
  {
    personId: "admin-004",
    name: "William Davis",
    role: "Admin",
    department: "Quality Assurance",
    skills: ["quality-monitoring", "compliance-auditing", "process-improvement"],
    preferences: { 
      maxHoursPerWeek: 42,
      dayShift: true
    },
    title: "Quality Assurance Coordinator",
    experience: {
      yearsOfExperience: 11,
      specializations: ["Quality Assurance", "Process Improvement"]
    }
  },
  {
    personId: "admin-005",
    name: "Nancy Garcia",
    role: "Admin",
    department: "Finance",
    skills: ["billing-management", "financial-reporting", "budget-analysis"],
    preferences: { 
      maxHoursPerWeek: 40,
      dayShift: true
    },
    title: "Finance Administrator",
    experience: {
      yearsOfExperience: 13,
      specializations: ["Healthcare Finance", "Revenue Management"]
    }
  }
];

// Combine all staff
export const allNewStaff: Person[] = [
  ...doctors,
  ...nurses,
  ...helperStaff
];