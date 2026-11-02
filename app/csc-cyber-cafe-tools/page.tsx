import { Metadata } from 'next';
import { CATEGORY_REGISTRY, getCategoryMetadata } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['csc-cyber-cafe-tools'];

export const metadata: Metadata = getCategoryMetadata('csc-cyber-cafe-tools');

export default function CSCCyberCafeToolsPage() {
  return <CategoryHubPage category={category} />;
}

