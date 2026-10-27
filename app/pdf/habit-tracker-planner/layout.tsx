import { generateToolMetadata } from '@/lib/seo-config';

export function generateMetadata() {
  return generateToolMetadata('/pdf/habit-tracker-planner');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
