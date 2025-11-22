"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "14px 18px",
        borderRadius: "8px",
        background: type === "success" ? "#16a34a" : "#dc2626",
        color: "white",
        fontWeight: "600",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
