import { create } from 'zustand';
import { IEvent } from '../types/event';
import { fetchEvents, deleteEventById, updateEventById, createEvent } from '../services/eventService';

type EventState = {
  events: IEvent[];
  loading: boolean;
  error: string | null;
  loadEvents: () => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateEvent: (event: IEvent) => Promise<void>;
  createEvent: (event: IEvent) => Promise<void>;
};

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  loadEvents: async () => {
    set({ loading: true });
    try {
      const events = await fetchEvents();
      set({ events, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteEvent: async (id: string) => {
    await deleteEventById(id);
    await get().loadEvents();
  },

  updateEvent: async (event: IEvent) => {
    await updateEventById(event.id, event);
    await get().loadEvents();
  },

  createEvent: async (event: IEvent) => {
    const created = await createEvent(event);
    set((state) => ({ events: [...state.events, created] }));
  },
}));
