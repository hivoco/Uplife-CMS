import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBlogs, deleteBlog } from '../api/blogs';
import type { BlogListItem, PaginatedResponse } from '../types';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogsPage() {
  const [data, setData] = useState<PaginatedResponse<BlogListItem> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchBlogs = (p: number) => {
    setLoading(true);
    getBlogs(p)
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlog(deleteId);
      toast.success('Blog deleted');
      fetchBlogs(page);
    } catch {
      toast.error('Failed to delete blog');
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blogs</h2>
        <button
          onClick={() => navigate('/blogs/new')}
          className="flex items-center gap-2 bg-[#457e7f] text-white px-4 py-2 rounded-lg hover:bg-[#3a6b6c] transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add Blog
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No blogs found</td>
                </tr>
              ) : (
                data?.items.map((b, i) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(page - 1) * (data?.per_page || 10) + i + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {b.image_url && (
                          <img src={b.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                        )}
                        <span className="text-sm font-medium text-gray-800">{b.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          b.is_published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {b.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(b.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/blogs/${b.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(b.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && (
          <div className="p-4 border-t border-gray-100">
            <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Blog</h3>
        <p className="text-gray-500 mb-6">Are you sure you want to delete this blog? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
