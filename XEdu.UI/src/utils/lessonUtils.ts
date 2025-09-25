// Utility functions for lesson management

// Backend lesson type constants
export const LESSON_TYPE = {
  VIDEO: 0,
  DOCUMENT: 1,
  QUIZ: 2,
  ASSIGNMENT: 3
} as const;

// Type definitions
export type LessonTypeNumeric = 0 | 1 | 2 | 3;
export type LessonTypeString = 'VIDEO' | 'DOCUMENT' | 'QUIZ' | 'ASSIGNMENT';

/**
 * Converts numeric lesson type from backend to string
 * @param numericType - Numeric lesson type (0=VIDEO, 1=DOCUMENT, 2=QUIZ, 3=ASSIGNMENT)
 * @returns String representation of lesson type
 */
export const mapLessonTypeToString = (numericType: LessonTypeNumeric): LessonTypeString => {
  switch (numericType) {
    case 0:
      return 'VIDEO';
    case 1:
      return 'DOCUMENT';
    case 2:
      return 'QUIZ';
    case 3:
      return 'ASSIGNMENT';
    default:
      return 'DOCUMENT'; // Fallback
  }
};

/**
 * Converts string lesson type to numeric for backend
 * @param stringType - String lesson type
 * @returns Numeric representation for backend
 */
export const mapLessonTypeToNumeric = (stringType: LessonTypeString): LessonTypeNumeric => {
  switch (stringType) {
    case 'VIDEO':
      return 0;
    case 'DOCUMENT':
      return 1;
    case 'QUIZ':
      return 2;
    case 'ASSIGNMENT':
      return 3;
    default:
      return 1; // Fallback to DOCUMENT
  }
};

/**
 * Get display name for lesson type
 * @param numericType - Numeric lesson type
 * @returns Vietnamese display name
 */
export const getLessonTypeDisplayName = (numericType: LessonTypeNumeric): string => {
  switch (numericType) {
    case 0:
      return 'Video';
    case 1:
      return 'Bài đọc';
    case 2:
      return 'Quiz';
    case 3:
      return 'Bài tập';
    default:
      return 'Bài đọc';
  }
};

/**
 * Get CSS class for lesson type icon color
 * @param numericType - Numeric lesson type
 * @returns Tailwind CSS class for icon color
 */
export const getLessonTypeIconColor = (numericType: LessonTypeNumeric): string => {
  switch (numericType) {
    case 0:
      return 'text-red-500'; // Video - Red
    case 1:
      return 'text-blue-500'; // Document - Blue
    case 2:
      return 'text-green-500'; // Quiz - Green
    case 3:
      return 'text-yellow-500'; // Assignment - Yellow
    default:
      return 'text-gray-500';
  }
};
