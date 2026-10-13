import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['ai-tools'];

export const metadata: Metadata = getCategoryMetadata('ai-tools');

export default function AiToolsPage() {
  return <CategoryHubPage category={category} />;
}
