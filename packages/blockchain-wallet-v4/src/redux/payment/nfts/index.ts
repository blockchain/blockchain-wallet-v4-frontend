import BigNumber from 'bignumber.js'
import { Signer } from 'ethers'

import {
  gasCalculationOperations,
  gasData,
  NftAsset,
  NftOrderSide,
  NftOrdersType,
  Order,
  SellOrder,
  txnData
} from '@core/network/api/nfts/types'

import {
  _atomicMatch,
  _buyOrderValidationAndApprovals,
  _cancelOrder,
  _sellOrderValidationAndApprovals,
  calculateAtomicMatchFees,
  calculateCancellation,
  calculatePaymentProxyApprovals,
  calculateProxyApprovalFees,
  calculateProxyFees,
  createMatchingOrders,
  createSellOrder,
  NULL_ADDRESS
} from './utils'

export const cancelNftListing = async (sellOrder: SellOrder, signer: Signer, gasData: gasData) => {
  const { gasFees, gasPrice } = gasData
  const txnData = {
    gasLimit: gasFees,
    gasPrice
  }
  const cancelled = await _cancelOrder({ sellOrder, signer, txnData })
  return cancelled
}

export const fulfillNftSellOrder = async (order: Order, signer: Signer, gasData: gasData) => {
  const validatedAndApproved = await _sellOrderValidationAndApprovals({ gasData, order, signer })
  console.log(`Successful approvals and validations?: ${validatedAndApproved}`)
  return order
}

export const getNftSellOrder = async (
  asset: NftAsset,
  signer: Signer,
  startPrice = 0.011, // The starting price for auctions / sale price for fixed price sale orders (TODO: Remove default 0.1 value)
  endPrice: number | null = null, // Implement later for to enable dutch auction sales.
  waitForHighestBid = false, // True = English auction,
  paymentTokenAddress = '0x0000000000000000000000000000000000000000'
): Promise<Order> => {
  return createSellOrder(
    asset,
    signer,
    startPrice,
    endPrice,
    waitForHighestBid,
    paymentTokenAddress
  )
}

// TODO: Be able to pass in custom value for price for making auction bids.
export const fulfillNftOrder = async (
  buy: Order,
  sell: Order,
  signer: Signer,
  gasData: gasData
) => {
  // Perform buy order validations (abstracted away from _atomicMatch because english auction bids don't hit that function)
  // await _buyOrderValidationAndApprovals({ order: buy, signer })
  // Is an english auction sale
  if (sell.waitingForBestCounterOrder) {
    await _buyOrderValidationAndApprovals({ gasData, order: buy, signer })
    console.log('Post buy order to OpenSea API because its an english auction')
    console.log(buy)
    return buy
  }
  // Is a dutch auction TODO: Find out why validations fail for buy order validations
  if (sell.saleKind === 1) {
    throw new Error('Dutch auctions not currently supported')
    // await _atomicMatch({ buy, sell, signer })
  }
  // Is a fixed price sale
  await _atomicMatch({ buy, gasData, sell, signer })
}

export const getNftBuyOrders = async (
  order: NftOrdersType['orders'][0],
  signer: Signer
): Promise<{ buy: Order; sell: Order }> => {
  return createMatchingOrders(order, signer)
}
// Calculates all the fees a user will need to pay/encounter on their journey to either sell/buy an NFT
// order and counterOrder needed for sell orders, only order needed for buy order calculations (May need to put a default value here in future / change the way these are called into two seperate functions?)
export const calculateGasFees = async (
  operation: gasCalculationOperations,
  signer: Signer,
  cancelOrder?: SellOrder,
  buyOrder?: Order,
  counterOrder?: Order,
  transferAsset?: NftAsset,
  transferRecipient?: string
): Promise<gasData> => {
  let totalFees = 0
  let proxyFees = 0
  let approvalFees = 0
  let gasFees = 0
  if (operation === gasCalculationOperations.Cancel && cancelOrder) {
    gasFees = (await calculateCancellation(cancelOrder, signer)).toNumber()
  } else if (
    operation === gasCalculationOperations.Transfer &&
    transferAsset &&
    transferRecipient
  ) {
    // TODO: After merge uncomment this.
    // gasFees = await calculateTransferFees(transferAsset, signer, transferRecipient)
  }
  // Sell orders always need proxy address and approval:
  else if (operation === gasCalculationOperations.Sell && buyOrder) {
    // 1. Calculate the gas cost of deploying proxy if needed (can estimate using ethers)
    proxyFees = (await calculateProxyFees(signer)).toNumber()
    // 2. Calculate the gas cost of making the approvals (can only estimate using ethers if the proxy has been deployed, otherwise can add a safe value here)
    approvalFees =
      proxyFees.toString() === '0'
        ? (await calculateProxyApprovalFees(buyOrder, signer)).toNumber()
        : 300_000
  }
  // Buy orders dont need any approval or proxy IF payment token is Ether.
  // However, if payment token is an ERC20 approval must be given to the payment proxy address
  else if (operation === gasCalculationOperations.Buy && buyOrder) {
    if (!counterOrder) {
      throw new Error('counter order not provdided into the calculate gas function.')
    }
    // 1. Calculate gas cost of approvals (if needed) - possible with ethers
    approvalFees =
      buyOrder.paymentToken !== NULL_ADDRESS
        ? (await calculatePaymentProxyApprovals(buyOrder, signer)).toNumber()
        : 0
    // 2. Caclulate the gas cost of the _atomicMatch function call
    gasFees =
      approvalFees === 0
        ? (await calculateAtomicMatchFees(buyOrder, counterOrder, signer)).toNumber()
        : 350_000
  } else {
    throw new Error('Invalid operation type or arguments provided.')
  }
  const gasPrice = parseInt((await signer.getGasPrice())._hex)
  totalFees = approvalFees + gasFees + proxyFees
  return {
    approvalFees,
    gasFees,
    gasPrice,
    proxyFees,
    totalFees
  }
}

// https://codesandbox.io/s/beautiful-euclid-nd7s8?file=/src/index.ts
// metamask https://etherscan.io/tx/0xb52c163434d85e79a63e34cadbfb980d928e4e70129284ae084d9ad992ba9778
// bc.com https://etherscan.io/tx/0xdb0620e6e1b186f4f84e4740b2453506b61416d79fd7de01a6e7ed2f9e5e3623
