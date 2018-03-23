// @flow
import type {ApiContext} from "../index";

const api = ({ rootUrl, apiUrl, fetchFn }: ApiContext) => {
  const getTokenForDelegate = (data: any) => fetchFn.get({
    url: rootUrl,
    endPoint: 'wallet/signed-token',
    data: data
  })

  return {
    getTokenForDelegate
  }
}

export type DelegateApi = $Call<typeof api, ApiContext>
export default api
