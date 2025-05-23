import { IEvent } from '../types/event';

export type RootStackParamList = {
  Main: undefined;
  EditEvent: { event: IEvent };
};
