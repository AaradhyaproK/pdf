import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo-config';

export function generateMetadata(): Metadata {
  return generateToolMetadata('/utility/markdown-editor');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
