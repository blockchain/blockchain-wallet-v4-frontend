import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getTrayOpened,
    selectors.components.layoutWallet.getTrayContent
  ],
  (opened, content) => ({
    highlighted: opened && content === 'faq'
  })
)
