import { Download, Monitor, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type BeforeInstallPromptEvent,
  getDeviceType,
  isIOS,
  isMobileDevice,
  isPWAInstalled,
  setupPWAInstallPrompt,
  showInstallPrompt,
} from "../lib/pwa";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "mobile",
  );

  useEffect(() => {
    // Don't show if already installed
    if (isPWAInstalled()) {
      return;
    }

    // Detect device type
    setDeviceType(getDeviceType());

    // Check if user has dismissed the prompt before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = Number.parseInt(dismissed, 10);
      const daysSinceDismissed =
        (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Setup install prompt listener
    setupPWAInstallPrompt((prompt) => {
      setDeferredPrompt(prompt);
      // Show prompt after 3 seconds for better UX
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    });

    // For iOS devices, show manual install instructions
    if (isIOS() && !isPWAInstalled()) {
      setTimeout(() => {
        const iosPromptDismissed = localStorage.getItem(
          "pwa-ios-prompt-dismissed",
        );
        if (!iosPromptDismissed) {
          setShowPrompt(true);
        }
      }, 5000);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      const accepted = await showInstallPrompt();
      if (accepted) {
        setShowPrompt(false);
        localStorage.removeItem("pwa-install-dismissed");
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    if (isIOS()) {
      localStorage.setItem("pwa-ios-prompt-dismissed", Date.now().toString());
    }
  };

  // Don't show if no prompt available and not iOS
  if (!showPrompt || (!deferredPrompt && !isIOS())) {
    return null;
  }

  // iOS-specific install instructions
  if (isIOS() && !deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <Card className="shadow-lg border-2">
          <CardHeader className="relative pb-3">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Smartphone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Install HASSANé App</CardTitle>
                <CardDescription className="text-xs">
                  Add to Home Screen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <p className="text-sm text-muted-foreground">
              Install our app for a better shopping experience:
            </p>
            <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
              <li>
                Tap the Share button <span className="inline-block">📤</span> in
                Safari
              </li>
              <li>Scroll down and tap "Add to Home Screen"</li>
              <li>Tap "Add" to install</li>
            </ol>
            <Button
              onClick={handleDismiss}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Got it
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Standard install prompt for Android/Desktop
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
      <Card className="shadow-lg border-2">
        <CardHeader className="relative pb-3">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              {isMobileDevice() ? (
                <Smartphone className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Monitor className="h-6 w-6 text-primary-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">Install HASSANé App</CardTitle>
              <CardDescription className="text-xs">
                {deviceType === "mobile"
                  ? "Get the full app experience"
                  : "Quick access from your desktop"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <p className="text-sm text-muted-foreground">
            {deviceType === "mobile"
              ? "Install our app for faster access, offline browsing, and a native shopping experience."
              : "Install for quick access, offline browsing, and desktop notifications."}
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
              <span className="text-lg">⚡</span>
              <span>Fast</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
              <span className="text-lg">📱</span>
              <span>Offline</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
              <span className="text-lg">🔔</span>
              <span>Alerts</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInstall} className="flex-1" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Install Now
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
