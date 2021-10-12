import { compose, curry, map, mergeDeepLeft } from 'ramda'

const getAuthOptions = ({ email, guid, token }) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'X-WALLET-EMAIL': email,
    'X-WALLET-GUID': guid
  }
})

const injectAuthCredentials = curry((getAuthCredentials, reauthenticate, request, options) =>
  compose(
    request,
    mergeDeepLeft(options),
    getAuthOptions
  )(getAuthCredentials()).catch((error) => {
    // 🚨!
    // 401 status means access token expired
    // BAD_2FA type means 2fa required by Exchange
    // There may be other errors that are status 401 that should be whitelisted
    // Otherwise yield api call can return reauth actionType (@EVENT.PROFILE.SIGN_IN)
    if (
      error.status !== 401 ||
      error.type === 'UNKNOWN_USER' ||
      error.type === 'NO_TRADE_PERMISSION' ||
      error.type === 'INVALID_CREDENTIALS' ||
      error.type === 'BAD_2FA'
    )
      throw error

    return reauthenticate()
  })
)

export default (http, getAuthCredentials, reauthenticate) =>
  map(injectAuthCredentials(getAuthCredentials, reauthenticate), http)
