import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['utility'];

export const metadata: Metadata = {
  title: {
    absolute: category.metaTitle,
  },
  description: category.metaDescription,
  alternates: {
    canonical: 'https://www.filezenith.com/utility',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/utility',
    siteName: 'FileZenith',
    type: 'website',
  },
};

export default function UtilityToolsAliasPage() {
  return <CategoryHubPage category={category} />;
}
