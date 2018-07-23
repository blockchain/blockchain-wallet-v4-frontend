import './create-nonce'

const index =
  process.env.NODE_ENV === 'production'
    ? require('./index.prod')
    : require('./index.dev')

export default index.default
