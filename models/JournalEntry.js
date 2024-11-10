import * as borsh from 'borsh';

export class JournalEntry {
  constructor(properties) {
    this.content_hash = properties.content_hash;
  }
}

export const JournalEntrySchema = new Map([
  [
    JournalEntry,
    {
      kind: 'struct',
      fields: [['content_hash', 'string']],
    },
  ],
]);
