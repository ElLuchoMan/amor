importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "AIzaSyAEvu_bI220Mqu7WD5kCda6ep-knFIycKY",
  authDomain: "amor-95fdb-9219f.firebaseapp.com",
  projectId: "amor-95fdb-9219f",
  storageBucket: "amor-95fdb-9219f.firebasestorage.app",
  messagingSenderId: "596484963391",
  appId: "1:596484963391:web:4fe8938e5f698aeafccc8a",
  measurementId: "G-C5X2S0EL8N",
  vapidKey: "BI-L9JSRv9h8lb39CQYbnW5IBEx7MMGhn6x_Wbe1GF_XwXQ56fcGpRao0j8Ex-PkzwYMwr1JYJIP2qHPyZHeNjs"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
