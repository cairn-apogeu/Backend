import fs from 'fs';
import path from 'path';
import forge from 'node-forge';

export const decryptData = (encryptedData: string) => {
  const privateKeyPath = path.join(process.cwd(), 'private.pem');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  const rsa = forge.pki.privateKeyFromPem(privateKey);
  const encryptedBytes = forge.util.decode64(encryptedData);
  
  const decrypted = rsa.decrypt(encryptedBytes, 'RSA-OAEP');
  return decrypted;
};
