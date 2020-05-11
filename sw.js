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
      ]);
    })
  );
  event.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        '/sw-test/gallery/bountyHunters.jpg',
        '/sw-test/gallery/snowTroopers.jpg',
        '/sw-test/gallery/img_1.jpg',
        '/sw-test/gallery/img_2.jpg',
        '/sw-test/gallery/text1.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/ind.jpg") {
    event.waitUntil(
      caches.match(event.request).then((resp) => {
        console.log("Wait complete until waitUntil");
      })
    );
    event.respondWith( // fetch and cache
      caches.match(event.request).then((resp) => {
        return fetch(event.request).then((response) => {
          return caches.open('v1').then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });  
        }).catch(function () {
          return caches.match('/sw-test/gallery/myLittleVader.jpg');
        });
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/snowTroopers.jpg") {
      return caches.match('/sw-test/gallery/alaska.jpg');
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_error_3.jpg") {
    event.respondWith(Promise.resolve({
        id: 1,
        str: "error string"
      })
    )
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_error_4.jpg") {
    event.respondWith(
      Promise.resolve(Response.error())
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_error_6.jpg") {
    // event.respondWith(
    //   throw('error - thrown from inside respondWith');
    // ); ---> this causes service worker registration to fail
    event.respondWith(new Promise((resolve) => {
      throw "error";
    }));    
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_error_5.jpg") {
    event.respondWith(fetch(url).then(() => {
      throw "error";
    }));      
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/rome.jpg") {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return fetch(event.request).then((response) => {
          return caches.open('v1').then((cache) => {
            return response;
          });  
        });
      })
    )
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/text1.js") {
    event.waitUntil(
      caches.match(event.request).then((resp) => {
        setTimeout(() => {
          return Promise.resolve()
        }, 35)
      })
    )
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp || fetch(event.request).then((response) => {
          return caches.open('v1').then((cache) => {
            return response;
          });  
        });
      })
    )
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/star-wars-logo.jpg") {
    event.waitUntil(
      caches.open('v1').then(() => {
        return caches.open('v1').then(() => {
          return caches.open('v1').then(() => {
            return caches.open('v1').then(() => {
              console.log("time consuming function ran")
              let i = 0
              while (i < 100000) {
                i++;
              }
              return Promise.resolve();
            })
          })
        })
      })
    );
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp;
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_2.jpg") {
    event.waitUntil(
      caches.match(event.request).then((resp) => {
        return caches.open('v2').then((cache) => {
          return caches.open('v1').then((cache) => {
            return caches.open('v2').then((cache) => {
              return caches.open('v1').then((cache) => {
                return Promise.resolve();
              })
            })
          })
        })
      })
    );
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp;
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_1.jpg") {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp;
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/alaska_2.jpg") {
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/alaska_3.jpg") {
    event.waitUntil(
      caches.match(event.request).then((resp) => {
        console.log("Wait complete until waitUntil");
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/swis.jpg") {
    throw('error happened');
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/myLittleVader.jpg") {
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
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
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
