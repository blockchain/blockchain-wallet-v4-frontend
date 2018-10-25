import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getSettingsOpened,
    selectors.modules.profile.userFlowSupported
  ],
  (settingsOpened, userFlowSupportedR) => {
    const userFlowSupported = userFlowSupportedR.getOrElse(false)
    return { settingsOpened, userFlowSupported }
  }
)
