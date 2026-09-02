import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Support & Developer Team - FileZenith',
  description: 'Have a question or feedback? Contact the FileZenith development team at Snab.',
  alternates: {
    canonical: 'https://www.filezenith.com/contact',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
