export const configuration = () => ({
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_DATABASE,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  dbUser: process.env.DB_USER,
  jwtExpiry: process.env.JWT_EXPIRY,
  jwtIssuer: process.env.JWT_ISSUER,
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
  jwtPublicKey: process.env.JWT_PUBLIC_KEY,
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL
});
