import type { Metadata } from 'next';
import { generateToolMetadata, generateToolSchemas } from '@/lib/seo-config';

export function generateMetadata(): Metadata {
  return generateToolMetadata('/utility/word-to-pages');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const schemas = generateToolSchemas('/utility/word-to-pages');

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
