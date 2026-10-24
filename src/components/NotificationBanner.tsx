import React, { useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "./ui/button";

interface NotificationBannerProps {
  permission: NotificationPermission | "unsupported";
  onRequestPermission: () => Promise<NotificationPermission | "unsupported">;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  permission,
  onRequestPermission,
}) => {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem("pictmun_notif_banner_dismissed") === "1";
  });
  const [isRequesting, setIsRequesting] = useState(false);

  if (dismissed || permission === "unsupported" || permission === "granted") {
    return null;
  }

  const handleEnable = async () => {
    setIsRequesting(true);
    try {
      await onRequestPermission();
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("pictmun_notif_banner_dismissed", "1");
  };

  if (permission === "denied") {
    return (
      <div
        id="notification-denied-banner"
        data-testid="notification-denied-banner"
        className="w-full max-w-5xl mx-auto mb-4 p-3.5 rounded-xl bg-[#0B2B26]/90 border border-[#A67C52]/40 text-[#F2E9DB] flex items-center justify-between gap-3 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-rose-950/60 border border-rose-600/40 flex items-center justify-center text-rose-300 flex-shrink-0">
            <BellOff className="size-4" />
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-rose-300">Notifications are blocked: </span>
            <span>
              To receive real-time alerts for incoming chits, please allow notifications in your browser's site settings.
            </span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="text-[#A67C52] hover:text-[#F2E9DB] p-1 flex-shrink-0 cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  // Permission is 'default'
  return (
    <div
      id="notification-permission-banner"
      data-testid="notification-permission-banner"
      className="w-full max-w-5xl mx-auto mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#0B2B26] via-[#174A3A]/80 to-[#0B2B26] border border-[#A67C52]/50 text-[#F2E9DB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-[#174A3A] border border-[#A67C52]/60 flex items-center justify-center text-[#FFF4D6] flex-shrink-0 shadow-sm">
          <Bell className="size-4 animate-pulse text-[#A67C52]" />
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-semibold text-[#FFF4D6]">Enable Browser Notifications</p>
          <p className="text-[#F2E9DB]/80 text-xs">
            Receive instant alerts with sender portfolio and message content whenever a new chit arrives.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
        <Button
          id="enable-notifications-btn"
          data-testid="enable-notifications-btn"
          onClick={handleEnable}
          disabled={isRequesting}
          className="bg-gradient-to-r from-[#A67C52] to-[#8C6239] hover:from-[#B88B5D] hover:to-[#9B6E43] text-[#FFF4D6] font-semibold text-xs px-3.5 py-1.5 h-auto rounded-lg shadow cursor-pointer"
        >
          {isRequesting ? "Requesting..." : "Enable Notifications"}
        </Button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification prompt"
          className="text-[#A67C52] hover:text-[#F2E9DB] p-1 cursor-pointer transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};
