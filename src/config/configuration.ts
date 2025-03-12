export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/koywe',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  quote: {
    expirationTime: parseInt(process.env.QUOTE_EXPIRATION_MINUTES || '5', 10),
  },
  api: {
    crypto: {
      baseUrl:
        process.env.CRYPTO_API_BASE_URL ||
        'https://api.exchange.cryptomkt.com/api/3/public',
    },
    useSimulated: process.env.USE_SIMULATED_API === 'true',
  },
});
