import { FunctionInputKind, FunctionOutputKind, StateMutability } from './types'

export const ERC721Schema = {
  assetFromFields: (fields: any) => ({
    address: fields.Address,
    id: fields.ID
  }),
  assetToFields: (asset) => ({
    Address: asset.address,
    ID: asset.id
  }),
  deploymentBlock: 0,

  description: 'Items conforming to the ERC721 spec, using transferFrom.',

  events: {
    transfer: []
  },

  fields: [
    { description: 'Asset Token ID', name: 'ID', type: 'uint256' },
    { description: 'Asset Contract Address', name: 'Address', type: 'address' }
  ],

  formatter: async (asset) => {
    return {
      description: '',
      properties: [],
      thumbnail: '',
      title: `ERC721 Asset: Token ID ${asset.id} at ${asset.address}`,
      url: ''
    }
  },

  functions: {
    assetsOfOwnerByIndex: [],
    checkAndTransfer: (asset, validatorAddress, merkle) => ({
      constant: false,
      inputs: [
        { kind: FunctionInputKind.Owner, name: 'from', type: 'address' },
        { kind: FunctionInputKind.Replaceable, name: 'to', type: 'address' },
        {
          kind: FunctionInputKind.Asset,
          name: 'token',
          type: 'address',
          value: asset.address
        },
        {
          kind: FunctionInputKind.Asset,
          name: 'tokenId',
          type: 'uint256',
          value: asset.id
        },
        {
          kind: FunctionInputKind.Data,
          name: 'root',
          type: 'bytes32',
          value: merkle
            ? merkle.root
            : '0x0000000000000000000000000000000000000000000000000000000000000000'
        },
        {
          kind: FunctionInputKind.Data,
          name: 'proof',
          type: 'bytes32[]',
          value: merkle ? merkle.proof : []
        }
      ],
      name: 'matchERC721UsingCriteria',
      outputs: [],
      payable: false,
      stateMutability: StateMutability.Nonpayable,
      target: validatorAddress,
      type: 'function'
    }),
    ownerOf: (asset) => ({
      constant: true,
      inputs: [
        { kind: FunctionInputKind.Asset, name: '_tokenId', type: 'uint256', value: asset.id }
      ],
      name: 'ownerOf',
      outputs: [{ kind: FunctionOutputKind.Owner, name: 'owner', type: 'address' }],
      payable: false,
      stateMutability: StateMutability.View,
      target: asset.address,
      type: 'function'
    }),
    transfer: (asset) => ({
      constant: false,
      inputs: [
        { kind: FunctionInputKind.Owner, name: '_from', type: 'address' },
        { kind: FunctionInputKind.Replaceable, name: '_to', type: 'address' },
        { kind: FunctionInputKind.Asset, name: '_tokenId', type: 'uint256', value: asset.id }
      ],
      name: 'transferFrom',
      outputs: [],
      payable: false,
      stateMutability: StateMutability.Nonpayable,
      target: asset.address,
      type: 'function'
    })
  },

  hash: (asset) => `${asset.address}-${asset.id}`,

  // Not indexed (for now; need asset-specific indexing strategy)
  name: 'ERC721',

  thumbnail: 'https://opensea.io/static/images/opensea-icon.png',
  version: 2,
  website: 'http://erc721.org/'
}

export const ERC1155Schema = {
  assetFromFields: (fields: any) => ({
    address: fields.Address,
    id: fields.ID,
    quantity: fields.Quantity
  }),
  assetToFields: (asset) => ({
    Address: asset.address,
    ID: asset.id,
    Quantity: asset.quantity
  }),

  deploymentBlock: 0,

  description: 'Items conforming to the ERC1155 spec, using transferFrom.',

  events: {
    transfer: []
  },

  fields: [
    { description: 'Asset Token ID', name: 'ID', type: 'uint256' },
    { description: 'Asset Contract Address', name: 'Address', type: 'address' },
    { description: 'Quantity to transfer', name: 'Quantity', type: 'uint256' }
  ],

  formatter: async (asset) => {
    return {
      description: `Trading ${asset.quantity.toString()}`,
      properties: [],
      thumbnail: '',
      title: `ERC1155 Asset: Token ID ${asset.id} at ${asset.address}`,
      url: ''
    }
  },

  functions: {
    assetsOfOwnerByIndex: [],
    checkAndTransfer: (asset, validatorAddress, merkle) => ({
      constant: false,
      inputs: [
        { kind: FunctionInputKind.Owner, name: 'from', type: 'address' },
        { kind: FunctionInputKind.Replaceable, name: 'to', type: 'address' },
        {
          kind: FunctionInputKind.Asset,
          name: 'token',
          type: 'address',
          value: asset.address
        },
        {
          kind: FunctionInputKind.Asset,
          name: 'tokenId',
          type: 'uint256',
          value: asset.id
        },
        {
          kind: FunctionInputKind.Count,
          name: 'amount',
          type: 'uint256',
          value: asset.quantity || 1
        },
        {
          kind: FunctionInputKind.Data,
          name: 'root',
          type: 'bytes32',
          value: merkle
            ? merkle.root
            : '0x0000000000000000000000000000000000000000000000000000000000000000'
        },
        {
          kind: FunctionInputKind.Data,
          name: 'proof',
          type: 'bytes32[]',
          value: merkle ? merkle.proof : []
        }
      ],
      name: 'matchERC1155UsingCriteria',
      outputs: [],
      payable: false,
      stateMutability: StateMutability.Nonpayable,
      target: validatorAddress,
      type: 'function'
    }),
    countOf: (asset) => ({
      assetFromOutputs: (outputs: any) => outputs.balance,
      constant: true,
      inputs: [
        { kind: FunctionInputKind.Owner, name: '_owner', type: 'address' },
        { kind: FunctionInputKind.Asset, name: '_id', type: 'uint256', value: asset.id }
      ],
      name: 'balanceOf',
      outputs: [{ kind: FunctionOutputKind.Count, name: 'balance', type: 'uint' }],
      payable: false,
      stateMutability: StateMutability.View,
      target: asset.address,
      type: 'function'
    }),
    transfer: (asset) => ({
      constant: false,
      inputs: [
        { kind: FunctionInputKind.Owner, name: '_from', type: 'address' },
        { kind: FunctionInputKind.Replaceable, name: '_to', type: 'address' },
        { kind: FunctionInputKind.Asset, name: '_id', type: 'uint256', value: asset.id },
        {
          kind: FunctionInputKind.Count,
          name: '_value',
          type: 'uint256',
          value: asset.quantity || 1
        },
        { kind: FunctionInputKind.Data, name: '_data', type: 'bytes', value: '0x' }
      ],
      name: 'safeTransferFrom',
      outputs: [],
      payable: false,
      stateMutability: StateMutability.Nonpayable,
      target: asset.address,
      type: 'function'
    })
  },

  hash: (asset) => `${asset.address}-${asset.id}`,
  // Not indexed (for now; need asset-specific indexing strategy)
  name: 'ERC1155',
  thumbnail: 'https://opensea.io/static/images/opensea-icon.png',
  version: 1,
  website: 'https://github.com/ethereum/eips/issues/1155'
}

export const schemaMap = {
  ERC1155: ERC1155Schema,
  ERC721: ERC721Schema
}
