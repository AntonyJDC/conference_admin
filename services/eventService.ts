import axios from 'axios';
import { IEvent } from '../types/event';
import { API_URL } from '@env';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebaseConfig';

const API = `${API_URL}/events`;

export const fetchEvents = async (): Promise<IEvent[]> => {
  const response = await axios.get(API);
  return response.data;
};

export const deleteEventById = async (id: string): Promise<void> => {
  await axios.delete(`${API}/${id}`);
};

export const updateEventById = async (id: string, updated: IEvent): Promise<IEvent> => {
  const res = await axios.put(`${API}/${id}`, updated);
  return res.data;
};

export const createEvent = async (event: IEvent): Promise<IEvent> => {
  if (event.imageUrl && event.imageUrl.startsWith('file://')) {
    const response = await fetch(event.imageUrl);
    const blob = await response.blob();
    const filename = `${event.id}-${Date.now()}`;
    const imageRef = ref(storage, `events/${filename}`);
    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    event.imageUrl = downloadURL;
  }

  const res = await axios.post(`${API}/`, event);
  return res.data;
};