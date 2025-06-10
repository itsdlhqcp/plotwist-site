"use client";

import { useState } from "react";

interface ShareData {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface ShareActionsProps {
  data: ShareData;
}

export default function ShareActions({ data }: ShareActionsProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      setIsSharing(true);
      try {
        await navigator.share({
          title: data.title,
          text: data.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <div className="actions">
      <button onClick={() => window.open("your-app-deep-link", "_blank")}>
        Open in App
      </button>
      <button onClick={handleShare} disabled={isSharing}>
        {isSharing ? "Sharing..." : "Share Again"}
      </button>

      <style jsx>{`
        .actions {
          margin-top: 30px;
          display: flex;
          gap: 10px;
        }
        .actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background: #007bff;
          color: white;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .actions button:hover:not(:disabled) {
          background: #0056b3;
        }
        .actions button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
