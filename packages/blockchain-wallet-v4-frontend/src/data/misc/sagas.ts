import { delay, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'

import * as S from './selectors'

export default () => {
  const pingManifestFile = function* () {
    try {
      const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrElse({
        comWalletApp: 'https://login.blockchain.com'
      })
      const response = yield fetch(domains.comWalletApp)
      const raw = yield response.text()
      const nextManifest = raw.match(/manifest\.\d*.js/)[0]

      const currentManifest = yield select(S.getManifest)

      if (currentManifest && nextManifest !== currentManifest) {
        yield put(actions.modals.showModal(ModalName.NEW_VERSION_AVAILABLE, { origin: 'Unknown' }))
      }

      if (!currentManifest) {
        yield put(actions.auth.setManifestFile(nextManifest))
      }
    } catch (e) {
      // ignore error, wallet failed to fetch happens rarely
    }

    yield delay(10_000)
    yield put(actions.misc.pingManifestFile())
  }

  const startCoinWebsockets = function* () {
    yield put(actions.middleware.webSocket.coins.authSocket())
    yield put(actions.middleware.webSocket.xlm.startStreams())
  }

  return {
    pingManifestFile,
    startCoinWebsockets
  }
}
