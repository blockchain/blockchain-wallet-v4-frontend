import { compose, head, path, prop } from 'ramda'
import { ETHEREUM } from '../config'
import { kvStorePath } from '../../paths'
import * as RemoteData from '../../remoteData'

export const getMetadata = path([kvStorePath, ETHEREUM])

export const getAccounts = state => RemoteData.map(x => path(['value', 'ethereum', 'accounts'], x), getMetadata(state))

export const getContext = state => RemoteData.map(x => compose(prop('addr'), head)(x), getAccounts(state))

export const getDefaultAccount = state => RemoteData.map(x => head(x), getAccounts(state))

export const getLegacyAccount = state => RemoteData.map(x => path(['value', 'ethereum', 'legacy_account'], x), getMetadata(state))

export const getLegacyAccountAddress = state => RemoteData.map(x => prop('addr', x), getLegacyAccount(state))
