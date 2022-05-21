import { selectors } from 'data'

const getSecret = (url) => {
  const myRegexp = /secret=(.*)/
  const match = myRegexp.exec(url)
  if (match) {
    return match[1]
  }
  return null
}

export const getData = (state) => {
  const { data } = selectors.core.settings.getGoogleAuthSecretUrl(state)

  return {
    googleAuthSecretUrl: data,
    secret: getSecret(data)
  }
}
