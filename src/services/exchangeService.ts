import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { IBook } from '../types';

interface ExchangeData {
  ownerEmail: string;
  myBooksList: string; 
  bookName: string;
}

export const prepareExchangeData = async (
  book: IBook, 
  currentUserId: string
): Promise<ExchangeData> => {
  
  const ownerRef = doc(db, "users", book.ownerId);
  const ownerSnap = await getDoc(ownerRef);
  
  if (!ownerSnap.exists()) {
    throw new Error("Власника цієї книги не знайдено в базі.");
  }
  
  const ownerEmail = ownerSnap.data().email;

  const myBooksQuery = query(collection(db, "books"), where("ownerId", "==", currentUserId));
  const myBooksSnap = await getDocs(myBooksQuery);
  
  const myBooksList = myBooksSnap.docs
    .map(doc => `• ${doc.data().name}`)
    .join('\n');

  if (myBooksList.length === 0) {
    throw new Error("У вас немає книг для обміну.");
  }

  return {
    ownerEmail,
    myBooksList,
    bookName: book.name
  };
};