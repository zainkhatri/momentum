'use client';

import React from 'react';
import { WalletConnectionProvider } from '../contexts/WalletConnectionProvider';

interface JournalLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}