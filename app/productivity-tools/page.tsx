import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['productivity-tools'];

export const metadata: Metadata = {
  title: category.metaTitle,
  description: category.metaDescription,
  alternates: {
    canonical: 'https://www.filezenith.com/productivity-tools',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/productivity-tools',
    siteName: 'FileZenith',
    type: 'website',
  },
};

export default function ProductivityToolsPage() {
  return <CategoryHubPage category={category} />;
}
