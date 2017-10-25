import 'isomorphic-fetch'
import queryString from 'query-string'
import { isNil, merge } from 'ramda'

const defaultHeaders = { 'Content-Type': 'application/x-www-form-urlencoded' }

export default ({ apiCode }) => {
  // Generic request object
  const request = ({ method, url, endPoint, data, sessionToken }) => {
    const formEncodedData = queryString.stringify({
      ...data,
      api_code: apiCode
    })

    const finalHeaders = isNil(sessionToken)
      ? defaultHeaders
      : merge({ 'Authorization': sessionToken }, defaultHeaders)

    const finalOptions = method === 'GET' ? {
      method,
      headers: finalHeaders,
      credentials: 'omit'
    } : {
      method,
      headers: finalHeaders,
      credentials: 'omit',
      body: formEncodedData
    }

    const finalUrl = method === 'GET'
      ? `${url}${endPoint}?${formEncodedData}`
      : `${url}${endPoint}`

    return fetch(finalUrl, finalOptions)
  }

  const get = ({ url, endPoint, data, sessionToken }) => request({ method: 'GET', url, endPoint, data, sessionToken })

  const post = ({ url, endPoint, data, sessionToken }) => request({ method: 'POST', url, endPoint, data, sessionToken })

  return {
    get,
    post
  }
}
