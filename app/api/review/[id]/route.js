
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
      .from('shared_digital')
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
      .from('shared_digital')
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
