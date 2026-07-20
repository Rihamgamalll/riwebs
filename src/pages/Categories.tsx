import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import api from '../lib/api';
import type { Category } from '../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data.categories || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-nude-200 border-t-blush-400" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-20 sm:px-6 lg:px-8">

      {/* Header */}

      <div className="mb-14 text-center">

        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blush-50 px-4 py-2">
          <Sparkles className="h-4 w-4 text-blush-500" />
          <span className="text-sm font-medium text-blush-600">
            Categories
          </span>
        </div>

        <h1 className="mb-4 font-serif text-4xl font-light text-nude-900 md:text-5xl">
          Shop by Category
        </h1>

        <p className="mx-auto max-w-xl text-lg text-nude-500">
          Find exactly what your skin needs
        </p>

      </div>

      {/* Categories */}

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

        {categories.map((cat) => (

          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-nude-200 bg-gradient-to-br from-nude-100 to-blush-50 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
          >

            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur transition-transform duration-500 group-hover:scale-110">
                <Sparkles className="h-7 w-7 text-blush-500" />
              </div>

              <h3 className="mb-2 font-serif text-3xl text-nude-900 transition-colors duration-300 group-hover:text-blush-500">
                {cat.name}
              </h3>

              {cat.description && (
                <p className="max-w-xs text-center text-base leading-7 text-nude-500">
                  {cat.description}
                </p>
              )}

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}