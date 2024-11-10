'use client';

import React from 'react';
import { WalletConnectionProvider } from '../../contexts/WalletConnectionProvider';

interface JournalLayoutProps {
  children: React.ReactNode;
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return (
    <WalletConnectionProvider>{children}</WalletConnectionProvider>
  );
}