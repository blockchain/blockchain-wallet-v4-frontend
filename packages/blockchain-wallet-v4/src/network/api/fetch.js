// @flow
import 'isomorphic-fetch'
import queryString from 'query-string'
import { isNil, merge } from 'ramda'

interface Converter<T> {
  convert(value: Response): Promise<T> }
export const StringConverter : Converter<string> = {
  convert: (value: Response) => value.text()}
export const ObjConverter: Converter<Object> = {
  convert: (value: Response) => value.json()}
export const ImgConverter: Converter<Blob> = {
  convert: (value: Response) => value.blob()}

type Method = 'GET' | 'POST'
export type ContentType = 'application/json' | 'text/plain' | 'image/jpeg' | 'application/x-www-form-urlencoded'
export type Request = {|
  url: string,
  endPoint: string,
  data?: Object,
  sessionToken?: ?string,
  contentType?: ContentType
|}

export type RequestFn = {|
  get: (Request) => Promise<Object>,
  post: (Request) => Promise<Object>,
  request: <T>(Method, Request, Converter<T>) => Promise<T>,
  getString: (Request) => Promise<*>,
  getImage: (Request) => Promise<*>,
  postString: (Request) => Promise<*>,
  postImage: (Request) => Promise<*>
|}


// Promise.polyfill()

// checkStatus :: Response -> Promise Response
function checkStatus <T>(r: Response): Promise<Response> {
  return r.ok ? Promise.resolve(r) : r.text().then(j => Promise.reject(j))
}

const encodeData = (contentType, data) => {
  switch (contentType) {
    case 'application/json': return JSON.stringify(data)
    default: return queryString.stringify(data)
  }
}

export default (apiCode: string): RequestFn => {
  // Generic request object
  const request = <T>(
    method: Method,
    { url, endPoint, data, sessionToken, contentType = 'application/x-www-form-urlencoded' }: Request,
    converter: Converter<T>) : Promise<T> => {
    const defaultHeaders = { 'Content-Type': contentType }

    const formEncodedData = encodeData(contentType, { ...data })

    const finalHeaders = isNil(sessionToken)
      ? defaultHeaders
      : merge({ 'Authorization': `Bearer ${sessionToken}` }, defaultHeaders)

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

    return fetch(finalUrl, finalOptions).then(checkStatus).then(converter.convert)
  }

  // Get request
  const getInt = <T>(req: Request, converter: Converter<T>): Promise<T> => request('GET', req, converter)
  const postInt = <T>(req: Request, converter: Converter<T>): Promise<T> => request('POST', req, converter)

  const get = (req: Request) => getInt(req, ObjConverter)
  const getString = (req: Request) => getInt(req, StringConverter)
  const getImage = (req: Request) => getInt(req, ImgConverter)

  const post = (req: Request) => postInt(req, ObjConverter)
  const postString = (req: Request) => postInt(req, StringConverter)
  const postImage = (req: Request) => postInt(req, ImgConverter)

  return {
    get,
    post,
    request,
    getString,
    getImage,
    postString,
    postImage
  }
}
