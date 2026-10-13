import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['social'];

export const metadata: Metadata = getCategoryMetadata('social');

export default function SocialToolsAliasPage() {
  return <CategoryHubPage category={category} />;
}
