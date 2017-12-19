import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getAdverts = path([dataPath, 'misc', 'adverts'])

export const getCaptcha = path([dataPath, 'misc', 'captcha'])

export const getPriceIndexSeries = path([dataPath, 'misc', 'price_index_series'])

export const getLogs = path([dataPath, 'misc', 'logs'])
