import { storage } from './firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

export const uploadImageToFirebase = async (uri: string, id: string): Promise<string> => {
  const response = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const blob = await fetch(uri).then((res) => res.blob());

  const fileRef = ref(storage, `events/${id}_${Date.now()}.jpg`);
  await uploadBytes(fileRef, blob);

  return await getDownloadURL(fileRef);
};
