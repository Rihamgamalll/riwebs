import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const result = await signIn(email.trim(), password);

      if (result.error) {
        setError(result.error);
        return;
      }

      navigate('/account');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-blush-50/70 via-white to-nude-50">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl items-start justify-center px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
          className="w-full max-w-[490px]"
        >
          {/* Page heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-blush-400" />

            <h1 className="font-serif text-3xl font-light tracking-tight text-nude-900 sm:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-nude-500 sm:text-base">
              Sign in to your account
            </p>
          </div>

          {/* Login form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-nude-200/80 bg-white p-6 shadow-soft sm:p-8"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-medium text-nude-700"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nude-400"
                />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="you@example.com"
                  className="h-14 w-full rounded-xl border border-nude-200 bg-nude-50/50 py-3 pl-12 pr-4 text-nude-900 outline-none transition placeholder:text-nude-400 focus:border-blush-400 focus:bg-white focus:ring-4 focus:ring-blush-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-medium text-nude-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nude-400"
                />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                  className="h-14 w-full rounded-xl border border-nude-200 bg-nude-50/50 py-3 pl-12 pr-12 text-nude-900 outline-none transition placeholder:text-nude-400 focus:border-blush-400 focus:bg-white focus:ring-4 focus:ring-blush-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-400 transition hover:text-nude-700 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-blush-400 px-6 font-medium text-white transition hover:bg-blush-500 focus:outline-none focus:ring-4 focus:ring-blush-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Register link */}
            <p className="pt-1 text-center text-sm text-nude-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-blush-500 transition hover:text-blush-600 hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}