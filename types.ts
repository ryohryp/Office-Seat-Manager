export enum SeatStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied', // In Use (Checked In)
  RESERVED = 'reserved', // Reserved but not yet in use
  SELECTED = 'selected',
  UNAVAILABLE = 'unavailable', // e.g. blocked out
}

export interface User {
  id: string;
  name: string;
  department: string;
  avatar?: string;
}

export interface Reservation {
  id: string;
  seatId: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  user: User;
}

export interface Seat {
  id: string;
  label: string;
  groupId: string; // e.g., 'PJ503', 'PJ413'
  status: SeatStatus;
  type: 'free' | 'fixed'; // New: Distinguish between free address and fixed seating
  colorTheme?: 'lime' | 'purple' | 'pink' | 'blue' | 'orange' | 'gray'; // New: customizable color
  bookedBy?: User;
  reservationDate?: string;
  reservationStart?: string;
  reservationEnd?: string;
  // Grid coordinates for precise placement within the map container
  gridRowStart: number;
  gridRowEnd: number;
  gridColStart: number;
  gridColEnd: number;
}

export interface Zone {
  id: string;
  label: string;
  type: 'room' | 'utility' | 'corridor' | 'decoration';
  colorClass: string; // Tailwind bg class
  gridRowStart: number;
  gridRowEnd: number;
  gridColStart: number;
  gridColEnd: number;
  borderClass?: string;
}

export interface OfficeData {
  seats: Seat[];
  zones: Zone[];
}