import { ethers, Signer } from 'ethers'

import { NftOrdersType } from '@core/network/api/nfts/types'

import { wyvernABI } from './abi'
import { _makeMatchingOrder, assignOrdersToSides, NULL_BLOCK_HASH } from './utils'

export const fulfillNftOrder = async (order: NftOrdersType['orders'][0], signer: Signer) => {
  const accountAddress = await signer.getAddress()
  const txnData = { from: accountAddress, gas: 75000 }
  const matchingOrder = _makeMatchingOrder({
    accountAddress,
    order,
    recipientAddress: accountAddress
  })

  const { buy, sell } = assignOrdersToSides(order, matchingOrder)

  const args = [
    [
      buy.exchange,
      buy.maker,
      buy.taker,
      buy.feeRecipient,
      buy.target,
      buy.staticTarget,
      buy.paymentToken,
      sell.exchange,
      sell.maker,
      sell.taker,
      sell.feeRecipient,
      sell.target,
      sell.staticTarget,
      sell.paymentToken
    ],
    [
      buy.makerRelayerFee.toString(),
      buy.takerRelayerFee.toString(),
      buy.makerProtocolFee.toString(),
      buy.takerProtocolFee.toString(),
      buy.basePrice.toString(),
      buy.extra.toString(),
      buy.listingTime.toString(),
      buy.expirationTime.toString(),
      buy.salt.toString(),
      sell.makerRelayerFee.toString(),
      sell.takerRelayerFee.toString(),
      sell.makerProtocolFee.toString(),
      sell.takerProtocolFee.toString(),
      sell.basePrice.toString(),
      sell.extra.toString(),
      sell.listingTime.toString(),
      sell.expirationTime.toString(),
      sell.salt.toString()
    ],
    [
      buy.feeMethod,
      0,
      buy.saleKind,
      buy.howToCall,
      sell.feeMethod,
      sell.side,
      sell.saleKind,
      sell.howToCall
    ],
    buy.calldata,
    sell.calldata,
    buy.replacementPattern,
    sell.replacementPattern,
    buy.staticExtradata,
    sell.staticExtradata,
    [buy.v || 0, sell.v || 0],
    [buy.r, buy.s, sell.r, sell.s, NULL_BLOCK_HASH]
  ]

  const contract = new ethers.Contract(
    ethers.utils.getAddress('0x7be8076f4ea4a4ad08075c2508e481d6c946d12b'),
    wyvernABI,
    signer
  )

  try {
    const match = await contract.atomicMatch_(...args)
    debugger
  } catch (e) {
    console.log(e)
  }
}
