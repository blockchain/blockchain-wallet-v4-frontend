import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getTrayOpened,
    selectors.components.layoutWallet.getTrayContent
  ],
  (opened, content) => ({
    opened,
    content
  })
)
