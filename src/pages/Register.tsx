import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName, form.phone);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      navigate('/account');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-blush-50/80 to-nude-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blush-300 to-blush-500 text-white font-serif font-semibold text-sm tracking-wider shadow-soft">
              RG
            </span>
            <span className="font-serif text-2xl font-semibold text-nude-800">Riham's Beauty</span>
          </Link>
          <h1 className="font-serif text-3xl font-light text-nude-800">Create Account</h1>
          <p className="text-nude-500 mt-2">Join the Riham's Beauty family</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-nude-200 space-y-4">
          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
              <input name="fullName" value={form.fullName} onChange={handleChange} required className="input-field pl-10" placeholder="Sara Ahmed" />
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field pl-10" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field pl-10" placeholder="01000000000" />
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <label className="text-sm text-nude-600 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="input-field pl-10" placeholder="••••••••" />
            </div>
          </div>

          {error && <p className="text-sm text-blush-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-center text-sm text-nude-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blush-500 hover:text-blush-600 font-medium">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
