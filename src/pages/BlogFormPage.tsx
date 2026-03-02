import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlog, getBlog, updateBlog, uploadBlogImage } from '../api/blogs';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Size = Quill.import('attributors/style/size') as any;
Size.whitelist = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];
Quill.register(Size, true);

export default function BlogFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (isEdit) {
      getBlog(Number(id))
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setExcerpt(res.data.excerpt || '');
          setIsPublished(res.data.is_published);
          setCurrentImageUrl(res.data.image_url);
        })
        .catch(() => {
          toast.error('Blog not found');
          navigate('/blogs');
        });
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    formData.append('is_published', String(isPublished));
    if (image) {
      formData.append('image', image);
    }

    try {
      if (isEdit) {
        await updateBlog(Number(id), formData);
        toast.success('Blog updated');
      } else {
        await createBlog(formData);
        toast.success('Blog created');
      }
      navigate('/blogs');
    } catch {
      toast.error(isEdit ? 'Failed to update blog' : 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const res = await uploadBlogImage(file);
        const editor = quillRef.current?.getEditor();
        if (editor) {
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', res.data.url);
          editor.setSelection(range.index + 1);
        }
      } catch {
        toast.error('Failed to upload image');
      }
    };
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  const previewImageUrl = image
    ? URL.createObjectURL(image)
    : currentImageUrl || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to Blogs
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          {showPreview ? 'Hide Preview' : 'Preview'}
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Blog' : 'Create New Blog'}
      </h2>

      {showPreview ? (
        /* ── Blog Preview ── */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {previewImageUrl && (
            <img
              src={previewImageUrl}
              alt=""
              className="w-full h-72 object-cover"
            />
          )}
          <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {title || 'Untitled Blog'}
            </h1>
            {excerpt && (
              <p className="text-gray-500 text-lg mb-6 italic">{excerpt}</p>
            )}
            <hr className="mb-6 border-gray-200" />
            <div
              className="prose prose-lg max-w-none
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-gray-900
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:text-gray-900
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:text-gray-900
                [&_p]:mb-4 [&_p]:text-gray-700 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                [&_li]:mb-1 [&_li]:text-gray-700
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#457e7f] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
                [&_a]:text-[#457e7f] [&_a]:underline
                [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                [&_strong]:font-bold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">No content yet...</p>' }}
            />
          </div>
        </div>
      ) : (
        /* ── Blog Form ── */
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457e7f] focus:border-transparent"
              placeholder="Blog title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457e7f] focus:border-transparent"
              placeholder="Short summary (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            {currentImageUrl && !image && (
              <div className="mb-2">
                <img src={currentImageUrl} alt="" className="h-32 rounded-lg object-cover" />
              </div>
            )}
            {image && (
              <div className="mb-2">
                <img src={URL.createObjectURL(image)} alt="" className="h-32 rounded-lg object-cover" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#457e7f] file:text-white hover:file:bg-[#3a6b6c] file:cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="bg-white rounded-lg [&_.ql-container]:min-h-[300px] [&_.ql-editor]:min-h-[300px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#457e7f] focus:ring-[#457e7f]"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              Publish this blog
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#457e7f] text-white rounded-lg font-medium hover:bg-[#3a6b6c] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
