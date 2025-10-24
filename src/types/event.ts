export type EventCategory = "reforestation" | "clean-up" | "education" | "conservation";

export interface UserEventDto {
  id: number;
  name?: string;
  email?: string;
}

export interface EventDto {
  id?: number;
  name: string;
  description: string;
  direction: string; 
  date: string; // ISO date string en formato 'YYYY-MM-DD' (LocalDate)
  latitude?: number | null;
  longitude?: number | null;
  idOrganization?: number | null;
  idOrganizer?: number | null;
  participants?: UserEventDto[];
  finished?: boolean;
}
