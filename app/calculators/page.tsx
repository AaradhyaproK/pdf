import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['calculators'];

export const metadata: Metadata = {
  title: category.metaTitle,
  description: category.metaDescription,
  alternates: {
    canonical: 'https://www.filezenith.com/calculators',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/calculators',
    siteName: 'FileZenith',
    type: 'website',
  },
};

export default function CalculatorsPage() {
  return <CategoryHubPage category={category} />;
}
