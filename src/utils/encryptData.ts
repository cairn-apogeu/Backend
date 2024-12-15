import forge from 'node-forge';
import fs from 'fs';
import path from 'path';

export const encryptData = async (data: string) => {
  const publicKeyPath = path.join(process.cwd(), 'public.pem');
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  const rsa = forge.pki.publicKeyFromPem(publicKey);
  const encrypted = rsa.encrypt(data, 'RSA-OAEP');
  
  return forge.util.encode64(encrypted);
};