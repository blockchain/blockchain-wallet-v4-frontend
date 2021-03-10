import { pathOr } from 'ramda'

import { selectors } from 'data'

export const getFormValues = state => {
  const formValues = selectors.form.getFormValues('lockboxTransactions')(state)
  return pathOr([], ['search', 'value'], formValues)
}
