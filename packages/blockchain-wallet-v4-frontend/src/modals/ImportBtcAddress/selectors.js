import { formValueSelector } from 'redux-form'

export const getData = state => {
  const addressType = formValueSelector('importBtcAddress')(state, 'address-type')
  const priv = formValueSelector('importBtcAddress')(state, 'priv')

  return {
    priv,
    isAddressInternal: addressType === 'internal',
    isAddressExternal: addressType === 'external'
  }
}
