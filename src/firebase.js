import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDgjyJrk76l06ohClKZEZlB70oy0xCkFYE",
    authDomain: "ecommerce-app-246d2.firebaseapp.com",
    databaseURL: "https://ecommerce-app-246d2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ecommerce-app-246d2",
    storageBucket: "ecommerce-app-246d2.appspot.com",
    messagingSenderId: "521587305347",
    appId: "1:521587305347:web:4a3a92df2ccb80bf4de4b6",
    measurementId: "G-4M1GFTMSMN"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);