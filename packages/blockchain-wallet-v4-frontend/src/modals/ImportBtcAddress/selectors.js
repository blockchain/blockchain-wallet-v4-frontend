import { formValueSelector } from 'redux-form'

export const getData = state => {
  const addressType = formValueSelector('importBtcAddress')(state, 'address-type')

  return {
    isAddressInternal: addressType === 'internal',
    isAddressExternal: addressType === 'external'
  }
}
