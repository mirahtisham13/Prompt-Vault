import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  // Admin client to bypass RLS and delete user
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Regular client to verify passwords
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  try {
    const { password } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Get the user corresponding to the token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Determine if the user has an email identity (and thus potentially a password)
    const hasEmailAuth = user.identities?.some(id => id.provider === 'email');
    
    // If they log in with email/password, verify the password
    if (hasEmailAuth) {
      if (!password) {
        return NextResponse.json({ error: 'Password is required to delete your account.' }, { status: 400 });
      }
      
      // Attempt to sign in to verify the password
      const { error: signInError } = await supabaseAuth.auth.signInWithPassword({
        email: user.email!,
        password
      });
      
      if (signInError) {
        return NextResponse.json({ error: 'Incorrect password. Account deletion failed.' }, { status: 401 });
      }
    }

    // Delete the user using the admin client
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete account error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete account' }, { status: 500 });
  }
}
