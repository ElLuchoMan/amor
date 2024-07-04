self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/script.js',
        '/assets/hello.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: 'Default title', body: 'Default message' };
  const options = {
    body: data.body,
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});


