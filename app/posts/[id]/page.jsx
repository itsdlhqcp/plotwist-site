import ShareActions from "@/components/ShareAction";

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${params.id}`);
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
      url: `https://plotwist-site.vercel.app/posts/${data.id}`,
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

export default async function PostPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${params.id}`);
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

  // Get filter color based on filter type
  const getFilterStyle = (filter) => {
    const filterStyles = {
      'am': 'from-amber-500 to-orange-500',
      'news': 'from-blue-500 to-cyan-500',
      'rumour': 'from-purple-500 to-pink-500',
      'default': 'from-gray-500 to-gray-600'
    };
    return filterStyles[filter] || filterStyles.default;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-wide mb-2">PlotTwist APP</h1>
          <p className="text-indigo-100">Entertainment News & Updates</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-black rounded-3xl shadow-2xl overflow-hidden border border-indigo-100">
          {/* Post Filter Badge */}
          {data.filter && (
            <div className="px-6 pt-6">
              <span className={`inline-block bg-gradient-to-r ${getFilterStyle(data.filter)} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-lg`}>
                {data.filter}
              </span>
            </div>
          )}

          {/* Image Section */}
          {imageUrl && (
            <div className="relative mt-4 mx-6">
              <img
                src={imageUrl}
                alt="PlotTwist Post"
                className="w-full h-auto max-h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
            </div>
          )}
          
          {/* Content Section */}
          <div className="p-6">
            {/* Post Body */}
            <div 
              className="text-xl text-gray-800 mb-6 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: data.body }}
            />
            
            {/* Tags Section */}
            {parsedTags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wide">Topics:</h3>
                <div className="flex flex-wrap gap-3">
                  {parsedTags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-semibold px-4 py-2 rounded-full border-2 border-indigo-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="text-center mt-8">
          <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-2xl py-6 px-8 shadow-xl">
            <p className="text-white font-semibold text-lg mb-2">
              Powered by <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent font-bold">PlotTwist</span>
            </p>
            <p className="text-indigo-200 text-sm">Your source for entertainment news and updates</p>
          </div>

            <ShareActions
                  title={data.title}
                  description={data.description}
                  appPath={`feeds`} // 🔁 dynamic deep link path
                />
        </div>
      </div>
    </div>
  );
}