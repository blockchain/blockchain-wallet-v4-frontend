import { path } from 'ramda'
import {addressLabelsPath} from '../paths'

export const getAddressLabel = (address) => path([addressLabelsPath, address])
