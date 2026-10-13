import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['calculators'];

export const metadata: Metadata = getCategoryMetadata('calculators');

export default function CalculatorsPage() {
  return <CategoryHubPage category={category} />;
}
