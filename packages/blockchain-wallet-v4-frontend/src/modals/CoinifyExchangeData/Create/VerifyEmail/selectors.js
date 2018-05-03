import { formValueSelector } from 'redux-form'

export const getData = state => ({
  emailCode: formValueSelector('coinifyVerifyEmail')(state, 'emailCode'),
  emailAddress: formValueSelector('coinifyVerifyEmail')(state, 'emailAddress')
})
