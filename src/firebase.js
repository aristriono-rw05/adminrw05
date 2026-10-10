import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGk-YGuaQOy-xn6MTiXYb_534koQpW4lU",
  authDomain: "rw05-tambakreja.firebaseapp.com",
  projectId: "rw05-tambakreja",
  storageBucket: "rw05-tambakreja.firebasestorage.app",
  messagingSenderId: "1051355734701",
  appId: "1:1051355734701:web:75db32581f5ecb672d9c24"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Inisialisasi Akun Admin Default
export async function initializeDefaultAdmins() {
  const defaultAccounts = {
    'superadmin': { password: 'password123', role: 'superadmin' },
    'bendahara': { password: 'password123', role: 'bendahara' },
    'aset': { password: 'password123', role: 'aset' }
  };

  for (let username in defaultAccounts) {
    const docRef = doc(db, "admin_users", username);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, defaultAccounts[username]);
    }
  }
}