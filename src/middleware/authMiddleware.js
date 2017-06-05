import * as actions from '../data/actionTypes'

const AuthMiddleware = store => next => action => {
  // console.log('Middleware triggered:', action)
  if (action.type === actions.LOGIN_START) {
    // browserHistory.push('/wallet')
  }

  return next(action)
}

export default AuthMiddleware
