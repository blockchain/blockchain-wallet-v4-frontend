export const wyvernExchange_ABI = [
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
    inputs: [{ name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', type: 'uint256' }],
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
export const ERC721_ABI = [
  {
    constant: true,
    inputs: [{ name: '_interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
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
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'InterfaceId_ERC165',
    outputs: [{ name: '', type: 'bytes4' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_index', type: 'uint256' }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  // {
  //   constant: false,
  //   inputs: [
  //     { name: '_from', type: 'address' },
  //     { name: '_to', type: 'address' },
  //     { name: '_tokenId', type: 'uint256' }
  //   ],
  //   name: 'safeTransferFrom',
  //   outputs: [],
  //   payable: false,
  //   stateMutability: 'nonpayable',
  //   type: 'function'
  // },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'exists',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_approved', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' },
      { name: '_data', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_operator', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_symbol', type: 'string' }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_from', type: 'address' },
      { indexed: true, name: '_to', type: 'address' },
      { indexed: true, name: '_tokenId', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_owner', type: 'address' },
      { indexed: true, name: '_approved', type: 'address' },
      { indexed: true, name: '_tokenId', type: 'uint256' }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: '_owner', type: 'address' },
      { indexed: true, name: '_operator', type: 'address' },
      { indexed: false, name: '_approved', type: 'bool' }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_tokenId', type: 'uint256' },
      { name: '_tokenURI', type: 'string' }
    ],
    name: 'mintUniqueTokenTo',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
export const ERC1155_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]'
      }
    ],
    name: 'TransferBatch',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'TransferSingle',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'value',
        type: 'string'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'URI',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]'
      }
    ],
    name: 'balanceOfBatch',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
export const proxyRegistry_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'initialAddressSet',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'endGrantAuthentication',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'revokeAuthentication',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'pending',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'contracts',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
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
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'delegateProxyImplementation',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    name: 'proxies',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'addr',
        type: 'address'
      }
    ],
    name: 'startGrantAuthentication',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'registerProxy',
    outputs: [
      {
        name: 'proxy',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'DELAY_PERIOD',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'authAddress',
        type: 'address'
      }
    ],
    name: 'grantInitialAuthentication',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipRenounced',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  }
]
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      },
      {
        name: '_spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  }
]

export const WETH_ABI =
  // 20220302104431
  // http://api.etherscan.io/api?module=contract&action=getabi&address=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&format=raw

  [
    {
      constant: true,
      inputs: [],
      name: 'name',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'guy',
          type: 'address'
        },
        {
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'approve',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupply',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'src',
          type: 'address'
        },
        {
          name: 'dst',
          type: 'address'
        },
        {
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'transferFrom',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'withdraw',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'decimals',
      outputs: [
        {
          name: '',
          type: 'uint8'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address'
        }
      ],
      name: 'balanceOf',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          name: '',
          type: 'string'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          name: 'dst',
          type: 'address'
        },
        {
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'transfer',
      outputs: [
        {
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'deposit',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address'
        },
        {
          name: '',
          type: 'address'
        }
      ],
      name: 'allowance',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      payable: true,
      stateMutability: 'payable',
      type: 'fallback'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'src',
          type: 'address'
        },
        {
          indexed: true,
          name: 'guy',
          type: 'address'
        },
        {
          indexed: false,
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'Approval',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'src',
          type: 'address'
        },
        {
          indexed: true,
          name: 'dst',
          type: 'address'
        },
        {
          indexed: false,
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'Transfer',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'dst',
          type: 'address'
        },
        {
          indexed: false,
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'Deposit',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: 'src',
          type: 'address'
        },
        {
          indexed: false,
          name: 'wad',
          type: 'uint256'
        }
      ],
      name: 'Withdrawal',
      type: 'event'
    }
  ]
