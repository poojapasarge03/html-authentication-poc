import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Forgot Password</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Enter your email to receive a reset link.</p>

        {message && (
          <p className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-4 animate-slide-down border border-green-100">
            ✓ {message}
          </p>
        )}
        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 animate-slide-down border border-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-stagger">
          <input
            type="email" placeholder="Email" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Sending...
              </span>
            ) : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="text-blue-600 font-medium hover:underline transition-colors">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
