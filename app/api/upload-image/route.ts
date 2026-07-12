import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Allow large file uploads on Vercel (default is 4.5MB)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Validate env vars first so we get a clear error instead of 500
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, supabaseServiceKey: !!supabaseServiceKey });
    return NextResponse.json({ error: 'Server misconfiguration: missing Supabase credentials' }, { status: 500 });
  }

  // Initialize inside the handler so env vars are always fresh
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e: any) {
      console.error('Failed to parse formData:', e.message);
      return NextResponse.json({ error: 'Failed to read uploaded file: ' + e.message }, { status: 400 });
    }

    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Uploading:', file.name, 'size:', file.size, 'type:', file.type);

    const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    // Convert File to Buffer (required in Next.js server environment)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('prompt-images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError.message, uploadError);
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
    }

    console.log('Upload success:', uploadData?.path);

    const { data: publicUrlData } = supabaseAdmin.storage
      .from('prompt-images')
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err: any) {
    console.error('Unexpected error in upload-image:', err?.message, err?.stack);
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}
