import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createFaq, getFaq, updateFaq } from '../api/faqs';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FAQFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getFaq(Number(id))
        .then((res) => {
          setQuestion(res.data.question);
          setAnswer(res.data.answer);
          setSortOrder(res.data.sort_order);
          setIsActive(res.data.is_active);
        })
        .catch(() => {
          toast.error('FAQ not found');
          navigate('/faqs');
        });
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateFaq(Number(id), { question, answer, sort_order: sortOrder, is_active: isActive });
        toast.success('FAQ updated');
      } else {
        await createFaq({ question, answer, sort_order: sortOrder });
        toast.success('FAQ created');
      }
      navigate('/faqs');
    } catch {
      toast.error(isEdit ? 'Failed to update FAQ' : 'Failed to create FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/faqs')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to FAQs
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit FAQ' : 'Create New FAQ'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457e7f] focus:border-transparent"
            placeholder="Enter the question"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457e7f] focus:border-transparent"
            placeholder="Enter the answer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#457e7f] focus:border-transparent"
          />
        </div>

        {isEdit && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#457e7f] focus:ring-[#457e7f]"
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Active
            </label>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/faqs')}
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#457e7f] text-white rounded-lg font-medium hover:bg-[#3a6b6c] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
          </button>
        </div>
      </form>
    </div>
  );
}
