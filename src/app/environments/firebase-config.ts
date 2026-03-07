import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
    apiKey: "AIzaSyAEvu_bI220Mqu7WD5kCda6ep-knFIycKY",
    authDomain: "amor-95fdb-9219f.firebaseapp.com",
    projectId: "amor-95fdb-9219f",
    storageBucket: "amor-95fdb-9219f.firebasestorage.app",
    messagingSenderId: "596484963391",
    appId: "1:596484963391:web:4fe8938e5f698aeafccc8a",
    measurementId: "G-C5X2S0EL8N",
    vapidKey: "BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);