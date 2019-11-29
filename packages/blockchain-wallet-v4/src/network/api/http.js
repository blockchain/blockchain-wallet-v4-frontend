import axios from 'axios'
import queryString from 'query-string'
import { prop, path, pathOr, merge } from 'ramda'

import * as kernel from 'web-microkernel/src'

axios.defaults.withCredentials = false
axios.defaults.timeout = Infinity

export default ({ apiKey, imports }) => {
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
    url,
    ...options
  }) =>
    axios({
      adapter: kernel.sanitizeFunction(imports.axios),
      url: `${url}${endPoint}`,
      method,
      data: encodeData(data, contentType),
      headers: merge(getHeaders(sessionToken, contentType), headers),
      cancelToken,
      ...options
    })
      .catch(error => {
        const errorData = pathOr({}, ['response', 'data'], error)
        const status = path(['response', 'status'], error)
        if (typeof errorData === 'string') throw errorData
        throw merge(errorData, { status })
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
