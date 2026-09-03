import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['text-tools'];

export const metadata: Metadata = {
  title: category.metaTitle,
  description: category.metaDescription,
  alternates: {
    canonical: 'https://www.filezenith.com/text-tools',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/text-tools',
    siteName: 'FileZenith',
    type: 'website',
  },
};

export default function TextToolsPage() {
  return <CategoryHubPage category={category} />;
}
