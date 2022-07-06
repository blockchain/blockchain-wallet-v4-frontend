import { NabuErrorInNetworkResponseUtility } from './isNabuErrorInNetworkResponse.types'

const isNabuErrorInNetworkResponse: NabuErrorInNetworkResponseUtility = (payload) => {
  return Object.prototype.hasOwnProperty.call(payload, 'ux')
}

export default isNabuErrorInNetworkResponse
