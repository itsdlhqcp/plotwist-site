import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SharePage({ initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  
  if (!data) {
    return <div>Content not found</div>;
  }
  
  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:image" content={data.image_url} />
        <meta property="og:url" content={`https://plotwist-site.vercel.app/share/${data.id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="PlotTwist" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={data.image_url} />
        
        {/* WhatsApp specific */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      
      <div className="container">
        <div className="share-content">
          <Image src={data.image_url} alt={data.title} className="preview-image" />
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          
          <div className="actions">
            <button onClick={() => window.open('your-app-deep-link', '_blank')}>
              Open in App
            </button>
            <button onClick={() => navigator.share ? navigator.share({
              title: data.title,
              text: data.description,
              url: window.location.href
            }) : null}>
              Share Again
            </button>
          </div>
        </div>
        
        <style jsx>{`
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .preview-image {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 10px;
            margin-bottom: 20px;
          }
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
          }
        `}</style>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      return { notFound: true };
    }
    
    return {
      props: {
        initialData: data
      }
    };
  } catch (error) {
    return { notFound: true };
  }
}