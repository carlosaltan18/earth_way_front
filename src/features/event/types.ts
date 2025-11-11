export type Event = {
  id: number;
  name: string;
  description: string;
  direction: string; 
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


// Tipo para la respuesta paginada de la API (estructura real)
export type PaginatedEventsResponse = {
  payload: Event[];
  totalPages: number;
  message: string;
  currentPage: number;
  events: Event[]; // Duplicado en la respuesta
  totalElements: number;
};
