import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../pages/images/logo.png';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact Us', href: '/#contact' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Curelex" className="h-9 w-auto" />
            <span className="text-xl font-bold text-primary">Curelex</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {link.label}
              </a>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={`/${user?.role}/dashboard`}
                  className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-danger transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setLoginDropdown(!loginDropdown)}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                >
                  Login
                </button>
                {loginDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to="/patient/login"
                      onClick={() => setLoginDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-bg-light hover:text-primary transition-colors"
                    >
                      🧑‍💼 Patient Login
                    </Link>
                    <Link
                      to="/doctor/login"
                      onClick={() => setLoginDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-bg-light hover:text-primary transition-colors"
                    >
                      🩺 Doctor Login
                    </Link>
                    <Link
                      to="/admin/login"
                      onClick={() => setLoginDropdown(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-bg-light hover:text-primary transition-colors"
                    >
                      🔑 Admin Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-bg-light hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-2" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={`/${user?.role}/dashboard`}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-primary"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-left text-danger"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/patient/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-bg-light">
                    🧑‍💼 Patient Login
                  </Link>
                  <Link to="/doctor/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-bg-light">
                    🩺 Doctor Login
                  </Link>
                  <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-bg-light">
                    🔑 Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
