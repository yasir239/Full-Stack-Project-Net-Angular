export interface Student {
  studentId: number;
  studentName: string;
  mobileNo: string;
  email: string;
  city: string | null;
  state: string | null;
  pinCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
}

export interface CreateStudent {
  studentName: string;
  mobileNo: string;
  email: string;
  city?: string;
  state?: string;
  pinCode?: string;
  addressLine1?: string;
  addressLine2?: string;
}

export interface UpdateStudent extends CreateStudent {}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface StudentQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
