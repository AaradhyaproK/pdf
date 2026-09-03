import readingTime from 'reading-time';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { BlogPost, BlogFaq } from './blog';

const DEFAULT_POST_IMAGES: Record<string, string> = {
  'compress-pdf-without-losing-quality': '/blog/pdf-compression.jpg',
  'how-to-merge-pdf-files-free': '/blog/pdf-merge.jpg',
  'emi-calculator-guide': '/blog/emi-calculator.jpg',
  'age-calculator-india': '/blog/age-calculator.jpg',
};

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

// Fetch live posts stored in Firebase Firestore
export async function getFirestorePosts(): Promise<BlogPost[]> {
  try {
    const snap = await getDocs(collection(db, 'blog_posts'));
    return snap.docs.map((d) => {
      const data = d.data();
      const content = data.content || '';
      const stats = readingTime(content);
      const faqs = extractFaqsFromContent(content);

      return {
        slug: d.id,
        title: data.title || 'Untitled Post',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime: stats.text || '3 min read',
        content,
        tool: data.tool || null,
        image: data.image || DEFAULT_POST_IMAGES[d.id] || '/blog/pdf-compression.jpg',
        faqs,
      };
    });
  } catch {
    return [];
  }
}

// Save post to Firebase Firestore
export async function saveBlogPostToFirestore(post: BlogPost): Promise<void> {
  const docRef = doc(db, 'blog_posts', post.slug);
  await setDoc(
    docRef,
    {
      ...post,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// Delete post from Firebase Firestore
export async function deleteBlogPostFromFirestore(slug: string): Promise<void> {
  const docRef = doc(db, 'blog_posts', slug);
  await deleteDoc(docRef);
}
