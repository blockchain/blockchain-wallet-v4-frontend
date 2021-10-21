import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import * as ethABI from 'ethereumjs-abi'
import { ethers } from 'ethers'

import {
  NftOrderSide,
  NftOrdersType,
  NftSaleKind,
  SolidityTypes,
  UnhashedOrder,
  UnsignedOrder
} from '@core/network/api/nfts/types'

import { schemaMap } from './schemas'
import { FunctionInputKind } from './types'

type Order = NftOrdersType['orders'][0]

export const INVERSE_BASIS_POINT = 10000
export const NULL_BLOCK_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
const MIN_EXPIRATION_SECONDS = 10
const ORDER_MATCHING_LATENCY_SECONDS = 60 * 60 * 24 * 7
const OPENSEA_FEE_RECIPIENT = '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'
const MAX_DIGITS_IN_UNSIGNED_256_INT = 72

export const bigNumberToBN = (value: BigNumber) => {
  return new BN(value.toString(), 10)
}

const ethABI_local = {
  elementaryName(name) {
    if (name.startsWith('int[')) {
      return `int256${name.slice(3)}`
    }
    if (name === 'int') {
      return 'int256'
    }
    if (name.startsWith('uint[')) {
      return `uint256${name.slice(4)}`
    }
    if (name === 'uint') {
      return 'uint256'
    }
    if (name.startsWith('fixed[')) {
      return `fixed128x128${name.slice(5)}`
    }
    if (name === 'fixed') {
      return 'fixed128x128'
    }
    if (name.startsWith('ufixed[')) {
      return `ufixed128x128${name.slice(6)}`
    }
    if (name === 'ufixed') {
      return 'ufixed128x128'
    }
    return name
  },
  eventID(name, types) {
    // FIXME: use node.js util.format?
    const sig = `${name}(${types.map(this.elementaryName).join(',')})`
    return ethers.utils.keccak256(Buffer.from(sig))
  },
  isDynamic(type) {
    // FIXME: handle all types? I don't think anything is missing now
    return type === 'string' || type === 'bytes' || this.parseTypeArray(type) === 'dynamic'
  },
  methodID(name, types) {
    return this.eventID(name, types).slice(0, 4)
  },
  parseTypeArray(type) {
    const tmp = type.match(/(.*)\[(.*?)\]$/)
    if (tmp) {
      return tmp[2] === '' ? 'dynamic' : parseInt(tmp[2], 10)
    }
    return null
  }
}

/**
 * Computes the default value for a type
 * @param type The ABI type to calculate a default value for
 * @return The default value for that type
 */
const generateDefaultValue = (type: string): any => {
  switch (type) {
    case 'address':
    case 'bytes20':
      /* Null address is sometimes checked in transfer calls. */
      // But we need to use 0x000 because bitwise XOR won't work if there's a 0 in the actual address, since it will be replaced as 1 OR 0 = 1
      return '0x0000000000000000000000000000000000000000'
    case 'bytes32':
      return '0x0000000000000000000000000000000000000000000000000000000000000000'
    case 'bool':
      return false
    case 'int':
    case 'uint':
    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'uint64':
    case 'uint256':
      return 0
    default:
      throw new Error(`Default value not yet implemented for type: ${type}`)
  }
}

const getOrderHashHex = (order: UnhashedOrder): string => {
  const orderParts = [
    { type: SolidityTypes.Address, value: order.exchange },
    { type: SolidityTypes.Address, value: order.maker },
    { type: SolidityTypes.Address, value: order.taker },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.makerRelayerFee) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.takerRelayerFee) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.makerProtocolFee) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.takerProtocolFee) },
    { type: SolidityTypes.Address, value: order.feeRecipient },
    { type: SolidityTypes.Uint8, value: order.feeMethod },
    { type: SolidityTypes.Uint8, value: order.side },
    { type: SolidityTypes.Uint8, value: order.saleKind },
    { type: SolidityTypes.Address, value: order.target },
    { type: SolidityTypes.Uint8, value: order.howToCall },
    { type: SolidityTypes.Bytes, value: new Buffer(order.calldata.slice(2), 'hex') },
    { type: SolidityTypes.Bytes, value: new Buffer(order.replacementPattern.slice(2), 'hex') },
    { type: SolidityTypes.Address, value: order.staticTarget },
    { type: SolidityTypes.Bytes, value: new Buffer(order.staticExtradata.slice(2), 'hex') },
    { type: SolidityTypes.Address, value: order.paymentToken },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.basePrice) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.extra) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.listingTime) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.expirationTime) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.salt) }
  ]
  const types = orderParts.map((o) => o.type)
  const values = orderParts.map((o) => o.value)
  const hash = ethABI.soliditySHA3(types, values)
  return hash.toString('hex')
}

/**
 * Get the non-prefixed hash for the order
 * (Fixes a Wyvern typescript issue and casing issue)
 * @param order order to hash
 */
export function getOrderHash(order: UnhashedOrder) {
  const orderWithStringTypes = {
    ...order,
    feeMethod: order.feeMethod.toString(),
    feeRecipient: order.feeRecipient.toLowerCase(),
    howToCall: order.howToCall.toString(),
    maker: order.maker.toLowerCase(),
    saleKind: order.saleKind.toString(),
    side: order.side.toString(),
    taker: order.taker.toLowerCase()
  }
  return getOrderHashHex(orderWithStringTypes as any)
}

/**
 * Generates a pseudo-random 256-bit salt.
 * The salt can be included in an 0x order, ensuring that the order generates a unique orderHash
 * and will not collide with other outstanding orders that are identical in all other parameters.
 * @return  A pseudo-random 256-bit number that can be used as a salt.
 */
const generatePseudoRandomSalt = (): string => {
  // BigNumber.random returns a pseudo-random number between 0 & 1 with a passed in number of decimal places.
  // Source: https://mikemcl.github.io/bignumber.js/#random
  const randomNumber = BigNumber.random(MAX_DIGITS_IN_UNSIGNED_256_INT)
  const factor = new BigNumber(10).pow(MAX_DIGITS_IN_UNSIGNED_256_INT - 1)
  const salt = randomNumber.times(factor).integerValue()
  return bigNumberToBN(salt).toString()
}

export const encodeCall = (abi, parameters: any[]): string => {
  const inputTypes = abi.inputs.map((i) => i.type)
  return `0x${Buffer.concat([
    Buffer.from(ethABI.methodID(abi.name, inputTypes)),
    Buffer.from(ethABI.rawEncode(inputTypes, parameters))
  ]).toString('hex')}`
}

/**
 * Encodes the replacementPattern for a supplied ABI and replace kind
 * @param   abi AnnotatedFunctionABI
 * @param   replaceKind Parameter kind to replace
 * @return  The resulting encoded replacementPattern
 */
const encodeReplacementPattern = (
  abi,
  replaceKind = FunctionInputKind.Replaceable,
  encodeToBytes = true
): string => {
  const output: Buffer[] = []
  const data: Buffer[] = []
  const dynamicOffset = abi.inputs.reduce((len, { type }) => {
    const match = type.match(/\[(.+)\]$/)
    return len + (match ? parseInt(match[1], 10) * 32 : 32)
  }, 0)
  abi.inputs
    .map(({ kind, type, value }) => ({
      bitmask: kind === replaceKind ? 255 : 0,
      type: ethABI_local.elementaryName(type),
      value: value !== undefined ? value : generateDefaultValue(type)
    }))
    .reduce((offset, { bitmask, type, value }) => {
      if (!value) return offset
      // The 0xff bytes in the mask select the replacement bytes. All other bytes are 0x00.
      const cur = new Buffer(ethABI.rawEncode([type], [value]).length).fill(bitmask)
      if (ethABI_local.isDynamic(type)) {
        if (bitmask) {
          throw new Error('Replacement is not supported for dynamic parameters.')
        }
        output.push(new Buffer(ethABI.rawEncode(['uint256'], [dynamicOffset]).length))
        data.push(cur)
        return offset + cur.length
      }
      output.push(cur)
      return offset
    }, dynamicOffset)
  // 4 initial bytes of 0x00 for the method hash.
  const methodIdMask = new Buffer(4)
  const mask = Buffer.concat([methodIdMask, Buffer.concat(output.concat(data))])
  return encodeToBytes ? `0x${mask.toString('hex')}` : mask.map((b) => (b ? 1 : 0)).join('')
}

export const encodeDefaultCall = (abi, address) => {
  const parameters = abi.inputs.map((input) => {
    switch (input.kind) {
      case FunctionInputKind.Replaceable:
        return generateDefaultValue(input.type)
      case FunctionInputKind.Owner:
        return address
      case FunctionInputKind.Asset:
      default:
        return input.value
    }
  })
  return encodeCall(abi, parameters)
}

export const encodeSell = (schema, asset, address) => {
  const transfer = schema.functions.transfer(asset)
  return {
    calldata: encodeDefaultCall(transfer, address),
    replacementPattern: encodeReplacementPattern(transfer),
    target: transfer.target
  }
}

export const encodeBuy = (schema, asset, address) => {
  const transfer = schema.functions.transfer(asset)
  const replaceables = transfer.inputs.filter((i: any) => i.kind === FunctionInputKind.Replaceable)
  const ownerInputs = transfer.inputs.filter((i: any) => i.kind === FunctionInputKind.Owner)

  // Validate
  if (replaceables.length !== 1) {
    throw new Error(
      `Only 1 input can match transfer destination, but instead ${replaceables.length} did`
    )
  }

  // Compute calldata
  const parameters = transfer.inputs.map((input: any) => {
    switch (input.kind) {
      case FunctionInputKind.Replaceable:
        return address
      case FunctionInputKind.Owner:
        return generateDefaultValue(input.type)
      default:
        try {
          return input.value.toString()
        } catch (e) {
          console.error(schema)
          console.error(asset)
          throw e
        }
    }
  })
  const calldata = encodeCall(transfer, parameters)

  // Compute replacement pattern
  let replacementPattern = '0x'
  if (ownerInputs.length > 0) {
    replacementPattern = encodeReplacementPattern(transfer, FunctionInputKind.Owner)
  }

  return {
    calldata,
    replacementPattern,
    target: transfer.target
  }
}

function _getTimeParameters(
  expirationTimestamp: number,
  listingTimestamp?: number,
  waitingForBestCounterOrder = false
) {
  // Validation
  const minExpirationTimestamp = Math.round(Date.now() / 1000 + MIN_EXPIRATION_SECONDS)
  const minListingTimestamp = Math.round(Date.now() / 1000)
  if (expirationTimestamp !== 0 && expirationTimestamp < minExpirationTimestamp) {
    throw new Error(
      `Expiration time must be at least ${MIN_EXPIRATION_SECONDS} seconds from now, or zero (non-expiring).`
    )
  }
  if (listingTimestamp && listingTimestamp < minListingTimestamp) {
    throw new Error('Listing time cannot be in the past.')
  }
  if (listingTimestamp && expirationTimestamp !== 0 && listingTimestamp >= expirationTimestamp) {
    throw new Error('Listing time must be before the expiration time.')
  }
  if (waitingForBestCounterOrder && expirationTimestamp === 0) {
    throw new Error('English auctions must have an expiration time.')
  }
  if (waitingForBestCounterOrder && listingTimestamp) {
    throw new Error(`Cannot schedule an English auction for the future.`)
  }
  if (parseInt(expirationTimestamp.toString()) !== expirationTimestamp) {
    throw new Error(`Expiration timestamp must be a whole number of seconds`)
  }

  if (waitingForBestCounterOrder) {
    listingTimestamp = expirationTimestamp
    // Expire one week from now, to ensure server can match it
    // Later, this will expire closer to the listingTime
    expirationTimestamp += ORDER_MATCHING_LATENCY_SECONDS
  } else {
    // Small offset to account for latency
    listingTimestamp = listingTimestamp || Math.round(Date.now() / 1000 - 100)
  }

  return {
    expirationTime: new BigNumber(expirationTimestamp),
    listingTime: new BigNumber(listingTimestamp)
  }
}

export function assignOrdersToSides(
  order: Order,
  matchingOrder: UnsignedOrder
): { buy: Order; sell: Order } {
  const isSellOrder = order.side === NftOrderSide.Sell

  let buy: Order
  let sell: Order
  if (!isSellOrder) {
    buy = order
    sell = {
      ...matchingOrder,
      r: buy.r,
      s: buy.s,
      v: buy.v
    }
  } else {
    sell = order
    buy = {
      ...matchingOrder,
      r: sell.r,
      s: sell.s,
      v: sell.v
    }
  }

  return { buy, sell }
}

export function _getMetadata(order: Order, referrerAddress?: string) {
  const referrer = referrerAddress || order.metadata.referrerAddress
  if (referrer) {
    return referrer
  }
  return undefined
}

export function _makeMatchingOrder({
  accountAddress,
  order,
  recipientAddress
}: {
  // UnsignedOrder;
  accountAddress: string
  order: Order
  recipientAddress: string
}): UnsignedOrder {
  accountAddress = ethers.utils.getAddress(accountAddress)
  recipientAddress = ethers.utils.getAddress(recipientAddress)

  const computeOrderParams = () => {
    if ('asset' in order.metadata) {
      // const schema = this._getSchema(order.metadata.schema)
      const schema = schemaMap[order.metadata.schema]
      return order.side === NftOrderSide.Buy
        ? encodeSell(schema, order.metadata.asset, recipientAddress)
        : encodeBuy(schema, order.metadata.asset, recipientAddress)
    }
    // BUNDLE NOT SUPPORTED
    // if ('bundle' in order.metadata) {
    //   // We're matching a bundle order
    //   const { bundle } = order.metadata
    //   const orderedSchemas = bundle.schemas
    //     ? bundle.schemas.map((schemaName) => this._getSchema(schemaName))
    //     : // Backwards compat:
    //       bundle.assets.map(() =>
    //         this._getSchema('schema' in order.metadata ? order.metadata.schema : undefined)
    //       )
    //   const atomicized =
    //     order.side == NftOrderSide.Buy
    //       ? encodeAtomicizedSell(
    //           orderedSchemas,
    //           order.metadata.bundle.assets,
    //           recipientAddress,
    //           this._wyvernProtocol,
    //           this._networkName
    //         )
    //       : encodeAtomicizedBuy(
    //           orderedSchemas,
    //           order.metadata.bundle.assets,
    //           recipientAddress,
    //           this._wyvernProtocol,
    //           this._networkName
    //         )
    //   return {
    //     calldata: atomicized.calldata,
    //     replacementPattern: atomicized.replacementPattern,
    //     target: WyvernProtocol.getAtomicizerContractAddress(this._networkName)
    //   }
    // }
    throw new Error('Invalid order metadata')
  }
  const { calldata, replacementPattern, target } = computeOrderParams() as Exclude<
    ReturnType<typeof computeOrderParams>,
    Error
  >

  const times = _getTimeParameters(0)
  // Compat for matching buy orders that have fee recipient still on them
  const feeRecipient = order.feeRecipient === NULL_ADDRESS ? OPENSEA_FEE_RECIPIENT : NULL_ADDRESS

  const matchingOrder: UnhashedOrder = {
    basePrice: new BigNumber(order.basePrice),
    calldata,
    exchange: order.exchange,
    expirationTime: times.expirationTime,
    extra: new BigNumber(0),
    feeMethod: order.feeMethod,
    feeRecipient,
    howToCall: order.howToCall,
    listingTime: times.listingTime,
    maker: accountAddress,
    makerProtocolFee: new BigNumber(order.makerProtocolFee),
    makerReferrerFee: new BigNumber(order.makerReferrerFee),
    makerRelayerFee: new BigNumber(order.makerRelayerFee),
    metadata: order.metadata,
    paymentToken: order.paymentToken,
    quantity: order.quantity,
    replacementPattern,
    saleKind: NftSaleKind.FixedPrice,
    // @ts-ignore
    salt: generatePseudoRandomSalt(),
    side: (order.side + 1) % 2,
    staticExtradata: '0x',
    staticTarget: NULL_ADDRESS,
    taker: order.maker,
    takerProtocolFee: new BigNumber(order.takerProtocolFee),
    takerRelayerFee: new BigNumber(order.takerRelayerFee),
    target,
    waitingForBestCounterOrder: false
  }

  return {
    ...matchingOrder,
    hash: getOrderHash(matchingOrder)
  }
}
