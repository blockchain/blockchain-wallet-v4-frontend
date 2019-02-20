import { curry, compose, map, mergeDeepLeft } from 'ramda'

const getAuthOptions = ({ email, guid, token }) => ({
  headers: {
    'X-WALLET-GUID': guid,
    'X-WALLET-EMAIL': email,
    Authorization: `Bearer ${token}`
  }
})

const injectAuthCredentials = curry(
  (getAuthCredentials, reauthenticate, request, options) =>
    compose(
      request,
      mergeDeepLeft(options),
      getAuthOptions
    )(getAuthCredentials()).catch(error => {
      if (error.status !== 401) throw error

      return reauthenticate()
    })
)

export default (http, getAuthCredentials, reauthenticate) =>
  map(injectAuthCredentials(getAuthCredentials, reauthenticate), http)
