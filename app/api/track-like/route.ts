import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize with Service Role Key to bypass RLS and allow updates without auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { promptId, action } = await request.json(); // action can be 'like' or 'unlike'

    if (!promptId) {
      return NextResponse.json({ error: 'Prompt ID is required' }, { status: 400 });
    }

    // 1. Fetch current likes
    const { data: prompt, error: fetchError } = await supabaseAdmin
      .from('prompts')
      .select('likes')
      .eq('id', promptId)
      .single();

    if (fetchError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // 2. Increment or decrement likes
    const currentLikes = prompt.likes || 0;
    const newLikes = action === 'unlike' ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    const { error: updateError } = await supabaseAdmin
      .from('prompts')
      .update({ likes: newLikes })
      .eq('id', promptId);

    if (updateError) {
      console.error('Failed to update likes:', updateError);
      return NextResponse.json({ error: 'Failed to update likes' }, { status: 500 });
    }

    return NextResponse.json({ success: true, likes: newLikes });
  } catch (err) {
    console.error('Error tracking like:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
