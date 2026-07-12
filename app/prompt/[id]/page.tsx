import { Metadata, ResolvingMetadata } from 'next';
import { supabase } from '@/lib/supabase';
import { truncateText } from '@/lib/utils';
import RedirectClient from './RedirectClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!prompt) {
    return { title: 'Prompt Not Found - PromptBytes' };
  }

  const { truncated } = truncateText(prompt.text, 120);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promptbytes.app';
  const imageUrl = prompt.image_url || `${baseUrl}/og-default.png`; // Fallback image

  return {
    title: `${prompt.title} | PromptBytes`,
    description: truncated,
    openGraph: {
      title: `${prompt.title} | PromptBytes`,
      description: truncated,
      url: `${baseUrl}/prompt/${prompt.id}`,
      siteName: 'PromptBytes',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: prompt.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prompt.title} | PromptBytes`,
      description: truncated,
      images: [imageUrl],
    },
  };
}

export default function PromptPage({ params }: Props) {
  // Returns a 200 OK with the metadata for bots, and uses JS to redirect real users
  return <RedirectClient id={params.id} />;
}
