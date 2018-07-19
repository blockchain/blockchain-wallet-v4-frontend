__webpack_nonce__ = 'c29tZSBjb29sIHN0cmluZyB3aWxsIHBvcCB1cCAxMjM='
const index =
  process.env.NODE_ENV === 'production'
    ? require('./index.prod')
    : require('./index.dev')

export default index.default
