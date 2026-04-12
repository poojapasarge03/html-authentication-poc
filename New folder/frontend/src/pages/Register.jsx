import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(msg);
      console.error('Register error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 animate-slide-up">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-scale-in">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Create Account</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Join us today</p>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 animate-slide-down border border-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-stagger">
          {[
            { field: 'name', type: 'text', placeholder: 'Full Name', required: true },
            { field: 'email', type: 'email', placeholder: 'Email', required: true },
            { field: 'phone', type: 'tel', placeholder: 'Phone (optional)', required: false },
            { field: 'password', type: 'password', placeholder: 'Password', required: true },
          ].map(({ field, type, placeholder, required }) => (
            <input
              key={field} type={type} placeholder={placeholder} required={required}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              value={form[field]} onChange={set(field)}
            />
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 active:scale-95 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account...
              </span>
            ) : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
