'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { BlogPost } from '@/lib/blog';
import { saveBlogPostToFirestore, deleteBlogPostFromFirestore, getFirestorePosts } from '@/lib/blog-client';
import { toast } from 'sonner';
import {
  BookOpen,
  Plus,
  Save,
  Trash2,
  Edit,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Calendar,
  Tag,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminBlogPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    tool: '/pdf/compress',
    content: '',
  });
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('omnitool_admin_session');
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    }
    loadPosts();
  }, [router]);

  const loadPosts = async () => {
    const firestorePosts = await getFirestorePosts();
    setPosts(firestorePosts);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setTagsInput(post.tags.join(', '));
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      slug: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      tool: '/pdf/compress',
      content: '',
    });
    setTagsInput('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.slug || !currentPost.content) {
      toast.error('Please enter Title, Slug, and Content!');
      return;
    }

    const cleanSlug = currentPost.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const postToSave: BlogPost = {
      slug: cleanSlug,
      title: currentPost.title,
      description: currentPost.description || '',
      date: currentPost.date || new Date().toISOString().split('T')[0],
      tags: tagsArray,
      readingTime: `${Math.max(1, Math.ceil(currentPost.content.split(/\s+/).length / 200))} min read`,
      content: currentPost.content,
      tool: currentPost.tool || null,
    };

    try {
      await saveBlogPostToFirestore(postToSave);
      toast.success('Blog post published to live site successfully!');
      setIsEditing(false);
      loadPosts();
    } catch {
      toast.error('Failed to save post to Firebase.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post from live site?')) return;
    try {
      await deleteBlogPostFromFirestore(slug);
      toast.success('Post deleted successfully.');
      loadPosts();
    } catch {
      toast.error('Failed to delete post.');
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">Live Blog & Content Publisher</h1>
              <p className="text-xs text-slate-500 font-medium">Publish, Edit & Manage Live Blog Articles on Hosted Site</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Blog</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Editor Form Modal / Card */}
        {isEditing ? (
          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  {currentPost.slug ? 'Edit Live Blog Post' : 'Publish New Blog Post'}
                </h2>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={currentPost.title || ''}
                    onChange={(e) => {
                      const titleVal = e.target.value;
                      const generatedSlug = titleVal.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
                      setCurrentPost({ ...currentPost, title: titleVal, slug: currentPost.slug || generatedSlug });
                    }}
                    placeholder="e.g. How to Compress PDF Files Online"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 font-bold text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    URL Slug * (e.g. how-to-compress-pdf)
                  </label>
                  <input
                    type="text"
                    value={currentPost.slug || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    placeholder="how-to-compress-pdf"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 font-mono text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  SEO Description / Summary *
                </label>
                <input
                  type="text"
                  value={currentPost.description || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value })}
                  placeholder="Short summary for Google search results and blog listing cards..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={currentPost.date || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="PDF, Guide, Compression, Privacy"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Featured Tool Link CTA
                  </label>
                  <input
                    type="text"
                    value={currentPost.tool || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, tool: e.target.value })}
                    placeholder="/pdf/compress"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-slate-50 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Blog Body Content (Markdown / MDX) *
                </label>
                <textarea
                  rows={14}
                  value={currentPost.content || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  placeholder="Write your article body in Markdown... Use ## for H2 headings, ### for H3 headings, and standard markdown links."
                  className="w-full p-4 rounded-2xl border border-slate-300 bg-slate-900 text-slate-100 font-mono text-xs focus:outline-none focus:border-indigo-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Blog Article to Live Site</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Existing Published Live Blogs Table / Cards */}
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Live Published Blog Posts ({posts.length})</h2>
                <p className="text-xs text-slate-500 font-medium">Manage articles published live to /blog on your hosted domain.</p>
              </div>
            </div>

            <Link
              href="/blog"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View /blog Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <p className="text-sm font-bold">No custom blog posts published via Admin yet.</p>
              <p className="text-xs text-slate-500">Click &quot;Write New Blog&quot; above to publish your first live article instantly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                        {post.date}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">/{post.slug}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 truncate">{post.title}</h3>
                    <p className="text-xs text-slate-500 truncate">{post.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600 transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-rose-600 transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
