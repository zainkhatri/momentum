// JournalEntry.js

import * as borsh from 'borsh';

// Define the JournalEntry class
export class JournalEntry {
  constructor(properties) {
    this.content_hash = properties.content_hash;
    this.is_public = properties.is_public ? 1 : 0; // Store as u8
    this.timestamp = properties.timestamp || Math.floor(Date.now() / 1000);
    this.owner = properties.owner || '';
  }
}

// Define the serialization schema
export const JournalEntrySchema = new Map([
  [
    JournalEntry,
    {
      kind: 'struct',
      fields: [
        ['content_hash', 'string'],
        ['is_public', 'u8'],
        ['timestamp', 'u64'],
        ['owner', 'string'],
      ],
    },
  ],
]);

// Helper function to serialize a JournalEntry
export function serializeJournalEntry(entry) {
  const serializedData = borsh.serialize(JournalEntrySchema, entry);
  return Buffer.from(serializedData);
}

// Helper function to deserialize a JournalEntry
export function deserializeJournalEntry(buffer) {
  const entry = borsh.deserialize(JournalEntrySchema, JournalEntry, buffer);
  // Convert is_public back to boolean
  entry.is_public = entry.is_public === 1;
  return entry;
}
