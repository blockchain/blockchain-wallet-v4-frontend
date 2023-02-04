import { Remote } from '@core'

import { XLM } from '../../kvStore/config'
import { dataPath, kvStorePath } from '../../paths'
import { getContext } from './selectors'

const id1 = 'GDXM5GK655MW2LGM6RV5DAYPO6U6RQ5KHR5Z43KBZAE265WGZGNFCD75'
const id2 = 'GAIVP73R2Z7F6XIAUH7L6M2U4BCOMHILYNPAJYQBJYA5K87LQIJD6DSP'
const balance1 = '2.9999999'
const balance2 = '2.0000001'
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

describe('getContext', () => {
  it('should get all unique wallet accounts', () => {
    expect(getContext(state)).toEqual([id1])
  })
})
