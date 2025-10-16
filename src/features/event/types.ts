export type Event = {
  id: number;
  name: string;
  description: string;
  direction: string; // Cambio: era "date", ahora es "direction"
  date?: string;
  latitude?: number;
  longitude?: number;
  idOrganization?: number;
  idOrganizer?: number;
  finished?: boolean;
};

export type GetEventsParams = {
  page?: number;
  size?: number;
  email?: string;
};

export type Participant = {
  id: number;
  userId: number;
  eventId: number;
};