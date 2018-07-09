import { put, select } from 'redux-saga/effects'
import { actions, selectors } from 'data'

export default () => {
  // TODO:: DEPRECATE
  // We should not need this but it is used to handle transferring cookies from .info to .com domain
  // Consider removing this code in the future
  const initialized = function * () {
    try {
      const alreadyTransferredCookiesKey = 'did_already_transfer_cookies_from_dot_info'
      const shouldTransfer = window.localStorage.getItem(alreadyTransferredCookiesKey) == null

      const createFrame = (src) => {
        const frame = document.createElement('iframe')
        frame.src = src
        frame.style.display = 'none'
        document.body.appendChild(frame)
        return frame
      }

      const tryJsonParse = (value) => {
        try {
          return JSON.parse(value)
        } catch (e) {
          return value
        }
      }

      if (shouldTransfer) {
        const domainsR = yield select(selectors.core.walletOptions.getDomains)
        const domains = domainsR.getOrElse({ root: 'https://blockchain.info' })
        const rootURL = domains.root
        const frame = createFrame(`${rootURL}/Resources/transfer_stored_values.html`)

        window.addEventListener('message', (event) => {
          if (event.data.type === 'cookie') {
            const cookie = event.data.payload
            window.localStorage.setItem(cookie.id, tryJsonParse(cookie.data))
          }

          if (event.data.type === 'cookies-sent') {
            frame.remove()
            window.localStorage.setItem(alreadyTransferredCookiesKey, true)
            const lastGuid = window.localStorage.getItem('ls.guid')
            console.log(lastGuid)
            // yield put(actions.cache.guidEntered(lastGuid))
          }
        })
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage('components/login/sagas', 'initialized', e))
    }
  }

  return {
    initialized
  }
}
