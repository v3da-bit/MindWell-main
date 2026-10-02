// app/dashboard/layout.tsx
import React from 'react';
import DashboardShell from '@/app/components/DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
