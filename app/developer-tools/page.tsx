import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['developer-tools'];

export const metadata: Metadata = {
  title: category.metaTitle,
  description: category.metaDescription,
  alternates: {
    canonical: 'https://www.filezenith.com/developer-tools',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/developer-tools',
    siteName: 'FileZenith',
    type: 'website',
  },
};

export default function DeveloperToolsPage() {
  return <CategoryHubPage category={category} />;
}
