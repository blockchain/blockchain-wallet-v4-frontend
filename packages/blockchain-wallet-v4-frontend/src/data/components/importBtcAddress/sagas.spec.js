import { testSaga } from 'redux-saga-test-plan'
import { coreSagasFactory } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import sagas from './sagas.js'
import Bitcoin from 'bitcoinjs-lib'

const api = {}
const networks = { btc: Bitcoin.networks['bitcoin'] }
const coreSagas = coreSagasFactory({ api })
const { importLegacyAddress, importBtcAddressSubmitClicked } = sagas({
  api,
  coreSagas,
  networks
})
const logLocation = 'components/importBtcAddress/sagas'

describe('importBtcAddress sagas', () => {
  describe('importBtcAddressSubmitClicked', () => {
    describe('non bip-38 addr', () => {
      const saga = testSaga(importBtcAddressSubmitClicked)
      it('should select form state', () => {
        // Fails
        // saga.next().select(selectors.form.getFormValues('importLegacyAddress'))
        saga.next()
      })
      it('should get addrOrPriv and importLegacyAddress', () => {
        saga
          .next({
            addrOrPriv: 'L1srees8FHP8v2yAv1b5JuZfCvqhVf37JUp5oHpFj1QtnPRyNRaB'
          })
          .call(
            importLegacyAddress,
            '1LM9wuwviAApr9y2nUrWaBadEZXJucsxLB',
            'L1srees8FHP8v2yAv1b5JuZfCvqhVf37JUp5oHpFj1QtnPRyNRaB',
            null,
            null,
            undefined
          )
      })
    })

    describe('bip-38 addr', () => {
      const saga = testSaga(importBtcAddressSubmitClicked)
      it('should select form state', () => {
        // Fails
        // saga.next().select(selectors.form.getFormValues('importLegacyAddress'))
        saga.next()
      })
      it('should get addrOrPriv and log error', () => {
        saga
          .next({
            addrOrPriv:
              '6PYKXJ9yisUdA8Qxv3H1bzrsxhMABYNgLTKvpvEFqMRYA1oyAmn9gvzF3W'
          })
          .put(
            actions.logs.logErrorMessage(
              `${logLocation} importBtcAddressSubmitClicked`,
              new Error('Unsupported Key Format')
            )
          )
      })
      it('should attempt import', () => {
        saga
          .next()
          .call(
            importLegacyAddress,
            undefined,
            '6PYKXJ9yisUdA8Qxv3H1bzrsxhMABYNgLTKvpvEFqMRYA1oyAmn9gvzF3W',
            null,
            null,
            undefined
          )
      })
    })
  })
})
