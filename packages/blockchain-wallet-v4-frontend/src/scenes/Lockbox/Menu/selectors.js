import { selectors } from 'data'
import { lift, keysIn, pathOr } from 'ramda'

export const getData = state => {
  const devicesKvStoreR = selectors.core.kvStore.lockbox.getDevices(state)
  const transform = devicesKvStore => {
    return devicesKvStore[keysIn(devicesKvStore)[0]]
  }
  return lift(transform)(devicesKvStoreR)
}

export const getFormValues = state => {
  const formValues = selectors.form.getFormValues('lockboxTransactions')(state)
  return pathOr([], ['search', 'value'], formValues)
}
