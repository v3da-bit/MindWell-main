'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import UserDropdown from '@/app/components/UserDropdown';
// ...removed theme context import...

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setUser] = useState(null);
  const { scrollY } = useScroll();
  // ...removed theme logic...
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const bgOpacity = useTransform(scrollY, [0, 120], [0.1, 0.6]);
  const bgColor = useTransform(bgOpacity, (o) => `rgba(255,255,255,${o})`);
  const shadow = useTransform(scrollY, [0, 120], [0, 0.2]);
  const boxShadow = useTransform(shadow, (o) => `0 10px 30px rgba(15,23,42,${o})`);

  const navItems = [
    { name: 'AI Support', href: '/ai-support' },
    { name: 'Book Session', href: '/book' },
    { name: 'Resources', href: '/resources' },
    { name: 'Community', href: '/community' },
  ];

  return (
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full z-50 backdrop-blur-lg border-b border-white/20 bg-transparent"
        style={{ backgroundColor: bgColor, boxShadow }}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.location.href = '/#'}
          >
            <Icon icon="line-md:heart-filled" className="text-2xl text-emerald-400" />
            <span className="font-poppins font-semibold text-xl text-slate-800">MindWell</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-700 hover:text-emerald-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            {/* Emergency prominent button */}
            <Link
              href="/emergency"
              className="relative flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:from-rose-700 hover:to-red-700 transition-all"
            >
              <span className="absolute -inset-0.5 rounded-full bg-red-500/30 blur opacity-60" aria-hidden="true" />
              <Icon icon="material-symbols:siren-rounded" className="text-lg" />
              Emergency
            </Link>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/signup"
                  className="bg-emerald-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-emerald-600 transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {pathname !== '' && <UserDropdown />}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-700 hover:text-slate-900 focus:outline-none focus:text-slate-900"
            >
              <Icon icon={isOpen ? "mdi:close" : "mdi:menu"} className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <>
            {/* Backdrop for mobile menu */}
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/90 backdrop-blur-lg rounded-lg mt-2 shadow-xl relative z-50"
            >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-slate-700 hover:text-emerald-600 hover:bg-white/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 flex items-center gap-3">
                <Link href="/emergency" className="flex-1 text-center bg-gradient-to-r from-rose-600 to-red-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:from-rose-700 hover:to-red-700" onClick={() => setIsOpen(false)}>
                  <span className="inline-flex items-center justify-center gap-2"><Icon icon="material-symbols:siren-rounded" className="text-lg"/> Emergency</span>
                </Link>
                {!isAuthenticated ? (
                  <>
                    <Link href="/signup" className="flex-1 text-center bg-emerald-500 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:bg-emerald-600" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard" className="w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:bg-emerald-600" onClick={() => setIsOpen(false)}>
                    Open Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
}
