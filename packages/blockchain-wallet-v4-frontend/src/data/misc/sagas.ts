import { call, delay, put, select } from 'redux-saga/effects'
import Cookies from 'universal-cookie'

import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { tryParseLanguageFromUrl } from 'services/locales'

import * as S from './selectors'

export default () => {
  const pingRuntimeFile = function* () {
    try {
      // only ping runtime if in production and window is active
      if (
        window.location.host === 'login.blockchain.com' &&
        (!window.document.hidden || window.document.visibilityState === 'visible')
      ) {
        const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrElse({
          comWalletApp: 'https://login.blockchain.com'
        })
        const response = yield fetch(domains.comWalletApp)
        const raw = yield response.text()
        const nextRuntime = raw.match(/runtime\.\d*.js/)[0]

        const currentRuntime = yield select(S.getRuntime)

        if (currentRuntime && nextRuntime !== currentRuntime) {
          yield put(
            actions.modals.showModal(ModalName.NEW_VERSION_AVAILABLE, { origin: 'Unknown' })
          )
        }

        if (!currentRuntime) {
          yield put(actions.misc.setRuntimeFile(nextRuntime))
        }
      }
    } catch (e) {
      // ignore error, wallet failed to fetch happens rarely
    }

    yield delay(15_000) // 15 second ping intervals
    yield put(actions.misc.pingRuntimeFile())
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
      const cookies = new Cookies()
      const urlLang = tryParseLanguageFromUrl()
      const cookieLang = cookies.get('clang')
      const lang = urlLang?.language || cookieLang
      if (lang) {
        yield put(actions.preferences.setLanguage(lang, false))
      }
    } catch (e) {
      // do nothing, app will fallback to english
    }
  }

  const generateCaptchaToken = function* (actionName) {
    let pollCount = 0

    // wait up to 10 seconds for captcha library to load
    while (true) {
      pollCount += 1

      if (pollCount >= 50) {
        console.error('Captcha: window.grecaptcha not found')
        break
      }
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        break
      }

      yield delay(200)
    }

    const getToken = () =>
      window.grecaptcha.enterprise
        .execute(window.CAPTCHA_KEY, { action: actionName })
        .then((token) => token)
        .catch((e) => {
          console.error('Captcha: ', e)
        })

    const captchaToken = yield call(getToken)
    return captchaToken
  }

  return {
    generateCaptchaToken,
    initAppLanguage,
    logAppConsoleWarning,
    pingRuntimeFile,
    startCoinWebsockets
  }
}
