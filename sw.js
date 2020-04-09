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
        '/sw-test/gallery/snowTroopers.jpg',
        '/sw-test/gallery/img_1.jpg',
        '/sw-test/gallery/img_2.jpg',
        '/sw-test/gallery/text1.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {

  function timeConsumingFunction() {
    return caches.open('v1').then(() => {
      return caches.open('v1').then(() => {
        return caches.open('v1').then(() => {
          return caches.open('v1').then(() => {
            return caches.open('v1').then(() => {
              return caches.open('v1').then(() => {
                return caches.open('v1').then(() => {
                  return caches.open('v1').then(() => {     
                    
                  })
                })
              })
            })
          })
        })
      })
    })
  }

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
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_error_1.jpg") { // fetch and cache
    event.respondWith(() => {
      return {
        id: 1,
        str: "error string"
      }
    })
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_error_2.jpg") { // fetch and cache
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return Response.error()
      })
    );
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/rome.jpg") {
    // fetch and don't cache
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return fetch(event.request).then((response) => {
          return caches.open('v1').then((cache) => {
            // cache.put(event.request, response.clone());
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
            // cache.put(event.request, response.clone());
            return response;
          });  
        });
      })
    )
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/star-wars-logo.jpg") {
    event.waitUntil(
      caches.open('v1').then(() => {
        return timeConsumingFunction().then(() => {
          return timeConsumingFunction().then(() => {
            return timeConsumingFunction().then(() => {
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
        return timeConsumingFunction().then(() => {
          return timeConsumingFunction().then(() => {
            return timeConsumingFunction().then(() => {
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
  } else if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/img_1.jpg") {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        return resp;
      })
    );
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
      if (event.request.url === "https://anubhamathur14.github.io/sw-test/gallery/swis.jpg") {
        throw('error happened');
      }
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
