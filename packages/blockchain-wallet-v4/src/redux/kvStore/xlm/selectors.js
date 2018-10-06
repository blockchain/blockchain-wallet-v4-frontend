import { head, path } from 'ramda'
import { XLM } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, XLM])

export const getAccounts = state =>
  getMetadata(state).map(path(['value', 'accounts']))

export const getDefaultAccount = state => getAccounts(state).map(head)
