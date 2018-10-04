import { lift, prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.layoutWallet.getMenuOpened,
    selectors.components.layoutWallet.getLockboxOpened,
    selectors.exchange.getCanTrade,
    selectors.router.getPathname,
    selectors.core.settings.getInvitations,
    selectors.core.kvStore.lockbox.getDevices
  ],
  (
    menuOpened,
    lockboxOpened,
    canTradeR,
    pathname,
    invitationsR,
    lockboxDevicesR
  ) => {
    const transform = (canTrade, lockboxDevices, invitations) => {
      const lockboxEnabled = prop('lockbox', invitations)
      return {
        canTrade,
        pathname,
        menuOpened,
        lockboxOpened,
        lockboxDevices,
        lockboxEnabled
      }
    }

    return lift(transform)(canTradeR, lockboxDevicesR, invitationsR)
  }
)
