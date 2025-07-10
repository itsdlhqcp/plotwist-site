'use client';

export default function ShareActions({ title, description, appPath = 'upcoming' }) {
  const handleOpenInApp = () => {
    const appLink = `plotwist://${appPath}`;
    const playStoreLink = 'https://play.google.com/store/apps/details?id=com.mediatalk.plotwist';

    const timeout = setTimeout(() => {
      window.location.href = playStoreLink;
    }, 1500);

    window.location.href = appLink;

    window.addEventListener('blur', () => clearTimeout(timeout));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url: window.location.href,
      });
    } else {
      console.warn('Web Share API is not supported in this browser');
    }
  };

  return (
    <div className="mt-8 flex gap-4">
      <button
        onClick={handleOpenInApp}
        className="px-5 py-2 bg-blue-600 text-white rounded"
      >
        Open in App
      </button>

      <button
        onClick={handleShare}
        className="px-5 py-2 bg-blue-500 text-white rounded"
      >
        Share Again
      </button>
    </div>
  );
}

