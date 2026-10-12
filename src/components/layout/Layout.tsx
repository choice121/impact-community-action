import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileDonateBar } from './MobileDonateBar';
import { CookieConsent } from '../common/CookieConsent';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-slate-950 text-[#1B1F2A] dark:text-slate-100 transition-colors duration-200">
      <Header />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <Footer />
      <MobileDonateBar />
      <CookieConsent />
    </div>
  );
};
