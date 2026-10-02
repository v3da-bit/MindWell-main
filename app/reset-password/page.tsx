'use client';

import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ResetPasswordForm from '@/app/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient( circle farthest-corner at 10% 20%,  rgba(83,113,245,0.6) 0%, rgba(107,228,184,0.4) 72.3% )',
        }}
      />
      <Navbar />
      <div className="pt-20">
        <ResetPasswordForm />
      </div>
      <Footer />
    </div>
  );
}
