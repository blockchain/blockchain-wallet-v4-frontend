import { GetHostnameFromHrefUtility } from './getHostnameFromHref.types'

const getHostnameFromHref: GetHostnameFromHrefUtility = (href) => {
  try {
    const url = new URL(href)

    return url.hostname.split('.').slice(-2).join('.')
  } catch (err) {
    return null
  }
}

export { getHostnameFromHref }
