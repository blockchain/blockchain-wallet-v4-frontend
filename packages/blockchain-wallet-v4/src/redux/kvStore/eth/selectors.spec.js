import Remote from '../../../remote'
import { ETH } from '../config'
import * as selectors from './selectors'

describe('kvstore eth selectors', () => {
  const accounts = [
    {
      addr: 'some address',
      label: 'some label'
    },
    {
      addr: 'second address',
      label: 'second label'
    }
  ]

  const ethMetadata = {
    value: {
      ethereum: {
        accounts,
        last_tx: 'this is the last tx',
        last_tx_timestamp: 'this is the last tx timestamp',
        legacy_account: { addr: 'legacy account addr' },
        tx_notes: {
          someTxHash: 'some someTxHash tx note'
        }
      }
    }
  }

  const successState = {
    kvStorePath: {
      [ETH]: Remote.Success(ethMetadata)
    }
  }

  it('getMetadata should return success of metadata', () => {
    const expectedResult = Remote.Success(ethMetadata)
    expect(selectors.getMetadata(successState)).toEqual(expectedResult)
  })

  it('getAccounts should return success of accounts', () => {
    const expectedResult = Remote.Success(accounts)
    expect(selectors.getAccounts(successState)).toEqual(expectedResult)
  })

  it('getDefaultAccount should return success of default account', () => {
    const expectedResult = Remote.Success({
      addr: 'some address',
      label: 'some label'
    })
    expect(selectors.getDefaultAccount(successState)).toEqual(expectedResult)
  })

  it('getDefaultAddress should return success of default account address', () => {
    const expectedResult = Remote.Success('some address')
    expect(selectors.getDefaultAddress(successState)).toEqual(expectedResult)
  })

  it('getDefaultLabel should return success of default account label', () => {
    const expectedResult = Remote.Success('some label')
    expect(selectors.getDefaultLabel(successState)).toEqual(expectedResult)
  })

  it('getLegacyAccount should return success of legacy account', () => {
    const expectedResult = Remote.Success({ addr: 'legacy account addr' })
    expect(selectors.getLegacyAccount(successState)).toEqual(expectedResult)
  })

  it('getLegacyAccountAddress should return success of legacy account address', () => {
    const expectedResult = Remote.Success('legacy account addr')
    expect(selectors.getLegacyAccountAddress(successState)).toEqual(
      expectedResult
    )
  })

  it('getAccount should return success of account', () => {
    const expectedResult = Remote.Success({
      addr: 'second address',
      label: 'second label'
    })
    expect(selectors.getAccount(successState, 'second address')).toEqual(
      expectedResult
    )
  })

  it('getAccountLabel should return success of account label', () => {
    const expectedResult = Remote.Success('second label')
    expect(selectors.getAccountLabel(successState, 'second address')).toEqual(
      expectedResult
    )
  })

  it('getAccountIndex should return success of account index', () => {
    const expectedResult = Remote.Success(1)
    expect(selectors.getAccountIndex(successState, 'second address')).toEqual(
      expectedResult
    )
  })

  it('getEthTxNote should return success of correct eth tx note', () => {
    const expectedResult = Remote.Success('some someTxHash tx note')
    expect(selectors.getEthTxNote(successState, 'someTxHash')).toEqual(
      expectedResult
    )
  })

  it('getLatestTx should return success of latest tx', () => {
    const expectedResult = Remote.Success('this is the last tx')
    expect(selectors.getLatestTx(successState, 'address')).toEqual(
      expectedResult
    )
  })

  it('getLatestTxTimestamp should return success of latest tx timestamp', () => {
    const expectedResult = Remote.Success('this is the last tx timestamp')
    expect(selectors.getLatestTxTimestamp(successState, 'address')).toEqual(
      expectedResult
    )
  })
})
