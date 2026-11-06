import type {
  IWeddingLocation,
  IWeddingLivestream,
  IWeddingWebsite,
} from '@/modules/wedding/wedding.model';

export interface CreateWeddingDTO {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  website: {
    slug: string;
  };
}

export interface WeddingDetailDTO {
  id: string;
  brideName: string;
  groomName: string;
  title: string | null;
  description: string | null;
  weddingDate: string;
  timeZone: string;
  location: IWeddingLocation;
  website: IWeddingWebsite;
  gallery: {
    isEnabled: boolean;
    guestUploadsEnabled: boolean;
  };
  livestream: IWeddingLivestream;
}

export interface DashboardEventItemDTO {
  id: string;
  title: string;
  startAt: string;
  endAt?: string | null;
  venueName?: string | null;
  city?: string | null;
  dressCode?: string | null;
}

export interface DashboardTaskItemDTO {
  id: string;
  title: string;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
}

export interface WeddingDashboardDTO {
  wedding: {
    id: string;
    brideName: string;
    groomName: string;
    title: string | null;
    weddingDate: string;
    timeZone: string;
    city: string | null;
    slug: string;
  };
  countdown: {
    weddingDate: string;
    daysRemaining: number;
  };
  summary: {
    events: number;
    tasks: {
      total: number;
      completed: number;
    };
    guests: number;
    rsvps: {
      pending: number;
      attending: number;
      notAttending: number;
    };
    totalExpensePaise: number;
    vendors: number;
  };
  upcomingEvents: DashboardEventItemDTO[];
  upcomingTasks: DashboardTaskItemDTO[];
}

