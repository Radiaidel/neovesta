export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
    first: boolean
    last: boolean
    empty: boolean
  }
  
  export interface PageRequest {
    page: number
    size: number
  }
  
  
  export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
    success: boolean;
  }
  
  export interface ApiErrorResponse {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
  }
  
  export interface PaginationParams {
    page: number;
    size: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }
  
  export interface FileUploadResponse {
    url: string;
    publicId: string;
  }
  