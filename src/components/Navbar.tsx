/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, User, HeartHandshake, ShieldCheck, LogOut, LayoutDashboard, Calculator } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Calculator', path: '/calculator' },
    { name: 'Donate', path: '/donate' },
    { name: 'Cases', path: '/cases' },
    { name: 'History', path: '/history' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#F0EBE6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Orange circle with stylized white crescent/heart logo */}
            <div className="w-10 h-10 rounded-full bg-[#F0440A] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tighter">SZ</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1615]">
              Smart Zakat
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`text-[15px] font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#F0440A] font-semibold'
                      : 'text-[#4A4543] hover:text-[#1A1615]'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F0440A] rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action: Sign In or User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[#E8E2DD] hover:border-[#F0440A] bg-white text-sm font-medium text-[#1A1615] transition-all shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#FFF0E8] text-[#F0440A] flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <span>Assalamu Alaikum, {user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#F0EBE6] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#F5EFEA]">
                      <p className="text-xs text-[#807975]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#1A1615] truncate">{user.email || user.phone}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3E3835] hover:bg-[#FFF8F4] hover:text-[#F0440A]"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Donor Dashboard
                    </Link>
                    <Link
                      to="/calculator"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3E3835] hover:bg-[#FFF8F4] hover:text-[#F0440A]"
                    >
                      <Calculator className="w-4 h-4" />
                      Zakat Calculator
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3E3835] hover:bg-[#FFF8F4] hover:text-[#F0440A]"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      Giving History & Auto-Pay
                    </Link>
                    <div className="border-t border-[#F5EFEA] my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#F0440A] text-white font-medium text-sm hover:bg-[#D63A07] shadow-sm transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}

            {user.isLoggedIn && (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#F0440A] text-white font-medium text-sm hover:bg-[#D63A07] shadow-sm transition-all"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#3E3835] hover:bg-[#FFF0E8] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F0EBE6] bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-[#FFF0E8] text-[#F0440A]'
                  : 'text-[#3E3835] hover:bg-gray-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#F0EBE6] space-y-2">
            {user.isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-5 py-3 rounded-full bg-[#F0440A] text-white font-medium"
                >
                  Go to Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-5 py-3 rounded-full bg-[#F0440A] text-white font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
