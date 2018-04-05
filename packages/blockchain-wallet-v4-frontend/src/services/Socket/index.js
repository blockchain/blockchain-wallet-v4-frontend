import settings from 'config'
import { Socket } from 'blockchain-wallet-v4/src/network'

export const socket = new Socket({ wsUrl: settings.WEB_SOCKET_URL, rootUrl: settings.BLOCKCHAIN_INFO })
