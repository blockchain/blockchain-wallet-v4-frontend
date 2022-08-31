import { call, put, select } from 'redux-saga/effects'

import sagas from './sagas'
import { getCurrentCardSelected, getEligibleAccountsData } from './selectors'
import { actions as A } from './slice'

const API_MOCK = {
  getDCCurrentAccount: jest.fn()
}

jest.mock('data/modules/profile/sagas', () => () => ({
  waitForUserData: jest.fn()
}))

describe('debitCard sagas', () => {
  const api = API_MOCK
  const coreSagas = null
  const networks = null
  const CARD_ID = 'some-id'

  const debitCardSagas = sagas({ api, coreSagas, networks })

  describe('getCurrentCardAccount', () => {
    const saga = debitCardSagas.getCurrentCardAccount
    const currentAccountSelectedMock = { accountCurrency: 'USD' }
    const accountMock = { balance: { symbol: 'USD', value: '1' } }
    const eligibleAccountsMock = [accountMock]
    const selectedCard = { id: CARD_ID }

    const validateYieldSelectGetCurrentCardSelected = (generator) => {
      const actual = generator.next().value
      const expected = select(getCurrentCardSelected)

      expect(actual).toEqual(expected)
    }
    const validateYieldSelectGetEligibleAccountsData = (generator) => {
      const actual = generator.next(selectedCard).value
      const expected = select(getEligibleAccountsData)

      expect(actual).toEqual(expected)
    }
    const validateYieldPutGetCurrentCardAccountLoading = (generator) => {
      const actual = generator.next(eligibleAccountsMock).value
      const expected = put(A.getCurrentCardAccountLoading())

      expect(actual).toEqual(expected)
    }
    const validateYieldCallGetDCCurrentAccount = (generator) => {
      const actual = generator.next().value

      const expected = call(api.getDCCurrentAccount, CARD_ID)
      expect(actual).toEqual(expected)
    }

    const validateShouldBeDone = (generator) => {
      const actual = generator.next().done
      const expected = true

      expect(actual).toEqual(expected)
    }

    describe('success flow with currentAccount data', () => {
      const generator = saga()

      it('should yields select getCurrentCardSelected', () => {
        validateYieldSelectGetCurrentCardSelected(generator)
      })

      it('should yields select getEligibleAccountsData', () => {
        validateYieldSelectGetEligibleAccountsData(generator)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        validateYieldPutGetCurrentCardAccountLoading(generator)
      })

      it('should yield call getDCCurrentAccount', () => {
        validateYieldCallGetDCCurrentAccount(generator)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        validateShouldBeDone(generator)
      })
    })

    describe('no current account obtained from API', () => {
      const generator = saga()

      it('should yields select getCurrentCardSelected', () => {
        validateYieldSelectGetCurrentCardSelected(generator)
      })

      it('should yields select getEligibleAccounts', () => {
        validateYieldSelectGetEligibleAccountsData(generator)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        validateYieldPutGetCurrentCardAccountLoading(generator)
      })

      it('should yield call getDCCurrentAccount', () => {
        validateYieldCallGetDCCurrentAccount(generator)
      })

      it('should yield put getCurrentCardAccountFailure', () => {
        const noCurrentAccountResponse = { accountCurrency: null }
        const actual = generator.next(noCurrentAccountResponse).value
        const expected = put(
          A.getCurrentCardAccountFailure('Could not get current user funds, no_funds_obtained')
        )

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        validateShouldBeDone(generator)
      })
    })

    describe('current account mismatch with existing eligible accounts', () => {
      const generator = saga()

      it('should yields select getCurrentCardSelected', () => {
        validateYieldSelectGetCurrentCardSelected(generator)
      })

      it('should yields select getEligibleAccounts', () => {
        validateYieldSelectGetEligibleAccountsData(generator)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        validateYieldPutGetCurrentCardAccountLoading(generator)
      })

      it('should yield call getDCCurrentAccount', () => {
        validateYieldCallGetDCCurrentAccount(generator)
      })

      it('should yield put getCurrentCardAccountFailure', () => {
        const noCurrentAccountResponse = { accountCurrency: 'ARS' }
        const actual = generator.next(noCurrentAccountResponse).value
        const expected = put(
          A.getCurrentCardAccountFailure('Could not get current user funds, no_funds_obtained')
        )

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        validateShouldBeDone(generator)
      })
    })
  })
})
