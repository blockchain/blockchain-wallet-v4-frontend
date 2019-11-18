import { HDWallet, serializer } from './index'

const walletFixture = require('./__mocks__/wallet.v3')

describe('HDWallet', () => {
  const hdWalletFixture = walletFixture.hd_wallets[0]
  const hdWallet = HDWallet.fromJS(hdWalletFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDWallet.toJS(hdWallet)).toEqual(hdWalletFixture)
    })
  })

  describe('properties', () => {
    it('should have a seedHex', () => {
      expect(hdWallet.seedHex).toEqual(hdWalletFixture.seed_hex)
    })
  })

  it(`generateAccount`, () => {
    expect(
      HDWallet.generateAccount(
        `xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi`,
        `label`
      ).toJS()
    ).toEqual({
      label: 'label',
      archived: false,
      xpriv:
        'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
      xpub:
        'xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8',
      address_labels: {},
      cache: {
        receiveAccount:
          'xpub68Gmy5EVb2BdFbj2LpWrk1M7obNuaPTpT5oh9QCCo5sRfqSHVYWex97WpDZzszdzHzxXDAzPLVSwybe4uPYkSk4G3gnrPqqkV9RyNzAcNJ1',
        changeAccount:
          'xpub68Gmy5EVb2BdHTYHpekwGdcbBWax19w9HwA2DaADYvuCSSgt4YAErxxSN1KWSnmyqkwRNbnTj3XiUBKmHeC8rTjLRPjSULcDKQQgfgJDppq'
      }
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(hdWallet)
      const newHDWallet = JSON.parse(string, serializer.reviver)
      expect(newHDWallet).toEqual(hdWallet)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(hdWallet)
      const newHDWallet = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newHDWallet)
      expect(string2).toEqual(string)
    })
  })
})
