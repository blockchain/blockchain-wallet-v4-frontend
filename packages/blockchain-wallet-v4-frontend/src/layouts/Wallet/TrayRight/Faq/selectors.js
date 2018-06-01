import { formValueSelector } from 'redux-form'

export const getData = (state) => ({
  search: formValueSelector('faq')(state, 'search')
})
