import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Install FileZenith Web & Mobile App',
  description: 'Install FileZenith progressive web app on Android, iPhone, Mac, and Windows for fast offline PDF & image tools.',
  alternates: {
    canonical: 'https://www.filezenith.com/download-app',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
