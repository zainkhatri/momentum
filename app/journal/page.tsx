'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { serialize } from 'borsh';
import { JournalEntry, JournalEntrySchema } from '../../models/JournalEntry';
import { hashContent } from '../../utils/hashContent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletConnectionProvider } from '../../contexts/WalletConnectionProvider';

// Dynamic import of WalletMultiButton
const DynamicWalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

export default function JournalPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [content, setContent] = useState('');
  const [programId, setProgramId] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PROGRAM_ID) {
      setProgramId(new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.connected) {
      toast.error('Please connect your wallet.');
      return;
    }

    if (!programId) {
      toast.error('Program ID is not set.');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter some content for your journal entry.');
      return;
    }

    try {
      const contentHash = await hashContent(content);

      const journalEntry = new JournalEntry({ content_hash: contentHash });
      const instructionData = Buffer.from(
        serialize(JournalEntrySchema, journalEntry)
      );

      const instruction = new TransactionInstruction({
        keys: [{ pubkey: wallet.publicKey!, isSigner: true, isWritable: false }],
        programId,
        data: instructionData,
      });

      const transaction = new Transaction().add(instruction);

      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      toast.success('Journal entry submitted successfully!');
      setContent(''); // Clear the textarea after submission
    } catch (error) {
      console.error(error);
      toast.error('Transaction failed!');
    }
  };

  return (
    <WalletConnectionProvider>
      <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4 text-black">Submit Your Journal Entry</h1>
        <DynamicWalletMultiButton className="mb-4" />
        <p className="text-center mb-4 max-w-md text-black">
          Your journal entries are securely stored on the blockchain using your
          wallet's public key. Only you can access them.
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <label htmlFor="journal-entry" className="block mb-2 font-semibold text-black">
            Journal Entry
          </label>
          <textarea
            id="journal-entry"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day..."
            className="w-full p-2 border rounded mb-4 text-black"
            rows={6}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Submit Journal Entry
          </button>
        </form>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </WalletConnectionProvider>
  );
}
