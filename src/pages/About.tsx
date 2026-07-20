import {
  Sparkles,
  Leaf,
  Heart,
  Award,
  Users,
  ShieldCheck,
  Truck,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: 'Clean Ingredients',
      desc: 'We use only safe, natural, and effective ingredients in every formula.',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      desc: 'Every product is crafted with care for your skin and wellbeing.',
    },
    {
      icon: Award,
      title: 'Quality First',
      desc: 'Dermatologist-tested and proven to deliver real results.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      desc: 'Your satisfaction is our priority. We listen and we care.',
    },
  ];

  const stats = [
    { value: '15K+', label: 'Happy Customers' },
    { value: '150+', label: 'Products' },
    { value: '98%', label: 'Positive Reviews' },
    { value: '5+', label: 'Years Experience' },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Dermatologist Tested',
    },
    {
      icon: CheckCircle,
      title: 'Premium Ingredients',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
    },
    {
      icon: Heart,
      title: 'Cruelty Free',
    },
  ];

  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-nude-100 via-blush-50 to-beige-100 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur mb-6">
            <Sparkles className="w-4 h-4 text-blush-500" />
            <span className="text-sm font-medium text-nude-700">
              Our Story
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-light text-nude-900 mb-6 leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-blush-500 to-beige-500 bg-clip-text text-transparent font-semibold">
              Riham's Beauty
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-9 text-nude-600">
            Riham's Beauty was born from a simple belief: that everyone deserves
            healthy, radiant skin. We create premium skincare products with
            carefully selected ingredients designed to nourish, protect, and
            reveal your natural beauty.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="btn-primary"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="rounded-full border border-blush-300 px-7 py-3 font-medium text-blush-600 transition hover:bg-blush-50"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="text-center mb-14">
          <h2 className="section-title">
            Our Values
          </h2>

          <p className="text-nude-500 mt-3">
            What drives us every day
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">

          {values.map((value, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-nude-200 bg-white p-8 text-center shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blush-50 transition group-hover:scale-110">
                <value.icon className="h-8 w-8 text-blush-500" />
              </div>

              <h3 className="font-serif text-xl text-nude-900 mb-3">
                {value.title}
              </h3>

              <p className="text-sm leading-7 text-nude-500">
                {value.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}

      <section className="bg-blush-50 py-16">

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">

          {stats.map((item) => (

            <div key={item.label}>

              <h3 className="font-serif text-5xl text-blush-500 mb-2">
                {item.value}
              </h3>

              <p className="text-nude-600">
                {item.label}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Mission */}

      <section className="py-20">

        <div className="max-w-3xl mx-auto px-4 text-center">

          <h2 className="section-title mb-6">
            Our Mission
          </h2>

          <p className="text-lg leading-9 text-nude-600">
            To empower every person to feel confident in their own skin. We
            believe skincare is self-care, and our products are designed to
            make your daily routine a moment of joy and self-love.
          </p>

        </div>

      </section>

      {/* Why Choose Us */}

      <section className="bg-nude-100 py-20">

        <div className="max-w-6xl mx-auto px-4">

          <div className="text-center mb-12">

            <h2 className="section-title">
              Why Choose Us
            </h2>

            <p className="text-nude-500 mt-3">
              Everything your skin deserves
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (

              <div
                key={feature.title}
                className="rounded-2xl bg-white p-7 text-center shadow-soft"
              >
                <feature.icon className="mx-auto mb-4 h-9 w-9 text-blush-500" />

                <p className="font-medium text-nude-800">
                  {feature.title}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24">

        <div className="max-w-3xl mx-auto px-4 text-center">

          <h2 className="font-serif text-4xl text-nude-900 mb-5">
            Ready to Start Your Skincare Journey?
          </h2>

          <p className="text-lg text-nude-500 mb-8">
            Discover our collection of premium skincare products made with love
            and care.
          </p>

          <Link
            to="/products"
            className="btn-primary"
          >
            Shop Now
          </Link>

        </div>

      </section>

    </div>
  );
}