export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
  
  export interface PageRequest {
    page: number
    size: number
  }
  
  