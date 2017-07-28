let config = (process.env.NODE_ENV === 'production')
  ? require('./config.prod')
  : require('./config.dev')
export default config.default
