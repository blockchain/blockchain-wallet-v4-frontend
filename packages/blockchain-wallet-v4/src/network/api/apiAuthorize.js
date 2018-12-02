import { curry, compose, map, mergeDeepLeft } from 'ramda'

const getAuthOptions = ({ email, guid, token }) => ({
  headers: {
    'X-WALLET-GUID': guid,
    'X-WALLET-EMAIL': email,
    Authorization: `Bearer ${token}`
  }
})

const injectAuthCredentials = curry((getAuthCredentials, request, options) =>
  compose(
    request,
    mergeDeepLeft(options),
    getAuthOptions
  )(getAuthCredentials())
)

export default (http, getAuthCredentials) =>
  map(injectAuthCredentials(getAuthCredentials), http)
