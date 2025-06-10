'use client';

export default function ShareActions({ title, description }) {
  return (
    <div className="mt-8 flex gap-4">
      <button
        onClick={() => window.open("your-app-deep-link", "_blank")}
        className="px-5 py-2 bg-blue-600 text-white rounded"
      >
        Open in App
      </button>
      <button
        onClick={() =>
          navigator.share?.({
            title,
            text: description,
            url: window.location.href,
          })
        }
        className="px-5 py-2 bg-blue-500 text-white rounded"
      >
        Share Again
      </button>
    </div>
  );
}
