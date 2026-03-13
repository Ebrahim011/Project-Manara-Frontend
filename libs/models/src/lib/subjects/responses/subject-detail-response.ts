export interface SubjectDetailResponse {
  id: number;
  name: string;
  code: string;
  description: string;
  creditHours: number;
  isDeleted: boolean;
  prerequisites: Prerequisite[];
}
interface Prerequisite {
  id: number;
  name: string;
}
