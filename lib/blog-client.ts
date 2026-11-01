import type { BlogPost, BlogFaq } from './blog';

export function extractFaqsFromContent(content: string): BlogFaq[] {
  const faqs: BlogFaq[] = [];
  const parts = content.split(/## (?:Frequently Asked Questions|FAQ)/i);
  if (parts.length < 2) return faqs;

  const faqSection = parts[1];
  const blocks = faqSection.split(/### /g).slice(1);

  blocks.forEach((block) => {
    const lines = block.trim().split('\n');
    const q = lines[0].replace(/[*#]/g, '').trim();
    const a = lines.slice(1).join(' ').replace(/[*#]/g, '').trim();
    if (q && a) {
      faqs.push({ q, a });
    }
  });

  return faqs;
}

// Zero-Firebase Client Stubs
export async function getFirestorePosts(): Promise<BlogPost[]> {
  return [];
}

export async function saveBlogPostToFirestore(_post: BlogPost): Promise<void> {
  // Static content only
}

export async function deleteBlogPostFromFirestore(_slug: string): Promise<void> {
  // Static content only
}
