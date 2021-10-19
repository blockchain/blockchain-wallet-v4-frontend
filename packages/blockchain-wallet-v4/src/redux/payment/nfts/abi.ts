export const wyvernABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'tokenTransferProxy',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'target', type: 'address' },
      { name: 'calldata', type: 'bytes' },
      { name: 'extradata', type: 'bytes' }
    ],
    name: 'staticCall',
    outputs: [{ name: 'result', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newMinimumMakerProtocolFee', type: 'uint256' }],
    name: 'changeMinimumMakerProtocolFee',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newMinimumTakerProtocolFee', type: 'uint256' }],
    name: 'changeMinimumTakerProtocolFee',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'array', type: 'bytes' },
      { name: 'desired', type: 'bytes' },
      { name: 'mask', type: 'bytes' }
    ],
    name: 'guardedArrayReplace',
    outputs: [{ name: '', type: 'bytes' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'minimumTakerProtocolFee',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'codename',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'addr', type: 'address' }],
    name: 'testCopyAddress',
    outputs: [{ name: '', type: 'bytes' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: 'arrToCopy', type: 'bytes' }],
    name: 'testCopy',
    outputs: [{ name: '', type: 'bytes' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' }
    ],
    name: 'calculateCurrentPrice_',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newProtocolFeeRecipient', type: 'address' }],
    name: 'changeProtocolFeeRecipient',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'version',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'buyCalldata', type: 'bytes' },
      { name: 'buyReplacementPattern', type: 'bytes' },
      { name: 'sellCalldata', type: 'bytes' },
      { name: 'sellReplacementPattern', type: 'bytes' }
    ],
    name: 'orderCalldataCanMatch',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' }
    ],
    name: 'validateOrder_',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'basePrice', type: 'uint256' },
      { name: 'extra', type: 'uint256' },
      { name: 'listingTime', type: 'uint256' },
      { name: 'expirationTime', type: 'uint256' }
    ],
    name: 'calculateFinalPrice',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'protocolFeeRecipient',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' }
    ],
    name: 'hashOrder_',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[14]' },
      { name: 'uints', type: 'uint256[18]' },
      { name: 'feeMethodsSidesKindsHowToCalls', type: 'uint8[8]' },
      { name: 'calldataBuy', type: 'bytes' },
      { name: 'calldataSell', type: 'bytes' },
      { name: 'replacementPatternBuy', type: 'bytes' },
      { name: 'replacementPatternSell', type: 'bytes' },
      { name: 'staticExtradataBuy', type: 'bytes' },
      { name: 'staticExtradataSell', type: 'bytes' }
    ],
    name: 'ordersCanMatch_',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' },
      { name: 'orderbookInclusionDesired', type: 'bool' }
    ],
    name: 'approveOrder_',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'registry',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'minimumMakerProtocolFee',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' }
    ],
    name: 'hashToSign_',
    outputs: [{ name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'pure',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'bytes32' }],
    name: 'cancelledOrFinalized',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'exchangeToken',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' }
    ],
    name: 'cancelOrder_',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: 'addrs', type: 'address[14]' },
      { name: 'uints', type: 'uint256[18]' },
      { name: 'feeMethodsSidesKindsHowToCalls', type: 'uint8[8]' },
      { name: 'calldataBuy', type: 'bytes' },
      { name: 'calldataSell', type: 'bytes' },
      { name: 'replacementPatternBuy', type: 'bytes' },
      { name: 'replacementPatternSell', type: 'bytes' },
      { name: 'staticExtradataBuy', type: 'bytes' },
      { name: 'staticExtradataSell', type: 'bytes' },
      { name: 'vs', type: 'uint8[2]' },
      { name: 'rssMetadata', type: 'bytes32[5]' }
    ],
    name: 'atomicMatch_',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[7]' },
      { name: 'uints', type: 'uint256[9]' },
      { name: 'feeMethod', type: 'uint8' },
      { name: 'side', type: 'uint8' },
      { name: 'saleKind', type: 'uint8' },
      { name: 'howToCall', type: 'uint8' },
      { name: 'calldata', type: 'bytes' },
      { name: 'replacementPattern', type: 'bytes' },
      { name: 'staticExtradata', type: 'bytes' }
    ],
    name: 'validateOrderParameters_',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'INVERSE_BASIS_POINT',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: 'addrs', type: 'address[14]' },
      { name: 'uints', type: 'uint256[18]' },
      { name: 'feeMethodsSidesKindsHowToCalls', type: 'uint8[8]' },
      { name: 'calldataBuy', type: 'bytes' },
      { name: 'calldataSell', type: 'bytes' },
      { name: 'replacementPatternBuy', type: 'bytes' },
      { name: 'replacementPatternSell', type: 'bytes' },
      { name: 'staticExtradataBuy', type: 'bytes' },
      { name: 'staticExtradataSell', type: 'bytes' }
    ],
    name: 'calculateMatchPrice_',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '', type: 'bytes32' }],
    name: 'approvedOrders',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [{ name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'registryAddress', type: 'address' },
      { name: 'tokenTransferProxyAddress', type: 'address' },
      { name: 'tokenAddress', type: 'address' },
      { name: 'protocolFeeAddress', type: 'address' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'hash', type: 'bytes32' },
      { indexed: false, name: 'exchange', type: 'address' },
      { indexed: true, name: 'maker', type: 'address' },
      { indexed: false, name: 'taker', type: 'address' },
      { indexed: false, name: 'makerRelayerFee', type: 'uint256' },
      { indexed: false, name: 'takerRelayerFee', type: 'uint256' },
      { indexed: false, name: 'makerProtocolFee', type: 'uint256' },
      { indexed: false, name: 'takerProtocolFee', type: 'uint256' },
      { indexed: true, name: 'feeRecipient', type: 'address' },
      { indexed: false, name: 'feeMethod', type: 'uint8' },
      { indexed: false, name: 'side', type: 'uint8' },
      { indexed: false, name: 'saleKind', type: 'uint8' },
      { indexed: false, name: 'target', type: 'address' }
    ],
    name: 'OrderApprovedPartOne',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'hash', type: 'bytes32' },
      { indexed: false, name: 'howToCall', type: 'uint8' },
      { indexed: false, name: 'calldata', type: 'bytes' },
      { indexed: false, name: 'replacementPattern', type: 'bytes' },
      { indexed: false, name: 'staticTarget', type: 'address' },
      { indexed: false, name: 'staticExtradata', type: 'bytes' },
      { indexed: false, name: 'paymentToken', type: 'address' },
      { indexed: false, name: 'basePrice', type: 'uint256' },
      { indexed: false, name: 'extra', type: 'uint256' },
      { indexed: false, name: 'listingTime', type: 'uint256' },
      { indexed: false, name: 'expirationTime', type: 'uint256' },
      { indexed: false, name: 'salt', type: 'uint256' },
      { indexed: false, name: 'orderbookInclusionDesired', type: 'bool' }
    ],
    name: 'OrderApprovedPartTwo',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'hash', type: 'bytes32' }],
    name: 'OrderCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: 'buyHash', type: 'bytes32' },
      { indexed: false, name: 'sellHash', type: 'bytes32' },
      { indexed: true, name: 'maker', type: 'address' },
      { indexed: true, name: 'taker', type: 'address' },
      { indexed: false, name: 'price', type: 'uint256' },
      { indexed: true, name: 'metadata', type: 'bytes32' }
    ],
    name: 'OrdersMatched',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }],
    name: 'OwnershipRenounced',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'previousOwner', type: 'address' },
      { indexed: true, name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  }
]
