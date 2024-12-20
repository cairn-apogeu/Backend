import fs from 'fs';
import path from 'path';
import forge from 'node-forge';

export const decryptData = (encryptedData: string) => {
  const privateKeyBase64 = process.env.PRIVATE_KEY;
  if (!privateKeyBase64) {
    throw new Error('Chave privada não encontrada nas variáveis de ambiente');
  }

  const privateKeyPem = Buffer.from(privateKeyBase64, 'base64').toString('utf8');
  const rsa = forge.pki.privateKeyFromPem(privateKeyPem);
  const encryptedBytes = forge.util.decode64(encryptedData);
  
  const decrypted = rsa.decrypt(encryptedBytes, 'RSA-OAEP');
  return decrypted;
};
