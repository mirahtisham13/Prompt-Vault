const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('prompts').insert([{ title: 'Test', text: 'Test text', category: '', platform: 'gemini', tags: [], image_url: '', is_featured: false }]).select().single();
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
