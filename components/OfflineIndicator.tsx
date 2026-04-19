"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showIndicator && isOnline) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 md:left-6 md:right-6 z-40 px-4 py-3 rounded-lg border flex items-center gap-3 transition-all",
        isOnline
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
          : "bg-amber-500/10 border-amber-500/20 text-amber-500"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm font-bold">Back Online</p>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold">You're Offline</p>
            <p className="text-xs opacity-75">
              Some features are limited. Cached data is available.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
