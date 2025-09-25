// Utility functions for user role management

// Backend role type constants  
export const USER_ROLE = {
  ADMIN: 0,
  TEACHER: 1,
  STUDENT: 2
} as const;

// Type definitions
export type UserRoleNumeric = 0 | 1 | 2;
export type UserRoleString = 'ADMIN' | 'TEACHER' | 'STUDENT';

/**
 * Converts numeric role from backend to string
 * @param numericRole - Numeric role (0=ADMIN, 1=TEACHER, 2=STUDENT)
 * @returns String representation of role
 */
export const mapRoleToString = (numericRole: UserRoleNumeric): UserRoleString => {
  switch (numericRole) {
    case 0:
      return 'ADMIN';
    case 1:
      return 'TEACHER';
    case 2:
      return 'STUDENT';
    default:
      return 'STUDENT'; // Fallback
  }
};

/**
 * Converts string role to numeric for backend
 * @param stringRole - String role
 * @returns Numeric representation for backend
 */
export const mapRoleToNumeric = (stringRole: UserRoleString): UserRoleNumeric => {
  switch (stringRole) {
    case 'ADMIN':
      return 0;
    case 'TEACHER':
      return 1;
    case 'STUDENT':
      return 2;
    default:
      return 2; // Fallback to STUDENT
  }
};

/**
 * Get display name for role
 * @param numericRole - Numeric role
 * @returns Vietnamese display name
 */
export const getRoleDisplayName = (numericRole: UserRoleNumeric): string => {
  switch (numericRole) {
    case 0:
      return 'Quản trị viên';
    case 1:
      return 'Giáo viên';
    case 2:
      return 'Học sinh';
    default:
      return 'Học sinh';
  }
};

/**
 * Get Tailwind CSS classes for role badge color
 * @param numericRole - Numeric role
 * @returns Tailwind CSS classes for background and text color
 */
export const getRoleColor = (numericRole: UserRoleNumeric): string => {
  switch (numericRole) {
    case 0:
      return 'bg-red-100 text-red-800'; // Admin - Red
    case 1:
      return 'bg-blue-100 text-blue-800'; // Teacher - Blue
    case 2:
      return 'bg-green-100 text-green-800'; // Student - Green
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
