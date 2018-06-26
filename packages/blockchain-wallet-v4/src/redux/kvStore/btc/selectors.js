import { path } from 'ramda'
import { kvStorePath } from '../../paths'

export const getAddressLabel = (address) => path([kvStorePath, 'bitcoin', 'address_labels', address])
