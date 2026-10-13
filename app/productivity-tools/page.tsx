import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['productivity-tools'];

export const metadata: Metadata = getCategoryMetadata('productivity-tools');

export default function ProductivityToolsPage() {
  return <CategoryHubPage category={category} />;
}
