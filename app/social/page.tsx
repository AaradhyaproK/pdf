import { Metadata } from 'next';
import { CATEGORY_REGISTRY } from '@/lib/categories-data';
import { CategoryHubPage } from '@/components/CategoryHubPage';

const category = CATEGORY_REGISTRY['social'];

export const metadata: Metadata = {
  title: {
    absolute: category.metaTitle,
  },
  description: category.metaDescription,
  alternates: {
    canonical: 'https://www.filezenith.com/social',
  },
  openGraph: {
    title: category.metaTitle,
    description: category.metaDescription,
    url: 'https://www.filezenith.com/social',
    siteName: 'FileZenith',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: category.metaTitle,
    description: category.metaDescription,
  },
};

export default function SocialPage() {
  return <CategoryHubPage category={category} />;
}
