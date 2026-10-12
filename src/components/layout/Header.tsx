import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Heart,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  User,
  Shield,
  Apple,
  Home,
  HeartPulse,
  GraduationCap,
  Users,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PILLARS } from '../../demo/demoData';

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Home,
  HeartPulse,
  GraduationCap,
  Users,
  ShieldAlert,
  Award,
};

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF7F2]/90 dark:bg-[#0B2545]/90 shadow-md backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 py-3'
          : 'bg-[#FAF7F2] dark:bg-[#0B2545] border-b border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0B2545] to-[#13A89E] flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5 h-5 fill-current text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#0B2545] dark:text-white leading-none">
                Impact Community Action
              </span>
              <span className="text-[11px] font-sans text-slate-500 dark:text-slate-300 mt-0.5 tracking-wide">
                Small acts. Real impact.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13.5px] font-medium text-slate-700 dark:text-slate-200">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname === '/' ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              Home
            </Link>

            {/* Our Work - Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                  location.pathname.startsWith('/our-work') ? 'text-[#13A89E] font-semibold' : ''
                }`}
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              >
                <span>Our Work</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full -left-20 w-[640px] pt-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                    <div className="col-span-2 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        7 Cause Pillars & Emergency Aid
                      </span>
                      <Link
                        to="/our-work"
                        className="text-xs text-[#13A89E] font-semibold flex items-center gap-1 hover:underline"
                      >
                        All Pillars Overview <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {DEMO_PILLARS.map((pillar) => {
                      const IconComponent = iconMap[pillar.iconName] || Heart;
                      return (
                        <Link
                          key={pillar.id}
                          to={`/our-work/${pillar.slug}`}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white shadow-sm"
                            style={{ backgroundColor: pillar.accentColor }}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs group-hover:text-[#13A89E] transition-colors">
                              {pillar.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              {pillar.tagline}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/projects"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname.startsWith('/projects') ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              Projects
            </Link>

            <Link
              to="/stories"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname.startsWith('/stories') ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              Stories
            </Link>

            <Link
              to="/impact"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname === '/impact' ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              Impact
            </Link>

            <Link
              to="/transparency"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname === '/transparency' ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              Transparency
            </Link>

            <Link
              to="/get-help"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname === '/get-help' ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              Get Help
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-lg transition-colors hover:text-[#13A89E] ${
                location.pathname === '/about' ? 'text-[#13A89E] font-semibold' : ''
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Icons & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Account / Portal / Login */}
            <Link
              to={user ? "/portal" : "/login"}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-[#13A89E] transition-colors rounded-xl"
              title={user ? `Signed in as ${profile?.fullName || user.email}` : "Sign In / Donor Portal"}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user ? "Portal" : "Sign In"}</span>
            </Link>

            {/* Prominent Always-Visible Donate CTA */}
            <Link
              to="/donate"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#0B2545] to-[#13A89E] hover:from-[#13A89E] hover:to-[#0B2545] text-white shadow-md shadow-teal-500/20 hover:shadow-lg transition-all duration-300 transform active:scale-95"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate</span>
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] dark:bg-[#0B2545] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/our-work"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Our Work (7 Pillars)
          </Link>
          <Link
            to="/projects"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Projects
          </Link>
          <Link
            to="/stories"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Success Stories
          </Link>
          <Link
            to="/impact"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Impact & Reports
          </Link>
          <Link
            to="/transparency"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Financial Transparency
          </Link>
          <Link
            to="/get-help"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Get Help (Assistance)
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            About ICA
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-xl font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-slate-800"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
};
