import ShareActions from './ShareActions';

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
  if (!res.ok) return { title: 'Content not found' };
  
  const data = await res.json();
  
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://plotwist-site.vercel.app/theatre/${data.id}`,
      type: 'article',
      siteName: 'PlotTwist',
      images: [
        {
          url: data.image_url,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.image_url],
    },
  };
}

export default async function SharePage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${params.id}`);
  if (!res.ok) return <div>Content not found</div>;
  
  const data = await res.json();
  
  return (
    <div>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1>{data.title}</h1>
          <div className="flex items-center gap-1 text-gray-600">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="text-sm">{data.view_count}</span>
          </div>
        </div>
        <p>{data.description}</p>
      </div>
      <ShareActions />
    </div>
  );
}