import { assocPath, merge } from 'ramda'
import Remote from '../../../remote'
import * as selectors from './selectors'
import {
  createMockWalletState,
  walletV3,
  walletV3WithLegacy
} from '../../../../data'

describe('kvstore bsv selectors', () => {
  const accounts = [
    { label: 'BSV A', archived: false },
    { label: 'BSV B', archived: false }
  ]

  const bsvMetadata = {
    value: {
      accounts,
      default_account_idx: 0,
      tx_notes: {
        dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2: 'tx'
      }
    }
  }

  const successState = {
    kvStorePath: {
      bsv: Remote.Success(bsvMetadata)
    }
  }

  const mockState = merge(createMockWalletState(walletV3), successState)
  const mockStateLegacy = merge(
    createMockWalletState(walletV3WithLegacy),
    successState
  )

  describe('getSpendableContext', () => {
    it('should return the context', () => {
      let context = selectors.getSpendableContext(mockState)
      expect(context).toEqual([
        'xpub6Cm98DdxftzzTxpUhj4CsiGRpFgLuxV33FsmjCreD9MtKY5NHeTyvhMw82aANb5GWaBGvGcey7skgcY9ZHk42KhyBXr23yYP5QYcAJzVz7D',
        'xpub6Cm98DdxftzzVidwASrWNe2Hg7WNXZ8nUvjZx6QveVH4d8Gaqx31NozqrupnCxGPqzVcatEJ8aDKfNfUuHxmfKD8dRDZ6NSFtXiWiwtW2Xh'
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

  describe('getUnspendableContext', () => {
    it('should return context with legacy and watch-only addresses', () => {
      let context = selectors.getUnspendableContext(mockStateLegacy)
      expect(context).toEqual(['12BeccoHhdZ5DtoZbuphji1FbQEgNNhy3P'])
    })
  })

  it('getMetadata should return success of metadata', () => {
    expect(selectors.getMetadata(successState)).toEqual(
      Remote.Success(bsvMetadata)
    )
  })

  it('getAccounts should return success of accounts', () => {
    expect(selectors.getAccounts(successState)).toEqual(
      Remote.Success(accounts)
    )
  })

  it('getDefaultAccountIndex should return success of default account index', () => {
    expect(selectors.getDefaultAccountIndex(successState)).toEqual(
      Remote.Success(0)
    )
  })

  it('getBsvTxNote should return success of correct bsv tx note', () => {
    const expectedResult = Remote.Success('tx')
    expect(
      selectors.getBsvTxNote(
        successState,
        'dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2'
      )
    ).toEqual(expectedResult)
  })

  const loadingState = assocPath(
    ['kvStorePath', 'bsv'],
    Remote.Loading,
    successState
  )

  it('getMetadata should return metadata', () => {
    expect(selectors.getMetadata(loadingState)).toEqual(Remote.Loading)
  })

  it('getAccounts should return loading', () => {
    expect(selectors.getAccounts(loadingState)).toEqual(Remote.Loading)
  })

  it('getDefaultAccountIndex should return loading', () => {
    expect(selectors.getDefaultAccountIndex(loadingState)).toEqual(
      Remote.Loading
    )
  })

  it('getbsvTxNote should return loading', () => {
    expect(
      selectors.getBsvTxNote(
        loadingState,
        'dadadece41f18f717c2910d0c7a4bb2ad27465d58f855c2d8b1a32fc764fa7b2'
      )
    ).toEqual(Remote.Loading)
  })
})
