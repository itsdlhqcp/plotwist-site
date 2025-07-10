// import ShareActions from './ShareActions';

// export async function generateMetadata({ params }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
//   if (!res.ok) return { title: 'Content not found' };

//   const data = await res.json();

//   return {
//     title: data.title,
//     description: data.description,
//     openGraph: {
//       title: data.title,
//       description: data.description,
//       url: `https://plotwist-site.vercel.app/theatre/${data.id}`,
//       type: 'article',
//       siteName: 'PlotTwist',
//       images: [
//         {
//           url: data.image_url,
//           width: 1200,
//           height: 630,
//           alt: data.title,
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: data.title,
//       description: data.description,
//       images: [data.image_url],
//     },
//   };
// }

// export default async function SharePage({ params }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
//   if (!res.ok) return <div>Content not found</div>;

//   const data = await res.json();

//   return (
//     <div className="max-w-xl mx-auto p-5 font-sans">
//       <div className="share-content">
//         <img
//           src={data.image_url}
//           alt={data.title}
//           className="w-full max-w-lg h-auto rounded-lg mb-5"
//         />
//         <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
//         <p className="text-base text-gray-700">{data.description}</p>

//         <ShareActions title={data.title} description={data.description} />
//       </div>
//     </div>
//   );
// }




// import ShareActions from './ShareActions';

// export async function generateMetadata({ params }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
//   if (!res.ok) return { title: 'Content not found' };

//   const data = await res.json();

//   return {
//     title: data.title,
//     description: data.description,
//     openGraph: {
//       title: data.title,
//       description: data.description,
//       url: `https://plotwist-site.vercel.app/theatre/${data.id}`,
//       type: 'article',
//       siteName: 'PlotTwist',
//       images: [
//         {
//           url: data.image_url,
//           width: 1200,
//           height: 630,
//           alt: data.title,
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: data.title,
//       description: data.description,
//       images: [data.image_url],
//     },
//   };
// }

// export default async function SharePage({ params }) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
//   if (!res.ok) return <div>Content not found</div>;

//   const data = await res.json();

//   const openInApp = () => {
//     const appLink = `plotwist://theatre/${data.id}`;
//     const playStoreLink = 'https://play.google.com/store/apps/details?id=com.mediatalk.plotwist';

//     const timeout = setTimeout(() => {
//       window.location.href = playStoreLink;
//     }, 1500);

//     // Attempt to open app
//     window.location.href = appLink;

//     // Cancel fallback if app opens successfully
//     window.addEventListener('blur', () => clearTimeout(timeout));
//   };

//   return (
//     <div className="max-w-xl mx-auto p-5 font-sans">
//       <div className="share-content">
//         <img
//           src={data.image_url}
//           alt={data.title}
//           className="w-full max-w-lg h-auto rounded-lg mb-5"
//         />
//         <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
//         <p className="text-base text-gray-700">{data.description}</p>

//         {/* Open in App Button */}
//         <button
//           onClick={openInApp}
//           className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
//         >
//           Open in App
//         </button>

//         {/* Optional sharing actions */}
//         <ShareActions title={data.title} description={data.description} />
//       </div>
//     </div>
//   );
// }




// SharePage.jsx
'use client';

import { useEffect, useState } from 'react';
import ShareActions from './ShareActions';

export default function SharePage({ params }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  // ✅ Fetch content client-side (to avoid SSR issues)
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

  // ✅ Open deep link or fallback to Play Store
  const openInApp = () => {
    const appLink = `plotwist://theatre/${params.id}`;
    const playStoreLink = 'https://play.google.com/store/apps/details?id=com.mediatalk.plotwist';

    const timeout = setTimeout(() => {
      window.location.href = playStoreLink;
    }, 1500);

    window.location.href = appLink;

    // Cancel timeout if app opens
    window.addEventListener('blur', () => clearTimeout(timeout));
  };

  // ✅ Safe MetaMask check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof window.ethereum === 'undefined') {
        console.warn('MetaMask extension not found');
      } else {
        console.log('MetaMask is installed');
        // You can now interact with MetaMask safely
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

        {/* Open in App Button */}
        <button
          onClick={openInApp}
          className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Open in App
        </button>

        {/* Share buttons */}
        <ShareActions title={data.title} description={data.description} />
      </div>
    </div>
  );
}
