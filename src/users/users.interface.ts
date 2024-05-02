import { Role, User } from '@prisma/client';

export interface UserWithRole extends User {
  role: Role;
}
