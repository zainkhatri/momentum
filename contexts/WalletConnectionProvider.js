'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

// Dynamic import of WalletModalProvider
const DynamicWalletModalProvider = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletModalProvider
    ),
  { ssr: false }
);

export const WalletConnectionProvider = ({ children }) => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

  const endpoint = useMemo(
    () =>
      process.env.NEXT_PUBLIC_SOLANA_RPC_HOST ||
      'https://api.devnet.solana.com',
    [network]
  );

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <DynamicWalletModalProvider>{children}</DynamicWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
