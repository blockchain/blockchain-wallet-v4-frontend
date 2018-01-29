import { Socket } from 'blockchain-wallet-v4/src/network'

export const socket = new Socket({ wsUrl: 'wss://ws.blockchain.info/inv' })