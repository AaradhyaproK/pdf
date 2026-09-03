import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  content: string;
  tool: string | null;
  image?: string;
  faqs?: BlogFaq[];
}

const BLOG_DIRECTORY = path.join(process.cwd(), 'content/blog');

const DEFAULT_POST_IMAGES: Record<string, string> = {
  'compress-pdf-without-losing-quality': '/blog/pdf-compression.jpg',
  'how-to-merge-pdf-files-free': '/blog/pdf-merge.jpg',
  'emi-calculator-guide': '/blog/emi-calculator.jpg',
  'age-calculator-india': '/blog/age-calculator.jpg',
};

// Helper function to extract FAQs for Google FAQPage Schema
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

// Get static MDX posts from filesystem
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    return [];
  }

  const fileNames = fs.readdirSync(BLOG_DIRECTORY);
  const mdxFiles = fileNames.filter((fileName) => fileName.endsWith('.mdx'));

  const posts = mdxFiles
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      return getPostBySlug(slug);
    })
    .filter((post): post is BlogPost => post !== null);

  // Sort descending by date
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);
    const faqs = extractFaqsFromContent(content);

    return {
      slug,
      title: data.title || 'Untitled Post',
      description: data.description || '',
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime: stats.text,
      content,
      tool: data.tool || null,
      image: data.image || DEFAULT_POST_IMAGES[slug] || '/blog/pdf-compression.jpg',
      faqs,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
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
