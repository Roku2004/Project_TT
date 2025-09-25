import { apiService } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { Course, CourseDetail, Lesson, PageResponse, ApiResponse } from '../types';

class CourseService {
  async getCourses(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  } = {}): Promise<PageResponse<Course>> {
    return await apiService.get<PageResponse<Course>>(API_ENDPOINTS.COURSES, params);
  }

  async getFreeCourses(params: {
    page?: number;
    size?: number;
  } = {}): Promise<PageResponse<Course>> {
    return await apiService.get<PageResponse<Course>>(API_ENDPOINTS.COURSES_FREE, params);
  }

  async getFeaturedCourses(): Promise<Course[]> {
    return await apiService.get<Course[]>(API_ENDPOINTS.PUBLIC_COURSES_FEATURED);
  }

  async getPopularCourses(): Promise<Course[]> {
    return await apiService.get<Course[]>(API_ENDPOINTS.PUBLIC_COURSES_POPULAR);
  }

  async searchCourses(keyword: string, params: {
    page?: number;
    size?: number;
  } = {}): Promise<PageResponse<Course>> {
    return await apiService.get<PageResponse<Course>>(API_ENDPOINTS.COURSES_SEARCH, {
      keyword,
      ...params
    });
  }

  async getCourseDetails(id: number): Promise<CourseDetail> {
    return await apiService.get<CourseDetail>(API_ENDPOINTS.COURSE_DETAILS(id));
  }

  async getCourseLessons(id: number): Promise<Lesson[]> {
    return await apiService.get<Lesson[]>(API_ENDPOINTS.COURSE_LESSONS(id));
  }

  async enrollInCourse(id: number): Promise<ApiResponse> {
    return await apiService.post<ApiResponse>(API_ENDPOINTS.COURSE_ENROLL(id));
  }

  async purchaseCourse(id: number, amount: number): Promise<ApiResponse> {
    return await apiService.post<ApiResponse>(API_ENDPOINTS.COURSE_PURCHASE(id), { amount });
  }

  async getMyCourses(params: {
    page?: number;
    size?: number;
  } = {}): Promise<PageResponse<Course>> {
    return await apiService.get<PageResponse<Course>>(API_ENDPOINTS.MY_COURSES, params);
  }
}

export const courseService = new CourseService();
export default courseService;