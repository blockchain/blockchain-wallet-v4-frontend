import { equals, prop } from 'ramda'

import { model, selectors } from 'data'
const { WALLET_TX_SEARCH } = model.form

export const selectOnlyShow = (state, s) => {
  const formValues = selectors.form.getFormValues(WALLET_TX_SEARCH)(state)
  const source = s || prop('source', formValues)

  return equals(source, 'all')
    ? ''
    : source.derivations
    ? prop(
        'xpub',
        source.derivations.find(d => d.type === 'legacy')
      )
    : source.address
}
