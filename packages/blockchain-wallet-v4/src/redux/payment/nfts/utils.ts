import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { ethers } from 'ethers'

import {
  NftOrderSide,
  NftOrdersType,
  NftSaleKind,
  SolidityTypes,
  UnhashedOrder,
  UnsignedOrder
} from '@core/network/api/nfts/types'

import { ERC721Schema } from './schemas'
import { FunctionInputKind } from './types'

type Order = NftOrdersType['orders'][0]

export const NULL_BLOCK_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const MIN_EXPIRATION_SECONDS = 10
const ORDER_MATCHING_LATENCY_SECONDS = 60 * 60 * 24 * 7
const OPENSEA_FEE_RECIPIENT = '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
const MAX_DIGITS_IN_UNSIGNED_256_INT = 78

const bigNumberToBN = (value: BigNumber) => {
  return new BN(value.toString(), 10)
}

const ethABI = {
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
  const orderPartsA = [
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
    { type: SolidityTypes.Uint8, value: order.howToCall }
  ]
  const orderPartsB = [
    { type: SolidityTypes.Bytes, value: Buffer.from(order.calldata.slice(2), 'hex') },
    { type: SolidityTypes.Bytes, value: Buffer.from(order.replacementPattern.slice(2), 'hex') },
    { type: SolidityTypes.Address, value: order.staticTarget },
    { type: SolidityTypes.Bytes, value: Buffer.from(order.staticExtradata.slice(2), 'hex') },
    { type: SolidityTypes.Address, value: order.paymentToken },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.basePrice) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.extra) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.listingTime) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.expirationTime) },
    { type: SolidityTypes.Uint256, value: bigNumberToBN(order.salt) }
  ]
  const typesA = orderPartsA.map((o) => o.type)
  const valuesA = orderPartsA.map((o) => o.value)
  debugger
  const hashBufA = ethers.utils.solidityKeccak256(typesA, valuesA)
  const typesB = orderPartsB.map((o) => o.type)
  const valuesB = orderPartsB.map((o) => o.value)
  const hashBufB = ethers.utils.solidityKeccak256(typesB, valuesB)
  const orderPartsC = [
    { type: SolidityTypes.String, value: '\x19Ethereum Signed Message:\n32' },
    { type: SolidityTypes.Bytes, value: hashBufA },
    { type: SolidityTypes.Bytes, value: hashBufB }
  ]
  const typesC = orderPartsC.map((o) => o.type)
  const valuesC = orderPartsC.map((o) => o.value)
  const hashBufC = ethers.utils.solidityKeccak256(typesC, valuesC)
  const hashHexC = hashBufC
  return hashHexC
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
const generatePseudoRandomSalt = (): BigNumber => {
  // BigNumber.random returns a pseudo-random number between 0 & 1 with a passed in number of decimal places.
  // Source: https://mikemcl.github.io/bignumber.js/#random
  const randomNumber = BigNumber.random(MAX_DIGITS_IN_UNSIGNED_256_INT)
  const factor = new BigNumber(10).pow(MAX_DIGITS_IN_UNSIGNED_256_INT - 1)
  const salt = randomNumber.times(factor).integerValue()
  return salt
}

export const encodeCall = (abi, parameters: any[]): string => {
  const inputTypes = abi.inputs.map((i) => i.type)
  return `0x${Buffer.concat([
    Buffer.from(ethABI.methodID(abi.name, inputTypes)),
    Buffer.from(ethers.utils.defaultAbiCoder.encode(inputTypes, parameters))
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
      type: ethABI.elementaryName(type),
      value: value !== undefined ? value : generateDefaultValue(type)
    }))
    .reduce((offset, { bitmask, type, value }) => {
      // The 0xff bytes in the mask select the replacement bytes. All other bytes are 0x00.
      const cur = new Buffer(ethers.utils.defaultAbiCoder.encode([type], [value]).length).fill(
        bitmask
      )
      if (ethABI.isDynamic(type)) {
        if (bitmask) {
          throw new Error('Replacement is not supported for dynamic parameters.')
        }
        output.push(
          new Buffer(ethers.utils.defaultAbiCoder.encode(['uint256'], [dynamicOffset]).length)
        )
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
  const transfer = ERC721Schema.functions.transfer(asset)
  return {
    calldata: encodeDefaultCall(transfer, address),
    replacementPattern: encodeReplacementPattern(transfer),
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
  matchingOrder: Order
): { buy: Order; sell: Order } {
  const isSellOrder = order.side === 0

  let buy: Order
  let sell: Order
  if (!isSellOrder) {
    buy = order
    // @ts-ignore
    sell = {
      ...matchingOrder,
      r: buy.r,
      s: buy.s,
      v: buy.v
    }
  } else {
    sell = order
    // @ts-ignore
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
      const { schema } = order.metadata
      return order.side === NftOrderSide.Buy
        ? encodeSell(schema, order.metadata.asset, recipientAddress)
        : new Error(
            'Sell not supported'
          ) /* encodeBuy(schema, order.metadata.asset, recipientAddress)  */
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
  // const feeRecipient = order.fee_recipient === NULL_ADDRESS ? OPENSEA_FEE_RECIPIENT : NULL_ADDRESS
  const feeRecipient = OPENSEA_FEE_RECIPIENT

  const matchingOrder: UnhashedOrder = {
    basePrice: new BigNumber(order.base_price),
    calldata,
    exchange: order.exchange,
    expirationTime: times.expirationTime,
    extra: new BigNumber(0),
    feeMethod: order.fee_method,
    feeRecipient,
    howToCall: order.how_to_call,
    listingTime: times.listingTime,
    maker: accountAddress,
    makerProtocolFee: new BigNumber(order.maker_protocol_fee),
    makerReferrerFee: new BigNumber(order.maker_referrer_fee),
    makerRelayerFee: new BigNumber(order.maker_relayer_fee),
    metadata: order.metadata,
    paymentToken: order.payment_token,
    quantity: order.quantity,
    replacementPattern,
    saleKind: NftSaleKind.FixedPrice,
    salt: generatePseudoRandomSalt(),
    side: (order.side + 1) % 2,
    staticExtradata: '0x',
    staticTarget: NULL_ADDRESS,
    taker: order.maker.address,
    takerProtocolFee: new BigNumber(order.taker_protocol_fee),
    takerRelayerFee: new BigNumber(order.taker_relayer_fee),
    target,
    waitingForBestCounterOrder: false
  }

  return {
    ...matchingOrder,
    hash: getOrderHash(matchingOrder)
  }
}
