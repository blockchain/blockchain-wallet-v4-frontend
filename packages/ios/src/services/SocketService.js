import { Socket } from 'blockchain-wallet-v4/src/network'
import Config from 'react-native-config'

export const socket = new Socket({ wsUrl: Config.WEB_SOCKET_URL })
