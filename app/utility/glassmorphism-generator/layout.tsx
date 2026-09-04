import type { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo-config';

export function generateMetadata(): Metadata {
  return generateToolMetadata('/utility/glassmorphism-generator');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
