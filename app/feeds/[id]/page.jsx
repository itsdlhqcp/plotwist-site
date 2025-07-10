import ShareActions from "../../theatre/[id]/ShareActions";

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feeds/${params.id}`);
  if (!res.ok) return { title: 'Content not found' };
  const data = await res.json();
  
  // Parse HTML body to extract text content for description
  const bodyText = data.body ? data.body.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
  const imageUrl = data.file ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profileImage/${data.file}` : null;
  
  return {
    title: bodyText || 'PlotTwist Post',
    description: bodyText || 'Check out this PlotTwist post',
    openGraph: {
      title: bodyText || 'PlotTwist Post',
      description: bodyText || 'Check out this PlotTwist post',
      url: `https://plotwist-site.vercel.app/feeds/${data.id}`,
      type: 'article',
      siteName: 'PlotTwist',
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: bodyText || 'PlotTwist Post',
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: bodyText || 'PlotTwist Post',
      description: bodyText || 'Check out this PlotTwist post',
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function SharePage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/feeds/${params.id}`);
  if (!res.ok) return <div>Content not found</div>;
  const data = await res.json();
  
  // Get image URL using the helper function logic
  const imageUrl = data.file ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profileImage/${data.file}` : null;
  
  // Parse tags if they exist
  let parsedTags = [];
  try {
    if (data.tags) {
      parsedTags = JSON.parse(data.tags);
    }
  } catch (error) {
    console.error('Error parsing tags:', error);
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-blue-500 text-white py-6 px-4 shadow-lg">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold tracking-wide">PlotTwist APP</h1>
          <p className="text-red-100 mt-2">Discover Amazing Stories</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto p-6">
        <div className="bg-black rounded-2xl shadow-xl overflow-hidden border border-red-100">
          {imageUrl && (
            <div className="relative">
              <img
                src={imageUrl}
                alt="PlotTwist Post"
                className="w-full h-auto max-h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          
          <div className="p-6">
            <div 
              className="text-lg text-gray-800 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.body }}
            />
            
            {parsedTags.length > 0 && (
              <div className="mb-6 ">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-gradient-to-r from-red-100 to-blue-100 text-gray-700 text-sm font-medium px-3 py-2 rounded-full border border-red-200 hover:shadow-md transition-shadow"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {new Date(data.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                {data.verified && (
                  <span className="flex items-center text-blue-600 font-medium">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 bg-gray-800 rounded-lg py-4 px-6">
          <p className="text-sm text-white">Powered by <span className="font-semibold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">PlotTwist</span></p>
        </div>

        <ShareActions
                  title={data.title}
                  description={data.description}
                  appPath={`upcoming`} // 🔁 dynamic deep link path
                />
      </div>
    </div>
  );
}