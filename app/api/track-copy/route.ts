import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize with Service Role Key to bypass RLS and allow updates without auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { promptId } = await request.json();

    if (!promptId) {
      return NextResponse.json({ error: 'Prompt ID is required' }, { status: 400 });
    }

    // 1. Fetch current copies
    const { data: prompt, error: fetchError } = await supabaseAdmin
      .from('prompts')
      .select('copies')
      .eq('id', promptId)
      .single();

    if (fetchError || !prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // 2. Increment copies
    const { error: updateError } = await supabaseAdmin
      .from('prompts')
      .update({ copies: (prompt.copies || 0) + 1 })
      .eq('id', promptId);

    if (updateError) {
      console.error('Failed to update copies:', updateError);
      return NextResponse.json({ error: 'Failed to update copies' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error tracking copy:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
