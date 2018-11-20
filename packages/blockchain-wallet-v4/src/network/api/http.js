import axios from 'axios'
import queryString from 'query-string'
import { prop, path, merge } from 'ramda'

axios.defaults.withCredentials = false
axios.defaults.timeout = Infinity

export default ({ apiKey }) => {
  const encodeData = (data, contentType) => {
    const defaultData = {
      api_code: apiKey,
      ct: Date.now()
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      return queryString.stringify(merge(defaultData, data))
    }
    return merge(defaultData, data)
  }

  const getHeaders = (sessionToken, contentType) => {
    const headers = {
      'Content-Type': contentType
    }
    if (sessionToken) headers['Authorization'] = `Bearer ${sessionToken}`

    return headers
  }

  const request = ({
    cancelToken,
    contentType = 'application/x-www-form-urlencoded',
    data,
    endPoint,
    headers,
    method,
    sessionToken,
    url
  }) =>
    axios({
      url: `${url}${endPoint}`,
      method,
      data: encodeData(data, contentType),
      headers: merge(getHeaders(sessionToken, contentType), headers),
      cancelToken
    })
      .catch(error => {
        throw path(['response', 'data'], error)
      })
      .then(prop('data'))

  const get = ({ ignoreQueryParams, endPoint, data, ...options }) =>
    request({
      ...options,
      method: 'GET',
      endPoint: ignoreQueryParams
        ? endPoint
        : `${endPoint}?${encodeData(data, 'application/x-www-form-urlencoded')}`
    })
  const post = options => request({ method: 'POST', ...options })
  const put = options => request({ method: 'PUT', ...options })
  const patch = options => request({ method: 'PATCH', ...options })

  return {
    get,
    post,
    put,
    patch
  }
}
