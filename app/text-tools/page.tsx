import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['text-tools'];

export const metadata: Metadata = getCategoryMetadata('text-tools');

export default function TextToolsPage() {
  return <CategoryHubPage category={category} />;
}
