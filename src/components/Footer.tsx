import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

function LogoMark() {
  return (
    <img
      src="/logo.jpg"
      alt="RiWebs Logo"
      className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
    />
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#2B1833] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <LogoMark />

              <span className="font-serif text-xl font-semibold text-white">
                RiWebs
              </span>
            </Link>

            <p className="text-sm text-white/75 leading-relaxed">
              Skincare designed to make your skin glow every day.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-[#E8A0B5]">
              Quick Links
            </h4>

            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/products"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-[#E8A0B5]">
              Account
            </h4>

            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link
                  to="/login"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  Sign In
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="hover:text-[#E8A0B5] transition-colors"
                >
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-4 text-[#E8A0B5]">
              Get in Touch
            </h4>

            <ul className="space-y-3 text-sm text-white">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E8A0B5]" />
                <span>+20 100 000 0000</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E8A0B5]" />
                <span>hello@rihamsbeauty.com</span>
              </li>

              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E8A0B5]" />
                <span>Cairo, Egypt</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/reel/Da_qd_Gqlbw/?igsh=OHZzOW9uNjNqcDhh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RiWebs Instagram"
                className="w-9 h-9 rounded-full bg-[#43264F] hover:bg-[#C96F8B] flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 mt-12 pt-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} RiWebs. All rights reserved.
            </p>

            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#E8A0B5] to-transparent" />

            <p className="text-sm text-white/80">
              Developed with{' '}
              <span className="text-[#E8A0B5]">❤</span> by{' '}
              <a
                href="https://www.linkedin.com/in/riham-gamal-1b4ab5312"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-[#E8A0B5] transition-colors duration-300"
              >
                RiWebs
              </a>
            </p>

            <p className="text-xs text-white/55 max-w-xl leading-relaxed">
              This website was designed and developed as a Full Stack portfolio
              project to demonstrate modern web development skills using React,
              TypeScript, Node.js, Express.js, MySQL, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}