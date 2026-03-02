import { Gender, Religion } from '@project-manara-frontend/enums';

export interface UniversityUserResponse {
  id: number;
  name: string;
  nationalId: string;
  email: string;
  birthDate: Date | null;
  gender: Gender;
  religion: Religion;
  phoneNumber: string;
  isDisabled: boolean;
  isDeleted: boolean;
  roles: string[];
}
