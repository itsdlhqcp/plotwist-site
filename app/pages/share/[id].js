// pages/share/[id].js - FIXED VERSION
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default function SharePage({ data, error }) {
  const router = useRouter();
  
  // Handle error cases
  if (error || !data) {
    return (
      <>
        <Head>
          <title>Content Not Found - PlotTwist</title>
          <meta name="description" content="The requested content could not be found." />
        </Head>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Content Not Found</h1>
          <p>The content youre looking for doesnt exist or has been removed.</p>
        </div>
      </>
    );
  }

  // Construct absolute URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://plotwist-site.vercel.app';
  const currentUrl = `${baseUrl}/share/${data.id}`;
  const imageUrl = data.image_url?.startsWith('http') ? data.image_url : `${baseUrl}${data.image_url}`;
  
  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.description} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="PlotTwist" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:secure_url" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={data.title} />
        <meta property="og:image:type" content="image/jpeg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@plottwist" />
        <meta name="twitter:creator" content="@plottwist" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.description} />
        <meta name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={data.title} />
        
        {/* Additional Meta Tags for Better Social Sharing */}
        <meta property="article:author" content={data.metadata?.created_by || 'PlotTwist User'} />
        <meta property="article:published_time" content={data.created_at} />
        
        {/* WhatsApp Specific - These help with WhatsApp previews */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="theme-color" content="#007bff" />
        
        {/* Structured Data - Helps with rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              "itemReviewed": {
                "@type": "Movie",
                "name": data.metadata?.title || "Movie Review"
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": data.metadata?.rating || 5,
                "bestRating": 5
              },
              "author": {
                "@type": "Person",
                "name": data.metadata?.created_by || "PlotTwist User"
              },
              "reviewBody": data.description,
              "datePublished": data.created_at,
              "image": imageUrl,
              "url": currentUrl
            })
          }}
        />
      </Head>
      
      <div className="container">
        <div className="share-content">
          <img src={imageUrl} alt={data.title} className="preview-image" />
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          
          {data.metadata?.rating && (
            <div className="rating">
              <span>Rating: {data.metadata.rating}/5 ⭐</span>
            </div>
          )}
          
          <div className="actions">
            <button 
              onClick={() => {
                // Try to open the app first, then fallback to app store
                const appUrl = `plottwist://share/${data.id}`;
                const fallbackUrl = 'https://your-app-store-link.com';
                
                window.location.href = appUrl;
                setTimeout(() => {
                  window.location.href = fallbackUrl;
                }, 1000);
              }}
              className="primary-button"
            >
              Open in App
            </button>
            
            <button 
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: data.title,
                      text: data.description,
                      url: currentUrl
                    });
                  } catch (err) {
                    console.log('Error sharing:', err);
                  }
                } else {
                  // Fallback for browsers that don't support Web Share API
                  await navigator.clipboard.writeText(currentUrl);
                  alert('Link copied to clipboard!');
                }
              }}
              className="secondary-button"
            >
              Share Again
            </button>
          </div>
          
          <div className="metadata">
            <p>Views: {data.view_count || 0}</p>
            {data.metadata?.created_by && (
              <p>Created by: {data.metadata.created_by}</p>
            )}
          </div>
        </div>
        
        <style jsx>{`
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
          }
          
          .share-content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 24px;
            text-align: center;
          }
          
          .preview-image {
            width: 100%;
            max-width: 500px;
            height: auto;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          h1 {
            color: #333;
            margin-bottom: 16px;
            font-size: 24px;
          }
          
          p {
            color: #666;
            margin-bottom: 20px;
            font-size: 16px;
          }
          
          .rating {
            margin: 16px 0;
            padding: 8px 16px;
            background: #f8f9fa;
            border-radius: 6px;
            display: inline-block;
          }
          
          .actions {
            margin: 30px 0;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .primary-button {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            background: #007bff;
            color: white;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background 0.2s;
          }
          
          .primary-button:hover {
            background: #0056b3;
          }
          
          .secondary-button {
            padding: 12px 24px;
            border: 2px solid #007bff;
            border-radius: 6px;
            background: transparent;
            color: #007bff;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.2s;
          }
          
          .secondary-button:hover {
            background: #007bff;
            color: white;
          }
          
          .metadata {
            margin-top: 24px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #888;
            font-size: 14px;
          }
          
          @media (max-width: 600px) {
            .container {
              padding: 16px;
            }
            
            .actions {
              flex-direction: column;
              align-items: center;
            }
            
            .primary-button,
            .secondary-button {
              width: 100%;
              max-width: 200px;
            }
          }
        `}</style>
      </div>
    </>
  );
}

// CRITICAL: This must be getServerSideProps, not getStaticProps
export async function getServerSideProps(context) {
  const { id } = context.params;
  
  // Add proper error handling and logging
  console.log(`Fetching share data for ID: ${id}`);
  
  try {
    // Fetch data directly from Supabase (more reliable than API route)
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return {
        props: {
          data: null,
          error: 'Content not found'
        }
      };
    }
    
    if (!data) {
      console.log('No data found for ID:', id);
      return {
        props: {
          data: null,
          error: 'Content not found'
        }
      };
    }
    
    // Increment view count
    const { error: updateError } = await supabase
      .from('shared_content')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);
    
    if (updateError) {
      console.warn('Failed to increment view count:', updateError);
    }
    
    // Ensure data is serializable
    const serializedData = JSON.parse(JSON.stringify(data));
    
    console.log('Successfully fetched data:', serializedData);
    
    return {
      props: {
        data: serializedData,
        error: null
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        data: null,
        error: 'Server error'
      }
    };
  }
}



// import Head from 'next/head';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
// import { useEffect, useState } from 'react';

// export default function SharePage({ initialData }) {
//   const router = useRouter();
//   const [data, setData] = useState(initialData);
  
//   if (!data) {
//     return <div>Content not found</div>;
//   }
  
//   return (
//     <>
//       <Head>
//         <title>{data.title}</title>
//         <meta name="description" content={data.description} />
        
//         {/* Open Graph Meta Tags */}
//         <meta property="og:title" content={data.title} />
//         <meta property="og:description" content={data.description} />
//         <meta property="og:image" content={data.image_url} />
//         <meta property="og:url" content={`https://plotwist-site.vercel.app/share/${data.id}`} />
//         <meta property="og:type" content="article" />
//         <meta property="og:site_name" content="PlotTwist" />
        
//         {/* Twitter Card Meta Tags */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content={data.title} />
//         <meta name="twitter:description" content={data.description} />
//         <meta name="twitter:image" content={data.image_url} />
        
//         {/* WhatsApp specific */}
//         <meta property="og:image:width" content="1200" />
//         <meta property="og:image:height" content="630" />
//       </Head>
      
//       <div className="container">
//         <div className="share-content">
//           <Image src={data.image_url} alt={data.title} className="preview-image" />
//           <h1>{data.title}</h1>
//           <p>{data.description}</p>
          
//           <div className="actions">
//             <button onClick={() => window.open('your-app-deep-link', '_blank')}>
//               Open in App
//             </button>
//             <button onClick={() => navigator.share ? navigator.share({
//               title: data.title,
//               text: data.description,
//               url: window.location.href
//             }) : null}>
//               Share Again
//             </button>
//           </div>
//         </div>
        
//         <style jsx>{`
//           .container {
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//             font-family: Arial, sans-serif;
//           }
//           .preview-image {
//             width: 100%;
//             max-width: 500px;
//             height: auto;
//             border-radius: 10px;
//             margin-bottom: 20px;
//           }
//           .actions {
//             margin-top: 30px;
//             display: flex;
//             gap: 10px;
//           }
//           .actions button {
//             padding: 10px 20px;
//             border: none;
//             border-radius: 5px;
//             background: #007bff;
//             color: white;
//             cursor: pointer;
//           }
//         `}</style>
//       </div>
//     </>
//   );
// }

// export async function getServerSideProps(context) {
//   const { id } = context.params;
  
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/share/${id}`);
//     const data = await response.json();
    
//     if (!response.ok) {
//       return { notFound: true };
//     }
    
//     return {
//       props: {
//         initialData: data
//       }
//     };
//   } catch (error) {
//     return { notFound: true };
//   }
// }