export interface IEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  imageUrl: string;
  capacity: number;
  spotsLeft: number;
  categories: string[];
}
