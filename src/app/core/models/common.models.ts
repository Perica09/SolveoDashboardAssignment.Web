/**
 * Common models used across the application
 */

export interface DateRangeParams {
  startDate?: string; // ISO 8601 format
  endDate?: string;   // ISO 8601 format
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  error?: any;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | undefined;
}
