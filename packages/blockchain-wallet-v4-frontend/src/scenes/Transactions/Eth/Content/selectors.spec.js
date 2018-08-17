import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'

describe('Eth Transactions selectors', () => {
  describe('getData', () => {
    it('should return the correct transaction(s)', () => {
      var mockParams = {
        form: {
          ethTransactions: {
            search: '0xc92b73e4cccaf5b44b2ce0e4133d44b6df120a533cdacddb7014513c9abe05cd',
            status: ''
          }
        },
        core: {
          common: {
            eth: {
              getWalletTransactions: [
                {
                  data: [
                    {
                      amount: 123456,
                      hash:
                        '0xc92b73e4cccaf5b44b2ce0e4133d44b6df120a533cdacddb7014513c9abe05cd',
                      type: 'received',
                      from: '0x0C579743a1405955537F73C5f1832a8bF133165b',
                      to: 'My Ether Wallet'
                    },
                    {
                      amount: 35215,
                      hash:
                        'asdfjl245uy2ljflj2r082347892jlkaoquvnx,3e8402157fhvlsieuro23r235',
                      type: 'sent',
                      from: '0x0C579743a1405955537F73C5f1832a8bF133165b',
                      to: 'My Ether Wallet'
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
          }
        }
      }

      const selected = getData.resultFunc(
        mockParams.form.ethTransactions,
        mockParams.core.common.eth.getWalletTransactions,
        mockParams.core.kvStore.buySell.getMetaData
      )

      expect(selected.pages).toEqual([
        {
          data: [mockParams.core.common.eth.getWalletTransactions[0].data[0]]
        }
      ])
      expect(selected.empty).toEqual(false)
      expect(selected.buysellPartner).toEqual(undefined)
    })
  })
})
