export const INVERSE_BASIS_POINT = 10000
export const NULL_BLOCK_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const MIN_EXPIRATION_SECONDS = 10
export const ORDER_MATCHING_LATENCY_SECONDS = 60 * 60 * 24 * 7
export const MAX_DIGITS_IN_UNSIGNED_256_INT = 72
export const MAX_EXPIRATION_MONTHS = 6
export const DEFAULT_BUYER_FEE_BASIS_POINTS = 0
export const DEFAULT_SELLER_FEE_BASIS_POINTS = 250
export const OPENSEA_SELLER_BOUNTY_BASIS_POINTS = 100
export const DEFAULT_MAX_BOUNTY = DEFAULT_SELLER_FEE_BASIS_POINTS
export const ENJIN_ADDRESS = '0xfaaFDc07907ff5120a76b34b731b278c38d6043C'
export const ENJIN_COIN_ADDRESS = '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c'
export const OPENSEA_SHARED_MARKETPLACE = '0x495f947276749ce646f68ac8c248420045cb7b5e'
export const OPENSEA_SHARED_MARKETPLACE_RINKEBY = '0x88b48f654c30e99bc2e4a1559b4dcf1ad93fa656'
export const WYVERN_MERKLE_VALIDATOR_MAINNET = '0xbaf2127b49fc93cbca6269fade0f7f31df4c88a7'
export const WYVERN_MERKLE_VALIDATOR_RINKEBY = '0x45b594792a5cdc008d0de1c1d69faa3d16b3ddc1'
export const WYVERN_TOKEN_PAYMENT_PROXY = '0xe5c783ee536cf5e63e792988335c4255169be4e1'
export const WYVERN_TOKEN_PAYMENT_PROXY_RINKEBY = '0xCdC9188485316BF6FA416d02B4F680227c50b89e'
export const WYVERN_CONTRACT_ADDR_RINKEBY = '0xdd54d660178b28f6033a953b0e55073cfa7e3744'
export const WYVERN_CONTRACT_ADDR_MAINNET = '0x7f268357a8c2552623316e2562d90e642bb538e5'
export const OPENSEA_FEE_RECIPIENT_RINKEBY = NULL_ADDRESS
export const OPENSEA_LEGACY_FEE_RECIPIENT = '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'
export const OPENSEA_FEE_RECIPIENT = '0x8de9c5a032463c561423387a9648c5c7bcc5bc90'
export const WYVERN_PROXY_REGISTRY_ADDRESS = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'
export const WYVERN_PROXY_REGISTRY_ADDRESS_RINKEBY = '0x1E525EEAF261cA41b809884CBDE9DD9E1619573A'
export const WETH_CONTRACT_MAINNET = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const WETH_CONTRACT_RINKEBY = '0xc778417e063141139fce010982780140aa0cd5ab'

export const EIP_712_WYVERN_DOMAIN_NAME = 'Wyvern Exchange Contract'
export const EIP_712_WYVERN_DOMAIN_VERSION = '2.3'
export const EIP_712_ORDER_TYPES = {
  EIP712Domain: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  ],
  Order: [
    { name: 'exchange', type: 'address' },
    { name: 'maker', type: 'address' },
    { name: 'taker', type: 'address' },
    { name: 'makerRelayerFee', type: 'uint256' },
    { name: 'takerRelayerFee', type: 'uint256' },
    { name: 'makerProtocolFee', type: 'uint256' },
    { name: 'takerProtocolFee', type: 'uint256' },
    { name: 'feeRecipient', type: 'address' },
    { name: 'feeMethod', type: 'uint8' },
    { name: 'side', type: 'uint8' },
    { name: 'saleKind', type: 'uint8' },
    { name: 'target', type: 'address' },
    { name: 'howToCall', type: 'uint8' },
    { name: 'calldata', type: 'bytes' },
    { name: 'replacementPattern', type: 'bytes' },
    { name: 'staticTarget', type: 'address' },
    { name: 'staticExtradata', type: 'bytes' },
    { name: 'paymentToken', type: 'address' },
    { name: 'basePrice', type: 'uint256' },
    { name: 'extra', type: 'uint256' },
    { name: 'listingTime', type: 'uint256' },
    { name: 'expirationTime', type: 'uint256' },
    { name: 'salt', type: 'uint256' },
    { name: 'nonce', type: 'uint256' }
  ]
}

export const CROSS_CHAIN_DEFAULT_CONDUIT_KEY =
  '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000'
const CROSS_CHAIN_DEFAULT_CONDUIT = '0x1e0049783f008a0085193e00003d00cd54003c71'

export const CONDUIT_KEYS_TO_CONDUIT = {
  [CROSS_CHAIN_DEFAULT_CONDUIT_KEY]: CROSS_CHAIN_DEFAULT_CONDUIT
}

export const DEFAULT_ZONE = '0x004c00500000ad104d7dbd00e3ae0a5c00560c00'
export const DEFAULT_ZONE_RINKEBY = '0x00000000e88fe2628ebc5da81d2b3cead633e89e'
