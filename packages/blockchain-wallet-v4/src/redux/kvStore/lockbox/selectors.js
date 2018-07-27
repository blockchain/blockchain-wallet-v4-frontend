import { path } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

export const getMetadata = path([kvStorePath, LOCKBOX])

export const getBtcLockboxAccounts = state =>
  getMetadata(state).map(path(['value', 'btc', 'accounts']))

export const getBchLockboxAccounts = state =>
  getMetadata(state).map(path(['value', 'bch', 'accounts']))

export const getEthLockboxAccounts = state =>
  getMetadata(state).map(path(['value', 'eth', 'accounts']))
