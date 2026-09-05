import { permanentRedirect } from 'next/navigation';
import { GUIDE_REGISTRY } from '@/lib/guides-data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GUIDE_REGISTRY).map((slug) => ({ slug }));
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/blog/${slug}`);
}

