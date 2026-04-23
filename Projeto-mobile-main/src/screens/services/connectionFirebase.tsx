import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDIjZKB02XkL3xCk0TuhqFhUJ2l2TPkdoc',
  authDomain: 'shoplist-2-b3df4.firebaseapp.com',
  databaseURL: 'https://shoplist-2-b3df4-default-rtdb.firebaseio.com/',
  projectId: 'shoplist-2-b3df4',
  storageBucket: 'shoplist-2-b3df4.firebasestorage.app',
  messagingSenderId: '1013371957270',
  appId: '1:1013371957270:web:ea4f5e4687d7bcaee70537',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const db = getFirestore(app);
