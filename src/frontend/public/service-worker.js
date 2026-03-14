const CACHE_NAME = 'hassane-collections-v1.1';
const RUNTIME_CACHE = 'hassane-runtime-v1.1';
const IMAGE_CACHE = 'hassane-images-v1';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/shop',
  '/cart',
  '/favorites',
  '/login',
  '/offline.html',
  '/assets/generated/hassane-logo-transparent.dim_200x200.png',
  '/assets/generated/hassane-app-icon-transparent.dim_512x512.png',
  '/assets/generated/hassane-app-icon-small-transparent.dim_192x192.png'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((error) => {
          console.error('Failed to cache some resources:', error);
          // Continue even if some resources fail to cache
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine cache strategy
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Images: Cache first
  if (request.destination === 'image' || url.pathname.includes('/assets/')) {
    return 'cache-first';
  }
  
  // API calls: Network first
  if (url.pathname.includes('/api/') || url.search.includes('canisterId')) {
    return 'network-first';
  }
  
  // HTML pages: Network first with cache fallback
  if (request.mode === 'navigate') {
    return 'network-first';
  }
  
  // Default: Network first
  return 'network-first';
}

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const strategy = getCacheStrategy(event.request);
  const cacheName = event.request.destination === 'image' ? IMAGE_CACHE : RUNTIME_CACHE;

  if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(event.request, cacheName));
  } else {
    event.respondWith(networkFirst(event.request, cacheName));
  }
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await cache.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
      // Fallback to root if offline page not available
      const rootPage = await cache.match('/');
      if (rootPage) {
        return rootPage;
      }
    }
    
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Background sync for cart updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

async function syncCart() {
  try {
    // Get cart data from IndexedDB or localStorage
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_CART',
        message: 'Syncing cart data...'
      });
    });
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New update from HASSANé Collections',
    icon: '/assets/generated/hassane-app-icon-small-transparent.dim_192x192.png',
    badge: '/assets/generated/hassane-app-icon-small-transparent.dim_192x192.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'HASSANé Collections', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Message handler for communication with the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});
