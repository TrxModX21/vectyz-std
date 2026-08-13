/**
 * Interface Standar untuk API Response dari Backend.
 * 'T' adalah tipe data dinamis yang akan dikembalikan oleh server.
 */
export interface ApiResponse<T = any> {
  message: string;
  timestamp: string;
  data: T; // Data utama (tipe datanya tergantung entitas yang di-request)
}

/**
 * Interface Tambahan untuk API yang memiliki Paginasi (Pagination)
 * Berguna untuk tabel atau dashboard yang membutuhkan list data besar.
 */
export interface PaginatedData<T> {
  items: T[]; // Array dari data utama (misal: User[], Product[])
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
    counts?: Record<string, number>;
  };
}

// Shortcut untuk response paginasi
export type ApiPaginatedResponse<T> = ApiResponse<PaginatedData<T>>;

/**
 * Interface untuk Error Response standar dari Axios / Backend
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>; // Untuk validasi field yang gagal (misal dari Express-Validator)
}
