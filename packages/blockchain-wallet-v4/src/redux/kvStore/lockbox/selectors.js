import { path } from 'ramda'
import { kvStorePath } from '../../paths'
import { LOCKBOX } from '../config'

export const getMetadata = path([kvStorePath, LOCKBOX])

export const getDevice = (state, deviceID) =>
  getMetadata(state).map(path(['value', 'devices', deviceID]))
