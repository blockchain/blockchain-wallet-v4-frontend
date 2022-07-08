import BigNumber from 'blockchain-wallet-v4-frontend/node_modules/bignumber.js/bignumber'
import { ethers } from 'ethers'

import { UnhashedOrder, WyvernSchemaName } from '@core/network/api/nfts/types'

import { WETH_CONTRACT_MAINNET } from '../constants'

// staging wallet (no funds)
// 0bd645c6-4b5b-44c5-a857-3233c2a01c79 / blockchain
// yard struggle suffer grass bean festival thrive episode pony wet atom minimum

export const MockWallet = ethers.Wallet.fromMnemonic(
  'yard struggle suffer grass bean festival thrive episode pony wet atom minimum',
  `m/44'/60'/0'/0/0`
)

export const MockProvider = ethers.providers.getDefaultProvider(
  `https://api.blockchain.info/eth/nodes/rpc`,
  {
    eth_chainId: 1
  }
)

export const MockSigner = new ethers.Wallet(MockWallet.privateKey, MockProvider)

export const MockUnhashedOrder: UnhashedOrder = {
  basePrice: '1000000000000000000',
  calldata:
    '0x23b872dd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000489b25a2a976dcfc3314b2e1175881353be19d9900000000000000000000000000000000000000000000000000000000000026df',
  exchange: '0x7f268357a8c2552623316e2562d90e642bb538e5',
  expirationTime: new BigNumber('1647284861'),
  extra: '0',
  feeMethod: 1,
  feeRecipient: '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073',
  howToCall: 0,
  listingTime: new BigNumber('1646683562'),
  maker: '0x489B25a2a976dcfC3314b2E1175881353be19d99',
  makerProtocolFee: new BigNumber('0'),
  makerReferrerFee: new BigNumber('0'),
  makerRelayerFee: new BigNumber('0'),
  metadata: {
    asset: {
      address: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
      id: '9951',
      quantity: '1'
    },
    schema: WyvernSchemaName.ERC721
  },
  paymentToken: WETH_CONTRACT_MAINNET,
  quantity: new BigNumber('1'),
  replacementPattern:
    '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  saleKind: 0,
  salt: '8885027740115040230912428262685539478404074301434996936260647137170515853570',
  side: 0,
  staticExtradata: '0x',
  staticTarget: '0x0000000000000000000000000000000000000000',
  taker: '0x0000000000000000000000000000000000000000',
  takerProtocolFee: new BigNumber('0'),
  takerRelayerFee: new BigNumber('500'),
  target: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
  waitingForBestCounterOrder: false
}
