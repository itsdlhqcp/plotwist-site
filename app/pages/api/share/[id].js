// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_KEY
// );

// export default async function handler(req, res) {
//   const { id } = req.query;
  
//   try {
//     // Fetch shared content
//     const { data, error } = await supabase
//       .from('shared_content')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error || !data) {
//       return res.status(404).json({ error: 'Content not found' });
//     }
    
//     // Increment view count
//     await supabase
//       .from('shared_content')
//       .update({ view_count: data.view_count + 1 })
//       .eq('id', id);
    
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// }



// pages/api/share/[id].js - IMPROVED VERSION
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Validate ID parameter
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }
  
  try {
    console.log(`API: Fetching content for ID: ${id}`);
    
    // Fetch shared content
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      
      // Handle specific error types
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Content not found' });
      }
      
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!data) {
      console.log('No data found for ID:', id);
      return res.status(404).json({ error: 'Content not found' });
    }
    
    // Increment view count (non-blocking)
    supabase
      .from('shared_content')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id)
      .then(({ error: updateError }) => {
        if (updateError) {
          console.warn('Failed to increment view count:', updateError);
        }
      });
    
    // Set appropriate caching headers
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    // Return the data
    res.status(200).json(data);
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Add this to handle CORS if needed
export const config = {
  api: {
    externalResolver: true,
  },
}