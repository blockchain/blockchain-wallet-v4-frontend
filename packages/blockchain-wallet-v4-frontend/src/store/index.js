const configureStore = (process.env.NODE_ENV === 'production')
  ? require('./configureStore.prod')
  : require('./configureStore.dev')

export default configureStore.default
