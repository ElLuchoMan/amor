importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "AIzaSyCYAUsOFhucyXzCE2orEnT-_FATBTvw9cA",
  authDomain: "natyalejo-d82e2.firebaseapp.com",
  projectId: "natyalejo-d82e2",
  storageBucket: "natyalejo-d82e2.appspot.com",
  messagingSenderId: "89155861645",
  appId: "1:89155861645:web:91f5ed51029e035f5a76c4",
  measurementId: "G-HSV6LQVDH8", 
  vapidKey: "BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
