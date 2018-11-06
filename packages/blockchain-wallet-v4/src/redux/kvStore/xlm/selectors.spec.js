import { prop } from 'ramda'

import Remote from '../../../remote'
import * as selectors from './selectors'

describe('kvstore stellar selectors', () => {
  const accounts = [
    {
      publicKey: 'GDRXE2BQUC3AZNPVFSCEZ76NJ3WWL25FYFK6RGZGIEKWE4SOOHSUJUJ6',
      secret: 'SBGWSG6BTNCKCOB3DIFBGCVMUPQFYPA2G4O34RMTB343OYPXU5DJDVMN',
      label: 'first account'
    },
    {
      publicKey: 'GAVXVW5MCK7Q66RIBWZZKZEDQTRXWCZUP4DIIFXCCENGW2P6W4OA34RH',
      secret: 'SAKS7I2PNDBE5SJSUSU2XLJ7K5XJ3V3K4UDFAHMSBQYPOKE247VHAGDB',
      label: 'second account'
    }
  ]

  const defaultIdx = 0

  const txNote = 'some someTxHash tx note'
  const txNoteHash = 'someTxHash'

  const ethMetadata = {
    value: {
      default_account_idx: defaultIdx,
      accounts,
      tx_notes: {
        [txNoteHash]: txNote
      }
    }
  }

  const successState = {
    kvStorePath: {
      xlm: Remote.Success(ethMetadata)
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

  it('getDefaultAccountIndex should return success of default account index', () => {
    const expectedResult = Remote.Success(defaultIdx)
    expect(selectors.getDefaultAccountIndex(successState)).toEqual(
      expectedResult
    )
  })

  it('getDefaultAccount should return success of default account', () => {
    const expectedResult = Remote.Success(accounts[defaultIdx])
    expect(selectors.getDefaultAccount(successState)).toEqual(expectedResult)
  })

  it('getDefaultAccountId should return success of default account public key', () => {
    const expectedResult = Remote.Success(accounts[defaultIdx].publicKey)
    expect(selectors.getDefaultAccountId(successState)).toEqual(expectedResult)
  })

  it('getDefaultLabel should return success of default account label', () => {
    const expectedResult = Remote.Success(accounts[defaultIdx].label)
    expect(selectors.getDefaultLabel(successState)).toEqual(expectedResult)
  })

  it('getAccount should return success of account', () => {
    const account = accounts[0]
    const expectedResult = Remote.Success(account)
    expect(selectors.getAccount(successState, account.publicKey)).toEqual(
      expectedResult
    )
  })

  it('getAccountLabel should return success of account label', () => {
    const account = accounts[0]
    const expectedResult = Remote.Success(account.label)
    expect(selectors.getAccountLabel(successState, account.publicKey)).toEqual(
      expectedResult
    )
  })

  it('getXlmTxNote should return success of correct xlm tx note', () => {
    const expectedResult = Remote.Success(txNote)
    expect(selectors.getXlmTxNote(successState, txNoteHash)).toEqual(
      expectedResult
    )
  })

  it('getContext should return success of all xlm addresses', () => {
    const expectedResult = Remote.Success(accounts.map(prop('publicKey')))
    expect(selectors.getContext(successState)).toEqual(expectedResult)
  })
})
