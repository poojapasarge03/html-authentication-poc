import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    setError('');
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 animate-fade-in">

      {/* Background blobs — behind everything via -z-10 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-slide-up">

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Reset Password</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Enter and confirm your new password.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 animate-slide-down">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-stagger">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">New Password</label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-green-700 active:scale-95 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Resetting...
              </span>
            ) : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
