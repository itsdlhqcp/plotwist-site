'use client';

import { useEffect, useState } from 'react';
import ShareActions from './ShareActions';

export default function SharePage({ params }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
        if (!res.ok) throw new Error('Not found');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof window.ethereum === 'undefined') {
        console.warn('MetaMask extension not found');
      } else {
        console.log('MetaMask is installed');
      }
    }
  }, []);

  if (error) return <div className="text-red-500 text-center mt-10">Content not found</div>;
  if (!data) return <div className="text-gray-500 text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-5 font-sans">
      <div className="share-content">
        <img
          src={data.image_url}
          alt={data.title}
          className="w-full max-w-lg h-auto rounded-lg mb-5"
        />
        <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
        <p className="text-base text-gray-700">{data.description}</p>

        {/* Reusable Share & Open in App Actions */}
        <ShareActions
          title={data.title}
          description={data.description}
          appPath={`releaseInfo/${data.id}`} // 🔁 dynamic deep link path
        />
      </div>
    </div>
  );
}
