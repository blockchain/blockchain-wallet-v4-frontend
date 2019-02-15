import { merge, path, assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  trayOpened: false,
  trayContent: '',
  balancesTable: 'total',
  menuOpened: true,
  settingsOpened: false,
  lockboxOpened: false
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.LAYOUT_WALLET_HEADER_FAQ_CLICKED: {
      return state.trayContent !== 'faq' || !state.trayOpened
        ? merge(state, { trayOpened: true, trayContent: 'faq' })
        : merge(state, { trayOpened: false, trayContent: '' })
    }
    case AT.LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED: {
      return state.trayContent !== 'whatsnew' || !state.trayOpened
        ? merge(state, { trayOpened: true, trayContent: 'whatsnew' })
        : merge(state, { trayOpened: false, trayContent: '' })
    }
    case AT.LAYOUT_WALLET_TRAY_CLOSE_CLICKED: {
      return merge(state, { trayOpened: false, trayContent: '' })
    }

    case AT.SET_BALANCES_CHART_TAB: {
      return assoc('balancesTable', payload, state)
    }
    case '@@router/LOCATION_CHANGE': {
      const pathname = path(['location', 'pathname'], payload)
      const settingsOpened = pathname && pathname.split('/')[1] === 'settings'
      const lockboxOpened = pathname && pathname.split('/')[1] === 'lockbox'
      const shouldOpenSettings = !state.settingsOpened && settingsOpened
      return merge(state, {
        trayOpened: false,
        trayContent: '',
        menuOpened: shouldOpenSettings,
        settingsOpened,
        lockboxOpened
      })
    }
    case AT.LAYOUT_WALLET_MENU_TOGGLE_CLICKED: {
      return merge(state, { menuOpened: !state.menuOpened })
    }
    case AT.LAYOUT_WALLET_MENU_CLOSE_CLICKED: {
      return merge(state, { trayOpened: false })
    }
    default:
      return state
  }
}
