import './create-nonce'

// load zxcvbn dependency async and set on window
require.ensure(
  ['zxcvbn'],
  require => (window.zxcvbn = require('zxcvbn')),
  'zxcvbn'
)

const index =
  process.env.NODE_ENV === 'production'
    ? require('./index.prod')
    : require('./index.dev')

export default index.default
