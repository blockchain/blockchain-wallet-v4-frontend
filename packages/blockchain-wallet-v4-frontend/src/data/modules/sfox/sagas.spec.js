import { select } from 'redux-saga/effects'

import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'
import { coreSagasFactory, Remote } from 'blockchain-wallet-v4/src'
import * as actions from '../../actions'
import * as sfoxActions from './actions.js'
import * as selectors from '../../selectors.js'
import sfoxSagas, { logLocation } from './sagas'
import * as C from 'services/AlertService'
import * as CC from 'services/ConfirmService'
import { promptForSecondPassword, confirm } from 'services/SagaService'

jest.mock('blockchain-wallet-v4/src/redux/sagas')
const coreSagas = coreSagasFactory()
const networks = { btc: 'bitcoin' }

describe('sfoxSagas', () => {
  beforeAll(() => {
    Math.random = () => 0.5
  })

  const tradeReceiveAddress = '1FVKW4rp5rN23dqFVk2tYGY4niAXMB8eZC'
  const secondPassword = 'secondPassword'
  const mockAccounts = Remote.of([{ id: 1 }])
  const mockJumioStatus = { success: true, status: 'DONE' }
  const mockJumioToken = { id: '123abc', token: 'token123abc' }
  const mockProfile = Remote.of({
    fetchJumioStatus: () => mockJumioStatus,
    fetchJumioToken: () => mockJumioToken
  })
  const mockSellTrade = {
    sendAmount: 100,
    receiveAddress: tradeReceiveAddress,
    id: 12345
  }
  const feeType = 'regular'
  const feePerByte = 1
  const value = {
    fees: {
      [feeType]: feePerByte
    }
  }
  const paymentMock = {
    value: jest.fn(),
    init: jest.fn(() => paymentMock),
    to: jest.fn(() => paymentMock),
    amount: jest.fn(() => paymentMock),
    from: jest.fn(() => paymentMock),
    fee: jest.fn(() => paymentMock),
    build: jest.fn(() => paymentMock),
    buildSweep: jest.fn(() => paymentMock),
    sign: jest.fn(() => paymentMock),
    publish: jest.fn(() => paymentMock),
    description: jest.fn(() => paymentMock),
    chain: jest.fn()
  }
  paymentMock.value.mockReturnValue(value)

  coreSagas.payment.btc.create.mockImplementation(() => {
    return paymentMock
  })

  describe('sfox signup', () => {
    let { sfoxSignup } = sfoxSagas({
      coreSagas,
      networks
    })
    let saga = testSaga(sfoxSignup)

    it('should set loading', () => {
      saga.next().put(sfoxActions.sfoxLoading())
    })

    it('should call signup', () => {
      saga.next().call(coreSagas.data.sfox.signup)
    })

    it('should select the profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })

    describe('successful signup', () => {
      it('should be success', () => {
        const fakeUser = { name: 'Shmee', id: 10 }
        return expectSaga(sfoxSignup)
          .put({ type: '@COMPONENT.SFOX_LOADING' })
          .provide([[matchers.call.fn(coreSagas.data.sfox.signup)]])
          .provide([[select(selectors.core.data.sfox.getProfile), fakeUser]])
          .put({ type: '@COMPONENT.SFOX_SUCCESS' })
          .put({ type: '@COMPONENT.ENABLE_SIFT_SCIENCE' })
          .put({ type: '@COMPONENT.NEXT_STEP', payload: 'verify' })
          .run()
      })
    })

    describe('signup error', () => {
      it('should throw', () => {
        const profileError = { error: 'signup_error' }
        return expectSaga(sfoxSignup)
          .put({ type: '@COMPONENT.SFOX_LOADING' })
          .provide([[matchers.call.fn(coreSagas.data.sfox.signup)]])
          .provide([
            [select(selectors.core.data.sfox.getProfile), profileError]
          ])
          .put({ type: '@COMPONENT.SFOX_NOT_ASKED' })
          .run()
      })
    })
  })

  describe('sfox set bank', () => {
    let { setBank } = sfoxSagas({
      coreSagas,
      networks
    })

    it('should call core setBankAccount and display success', () => {
      let fakeBank = { id: 5, name: 'Bitcoin Bank' }
      return expectSaga(setBank)
        .provide([
          [matchers.call.fn(coreSagas.data.sfox.setBankAccount), fakeBank]
        ])
        .put(actions.alerts.displaySuccess(C.BANK_ACCOUNT_SET_SUCCESS))
        .put(actions.modals.closeAllModals())
        .run()
    })

    it('logs an error', () => {
      const error = new Error('Error Setting Bank')
      return expectSaga(setBank)
        .provide([
          [
            matchers.call.fn(coreSagas.data.sfox.setBankAccount),
            throwError(error)
          ]
        ])
        .put(actions.logs.logErrorMessage(logLocation, 'setBank', error))
        .run()
    })
  })

  describe('sfox handle quote', () => {
    const { submitQuote, prepareAddress } = sfoxSagas({
      coreSagas,
      networks
    })
    const quoteId = '12345'
    const quoteCurrency = 'USD'
    const quoteAmount = 100

    const action = {
      payload: {
        quoteId,
        quoteCurrency,
        quoteAmount
      }
    }

    const saga = testSaga(submitQuote, action)
    const beforeResponse = 'beforeResponse'

    const nextAddressData = {
      address: '1masdfasdflkjo',
      index: 0,
      accountIndex: 0
    }

    it('should trigger the loading state', () => {
      saga.next().put(sfoxActions.sfoxLoading())
    })

    it('should call prepareAddress', () => {
      saga.next().call(prepareAddress)
    })

    it('should call handleTrade', () => {
      saga
        .next(nextAddressData)
        .call(coreSagas.data.sfox.handleTrade, action.payload, nextAddressData)
        .save(beforeResponse)
    })

    it('should trigger success if response is not an error', () => {
      const trade = { id: 5 }
      saga.next(trade).put(sfoxActions.sfoxSuccess())
    })

    it('should enable sift science', () => {
      saga.next().put(sfoxActions.enableSiftScience())
    })

    it('should select the phoneCallRequestSent status', () => {
      saga.next().select(selectors.core.kvStore.buySell.getSfoxPhoneCall)
    })

    it('should change the tab', () => {
      saga
        .next(Remote.of(true))
        .put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
    })

    it('should show the tradeDetails modal', () => {
      let trade = { id: 5 }
      saga
        .next(trade)
        .put(actions.modals.showModal('SfoxTradeDetails', { trade }))
    })

    it('should throw if response is not a trade', () => {
      const response = new Error({ message: 'ERROR' })
      saga
        .restore(beforeResponse)
        .next(response)
        // First yield in catch block
        .put(sfoxActions.sfoxFailure(response))
        .next()
        .put(actions.logs.logErrorMessage(logLocation, 'submitQuote', response))
    })
  })

  describe('sfox prepareAddress', () => {
    const { prepareAddress } = sfoxSagas({
      coreSagas
    })

    const saga = testSaga(prepareAddress)

    it('should select the state', () => {
      saga.next().select()
    })
  })

  describe('sfox setProfile', () => {
    const { setProfile } = sfoxSagas({
      coreSagas,
      networks
    })

    const firstName = 'satoshi'
    const lastName = 'nakamoto'
    const city = 'nyc'

    const data = {
      payload: {
        firstName,
        lastName,
        city
      }
    }

    const saga = testSaga(setProfile, data)
    const beforeDetermine = 'beforeDetermine'

    it('should call core setProfile with a payload', () => {
      saga.next().call(coreSagas.data.sfox.setProfile, data)
    })

    it('should select the profile', () => {
      saga
        .next()
        .select(selectors.core.data.sfox.getProfile)
        .save(beforeDetermine)
    })

    it('should determine the step to be funding', () => {
      const profile = { data: { verificationStatus: { required_docs: [] } } }
      saga.next(profile).put(sfoxActions.nextStep('funding'))
    })

    it('should determine the step to be upload', () => {
      const profile = {
        data: { verificationStatus: { required_docs: ['id'] } }
      }
      saga
        .restore(beforeDetermine)
        .next(profile)
        .put(sfoxActions.nextStep('upload'))
    })

    describe('error handling', () => {
      const errorProfile = { error: 'invalid_profile' }
      it('should log the error and put the action setVerifyError', () => {
        saga
          .restart()
          .next()
          .throw(errorProfile)
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'setProfile',
              errorProfile
            )
          )
          .next()
          .put(sfoxActions.setVerifyError(errorProfile))
      })
    })
  })

  describe('sfox submitMicroDeposits', () => {
    const { submitMicroDeposits } = sfoxSagas({
      coreSagas,
      networks
    })

    const deposit1 = '.02'
    const deposit2 = '.01'

    const data = {
      deposit1,
      deposit2
    }

    const saga = testSaga(submitMicroDeposits, data)
    const beforeDetermine = 'beforeDetermine'
    it('should trigger loading', () => {
      saga.next().put(sfoxActions.sfoxLoading())
    })

    it('should call core saga verifyMicroDeposits with the payload', () => {
      saga
        .next()
        .call(coreSagas.data.sfox.verifyMicroDeposits, data)
        .save(beforeDetermine)
    })

    it('should follow the success flow', () => {
      const response = { status: 'active' }

      saga.next(response).put(sfoxActions.sfoxSuccess())
    })

    it('should handle invalid amounts', () => {
      const response = { status: 'inactive' }
      saga
        .restore(beforeDetermine)
        .next(response)
        .put(sfoxActions.sfoxNotAsked())
    })

    it('should log and set failure state', () => {
      const response = new Error({ status: 'inactive' })
      saga
        .next(response)
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'submitMicroDeposits',
            response
          )
        )
        .next()
        .put(sfoxActions.sfoxFailure(response))
    })
  })

  describe('sfox upload', () => {
    const { upload } = sfoxSagas({
      coreSagas,
      networks
    })

    const data = {}

    const saga = testSaga(upload, data)

    it('should call the core', () => {
      saga.next().call(coreSagas.data.sfox.uploadDoc, data)
    })
    it('should select the profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })
    it('should go to funding if no required docs', () => {
      const profile = { data: { verificationStatus: { required_docs: [] } } }

      saga.next(profile).put(sfoxActions.nextStep('jumio'))
    })
    it('should handle errors', () => {
      const error = new Error()

      saga
        .restart()
        .next()
        .throw(error)
        .put(actions.logs.logErrorMessage(logLocation, 'upload', error))
        .next()
        .put(actions.alerts.displayError(C.DOCUMENT_UPLOAD_ERROR))
    })
  })

  describe('sfox setBankManually', () => {
    const { setBankManually } = sfoxSagas({
      coreSagas,
      networks
    })

    const action = {
      payload: {
        id: 1,
        number: 10510
      }
    }

    const saga = testSaga(setBankManually, action)

    it('should trigger loading', () => {
      saga.next().put(sfoxActions.sfoxLoading())
    })
    it('should call the core to set the bank', () => {
      saga.next().call(coreSagas.data.sfox.setBankManually, action.payload)
    })
    it('should select the accounts', () => {
      saga.next().select(selectors.core.data.sfox.getAccounts)
    })
    it('should set success', () => {
      const accounts = [{ id: 1 }]

      saga.next(accounts).put(sfoxActions.sfoxSuccess())
    })
    it('should handle an error', () => {
      const accounts = { error: '{"error": "set_bank_error"}' }

      saga
        .restart()
        .next()
        .put(sfoxActions.sfoxLoading())
        .next()
        .call(coreSagas.data.sfox.setBankManually, action.payload)
        .next()
        .select(selectors.core.data.sfox.getAccounts)
        .next(accounts)
        .put(
          actions.logs.logErrorMessage(
            logLocation,
            'setBankManually',
            new Error('set_bank_error')
          )
        )
        .next()
        .put(sfoxActions.sfoxFailure(new Error('set_bank_error')))
    })
  })

  describe('sfox checkProfileStatus', () => {
    const { checkProfileStatus } = sfoxSagas({
      coreSagas,
      networks
    })

    const saga = testSaga(checkProfileStatus)

    it('should select the profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })

    it('should select modals', () => {
      const profile = Remote.Failure({})
      saga.next(profile).select(selectors.modals.getModals)
    })

    it('should refetch profile', () => {
      const modals = [{ type: 'SfoxExchangeData' }]
      saga.next(modals).call(coreSagas.data.sfox.refetchProfile)
    })
  })

  describe('sfox submitSellQuote', () => {
    const { submitSellQuote } = sfoxSagas({
      coreSagas,
      networks
    })

    const action = {
      payload: {
        id: 1,
        quoteAmount: 100
      }
    }

    const beforeEnd = 'beforeEnd'

    const saga = testSaga(submitSellQuote, action)

    it('should prompt for second password', () => {
      saga.next().call(promptForSecondPassword)
    })

    it('should set loading', () => {
      const password = secondPassword
      saga.next(password).put(sfoxActions.sfoxLoading())
    })

    it('should call the core to sell', () => {
      const quote = { id: 1, quoteAmount: 100 }
      saga.next(quote).call(coreSagas.data.sfox.handleSellTrade, quote)
    })

    it('should select the state', () => {
      const trade = mockSellTrade
      saga.next(trade).select()
    })

    it('should create payment', () => {
      const state = {
        sfoxSignup: {
          payment: Remote.of(null)
        }
      }
      saga.next(state)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledTimes(1)
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        payment: state.sfoxSignup.payment.getOrElse({}),
        network: networks.btc
      })
    })

    it('should update the payment amount', () => {
      saga.next(paymentMock)

      expect(paymentMock.amount).toHaveBeenCalledTimes(1)
      expect(paymentMock.amount).toHaveBeenCalledWith(100)
    })

    it('should set payment.to to the trade receiveAddress', () => {
      saga.next(paymentMock)

      expect(paymentMock.to).toHaveBeenCalledTimes(1)
      expect(paymentMock.to).toHaveBeenCalledWith(tradeReceiveAddress)
    })

    it('should set a description', () => {
      saga.next(paymentMock)

      expect(paymentMock.description).toHaveBeenCalledTimes(1)
      expect(paymentMock.description).toHaveBeenCalledWith(
        'Exchange Trade SFX-12345'
      )
    })

    it('should call payment.build', () => {
      saga.next(paymentMock)

      expect(paymentMock.build).toHaveBeenCalledTimes(1)
    })

    it('should call payment.sign with the second password', () => {
      saga.next(paymentMock)

      expect(paymentMock.sign).toHaveBeenCalledTimes(1)
      expect(paymentMock.sign).toHaveBeenCalledWith(secondPassword)
    })

    it('should call payment.publish', () => {
      saga.next(paymentMock)

      expect(paymentMock.publish).toHaveBeenCalledTimes(1)
    })

    it('should fetch btc data', () => {
      saga.next(paymentMock).put(actions.core.data.bitcoin.fetchData())
    })

    it('should set a tx note', () => {
      saga
        .next(paymentMock)
        .put(
          actions.core.wallet.setTransactionNote(
            paymentMock.value().txId,
            paymentMock.value().description
          )
        )
    })

    it('should set success state', () => {
      saga.next().put(sfoxActions.sfoxSuccess())
    })

    it('should change the form to order_history', () => {
      saga
        .next()
        .put(actions.form.change('buySellTabStatus', 'status', 'order_history'))
        .save(beforeEnd)
    })

    it('should show the trade details modal', () => {
      saga
        .next()
        .put(
          actions.modals.showModal('SfoxTradeDetails', { trade: mockSellTrade })
        )
    })

    describe('error handling', () => {
      const error = 'ERROR'
      it('should set failure and log the error', () => {
        saga
          .restore(beforeEnd)
          .throw(error)
          .put(sfoxActions.sfoxFailure(error))
          .next()
          .put(
            actions.logs.logErrorMessage(logLocation, 'submitSellQuote', error)
          )
      })
    })
  })

  describe('sfox initializeJumio', () => {
    const { initializeJumio, fetchJumioStatus } = sfoxSagas({
      coreSagas,
      networks
    })

    const saga = testSaga(initializeJumio)

    it('should call fetchJumioStatus saga', () => {
      saga.next().call(fetchJumioStatus)
    })

    it('should select bank accounts', () => {
      saga.next(undefined).select(selectors.core.data.sfox.getAccounts)
    })

    it('should prompt the user to confirm their id verification if missing_token and accounts', () => {
      saga.next(mockAccounts).call(confirm, {
        title: 'verify_identity_title',
        image: 'identity-verification',
        message: 'verify_identity_msg',
        confirm: 'confirm_verify_identity',
        cancel: 'cancel_verify_identity'
      })
    })

    it('should trigger SfoxExchangeData modal on jumio step', () => {
      saga
        .next(true)
        .put(actions.modals.showModal('SfoxExchangeData', { step: 'jumio' }))
    })
  })

  describe('sfox completeJumio', () => {
    const { completeJumio, fetchJumioStatus } = sfoxSagas({
      coreSagas,
      networks
    })

    const saga = testSaga(completeJumio)

    it('should select jumio token from kvStore', () => {
      saga.next().select(selectors.core.kvStore.buySell.getSfoxJumio)
    })
    it('should select bank accounts from sfox', () => {
      saga
        .next(Remote.of(mockJumioToken))
        .select(selectors.core.data.sfox.getAccounts)
    })
    it('should go to next step, funding', () => {
      saga.next(mockAccounts).put(actions.modals.closeAllModals())
    })
    it('should fetchJumioStatus', () => {
      saga.next().call(fetchJumioStatus)
    })
    it('should set the jumio token in kvStore', () => {
      const completedToken = mockJumioToken
      saga
        .next()
        .put(actions.core.kvStore.buySell.sfoxSetJumioToken(completedToken))
    })
  })

  describe('sfox fetchJumioStatus', () => {
    const { fetchJumioStatus } = sfoxSagas({ coreSagas, networks })

    const saga = testSaga(fetchJumioStatus)

    it('should set jumioStatus to loading', () => {
      saga.next().put(sfoxActions.fetchJumioStatusLoading())
    })
    it('should select the users sfox profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })
    it('should select jumio token from kvStore', () => {
      saga.next(mockProfile).select(selectors.core.kvStore.buySell.getSfoxJumio)
    })
    it('should fetchJumioStatus from sfox', () => {
      const profile = mockProfile.getOrElse({})
      const token = mockJumioToken
      saga
        .next(Remote.of(mockJumioToken))
        .apply(profile, profile.fetchJumioStatus, [token.id])
    })
    it('should put successful status', () => {
      saga
        .next(mockJumioStatus)
        .put(sfoxActions.fetchJumioStatusSuccess(mockJumioStatus))
    })
    it('should return success payload', () => {
      saga.next().isDone()
    })
  })

  describe('sfox fetchJumioToken', () => {
    const { fetchJumioToken, fetchJumioStatus } = sfoxSagas({
      coreSagas,
      networks
    })

    const saga = testSaga(fetchJumioToken)

    it('should set jumioToken to loading', () => {
      saga.next().put(sfoxActions.fetchJumioTokenLoading())
    })
    it('should select the users sfox profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })
    it('should fetchJumioToken from sfox', () => {
      const profile = mockProfile.getOrElse({})
      saga.next(mockProfile).apply(profile, profile.fetchJumioToken)
    })
    it('should set jumio token to kvStore', () => {
      saga
        .next(mockJumioToken)
        .put(actions.core.kvStore.buySell.sfoxSetJumioToken(mockJumioToken))
    })
    it('should set jumioToken to success', () => {
      saga.next().put(sfoxActions.fetchJumioTokenSuccess(mockJumioToken))
    })
    it('should refresh jumioStatus', () => {
      saga.next().call(fetchJumioStatus)
    })
  })

  describe('sfox initializePayment', () => {
    let { initializePayment } = sfoxSagas({ coreSagas, networks })

    let saga = testSaga(initializePayment)

    it('should set loading', () => {
      saga.next(paymentMock).put(sfoxActions.sfoxSellBtcPaymentUpdatedLoading())
    })
    it('should create the payment', () => {
      saga.next(paymentMock)
      expect(coreSagas.payment.btc.create).toHaveBeenCalled()
      expect(coreSagas.payment.btc.create).toHaveBeenCalledWith({
        network: networks.btc
      })
    })
    it('should call init on the payment', () => {
      saga.next(paymentMock)
      expect(paymentMock.init).toHaveBeenCalled()
    })
    it('should update payment from', () => {
      saga.next(paymentMock)
      expect(paymentMock.from).toHaveBeenCalled()
    })
    it('should update the payment fee', () => {
      saga.next(paymentMock)
      expect(paymentMock.fee).toHaveBeenCalled()
    })
    it('should call payment value', () => {
      saga.next(paymentMock)
      expect(paymentMock.value).toHaveBeenCalled()
    })

    describe('error handling', () => {
      const error = { error: 'some_error' }
      it('should dispatch a failure action then log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(sfoxActions.sfoxSellBtcPaymentUpdatedFailure(error))
          .next()
          .put(
            actions.logs.logErrorMessage(
              logLocation,
              'initializePayment',
              error
            )
          )
      })
    })
  })

  describe('sfox initialize', () => {
    const quote = { amt: 1e8, baseCurrency: 'BTC', quoteCurrency: 'USD' }
    let { sfoxInitialize } = sfoxSagas({ coreSagas, networks })

    let saga = testSaga(sfoxInitialize)

    it('should fetch trades', () => {
      saga.next().put(actions.core.data.sfox.fetchTrades())
    })
    it('should fetch the profile', () => {
      saga.next().put(actions.core.data.sfox.fetchProfile())
    })
    it('should fetch accounts', () => {
      saga.next().put(actions.core.data.sfox.sfoxFetchAccounts())
    })
    it('should fetch a buy quote', () => {
      saga.next().put(
        actions.core.data.sfox.fetchQuote({
          quote
        })
      )
    })
    it('should fetch a sell quote', () => {
      saga.next().put(actions.core.data.sfox.fetchSellQuote({ quote }))
    })
    it('should initialize the payment', () => {
      saga.next().put(sfoxActions.initializePayment())
    })
    it('should set the sfox busy status to not asked', () => {
      saga.next().put(sfoxActions.sfoxNotAsked())
    })

    describe('error handling', () => {
      const error = { error: 'ERROR' }
      it('should log the error', () => {
        saga
          .restart()
          .next()
          .throw(error)
          .put(
            actions.logs.logErrorMessage(logLocation, 'sfoxInitialize', error)
          )
      })
    })
  })

  describe('confirm phone call', () => {
    const SMS_NUMBER = Remote.of('5555555555')
    const trade = {
      id: 1
    }
    let { __confirmPhoneCall } = sfoxSagas({ coreSagas, networks })

    let saga = testSaga(__confirmPhoneCall, trade)

    it('should select the smsNumber', () => {
      saga.next().select(selectors.core.settings.getSmsNumber)
    })

    it('should call the confirm modal', () => {
      saga.next(SMS_NUMBER).call(confirm, {
        title: CC.PHONE_CALL_TITLE,
        message: CC.PHONE_CALL_MSG,
        confirm: CC.CONFIRM_PHONE_CALL,
        cancel: CC.CANCEL_PHONE_CALL,
        messageValues: { smsNumber: '5555555555' }
      })
    })

    it('should set sfoxPhoneCall to true', () => {
      saga.next(true).put(actions.core.kvStore.buySell.sfoxSetPhoneCall(true))
    })
    it('should select the profile', () => {
      saga.next().select(selectors.core.data.sfox.getProfile)
    })
  })
})
