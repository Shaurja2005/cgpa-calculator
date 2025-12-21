export interface Subject {
  id: string;
  name: string;
  credits: number;
  grade: string;
  gradePoint: number;
}

export interface Semester {
  id: string;
  name: string;
  subjects: Subject[];
  sgpa: number;
  totalCredits: number;
}

export interface GradeMapping {
  min: number;
  max: number;
  gp: number;
  label: string;
}

export const defaultGradeMapping: GradeMapping[] = [
  { min: 85, max: 100, gp: 10, label: 'S' },
  { min: 75, max: 84, gp: 9, label: 'A' },
  { min: 65, max: 74, gp: 8, label: 'B' },
  { min: 55, max: 64, gp: 7, label: 'C' },
  { min: 50, max: 54, gp: 6, label: 'D' },
  { min: 45, max: 49, gp: 5, label: 'E' },
  { min: 0, max: 44, gp: 0, label: 'F' },
];

export const gradeLabels = ['S', 'A', 'B', 'C', 'D', 'E', 'F'] as const;
export type GradeLabel = typeof gradeLabels[number];

export const labelToGradePoint: Record<GradeLabel, number> = {
  S: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
};
