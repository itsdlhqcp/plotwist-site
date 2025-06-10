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



// app/api/share/[id]/route.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Fetch shared content
    const { data, error } = await supabase
      .from('shared_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Content not found' }), {
        status: 404,
      });
    }

    // Increment view count
    await supabase
      .from('shared_content')
      .update({ view_count: data.view_count + 1 })
      .eq('id', id);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    });
  }
}
