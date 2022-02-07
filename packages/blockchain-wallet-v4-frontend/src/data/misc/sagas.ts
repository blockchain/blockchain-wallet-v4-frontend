import { delay, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { tryParseLanguageFromUrl } from 'services/locales'

import * as S from './selectors'

export default () => {
  const pingManifestFile = function* () {
    try {
      // only ping manifest if window is active
      if (!window.document.hidden || window.document.visibilityState === 'visible') {
        const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrElse({
          comWalletApp: 'https://login.blockchain.com'
        })
        const response = yield fetch(domains.comWalletApp)
        const raw = yield response.text()
        const nextManifest = raw.match(/manifest\.\d*.js/)[0]

        const currentManifest = yield select(S.getManifest)

        if (currentManifest && nextManifest !== currentManifest) {
          yield put(
            actions.modals.showModal(ModalName.NEW_VERSION_AVAILABLE, { origin: 'Unknown' })
          )
        }

        if (!currentManifest) {
          yield put(actions.misc.setManifestFile(nextManifest))
        }
      }
    } catch (e) {
      // ignore error, wallet failed to fetch happens rarely
    }

    yield delay(15_000) // 15 second ping intervals
    yield put(actions.misc.pingManifestFile())
  }

  const startCoinWebsockets = function* () {
    yield put(actions.middleware.webSocket.coins.authSocket())
    yield put(actions.middleware.webSocket.xlm.startStreams())
  }

  // eslint-disable-next-line require-yield
  const logAppConsoleWarning = function* () {
    try {
      const version = window.APP_VERSION
      const style1 = 'background: #F00; color: #FFF; font-size: 24px;'
      const style2 = 'font-size: 18px;'
      /* eslint-disable */
      console.log('=======================================================')
      console.log(`%c Wallet version ${version}`, style2)
      console.log('=======================================================')
      console.log('%c STOP!!', style1)
      console.log('%c This browser feature is intended for developers.', style2)
      console.log('%c If someone told you to copy-paste something here,', style2)
      console.log('%c it is a scam and will give them access to your money!', style2)
      /* eslint-enable */
    } catch (e) {
      // do nothing
    }
  }

  const initAppLanguage = function* () {
    try {
      yield delay(250)
      const lang = tryParseLanguageFromUrl()
      if (lang?.language) {
        yield put(actions.preferences.setLanguage(lang.language, false))
        if (lang.cultureCode) {
          yield put(actions.preferences.setCulture(lang.cultureCode))
        }
      }
    } catch (e) {
      // do nothing, app will fallback to english
    }
  }

  return {
    initAppLanguage,
    logAppConsoleWarning,
    pingManifestFile,
    startCoinWebsockets
  }
}
