import { keys, path } from 'ramda'

import { kvStorePath } from '../../paths'
import { BTC } from '../config'

export const getMetadata = path([kvStorePath, BTC])
export const getAddressLabel = (address, state) =>
  getMetadata(state).map(path(['value', 'address_labels', address]))
export const getAddressLabelKeys = state =>
  keys(
    getMetadata(state)
      .map(path(['value', 'address_labels']))
      .getOrElse({})
  )
export const getAddressLabels = state =>
  getMetadata(state).map(path(['value', 'address_labels']))
