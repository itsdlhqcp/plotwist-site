import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Fetch twist content
    const { data, error } = await supabase
      .from('twists')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Content not found' }), {
        status: 404,
      });
    }

    // Note: Removed view count increment since 'twists' table doesn't have view_count column
    // If you want to track views, you'll need to add a view_count column to the twists table

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