'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

const DynamicWalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

interface JournalEntryType {
  content_hash: string;
  is_public: boolean;
  timestamp: number;
  owner: string;
  address: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const BACKEND_URL = 'http://127.0.0.1:8000';

export default function JournalPage() {
  const { publicKey, connected, connecting } = useWallet();
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [fetchingEntries, setFetchingEntries] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const entriesPerPage = 5;

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (publicKey && connected) {
      console.log('Wallet connected:', publicKey.toString());
      showToast('Wallet connected successfully!', 'success');
      fetchEntries();
    }
  }, [publicKey, connected]);

  const fetchEntries = async () => {
    try {
      setFetchingEntries(true);
      const skip = (page - 1) * entriesPerPage;
      const response = await fetch(
        `${BACKEND_URL}/journal_entries?skip=${skip}&limit=${entriesPerPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
      showToast('Failed to fetch journal entries. Please try again.', 'error');
    } finally {
      setFetchingEntries(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    if (!content.trim()) {
      showToast('Please enter some content', 'error');
      return;
    }

    setSubmitting(true);

    try {
      // Create a simple hash of the content
      const contentHash = Array.from(new TextEncoder().encode(content))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const response = await fetch(`${BACKEND_URL}/submit_journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_hash: contentHash,
          is_public: isPublic,
          wallet_address: publicKey.toString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error occurred' }));
        throw new Error(errorData.detail || `Failed to submit journal entry (${response.status})`);
      }

      const result = await response.json();
      
      if (result.status === 'success') {
        showToast('Journal entry submitted!', 'success');
        setContent('');
        fetchEntries();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to submit entry. Please try again.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Toast Messages */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-2 rounded-md shadow-lg text-white ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } transition-opacity duration-300`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Journal Entry</h1>
            <div className="flex flex-col items-end gap-2">
              <DynamicWalletMultiButton />
              {connecting && <p className="text-sm text-blue-500">Connecting...</p>}
              {!connected && !connecting && (
                <p className="text-sm text-red-500">Connect wallet to continue</p>
              )}
              {connected && publicKey && (
                <p className="text-sm text-green-500">
                  Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={connected ? "Write about your day..." : "Connect wallet first"}
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${submitting ? 'bg-gray-100' : 'bg-white'}
                  ${!connected ? 'bg-gray-100' : ''}`}
                rows={6}
                disabled={submitting || !connected}
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
                disabled={submitting || !connected}
              />
              <label htmlFor="isPublic" className="ml-2 text-gray-700">
                Make this entry public
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !connected || !content.trim()}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${submitting || !connected || !content.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Journal Entry'
              )}
            </button>
          </form>
        </div>

        {/* Journal Entries List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Public Entries</h2>
          {fetchingEntries ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.content_hash}
                className="bg-white rounded-lg shadow p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      By: {entry.owner.slice(0, 4)}...{entry.owner.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">Hash: {entry.content_hash}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No entries found</p>
          )}

          {entries.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || fetchingEntries}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span>Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={entries.length < entriesPerPage || fetchingEntries}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}