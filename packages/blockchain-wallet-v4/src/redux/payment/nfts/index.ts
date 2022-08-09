import { ethers, Signer } from 'ethers'

import {
  GasCalculationOperations,
  GasDataI,
  NftAsset,
  NftOrder,
  WyvernRawOrder
} from '@core/network/api/nfts/types'

import { WETH_ABI } from './abis'
import { NULL_ADDRESS, WETH_CONTRACT_MAINNET, WETH_CONTRACT_RINKEBY } from './constants'
import {
  atomicMatch,
  buyOrderValidationAndApprovals,
  calculateAtomicMatchFees,
  calculateCancellationFees,
  calculatePaymentProxyApprovalsFees,
  calculateProxyApprovalFees,
  calculateProxyFees,
  calculateTransferFees,
  calculateWrapEthFees,
  cancelOrder,
  createBuyOrder,
  createListing,
  createMatchingOrders,
  getNetwork,
  sellOrderValidationAndApprovals,
  transferAsset
} from './wyvern.utils'

export const cancelNftOrder = async (
  sellOrder: WyvernRawOrder,
  signer: Signer,
  gasData: GasDataI
) => {
  const { gasFees, gasPrice } = gasData
  const txnData = {
    gasLimit: gasFees,
    gasPrice
  }
  const cancelled = await cancelOrder({ sellOrder, signer, txnData })
  return cancelled
}

export const fulfillNftSellOrder = async (order: NftOrder, signer: Signer, gasData: GasDataI) => {
  const validatedAndApproved = await sellOrderValidationAndApprovals({ gasData, order, signer })
  // eslint-disable-next-line no-console
  console.log(`Successful approvals and validations?: ${validatedAndApproved}`)
  return order
}

export const getNftSellOrder = async (
  asset: NftAsset,
  signer: Signer,
  listingTime = 0,
  expirationTime = 0,
  startPrice = 0.011, // The starting price for auctions / sale price for fixed price sale orders (TODO: Remove default 0.1 value)
  endPrice: number | null = null,
  reservePrice: number | undefined,
  network: string,
  waitForHighestBid = false, // True = English auction,
  paymentTokenAddress = '0x0000000000000000000000000000000000000000'
): Promise<NftOrder> => {
  return createListing(
    asset,
    expirationTime,
    listingTime,
    signer,
    startPrice,
    endPrice,
    reservePrice,
    waitForHighestBid,
    paymentTokenAddress,
    network
  )
}

export const fulfillNftOrder = async ({
  buy,
  gasData,
  sell,
  signer
}: {
  buy: NftOrder
  gasData: GasDataI
  sell?: NftOrder
  signer: Signer
}) => {
  // Perform buy order validations (abstracted away from atomicMatch because english auction bids don't hit that function)
  if (!sell) {
    await buyOrderValidationAndApprovals({ gasData, order: buy, signer })
    // eslint-disable-next-line no-console
    console.log('Post buy order to OpenSea API.')
    return buy
  }
  await atomicMatch({ buy, gasData, sell, signer })
}

export const getNftBuyOrder = async (
  asset: NftAsset,
  signer: Signer,
  expirationTime,
  startAmount: number,
  paymentTokenAddress: string,
  network: 'mainnet' | 'rinkeby',
  sellOrder?: NftOrder
): Promise<NftOrder> => {
  const accountAddress = await signer.getAddress()
  return createBuyOrder(
    asset,
    accountAddress,
    startAmount,
    expirationTime,
    paymentTokenAddress,
    signer,
    network,
    sellOrder
  )
}

export const getNftMatchingOrders = async (
  order: NftOrder,
  signer: Signer,
  expirationTime = 0,
  network: string,
  paymentTokenAddress?: string
): Promise<{ buy: NftOrder; sell: NftOrder }> => {
  return createMatchingOrders(expirationTime, order, signer, network, paymentTokenAddress || null)
}
// Calculates all the fees a user will need to pay/encounter on their journey to either sell/buy an NFT
// order and counterOrder needed for sell orders, only order needed for buy order calculations (May need to put a default value here in future / change the way these are called into two seperate functions?)
export const calculateGasFees = async (
  operation: GasCalculationOperations,
  signer: Signer,
  cancelOrder?: WyvernRawOrder,
  buyOrder?: NftOrder,
  sellOrder?: NftOrder,
  transferAsset?: NftAsset,
  transferRecipient?: string
): Promise<GasDataI> => {
  let totalFees = 0
  let proxyFees = 0
  let approvalFees = 0
  let gasFees = 0
  if (operation === GasCalculationOperations.Cancel && cancelOrder) {
    gasFees = (await calculateCancellationFees(cancelOrder, signer)).toNumber()
  } else if (
    operation === GasCalculationOperations.Transfer &&
    transferAsset &&
    transferRecipient
  ) {
    gasFees = await calculateTransferFees(transferAsset, signer, transferRecipient)
  }
  // Sell orders always need proxy address and approval:
  else if (operation === GasCalculationOperations.Sell && sellOrder) {
    // 1. Calculate the gas cost of deploying proxy if needed (can estimate using ethers)
    proxyFees = (await calculateProxyFees(signer)).toNumber()
    // 2. Calculate the gas cost of making the approvals (can only estimate using ethers if the proxy has been deployed, otherwise can add a safe value here)
    approvalFees =
      proxyFees.toString() === '0'
        ? (await calculateProxyApprovalFees(sellOrder, signer)).toNumber()
        : 300_000
  } else if (operation === GasCalculationOperations.AcceptOffer && sellOrder && buyOrder) {
    // 1. Calculate the gas cost of deploying proxy if needed (can estimate using ethers)
    proxyFees = (await calculateProxyFees(signer)).toNumber()
    // 2. Calculate the gas cost of making the approvals (can only estimate using ethers if the proxy has been deployed, otherwise can add a safe value here)
    approvalFees =
      proxyFees.toString() === '0'
        ? (await calculateProxyApprovalFees(sellOrder, signer)).toNumber()
        : 300_000
    gasFees =
      approvalFees === 0
        ? (await calculateAtomicMatchFees(buyOrder, sellOrder, signer)).toNumber()
        : 350_000
  } else if (operation === GasCalculationOperations.CreateOffer && buyOrder) {
    // 1. Calculate gas cost of approvals (if needed) - possible with ethers
    approvalFees =
      buyOrder.paymentToken !== NULL_ADDRESS
        ? (await calculatePaymentProxyApprovalsFees(buyOrder, signer)).toNumber()
        : 0
  }
  // Buy orders dont need any approval or proxy IF payment token is Ether.
  // However, if payment token is an ERC20 approval must be given to the payment proxy address
  else if (operation === GasCalculationOperations.Buy && buyOrder) {
    if (!sellOrder) {
      throw new Error('counter order not provdided into the calculate gas function.')
    }
    // 1. Calculate gas cost of approvals (if needed) - possible with ethers
    approvalFees =
      buyOrder.paymentToken !== NULL_ADDRESS
        ? (await calculatePaymentProxyApprovalsFees(buyOrder, signer)).toNumber()
        : 0
    // 2. Caclulate the gas cost of the atomicMatch function call
    gasFees =
      approvalFees === 0 && buyOrder.paymentToken === NULL_ADDRESS
        ? (await calculateAtomicMatchFees(buyOrder, sellOrder, signer)).toNumber()
        : 350_000
  } else if (operation === GasCalculationOperations.WrapEth) {
    gasFees = (await calculateWrapEthFees(signer)).toNumber()
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
export const fulfillTransfer = async (
  asset: NftAsset,
  signer: Signer,
  recipient: string,
  txnData: { gasLimit: string; gasPrice: string }
) => {
  await transferAsset(asset, signer, recipient.toLowerCase(), txnData)
}

export const executeWrapEth = async (signer: Signer, amount: string, gasData: GasDataI) => {
  const wrapEthAddr =
    getNetwork(signer) === 'rinkeby' ? WETH_CONTRACT_RINKEBY : WETH_CONTRACT_MAINNET
  const wrapEthContract = new ethers.Contract(wrapEthAddr, WETH_ABI, signer)

  const wrap = await wrapEthContract.deposit({
    gasLimit: gasData.gasFees,
    gasPrice: gasData.gasPrice,
    value: amount
  })

  await wrap.wait()
}
