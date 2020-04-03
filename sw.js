self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/sw-test/',
        '/sw-test/index.html',
        '/sw-test/style.css',
        '/sw-test/app.js',
        '/sw-test/image-list.js',
        '/sw-test/star-wars-logo.jpg',
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/snowTroopers.jpg") {
      return caches.match('/sw-test/gallery/alaska.jpg');
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/ind.jpg") { // fetch and cache
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return fetch(event.request).then((response) => {
          return caches.open('v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });  
        });
      })
    );
  }  else if (event.request.url === "https://anubhamathur14.github.io/sw-test/star-wars-logo.jpg") {
    event.waitUntil(
      caches.open('v1').then(() => {
        const i = 0
        while (i < 1000) {
          console.log("Wait complete until waitUntil");
          i++;
        }
        return Promise.resolve();
      })
    );
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp;
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/myLittleVader.jpg") {
    // event.waitUntil(
    //   setTimeout((event) => {
    //     console.log("Wait complete until waitUntil");
    //     return Promise.resolve();
    //   }, 500)
    // );
    event.respondWith(caches.match(event.request).then(function(response) {
      return new Response(JSON.stringify("fallback loading"), {
        headers: {'Content-Type': 'application/json'}
      });
    })); 
  } else {
    event.waitUntil(
      caches.match(event.request).then((resp) => {
        console.log("Wait complete until waitUntil");
      })
    );
    event.respondWith(caches.match(event.request).then(function(response) {
      if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/swis.jpg") {
        throw('error happened');
      }
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open('v1').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('/sw-test/gallery/myLittleVader.jpg');
        });
      }
    }));
  }
});
