import { ethers, Signer } from 'ethers'

import { NftOrdersType } from '@core/network/api/nfts/types'

import { wyvernABI } from './abi'
import { _getMetadata, _makeMatchingOrder, assignOrdersToSides, NULL_BLOCK_HASH } from './utils'

export const fulfillNftOrder = async (order: NftOrdersType['orders'][0], signer: Signer) => {
  const accountAddress = await signer.getAddress()
  const txnData = { from: accountAddress, gas: 75000 }
  //   const matchingOrder = _makeMatchingOrder({
  //     accountAddress,
  //     order,
  //     recipientAddress: accountAddress
  //   })
  const { buy, sell } = assignOrdersToSides(order, order)
  console.log('buy', buy)
  console.log('sell', sell)
  const args = [
    [
      buy.exchange, // buy.exchange,
      accountAddress, // buy.maker,
      buy.maker.address, // buy.taker,
      '0x0000000000000000000000000000000000000000', // buy.feeRecipient,
      buy.target, // buy.target,
      '0x0000000000000000000000000000000000000000', // buy.staticTarget,
      '0x0000000000000000000000000000000000000000', // buy.paymentToken,
      sell.exchange, // sell.exchange,
      accountAddress, // sell.maker,
      '0x0000000000000000000000000000000000000000', // sell.taker,
      sell.fee_recipient.address, // sell.feeRecipient,
      sell.target, // sell.target,
      '0x0000000000000000000000000000000000000000', // sell.staticTarget,
      '0x0000000000000000000000000000000000000000' // sell.paymentToken
    ],
    [
      buy.maker_relayer_fee,
      buy.taker_relayer_fee,
      buy.maker_protocol_fee,
      buy.taker_protocol_fee,
      buy.base_price,
      buy.extra,
      buy.listing_time,
      buy.expiration_time,
      buy.salt,
      sell.maker_relayer_fee,
      sell.taker_relayer_fee,
      sell.maker_protocol_fee,
      sell.taker_protocol_fee,
      sell.base_price,
      sell.extra,
      sell.listing_time,
      sell.expiration_time,
      sell.salt
    ],
    [
      buy.fee_method,
      0,
      buy.sale_kind,
      buy.how_to_call,
      sell.fee_method,
      sell.side,
      sell.sale_kind,
      sell.how_to_call
    ],
    buy.calldata,
    sell.calldata,
    buy.replacement_pattern,
    sell.replacement_pattern,
    buy.static_extradata,
    sell.static_extradata,
    [buy.v || 0, sell.v || 0],
    [buy.r, buy.s, sell.r, sell.s, NULL_BLOCK_HASH],
    txnData
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
