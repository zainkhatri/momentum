export const hashContent = async (content) => {
  if (!content) {
    throw new Error('Content is required to compute hash');
  }

  let hashHex;

  // Check if running in a browser environment
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    // Browser environment
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } 
  // Check if running in a Node.js environment
  else if (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null
  ) {
    // Node.js environment
    const crypto = require('crypto');
    hashHex = crypto.createHash('sha256').update(content, 'utf8').digest('hex');
  } else {
    throw new Error('Hashing is not supported in this environment');
  }

  return hashHex;
};
