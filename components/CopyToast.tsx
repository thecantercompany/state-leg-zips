"use client";

import { useEffect } from "react";

interface CopyToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function CopyToast({
  message,
  visible,
  onDismiss,
}: CopyToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
