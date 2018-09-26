import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'

describe('Btc Transactions selectors', () => {
  describe('getData', () => {
    it('should return the correct transaction(s)', () => {
      var mockParams = {
        form: {
          btcTransactions: {
            search: '1HVYEkWQ7wmqR2jPTyiY6ru7jA35vh6Uq6',
            status: ''
          }
        },
        core: {
          common: {
            btc: {
              getWalletTransactions: [
                {
                  data: [
                    {
                      amount: 123456,
                      hash:
                        '8ba8eb225e18a484871aee5787db4394bb29bccd1ebccb23a572f76eb38dad25',
                      type: 'received',
                      from: '1HVYEkWQ7wmqR2jPTyiY6ru7jA35vh6Uq6',
                      to: 'My Bitcoin Wallet'
                    },
                    {
                      amount: 35215,
                      hash:
                        'asdfjl245uy2ljflj2r082347892jlkaoquvnx,3e8402157fhvlsieuro23r235',
                      type: 'sent',
                      from: '1LI1jd215NDKmnj21515kmHHKLKJ',
                      to: 'My Bitcoin Wallet'
                    }
                  ]
                }
              ]
            }
          },
          kvStore: {
            buySell: {
              getMetaData: Remote.of({})
            }
          },
          currency: Remote.of('USD')
        }
      }

      const selected = getData.resultFunc(
        mockParams.form.btcTransactions,
        mockParams.core.common.btc.getWalletTransactions,
        mockParams.core.kvStore.buySell.getMetaData,
        mockParams.core.currency
      )

      expect(selected.pages).toEqual([
        {
          data: [mockParams.core.common.btc.getWalletTransactions[0].data[0]]
        }
      ])
      expect(selected.empty).toEqual(false)
      expect(selected.currency).toEqual('USD')
      expect(selected.buysellPartner).toEqual(undefined)
    })
  })
})
