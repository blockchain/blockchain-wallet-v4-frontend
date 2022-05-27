
import { call, put, select } from 'redux-saga/effects'

import * as S from 'data/components/debitCard/selectors'
import { AccountType } from 'data/components/debitCard/types'

import sagas from './sagas'
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
    const eligibleAccountsMock = []
    eligibleAccountsMock.push(accountMock)

    describe('success flow with currentAccount data', () => {
      const generator = saga(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    describe('success flow with currentAccount data2', () => {
      const generator = cloneableGenerator(saga)(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    describe('success flow with currentAccount data3', () => {
      const generator = cloneableGenerator(saga)(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    describe('success flow with currentAccount data4', () => {
      const generator = cloneableGenerator(saga)(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    describe('success flow with currentAccount data5', () => {
      const generator = cloneableGenerator(saga)(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    describe('success flow with currentAccount data6', () => {
      const generator = cloneableGenerator(saga)(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })

    describe('success flow with currentAccount data7', () => {
      const generator = cloneableGenerator(saga)(CARD_ID)

      it('should yields select getEligibleAccounts', () => {
        const actual = generator.next().value
        const expected = select(S.getEligibleAccounts)

        expect(actual).toEqual(expected)
      })

      it('should yields put getCurrentCardAccountLoading', () => {
        const actual = generator.next(eligibleAccountsMock).value
        const expected = put(A.getCurrentCardAccountLoading())

        expect(actual).toEqual(expected)
      })

      it('should yield call getDCCurrentAccount', () => {
        const actual = generator.next().value

        const expected = call(api.getDCCurrentAccount, CARD_ID)
        expect(actual).toEqual(expected)
      })

      it('should yield put getCurrentCardAccountSuccess', () => {
        const actual = generator.next(currentAccountSelectedMock).value
        const expected = put(A.getCurrentCardAccountSuccess(accountMock))

        expect(actual).toEqual(expected)
      })

      it('should be done', () => {
        const actual = generator.next().done
        const expected = true

        expect(actual).toEqual(expected)
      })
    })
    // describe('success flow without currentAccount data', () => {
    //   const generator = cloneableGenerator(saga)(CARD_ID)
    //
    //   it('should yields select getEligibleAccounts', () => {
    //     const actual = generator.next().value
    //     const expected = select(S.getEligibleAccounts)
    //
    //     expect(actual).toEqual(expected)
    //   })
    //
    //   it('should yields put getCurrentCardAccountLoading', () => {
    //     const actual = generator.next(eligibleAccountsMock).value
    //     const expected = put(A.getCurrentCardAccountLoading())
    //
    //     expect(actual).toEqual(expected)
    //   })
    //
    //   it('should yield call getDCCurrentAccount', () => {
    //     const actual = generator.next().value
    //
    //     const expected = call(api.getDCCurrentAccount, CARD_ID)
    //     expect(actual).toEqual(expected)
    //   })
    //
    //   it('should yield put getCurrentCardAccountSuccess', () => {
    //     const actual = generator.next().value
    //     const expected = put(A.getCurrentCardAccountSuccess(accountMock))
    //
    //     expect(actual).toEqual(expected)
    //   })
    //
    //   it('should be done', () => {
    //     const actual = generator.next().done
    //     const expected = true
    //
    //     expect(actual).toEqual(expected)
    //   })
    // })
  })
})
