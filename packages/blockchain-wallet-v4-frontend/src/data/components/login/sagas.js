import { call, put, select, take } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { actions, selectors } from 'data'
import { assoc } from 'ramda'

// TODO: DEPRECATE
// We should not need this in the future. It is used to handle transferring cookies from .info to .com domain

export default () => {
  const initialized = function*() {
    try {
      const alreadyTransferredCookiesKey =
        'did_already_transfer_cookies_from_dot_info'
      const shouldTransfer =
        window.localStorage.getItem(alreadyTransferredCookiesKey) == null

      if (shouldTransfer) {
        const domainsR = yield select(selectors.core.walletOptions.getDomains)
        const domains = domainsR.getOrElse({ root: 'https://blockchain.info' })
        const rootURL = domains.root
        const frame = createFrame(
          `${rootURL}/Resources/transfer_stored_values.html`
        )

        const windowChannel = function () {
          return eventChannel(emitter => {
            const cookieTransfer = function (event) {
              if (event.data.type === 'cookie') {
                const cookie = event.data.payload
                window.localStorage.setItem(
                  cookie.id,
                  tryJsonParse(cookie.data)
                )
              }

              if (event.data.type === 'cookies-sent') {
                frame.remove()
                const lastGuid = window.localStorage.getItem('guid')
                const session = window.localStorage.getItem('session')
                window.localStorage.setItem(alreadyTransferredCookiesKey, true)
                emitter({ lastGuid, session })
                emitter(END)
              }
            }
            window.addEventListener('message', cookieTransfer)
            return () => window.removeEventListener('message', cookieTransfer)
          })
        }

        const chan = yield call(windowChannel)

        try {
          while (true) {
            let { session, lastGuid } = yield take(chan)
            yield put(actions.cache.guidEntered(lastGuid))
            yield put(actions.session.saveSession(assoc(lastGuid, session, {})))
          }
        } finally {
          chan.close()
        }
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage('components/login/sagas', 'initialized', e)
      )
    }
  }

  const createFrame = src => {
    const frame = document.createElement('iframe')
    frame.src = src
    frame.style.display = 'none'
    document.body.appendChild(frame)
    return frame
  }

  const tryJsonParse = value => {
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  }

  return {
    initialized
  }
}
