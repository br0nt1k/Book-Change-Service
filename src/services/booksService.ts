import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  getDoc 
} from "firebase/firestore";
import { db } from "../lib/firebase"; 
import type { IBook } from "../types";

export const addBook = async (
  name: string, 
  author: string, 
  photoUrl: string, 
  ownerId: string
) => {
  const newBook = {
    name,
    author,
    photoUrl,
    ownerId,
    createdAt: Date.now()
  };

  await addDoc(collection(db, "books"), newBook);
};

export const fetchMyBooks = async (userId: string): Promise<IBook[]> => {
  const q = query(
    collection(db, "books"),
    where("ownerId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as IBook));
};

export const fetchAllBooks = async (): Promise<IBook[]> => {
  const booksRef = collection(db, "books");
  const q = query(booksRef); 
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as IBook));
};

export const fetchBookById = async (bookId: string): Promise<IBook | null> => {
  const docRef = doc(db, "books", bookId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as IBook;
  } else {
    return null;
  }
};

export const deleteBook = async (bookId: string) => {
  await deleteDoc(doc(db, "books", bookId));
};