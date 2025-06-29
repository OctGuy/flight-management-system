// Account related
export type { Account } from './Account';

// Flight related
export type { Flight, FlightSearchCriteria, FlightRequest } from './Flight';
export type { FlightDetail } from './FlightDetail';
export type {
  FlightTicketClass,
  FlightTicketClassRequest,
  UpdateFlightTicketClassRequest,
  SeatAvailability,
  BookSeatRequest,
  SeatMap
} from './FlightTicketClass';

// Airport related
export type { Airport } from './Airport';

// Auth related
export type { AuthResponse, LoginRequest, UserDetails, RegisterRequest } from './Auth';

// Ticket related
export type { TicketClass, TicketClassRequest } from './TicketClass';
export type { Ticket, TicketRequest } from './Ticket';

// Payment related
export type {
  PaymentResponse,
  PaymentReturnResponse,
  TransactionQueryResponse,
  RefundResponse
} from './Payment';

// User related
export type { Customer } from './Customer';
export type {
  Employee,
  UpdateEmployeeRequest,
} from './Employee';

// Chat related
export type { CreateTestChatboxRequest, Chatbox, Message, SendMessageRequest } from './Chat';

// Plane related
export type { Plane } from './Plane';

// Passenger related
export type { Passenger, CreatePassengerRequest, UpdatePassengerRequest } from './Passenger';

// System related
export type { Parameter, ParameterUpdateRequest } from './Parameter';

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface SearchFilters {
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Demo and utility types
export interface DemoInfo {
  application: string;
  description: string;
  version: string;
  features: string[];
  demo_accounts: Record<string, string>;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  message: string;
  version: string;
}

export * from './Ticket';
