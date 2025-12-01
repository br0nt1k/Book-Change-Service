import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { IUser, IBook } from '../types';

export const getAllUsers = async (): Promise<IUser[]> => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  } as IUser));
};

                                            
export const getUserBooks = async (uid: string): Promise<IBook[]> => {
  const q = query(collection(db, "books"), where("ownerId", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IBook));
};


export const removeBook = async (bookId: string) => {
  await deleteDoc(doc(db, "books", bookId));
};

export const removeUserWithBooks = async (uid: string): Promise<number> => {
  
  const q = query(collection(db, "books"), where("ownerId", "==", uid));
  const snapshot = await getDocs(q);

  const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);

  await deleteDoc(doc(db, "users", uid));

  return snapshot.size; 
};