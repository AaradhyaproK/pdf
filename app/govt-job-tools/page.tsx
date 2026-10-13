import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['govt-job-tools'];

export const metadata: Metadata = getCategoryMetadata('govt-job-tools');

export default function GovtJobToolsPage() {
  return <CategoryHubPage category={category} />;
}
