import { selectors } from 'data'
import { pathOr } from 'ramda'

export const getFormValues = state => {
  const formValues = selectors.form.getFormValues('lockboxTransactions')(state)
  return pathOr([], ['search', 'value'], formValues)
}
