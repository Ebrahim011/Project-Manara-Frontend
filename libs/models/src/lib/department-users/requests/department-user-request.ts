import { Gender, Religion } from '@project-manara-frontend/enums';

export interface DepartmentUserRequest {
  name: string;
  nationalId: string;
  email: string;
  password: string;
  birthDate: Date | null;
  gender: Gender;
  religion: Religion;
  phoneNumber: string;
  isDisabled: boolean;
  roles: string[];
}
