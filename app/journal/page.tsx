// page.tsx (JournalPage.tsx)

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { hashContent } from '../../utils/hashContent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WalletConnectionProvider } from '../../contexts/WalletConnectionProvider';

// Dynamic import of WalletMultiButton
const DynamicWalletMultiButton = dynamic(
  () =>
    import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

interface JournalEntryType {
  content_hash: string;
  is_public: boolean;
  timestamp: number;
  owner: string;
  upvotes: number;
  downvotes: number;
  address: string; // Added address field
}

export default function JournalPage() {
  const wallet = useWallet();
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    fetchEntries();
  }, [page]);

  const fetchEntries = async () => {
    try {
      const skip = (page - 1) * entriesPerPage;
      const response = await fetch(
        `http://127.0.0.1:8000/journal_entries?skip=${skip}&limit=${entriesPerPage}`
      );
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('Failed to fetch journal entries');
    }
  };

  const handleVote = async (entryId: string, isUpvote: boolean) => {
    if (!wallet.connected) {
      toast.error('Please connect your wallet to vote');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/vote_journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entry_id: entryId,
          is_upvote: isUpvote,
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Vote submitted successfully!');
        fetchEntries(); // Refresh the entries
      } else {
        toast.error(`Failed to submit vote: ${result.detail || result.message}`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to submit vote');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!wallet.connected) {
      toast.error('Please connect your wallet');
      setLoading(false);
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter some content for your journal entry');
      setLoading(false);
      return;
    }

    try {
      const contentHash = await hashContent(content);

      // Send to backend
      const response = await fetch('http://127.0.0.1:8000/submit_journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_hash: contentHash,
          is_public: isPublic,
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Journal entry submitted successfully!');
        setContent('');
        fetchEntries(); // Refresh the entries list
      } else {
        toast.error(`Submission failed: ${result.detail || result.message}`);
      }
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      toast.error('Failed to submit journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletConnectionProvider>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Journal Entry</h1>
              <DynamicWalletMultiButton />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write about your day..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading}
                />
                <label htmlFor="isPublic" className="ml-2 text-gray-700">
                  Make this entry public
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !wallet.connected}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${
                      loading || !wallet.connected
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
              >
                {loading ? 'Submitting...' : 'Submit Journal Entry'}
              </button>
            </form>
          </div>

          {/* Journal Entries List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Public Entries</h2>
            {entries.map((entry) => (
              <div key={entry.content_hash} className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      By: {entry.owner.slice(0, 4)}...{entry.owner.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVote(entry.address, true)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                      disabled={!wallet.connected}
                    >
                      <span>↑</span>
                      <span>{entry.upvotes}</span>
                    </button>
                    <button
                      onClick={() => handleVote(entry.address, false)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      disabled={!wallet.connected}
                    >
                      <span>↓</span>
                      <span>{entry.downvotes}</span>
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">Hash: {entry.content_hash}</p>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={entries.length < entriesPerPage}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </WalletConnectionProvider>
  );
}
