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
