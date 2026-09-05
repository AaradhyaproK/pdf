import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['govt-job-tools'];

export const metadata: Metadata = {
  title: category.metaTitle,
  description: category.metaDescription,
  keywords: category.keywords,
  alternates: {
    canonical: 'https://www.filezenith.com/govt-job-tools',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/govt-job-tools',
    siteName: 'FileZenith',
    type: 'website',
  },
};

export default function GovtJobToolsPage() {
  return <CategoryHubPage category={category} />;
}
