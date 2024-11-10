'use client';

import React, { useMemo, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import type { Adapter } from '@solana/wallet-adapter-base';
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletConnectionProviderProps {
  children: ReactNode;
}

export const WalletConnectionProvider: React.FC<WalletConnectionProviderProps> = ({ children }) => {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "https://api.devnet.solana.com";
  
  const wallets = useMemo<Adapter[]>(
    () => [new PhantomWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletConnectionProvider;