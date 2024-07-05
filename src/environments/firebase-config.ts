import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYAUsOFhucyXzCE2orEnT-_FATBTvw9cA",
  authDomain: "natyalejo-d82e2.firebaseapp.com",
  projectId: "natyalejo-d82e2",
  storageBucket: "natyalejo-d82e2.appspot.com",
  messagingSenderId: "89155861645",
  appId: "1:89155861645:web:91f5ed51029e035f5a76c4",
  measurementId: "G-HSV6LQVDH8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);