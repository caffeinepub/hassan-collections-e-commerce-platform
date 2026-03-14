// PWA installation and service worker utilities

export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("✅ Service Worker registered successfully");

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available, prompt user to refresh
                  if (confirm("New version available! Reload to update?")) {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });

      // Handle controller change
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    });
  } else {
    console.warn("⚠️ Service Workers are not supported in this browser");
  }
}

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function setupPWAInstallPrompt(
  onPromptAvailable: (prompt: BeforeInstallPromptEvent) => void,
) {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log("📱 PWA install prompt available");
    onPromptAvailable(deferredPrompt);
  });

  window.addEventListener("appinstalled", () => {
    console.log("✅ PWA installed successfully");
    deferredPrompt = null;

    // Track installation if analytics is available
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", "pwa_install", {
        event_category: "engagement",
        event_label: "PWA Installation",
      });
    }
  });
}

export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn("⚠️ Install prompt not available");
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User ${outcome} the install prompt`);
    deferredPrompt = null;

    return outcome === "accepted";
  } catch (error) {
    console.error("Error showing install prompt:", error);
    return false;
  }
}

export function isPWAInstalled(): boolean {
  // Check if running in standalone mode
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://");

  return isStandalone;
}

export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}

export function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// Request background sync for cart updates
export async function requestBackgroundSync(tag: string) {
  if (
    "serviceWorker" in navigator &&
    "sync" in ServiceWorkerRegistration.prototype
  ) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(tag);
      console.log(`✅ Background sync registered: ${tag}`);
    } catch (error) {
      console.error("❌ Background sync registration failed:", error);
    }
  } else {
    console.warn("⚠️ Background sync not supported");
  }
}

// Cache specific URLs for offline access
export async function cacheUrls(urls: string[]) {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      registration.active?.postMessage({
        type: "CACHE_URLS",
        urls,
      });
      console.log(`✅ Cached ${urls.length} URLs for offline access`);
    } catch (error) {
      console.error("❌ Failed to cache URLs:", error);
    }
  }
}

// Check if online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Listen for online/offline events
export function setupNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void,
) {
  window.addEventListener("online", () => {
    console.log("✅ Back online");
    onOnline?.();
  });

  window.addEventListener("offline", () => {
    console.log("⚠️ Gone offline");
    onOffline?.();
  });
}

// Get PWA display mode
export function getPWADisplayMode():
  | "browser"
  | "standalone"
  | "minimal-ui"
  | "fullscreen" {
  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    return "fullscreen";
  }
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return "standalone";
  }
  if (window.matchMedia("(display-mode: minimal-ui)").matches) {
    return "minimal-ui";
  }
  return "browser";
}

// Check if PWA can be installed
export function canInstallPWA(): boolean {
  return deferredPrompt !== null;
}
