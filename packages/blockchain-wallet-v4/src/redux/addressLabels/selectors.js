import { path } from 'ramda'
import {settingsPath} from '../paths'

export const getAddressLabel = (address) => path([settingsPath, address])
