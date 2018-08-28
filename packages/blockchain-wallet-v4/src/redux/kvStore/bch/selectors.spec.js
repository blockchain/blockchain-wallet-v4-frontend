import { assocPath, merge } from 'ramda'
import Remote from '../../../remote'
import * as selectors from './selectors'
import { createMockState, walletV3, walletV3WithLegacy } from '../../../../data'

describe('kvstore bch selectors', () => {
  const accounts = [
    { label: 'a', archived: false },
    { label: 'b', archived: false },
    { label: 'c', archived: true }
  ]

  const bchMetadata = {
    value: {
      accounts,
      default_account_idx: 2,
      tx_notes: {
        dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2: 'tx'
      }
    }
  }

  const successState = {
    kvStorePath: {
      bch: Remote.Success(bchMetadata)
    }
  }

  const mockState = merge(createMockState(walletV3), successState)
  const mockStateLegacy = merge(
    createMockState(walletV3WithLegacy),
    successState
  )

  describe('getContext', () => {
    it('should return the context', () => {
      let context = selectors.getContext(mockState)
      expect(context).toEqual([
        'xpub6CaQke7DZA2WPRTKy954mx52b1duxkXoPbeB1teNEMzR7oLsg2XoCnUwMbK8WDvKJYfuvWxfeH2f7HdoyGDEZs7Kj11AuQiKeJhLBd2GciM'
      ])
    })

    it('should return context with legacy and watch-only addresses', () => {
      let context = selectors.getContext(mockStateLegacy)
      expect(context).toEqual([
        'xpub6CaQke7DZA2WPRTKy954mx52b1duxkXoPbeB1teNEMzR7oLsg2XoCnUwMbK8WDvKJYfuvWxfeH2f7HdoyGDEZs7Kj11AuQiKeJhLBd2GciM',
        '1EGW5YZs4EXExhLiCVvRXTRVmfLjs69bZc',
        '12BeccoHhdZ5DtoZbuphji1FbQEgNNhy3P'
      ])
    })
  })

  describe('getSpendableContext', () => {
    it('should return the context', () => {
      let context = selectors.getSpendableContext(mockState)
      expect(context).toEqual([
        'xpub6CaQke7DZA2WPRTKy954mx52b1duxkXoPbeB1teNEMzR7oLsg2XoCnUwMbK8WDvKJYfuvWxfeH2f7HdoyGDEZs7Kj11AuQiKeJhLBd2GciM'
      ])
    })

    it('should return context with legacy addresses', () => {
      let context = selectors.getSpendableContext(mockStateLegacy)
      expect(context).toEqual([
        'xpub6CaQke7DZA2WPRTKy954mx52b1duxkXoPbeB1teNEMzR7oLsg2XoCnUwMbK8WDvKJYfuvWxfeH2f7HdoyGDEZs7Kj11AuQiKeJhLBd2GciM',
        '1EGW5YZs4EXExhLiCVvRXTRVmfLjs69bZc'
      ])
    })
  })

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(bchMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getAccounts should return success of accounts', () => {
    const expectedResult = Remote.Success(accounts)
    expect(selectors.getAccounts(successState)).toEqual(expectedResult)
  })

  it('getDefaultAccountIndex should return success of default account index', () => {
    const expectedResult = Remote.Success(2)
    expect(selectors.getDefaultAccountIndex(successState)).toEqual(
      expectedResult
    )
  })

  it('getAccountLabel should return success of account label', () => {
    const expectedResult = Remote.Success('b')
    expect(selectors.getAccountLabel(successState)(1)).toEqual(expectedResult)
  })

  it('getBchTxNote should return success of correct bch tx note', () => {
    const expectedResult = Remote.Success('tx')
    expect(
      selectors.getBchTxNote(
        successState,
        'dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2'
      )
    ).toEqual(expectedResult)
  })

  const loadingState = assocPath(
    ['kvStorePath', 'bch'],
    Remote.Loading,
    successState
  )

  it('getMetadata should return metadata', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getMetadata(loadingState)).toEqual(expectedResult)
  })

  it('getAccounts should return loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getAccounts(loadingState)).toEqual(expectedResult)
  })

  it('getDefaultAccountIndex should return loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getDefaultAccountIndex(loadingState)).toEqual(
      expectedResult
    )
  })

  it('getAccountLabel should return loading', () => {
    const expectedResult = Remote.Loading
    expect(selectors.getAccountLabel(loadingState)(1)).toEqual(expectedResult)
  })

  it('getBchTxNote should return loading', () => {
    const expectedResult = Remote.Loading
    expect(
      selectors.getBchTxNote(
        loadingState,
        'dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2'
      )
    ).toEqual(expectedResult)
  })
})
