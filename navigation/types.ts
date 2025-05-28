import { IEvent } from '../types/event';

export type RootStackParamList = {
  EventList: undefined;
  EditEvent: { event: IEvent };
  CreateEvent: undefined;
  Stats: undefined;
  EventDetail: { event: IEvent };
  AllReviews: { eventId: string };
};
