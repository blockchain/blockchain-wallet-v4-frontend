import settings from 'config'
import { Socket } from 'blockchain-wallet-v4/lib/network'

export const socket = new Socket({ wsUrl: settings.WEB_SOCKET_URL })
