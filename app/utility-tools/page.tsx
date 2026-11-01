import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['utility-tools'] || CATEGORY_REGISTRY['utility'];

export const metadata: Metadata = getCategoryMetadata('utility-tools');

export default function UtilityToolsAliasPage() {
  return <CategoryHubPage category={category} />;
}
