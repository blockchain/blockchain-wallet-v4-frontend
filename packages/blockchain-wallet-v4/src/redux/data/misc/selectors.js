import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getCaptcha = path([dataPath, 'misc', 'captcha'])

export const getPriceIndexSeries = path([dataPath, 'misc', 'price_index_series'])

export const getLogs = path([dataPath, 'misc', 'logs'])

export const getPairingCode = path([dataPath, 'misc', 'pairing_code'])

export const authorizeLogin = path([dataPath, 'misc', 'authorize_login'])
