import fs from 'fs';

// Codifica a chave privada e pública da raiz do projeto para Base64 e exibe os resultados
function encodeKeyToBase64(filePath) {
    try {
        const key = fs.readFileSync(filePath, 'utf-8');
        return Buffer.from(key).toString('base64');
    } catch (error) {
        console.error(`Error reading or encoding file at ${filePath}:`, error);
        throw error;
    }
}

function decodeKeyFromBase64(base64Key) {
    try {
        return Buffer.from(base64Key, 'base64').toString('utf-8');
    } catch (error) {
        console.error('Error decoding Base64 key:', error);
        throw error;
    }
}

const privateKeyPath = `${process.cwd()}/private.pem`;
const publicKeyPath = `${process.cwd()}/public.pem`;

try {
    const encodedPrivateKey = encodeKeyToBase64(privateKeyPath);
    const encodedPublicKey = encodeKeyToBase64(publicKeyPath);

    console.log('Encoded Private Key:', encodedPrivateKey);
    console.log('Encoded Public Key:', encodedPublicKey);

    // Decodificar para testar
    const decodedPrivateKey = decodeKeyFromBase64(encodedPrivateKey);
    const decodedPublicKey = decodeKeyFromBase64(encodedPublicKey);

    console.log('Decoded Private Key:', decodedPrivateKey);
    console.log('Decoded Public Key:', decodedPublicKey);
} catch (error) {
    console.error('An error occurred while processing keys:', error);
}
