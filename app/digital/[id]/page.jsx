import ShareActions from '../../theatre/[id]/ShareActions';

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/review/${params.id}`);
  if (!res.ok) return { title: 'Content not found' };

  const data = await res.json();

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://plotwist-site.vercel.app/review/${data.id}`,
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/review/${params.id}`);
  if (!res.ok) return <div>Content not found</div>;

  const data = await res.json();

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

         <ShareActions
          title={data.title}
          description={data.description}
          appPath={`upcoming`} // 🔁 dynamic deep link path
        />
      </div>
    </div>
  );
}