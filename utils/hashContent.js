// utils/hashContent.js
import CryptoJS from 'crypto-js';

export const hashContent = (content) => {
  return CryptoJS.SHA256(content).toString();
};