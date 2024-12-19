import forge from 'node-forge';
import fs from 'fs';
import path from 'path';

export const encryptData = async (data: string) => {
  const publicKeyBase64 = process.env.PUBLIC_KEY;
  if (!publicKeyBase64) {
    throw new Error('Chave pública não encontrada nas variáveis de ambiente');
  }

  const publicKeyPem = Buffer.from(publicKeyBase64, 'base64').toString('utf8');
  const rsa = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = rsa.encrypt(data, 'RSA-OAEP');
  
  return forge.util.encode64(encrypted);
};