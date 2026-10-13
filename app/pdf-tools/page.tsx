import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['pdf-tools'];

export const metadata: Metadata = getCategoryMetadata('pdf-tools');

export default function PdfToolsPage() {
  return <CategoryHubPage category={category} />;
}
