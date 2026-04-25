"use client";
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { Menu, X } from "lucide-react";
import { useEffect, useState } from 'react'
import { authApis } from '@/utils/api/api';
import { useAppStore } from '@/utils/store/store';

const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", href: "/home" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" }
  ];
  const { isLoggedin, setLoggedIn } = useAppStore();

  const verifyUser = async () => {
    try {
      const response = await authApis.verify();
      if (response?.data.authenticated) {
        setLoggedIn(true);
      }
    } catch (error) {
      // User is not authenticated or token expired - swallow the 401
      setLoggedIn(false);
    }
  }

  useEffect(() => {
    verifyUser()
  }, [])

  return (
    <header className="fixed top-0 w-full z-50">
      <div className="w-full bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
        <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 2xl:gap-3 bg-brand-600 text-white rounded-2xl px-5 py-2.5 shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 hover:-translate-y-0.5 transition-all duration-300 group">
            <Leaf className="w-5 h-5 xl:w-6 xl:h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-outfit text-lg xl:text-xl font-bold tracking-wide">PlantScan</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative font-medium text-[15px] transition-all duration-300 px-4 py-2 rounded-xl ${isActive
                      ? "text-brand-700 bg-brand-50/80 shadow-sm border border-brand-100/50"
                      : "text-gray-600 hover:text-brand-700 hover:bg-gray-50 border border-transparent"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          {!isLoggedin ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/signin"
                className="text-[15px] font-semibold text-gray-700 hover:text-brand-700 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-brand-600 text-white rounded-xl px-6 py-2.5 text-[15px] font-semibold hover:bg-brand-700 hover:shadow-[0_8px_20px_-6px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 transition-all duration-300 border border-brand-500"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center justify-center px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 hover:shadow-[0_8px_20px_-6px_rgba(22,163,74,0.4)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Dashboard
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2.5 text-brand-800 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-300 ease-out md:hidden z-50 ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2 text-brand-700">
              <Leaf size={24} />
              <span className="font-outfit text-xl font-bold tracking-wide">PlantScan</span>
            </div>
            <button
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="px-6 py-8 space-y-2 flex-1 overflow-y-auto">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-[15px] transition-all duration-200 ${isActive
                      ? "bg-brand-50 text-brand-700 font-bold border border-brand-100/50"
                      : "text-gray-600 font-medium hover:bg-gray-50 hover:text-brand-600"
                    }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Footer Actions */}
          <div className="px-6 py-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
            {!isLoggedin ? (
              <>
                <Link
                  href="/signin"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-[15px] font-semibold text-gray-700 hover:border-gray-300 hover:bg-white transition-all duration-200"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center justify-center w-full px-4 py-3 bg-brand-600 text-white rounded-xl text-[15px] font-semibold hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30 transition-all duration-200"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="flex items-center justify-center w-full px-4 py-3 bg-brand-600 text-white rounded-xl text-[15px] font-semibold hover:bg-brand-700 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar

function Leaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c4-8 12-8 20-8-4 8-4 16-12 16-4 0-8-4-8-8z" />
      <path d="M2 22c4-4 8-8 12-12" />
    </svg>
  );
}