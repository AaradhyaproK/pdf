import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['image-tools'];

export const metadata: Metadata = getCategoryMetadata('image-tools');

export default function ImageToolsPage() {
  return <CategoryHubPage category={category} />;
}
