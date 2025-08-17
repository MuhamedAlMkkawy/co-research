// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCp5iXiyKRBndQwRjz_HYgHlxsUttAXh78",
  authDomain: "co-research-7ace4.firebaseapp.com",
  projectId: "co-research-7ace4",
  storageBucket: "co-research-7ace4.firebasestorage.app",
  messagingSenderId: "791640618127",
  appId: "1:791640618127:web:87afae694a502ae3ad2cfa",
  measurementId: "G-F295D7CZ88"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png'
  };
  
  if (document.cookie.includes('token')) {
    self.registration.showNotification(notificationTitle, notificationOptions);
  }
});


self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    // clients.openWindow('https://store.thunder-way.com/orders') 
  );
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((err) => {
          console.error('Service Worker registration failed:', err);
      });
}


