// Sistema de autenticação simples para admin
// Usa variáveis de ambiente para credenciais

export function verifyAdminCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPassword = process.env.ADMIN_PASS || 'admin123';
  
  return username === adminUser && password === adminPassword;
}

export function generateAdminToken(): string {
  // Token simples baseado em timestamp + secret
  const secret = process.env.ADMIN_SECRET || 'admin_secret_123';
  const timestamp = Date.now();
  return Buffer.from(`${secret}_${timestamp}`).toString('base64');
}

export function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const secret = process.env.ADMIN_SECRET || 'admin_secret_123';
    return decoded.startsWith(`${secret}_`);
  } catch {
    return false;
  }
}
