
const AuthMiddleware = store => next => action => {
  console.log('Middleware triggered:', action)
  return next(action)
}

export default AuthMiddleware
