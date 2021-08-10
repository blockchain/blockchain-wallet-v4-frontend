import { Remote } from 'blockchain-wallet-v4/src'

import { XLM } from '../../kvStore/config'
import { dataPath, kvStorePath } from '../../paths'
import { getBalance, getContext, getTotalBalance } from './selectors'

const id1 = 'GDXM5GK655MW2LGM6RV5DAYPO6U6RQ5KHR5Z43KBZAE265WGZGNFCD75'
const id2 = 'GAIVP73R2Z7F6XIAUH7L6M2U4BCOMHILYNPAJYQBJYA5K87LQIJD6DSP'
const id3 = 'GAIVP73R2Z7F6XIAUH7L6M2U4BCOMHILYNPAJYQBJYA5K87LQIJD6DSL'
const balance1 = '2.9999999'
const balance1Stroops = '29999999'
const balance2 = '2.0000001'
const balance2Stroops = '20000001'
const totalBalanceStroopsNumber = 50000000
const state = {
  [dataPath]: {
    xlm: {
      data: {
        [id1]: Remote.of({
          account_id: id1,
          balances: [
            {
              asset_type: 'native',
              balance: balance1,
              buying_liabilities: '0.0000000',
              selling_liabilities: '0.0000000'
            }
          ],
          id: id1
        }),
        [id2]: Remote.of({
          account_id: id2,
          balances: [
            {
              asset_type: 'native',
              balance: balance2,
              buying_liabilities: '0.0000000',
              selling_liabilities: '0.0000000'
            }
          ],
          id: id2
        })
      }
    }
  },
  [kvStorePath]: {
    [XLM]: Remote.of({
      value: {
        accounts: [{ publicKey: id1 }, { publicKey: id2 }]
      }
    })
  }
}

describe('getBalance', () => {
  it('should get xlm account native balance in stroops by id', () => {
    expect(getBalance(state)(id1)).toEqual(Remote.of(balance1Stroops))
    expect(getBalance(state)(id2)).toEqual(Remote.of(balance2Stroops))
  })
  it('should return Remote.NotAsked if account was not found', () => {
    expect(getBalance(state)(id3)).toEqual(Remote.NotAsked)
  })
})

describe('getTotalBalance', () => {
  it('should get sum balance for all unique accounts in stroops as number', () => {
    expect(getTotalBalance(state)).toEqual(Remote.of(totalBalanceStroopsNumber))
  })
})

describe('getContext', () => {
  it('should get all unique wallets', () => {
    expect(getContext(state)).toEqual([id1, id2])
  })
})
