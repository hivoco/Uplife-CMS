import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFaqs, deleteFaq } from '../api/faqs';
import type { FAQ } from '../types';
import Modal from '../components/ui/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchFaqs = () => {
    setLoading(true);
    getFaqs()
      .then((res) => setFaqs(res.data))
      .catch(() => toast.error('Failed to load FAQs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFaq(deleteId);
      toast.success('FAQ deleted');
      fetchFaqs();
    } catch {
      toast.error('Failed to delete FAQ');
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">FAQs</h2>
        <button
          onClick={() => navigate('/faqs/new')}
          className="flex items-center gap-2 bg-[#457e7f] text-white px-4 py-2 rounded-lg hover:bg-[#3a6b6c] transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Add FAQ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Question</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Answer</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading...</td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No FAQs found</td>
                </tr>
              ) : (
                faqs.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{f.sort_order}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 max-w-xs truncate">
                      {f.question}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {f.answer}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          f.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {f.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/faqs/${f.id}/edit`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(f.id)}
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
      </div>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete FAQ</h3>
        <p className="text-gray-500 mb-6">Are you sure you want to delete this FAQ?</p>
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
