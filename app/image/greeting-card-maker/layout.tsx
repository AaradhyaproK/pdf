import { Metadata } from 'next';
import { generateToolMetadata } from '@/lib/seo-config';

export const metadata: Metadata = generateToolMetadata('/image/greeting-card-maker');

export default function GreetingCardMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
