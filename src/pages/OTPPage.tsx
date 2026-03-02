import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { verifyOtp } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OTPPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useAuth();

  const email = location.state?.email;

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      setToken(res.data.access_token);
      toast.success('Login successful');
      navigate('/dashboard', { replace: true });
    } catch {
      toast.error('Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#457e7f]">Verify OTP</h1>
          <p className="text-gray-500 mt-2">
            Enter the 6-digit code sent to <br />
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#457e7f] focus:border-transparent"
              placeholder="000000"
            />
          </div>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#457e7f] text-white py-2.5 rounded-lg font-medium hover:bg-[#3a6b6c] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
