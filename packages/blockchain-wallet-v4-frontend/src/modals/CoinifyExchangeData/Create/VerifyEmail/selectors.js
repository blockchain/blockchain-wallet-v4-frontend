import { formValueSelector } from 'redux-form'

export const getData = state => ({
  emailCode: formValueSelector('coinifyCreate')(state, 'emailCode'),
  emailAddress: formValueSelector('coinifyCreate')(state, 'emailAddress')
})
