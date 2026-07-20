import { useEffect, useState, useRef } from "react";
import beforeImage from "../assets/Before.png";
import afterImage from "../assets/After.png";
import heroImage from "../assets/hero-bg.png";
import { Link } from "react-router-dom";
import {
  ArrowRight, Leaf, ShieldCheck, Truck, Heart, Sparkles,
  Star, ChevronDown, Check,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import api from '../lib/api';
import type { Product, Category } from '../types';
import ProductGrid from '../components/ProductGrid';
import { SKIN_TYPE_LABELS } from '../types';

interface ProductWithImage extends Omit<Product, 'product_images'> {
  primary_image?: string;
  product_images?: { image_url: string; is_primary: boolean }[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const heroReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay: 0.25 + i * 0.14,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const particles = [
  { top: '18%', left: '12%', size: 3, delay: 0 },
  { top: '28%', left: '72%', size: 2, delay: 1.2 },
  { top: '62%', left: '18%', size: 2.5, delay: 0.6 },
  { top: '48%', left: '88%', size: 2, delay: 1.8 },
  { top: '78%', left: '42%', size: 3, delay: 0.3 },
  { top: '22%', left: '48%', size: 1.5, delay: 2.1 },
  { top: '70%', left: '78%', size: 2, delay: 0.9 },
];

const testimonials = [
  { name: 'Nour A.', text: 'My skin feels softer and brighter after two weeks. The texture of every product feels refined.', rating: 5 },
  { name: 'Sara M.', text: 'Finally a routine that feels gentle and effective. Packaging is beautiful and shipping was fast.', rating: 5 },
  { name: 'Hana K.', text: 'I found the perfect match for my combination skin. Everything looks and feels premium.', rating: 5 },
];

const whyUs = [
  { icon: Leaf, title: 'Clean Formulas', desc: 'Thoughtfully chosen ingredients for everyday glow.' },
  { icon: ShieldCheck, title: 'Skin-Safe Care', desc: 'Formulated with care for sensitive routines.' },
  { icon: Heart, title: 'Made with Love', desc: 'Each product is curated for real results.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Delivered carefully across Egypt.' },
];

export default function Home() {
  const [popular, setPopular] = useState<ProductWithImage[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductWithImage[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductWithImage[]>([]);
  const [offers, setOffers] = useState<ProductWithImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.03, 1.12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => {
    (async () => {
      try {
        const [popRes, newRes, bestRes, offRes, catRes] = await Promise.all([
          api.get('/products/section/popular'),
          api.get('/products/section/new'),
          api.get('/products/section/bestseller'),
          api.get('/products/section/offers'),
          api.get('/categories'),
        ]);
        setPopular(popRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
        setBestSellers(bestRes.data.products || []);
        setOffers(offRes.data.products || []);
        setCategories(catRes.data.categories || []);
      } catch {
        // ignore
      }
      setLoading(false);
    })();
  }, []);

  const mapProduct = (p: ProductWithImage) => ({
    ...p,
    product_images: p.primary_image ? [{ image_url: p.primary_image, is_primary: true }] : [],
  });

  const skinTypes = Object.entries(SKIN_TYPE_LABELS);

  const galleryImages = [
    ...bestSellers,
    ...newArrivals,
    ...popular,
  ]
    .map((p) => p.primary_image)
    .filter(Boolean)
    .slice(0, 6) as string[];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="overflow-x-hidden">
      {/* Full-bleed luxury hero */}
      <section
        ref={heroRef}
        className="relative w-screen left-1/2 -translate-x-1/2 h-[100svh] min-h-[640px] md:h-screen md:min-h-[700px] overflow-hidden bg-[#1a1a1a]"
      >
        {/* Cinematic image layer */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ y: imageY, scale: imageScale }}
        >
          <img
            src={heroImage}
            alt="Editorial skincare model applying cream"
            className="absolute inset-0 w-full h-full object-cover object-[72%_center] sm:object-[66%_center] md:object-[center_18%] scale-[1.02] md:scale-105"
            loading="eager"
            fetchPriority="high"
          />
          {/* Soft background blur veil (edges / depth) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backdropFilter: 'blur(0px)',
              background:
                'radial-gradient(ellipse 70% 60% at 70% 40%, transparent 0%, transparent 45%, rgba(20,18,16,0.15) 100%)',
            }}
          />
        </motion.div>

        {/* Dark elegant overlay ~25% */}
        <div className="absolute inset-0 bg-[#1a1514]/[0.28] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(18,16,15,0.62) 0%, rgba(18,16,15,0.38) 38%, rgba(18,16,15,0.12) 68%, rgba(18,16,15,0.22) 100%)',
          }}
        />
        {/* Soft vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(10,8,8,0.45) 100%)',
          }}
        />
        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.22] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white/40 pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -18, 0],
              opacity: [0.15, 0.55, 0.15],
            }}
            transition={{
              duration: 5.5 + i * 0.4,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Left editorial copy */}
        <motion.div
          className="relative z-10 h-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center"
          style={{ opacity: contentOpacity }}
        >
          <div className="w-full max-w-xl pt-16 sm:pt-5">
            <motion.p
              custom={0}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="font-serif text-[#F5D6DE] text-base sm:text-lg md:text-xl tracking-[0.22em] uppercase mb-5 sm:mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
            >
              RiWebs
            </motion.p>

            <motion.h1
              custom={1}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="font-serif text-[2.75rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-light text-white tracking-tight mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]"
            >
              Healthy Skin Starts Here
            </motion.h1>

            <motion.p
              custom={2}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="text-white/85 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-md mb-9 sm:mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
            >
              Discover skincare designed to make your skin glow every day.
            </motion.p>

            <motion.div
              custom={3}
              variants={heroReveal}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-3.5 sm:gap-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/products"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-[#2B2B2B] bg-[#F2C4CF] hover:bg-[#EBB5C3] transition-colors duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/categories"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium text-white border border-white/45 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/70 transition-all duration-300"
                >
                  Explore Collection
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#featured-categories"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] font-light">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </motion.a>
      </section>

      {/* Featured Categories */}
      <section id="featured-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-10">
            <h2 className="section-title">Featured Categories</h2>
            <p className="text-nude-500 mt-2">Explore our product ranges</p>
          </motion.div>
          {categories.length > 0 ? (
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-nude-200 p-6 text-center shadow-soft hover:shadow-premium transition-all duration-300"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blush-100 to-beige-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Sparkles className="w-6 h-6 text-blush-500" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-nude-800 group-hover:text-blush-500 transition-colors">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </motion.div>
          ) : !loading && (
            <p className="text-center text-nude-400">Categories coming soon.</p>
          )}
        </motion.div>
      </section>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-nude-200 border-t-blush-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {bestSellers.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="section-title">Best Sellers</h2>
                <Link to="/products?filter=bestseller" className="text-sm text-blush-500 hover:text-blush-600 flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <ProductGrid products={bestSellers.map(mapProduct)} />
            </section>
          )}

          {offers.length > 0 && (
            <section className="bg-gradient-to-r from-blush-50 to-beige-100 py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="section-title">Special Offers</h2>
                  <Link to="/products?filter=offers" className="text-sm text-blush-500 hover:text-blush-600 flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <ProductGrid products={offers.map(mapProduct)} />
              </div>
            </section>
          )}
        </>
      )}

      {/* Why Choose Us */}
      <section className="bg-white border-y border-nude-200 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="text-nude-500 mt-2">Care that feels personal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="text-center px-4"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blush-50 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-blush-500" />
                </div>
                <h3 className="font-serif text-xl text-nude-800 mb-2">{item.title}</h3>
                <p className="text-sm text-nude-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="section-title">Before & After</h2>
          <p className="text-nude-500 mt-2">Real glow, real confidence</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-soft border border-nude-200">
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-4 left-4 glass px-4 py-1.5 rounded-full text-sm font-medium text-nude-800">
              Before
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-premium border border-nude-200">
            <img
              src={afterImage}
              alt="After"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <span className="absolute bottom-4 left-4 glass px-4 py-1.5 rounded-full text-sm font-medium text-blush-600">
              After
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}