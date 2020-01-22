import { merge, mergeRight, path, pathOr, prop } from 'ramda'
import axios, { AxiosRequestConfig } from 'axios'
import queryString from 'query-string'

axios.defaults.withCredentials = false
axios.defaults.timeout = Infinity

interface RequestConfig extends AxiosRequestConfig {
  contentType?: string
  endPoint?: string
  sessionToken?: string
  url?: string
}

interface GetConfig extends RequestConfig {
  ignoreQueryParams: boolean
}

type Header = {
  Authorization?: string
  ['Content-Type']: string
}

export default ({ apiKey }: { apiKey: string }) => {
  const encodeData = (data: any, contentType: string) => {
    const defaultData = {
      api_code: apiKey,
      ct: Date.now()
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      return queryString.stringify(merge(defaultData, data))
    }
    return merge(defaultData, data)
  }

  const getHeaders = (contentType: string, sessionToken?: string) => {
    const headers: Header = {
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
  }: RequestConfig) =>
    axios
      .request({
        url: `${url}${endPoint}`,
        method,
        data: encodeData(data, contentType),
        headers: mergeRight(getHeaders(contentType, sessionToken), headers),
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

  const get = ({
    ignoreQueryParams,
    endPoint,
    data,
    ...options
  }: Partial<GetConfig>) =>
    request({
      ...options,
      method: 'GET',
      endPoint: ignoreQueryParams
        ? endPoint
        : `${endPoint}?${encodeData(data, 'application/x-www-form-urlencoded')}`
    })
  const post = (options: Partial<RequestConfig>) =>
    request({ method: 'POST', ...options })
  const put = (options: Partial<RequestConfig>) =>
    request({ method: 'PUT', ...options })
  const patch = (options: Partial<RequestConfig>) =>
    request({ method: 'PATCH', ...options })

  return {
    get,
    post,
    put,
    patch
  }
}
