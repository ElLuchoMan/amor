import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
    apiKey: "AIzaSyCYAUsOFhucyXzCE2orEnT-_FATBTvw9cA",
    authDomain: "natyalejo-d82e2.firebaseapp.com",
    projectId: "natyalejo-d82e2",
    storageBucket: "natyalejo-d82e2.appspot.com",
    messagingSenderId: "89155861645",
    appId: "1:89155861645:web:91f5ed51029e035f5a76c4",
    measurementId: "G-HSV6LQVDH8",
    vapidKey: "BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs"
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);