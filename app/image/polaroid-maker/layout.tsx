import { generateToolMetadata } from '@/lib/seo-config';

export function generateMetadata() {
  return generateToolMetadata('/image/polaroid-maker');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
