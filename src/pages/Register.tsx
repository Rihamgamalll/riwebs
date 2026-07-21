import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((currentForm) => ({
      ...currentForm,
      [e.target.name]: e.target.value,
    }));
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

    const { error } = await signUp(
      form.email,
      form.password,
      form.fullName,
      form.phone,
    );

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    navigate('/account');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blush-50/80 to-nude-50 px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto w-full max-w-lg"
      >
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="mb-5 inline-flex items-center justify-center gap-3"
          >
            <img
              src="/logo.png"
              alt="RiWebs"
              className="h-12 w-12 rounded-full object-contain shadow-soft"
            />

            <span className="font-serif text-2xl font-semibold text-nude-800">
              RiWebs
            </span>
          </Link>

          <h1 className="font-serif text-3xl font-light text-nude-800 sm:text-4xl">
            Create Account
          </h1>

          <p className="mt-2 text-nude-500">
            Join the RiWebs Beauty family
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-nude-200 bg-white p-6 shadow-soft sm:p-8"
        >
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm text-nude-600"
            >
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />

              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
                className="input-field pl-10"
                placeholder="RiWebs"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-nude-600"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm text-nude-600"
            >
              Phone
            </label>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />

              <input
                id="phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="input-field pl-10"
                placeholder="01000000000"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm text-nude-600"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />

              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-sm text-nude-600"
            >
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-nude-400" />

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="input-field pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-nude-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blush-500 transition-colors hover:text-blush-600"
            >
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </main>
  );
}