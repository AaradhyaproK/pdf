import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['developer-tools'];

export const metadata: Metadata = getCategoryMetadata('developer-tools');

export default function DeveloperToolsPage() {
  return <CategoryHubPage category={category} />;
}
