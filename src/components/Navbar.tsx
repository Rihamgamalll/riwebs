import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Search,
  LogOut,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function LogoMark() {
  return (
    <img
      src="/logo.jpg"
      alt="RiWebs Logo"
      className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md"
    />
  );
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';
  const transparentMode = isHomePage && !isScrolled && !mobileOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  const desktopTextClass = transparentMode
    ? 'text-white hover:text-blush-200'
    : 'text-nude-800 hover:text-blush-500';

  const desktopIconClass = transparentMode
    ? 'text-white'
    : 'text-nude-800';

  const desktopHoverClass = transparentMode
    ? 'hover:bg-white/10'
    : 'hover:bg-blush-50';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparentMode
            ? 'bg-transparent border-b border-transparent shadow-none'
            : 'bg-white/90 backdrop-blur-xl border-b border-nude-200/80 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-2.5 group">
              <LogoMark />

              <span
            className={`font-serif text-2xl font-semibold tracking-wide transition-colors duration-300 ${
             transparentMode
            ? 'text-white group-hover:text-blush-200'
            : 'text-nude-800 group-hover:text-blush-500'
            }`}
           >
            RiWebs
            </span>
              
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors relative group ${desktopTextClass}`}
                >
                  {link.label}

                  <span
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                      transparentMode ? 'bg-white' : 'bg-blush-400'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className={`w-48 lg:w-64 px-4 py-2 pl-10 rounded-full text-sm focus:outline-none transition-all duration-300 ${
                    transparentMode
                      ? 'bg-black/15 border border-white/30 text-white placeholder:text-white/65 focus:border-white/70 backdrop-blur-md'
                      : 'bg-white border border-nude-200 text-nude-800 placeholder:text-nude-400 focus:border-blush-300'
                  }`}
                />

                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                    transparentMode ? 'text-white/80' : 'text-nude-400'
                  }`}
                />
              </div>
            </form>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`p-2 rounded-full transition-colors ${desktopHoverClass}`}
                    aria-label="Open account menu"
                  >
                    <User className={`w-5 h-5 ${desktopIconClass}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium border border-nude-200 py-2 z-50 animate-scale-in">
                        <div className="px-4 py-2 border-b border-nude-200">
                          <p className="text-sm font-medium text-nude-800">
                            {user?.full_name || 'Account'}
                          </p>

                          <p className="text-xs text-nude-400">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-nude-700 hover:bg-blush-50"
                        >
                          <User className="w-4 h-4" />
                          My Account
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-nude-700 hover:bg-blush-50"
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>

                        <Link
                          to="/favorites"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-nude-700 hover:bg-blush-50"
                        >
                          <Heart className="w-4 h-4" />
                          Favorites
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-blush-600 hover:bg-blush-50"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-nude-700 hover:bg-blush-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`hidden md:block p-2 rounded-full transition-colors ${desktopHoverClass}`}
                  aria-label="Sign in"
                >
                  <User className={`w-5 h-5 ${desktopIconClass}`} />
                </Link>
              )}

              <Link
                to="/favorites"
                className={`p-2 rounded-full transition-colors relative ${desktopHoverClass}`}
                aria-label="Favorites"
              >
                <Heart className={`w-5 h-5 ${desktopIconClass}`} />
              </Link>

              <Link
                to="/cart"
                className={`p-2 rounded-full transition-colors relative ${desktopHoverClass}`}
                aria-label="Shopping cart"
              >
                <ShoppingBag className={`w-5 h-5 ${desktopIconClass}`} />

                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blush-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-full transition-colors ${desktopHoverClass}`}
                aria-label="Toggle mobile menu"
              >
                {mobileOpen ? (
                  <X className={`w-5 h-5 ${desktopIconClass}`} />
                ) : (
                  <Menu className={`w-5 h-5 ${desktopIconClass}`} />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-nude-200 animate-fade-in shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 rounded-full text-sm bg-white border border-nude-200 text-nude-800 placeholder:text-nude-400 focus:border-blush-300 focus:outline-none"
                />

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nude-400" />
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-nude-700 hover:text-blush-500"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-base font-medium text-nude-700"
                  >
                    My Account
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-base font-medium text-nude-700"
                  >
                    My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-base font-medium text-blush-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="block py-2 text-base font-medium text-nude-700 w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-base font-medium text-nude-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}