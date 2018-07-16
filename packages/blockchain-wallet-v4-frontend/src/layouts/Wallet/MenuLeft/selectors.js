import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.components.layoutWallet.getMenuOpened],
  (menuOpened) => ({ toggled: menuOpened })
)
