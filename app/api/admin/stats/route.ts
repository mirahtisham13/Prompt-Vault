import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Fetch users (up to 1000 for now)
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    
    if (error) {
      throw error;
    }
    
    // Verified users are those with a confirmed email or phone
    const verifiedUsers = users.filter(u => u.email_confirmed_at != null || u.phone_confirmed_at != null);
    
    return NextResponse.json({ totalVerifiedUsers: verifiedUsers.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
